/* Unit-Tests für den Formular-Versand (functions/api/anfrage.ts).
   Resend wird nicht angesprochen - ein Stellvertreter für fetch merkt sich,
   was verschickt worden wäre. */
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  bearbeiteAnfrage,
  MAX_FOTOS,
  onRequestPost,
} from "../functions/api/anfrage.ts";

const env = { RESEND_API_KEY: "re_test", ANFRAGE_AN: "test@example.com" };

const formular = (extra: Record<string, string> = {}, fotos: File[] = []) => {
  const form = new FormData();
  const felder = {
    name: "Erika Muster",
    telefon: "0151 123",
    thema: "Entrümpelung / Haushaltsauflösung",
    datenschutz: "on",
    nachricht: "3 Zimmer <b>Emden</b>",
    ...extra,
  };
  for (const [k, v] of Object.entries(felder)) form.set(k, v);
  for (const f of fotos) form.append("fotos", f);
  return form;
};

const anfrage = (form: FormData, json = true) =>
  new Request("https://www.fixum-objektservice.de/api/anfrage", {
    method: "POST",
    body: form,
    headers: json ? { Accept: "application/json" } : {},
  });

const foto = (name: string, bytes = 1000, type = "image/jpeg") =>
  new File([new Uint8Array(bytes).fill(7)], name, { type });

function stellvertreter(status = 200) {
  const aufrufe: Array<{ url: string; body: any; headers: any }> = [];
  const senden = (async (url: string, init: RequestInit) => {
    aufrufe.push({
      url,
      body: JSON.parse(String(init.body)),
      headers: init.headers,
    });
    return new Response("{}", { status });
  }) as unknown as typeof fetch;
  return { aufrufe, senden };
}

describe("Formular-Versand", () => {
  test("schickt Angaben und Fotos an Resend", async () => {
    const { aufrufe, senden } = stellvertreter();
    const erg = await bearbeiteAnfrage(
      anfrage(
        formular({ email: "erika@example.com" }, [
          foto("küche 1.jpg"),
          foto("bad.png", 500, "image/png"),
        ]),
      ),
      env,
      senden,
    );
    assert.deepEqual(erg, { ok: true });
    assert.equal(aufrufe.length, 1);
    const { url, body, headers } = aufrufe[0];
    assert.equal(url, "https://api.resend.com/emails");
    assert.equal(headers.Authorization, "Bearer re_test");
    assert.deepEqual(body.to, ["test@example.com"]);
    assert.equal(body.reply_to, "erika@example.com");
    assert.match(body.subject, /Entrümpelung.*Erika Muster/);
    assert.equal(body.attachments.length, 2);
    assert.equal(body.attachments[0].filename, "kuche-1.jpg");
    assert.equal(
      body.attachments[1].content,
      Buffer.from(new Uint8Array(500).fill(7)).toString("base64"),
    );
    // HTML wird maskiert
    assert.ok(body.html.includes("&lt;b&gt;Emden&lt;/b&gt;"));
    assert.ok(!body.html.includes("<b>Emden"));
  });

  test("ohne Fotos und ohne E-Mail kein Anhang, kein reply_to", async () => {
    const { aufrufe, senden } = stellvertreter();
    await bearbeiteAnfrage(anfrage(formular()), env, senden);
    assert.equal(aufrufe[0].body.attachments, undefined);
    assert.equal(aufrufe[0].body.reply_to, undefined);
  });

  test("Honeypot: Bot bekommt ok, es wird nichts verschickt", async () => {
    const { aufrufe, senden } = stellvertreter();
    const erg = await bearbeiteAnfrage(
      anfrage(formular({ _gotcha: "spam" })),
      env,
      senden,
    );
    assert.deepEqual(erg, { ok: true });
    assert.equal(aufrufe.length, 0);
  });

  test("Pflichtfelder und Datenschutz werden geprüft", async () => {
    const { senden } = stellvertreter();
    const ohneTelefon = formular();
    ohneTelefon.delete("telefon");
    const erg = await bearbeiteAnfrage(anfrage(ohneTelefon), env, senden);
    assert.equal(erg.ok, false);

    const ohneDs = formular();
    ohneDs.delete("datenschutz");
    assert.equal(
      (await bearbeiteAnfrage(anfrage(ohneDs), env, senden)).ok,
      false,
    );
  });

  test("Fotos: Anzahl, Typ und Größe begrenzt", async () => {
    const { aufrufe, senden } = stellvertreter();
    const zuViele = Array.from({ length: MAX_FOTOS + 1 }, (_, i) =>
      foto(`f${i}.jpg`),
    );
    const a = await bearbeiteAnfrage(
      anfrage(formular({}, zuViele)),
      env,
      senden,
    );
    assert.equal(a.ok, false);

    const pdf = await bearbeiteAnfrage(
      anfrage(formular({}, [foto("x.pdf", 100, "application/pdf")])),
      env,
      senden,
    );
    assert.equal(pdf.ok, false);

    const riesig = await bearbeiteAnfrage(
      anfrage(formular({}, [foto("gross.jpg", 11 * 1024 * 1024)])),
      env,
      senden,
    );
    assert.equal(riesig.ok, false);
    assert.equal(aufrufe.length, 0);
  });

  test("ohne Schlüssel: 503, Resend-Fehler: 502", async () => {
    const { senden } = stellvertreter();
    const ohne = await bearbeiteAnfrage(anfrage(formular()), {}, senden);
    assert.equal(!ohne.ok && ohne.status, 503);

    const kaputt = stellvertreter(500);
    const erg = await bearbeiteAnfrage(anfrage(formular()), env, kaputt.senden);
    assert.equal(!erg.ok && erg.status, 502);
  });

  test("ohne JavaScript: Weiterleitung statt JSON", async () => {
    const res = await onRequestPost({
      request: anfrage(formular(), false),
      env: {},
    });
    assert.equal(res.status, 303);
    assert.match(res.headers.get("Location") ?? "", /\/kontakt\/\?fehler=1$/);

    const json = await onRequestPost({ request: anfrage(formular()), env: {} });
    assert.equal(json.status, 503);
    assert.deepEqual(await json.json(), {
      ok: false,
      fehler: "Versand ist nicht eingerichtet.",
    });
  });
});
