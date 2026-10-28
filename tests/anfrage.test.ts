/* Tests für das Anfrageformular (api/anfrage.ts). Ausführen: npm test
   Versendet nichts: Statt SMTP läuft ein Versand-Ersatz mit, der die
   Mails nur einsammelt. */
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import {
  FIRMA,
  KONTAKTWEGE,
  LEISTUNGEN,
  MAX_FOTOS,
  MAX_GESAMT_BYTES,
  OBJEKTARTEN,
  GET,
  POST,
  ZEITRAEUME,
  bearbeite,
  leseEnv,
  bildtyp,
  type Env,
  type Versand,
} from "../api/anfrage.ts";
import {
  anfrageHref,
  anfrageKontaktwege,
  anfrageLeistungen,
  anfrageObjektarten,
  anfrageZeitraeume,
  leistungJeRechner,
  leistungJeSeite,
} from "../src/data/anfrage.ts";

type Mail = {
  from?: string;
  to?: string;
  replyTo?: string;
  subject?: string;
  text?: string;
  html?: string;
  attachments?: Array<{ filename: string; contentType: string }>;
};

const ENV: Env = {
  SMTP_HOST: "smtp.ionos.de",
  SMTP_PORT: "465",
  SMTP_USER: "info@fixum-objektservice.de",
  SMTP_PASS: "geheim",
  CONTACT_TO: "info@fixum-objektservice.de",
  CONTACT_FROM: "Fixum Objektservice <info@fixum-objektservice.de>",
};

const JETZT = 1_800_000_000_000;

/** Versand-Ersatz: sammelt Mails, kann Fehler simulieren. */
const postfach = (scheitertBei: number[] = []) => {
  const mails: Mail[] = [];
  const versand: Versand = {
    sendMail: async (m) => {
      if (scheitertBei.includes(mails.length + 1)) {
        mails.push({});
        throw new Error("SMTP down");
      }
      mails.push(m as Mail);
      return {};
    },
  };
  return { mails, versand };
};

const jpeg = (bytes: number) => {
  const b = new Uint8Array(bytes);
  b.set([0xff, 0xd8, 0xff, 0xe0]);
  return new File([b], "IMG_0001.jpg", { type: "image/jpeg" });
};

const gueltig = (extra: Record<string, string> = {}) => {
  const f = new FormData();
  const felder: Record<string, string> = {
    leistung: "entruempelung",
    ort: "Leer",
    objektart: "wohnung",
    groesse: "70 m²",
    zeitraum: "wochen",
    beschreibung: "3 Zimmer, 2. OG, kein Aufzug",
    name: "Anna Muster",
    telefon: "0151 1234567",
    email: "anna@example.org",
    kontaktweg: "anruf",
    datenschutz: "ja",
    seite: "/leer/",
    _t: String(JETZT - 60_000),
    _gotcha: "",
    ...extra,
  };
  for (const [k, v] of Object.entries(felder)) f.append(k, v);
  return f;
};

let ipZaehler = 0;
const anfrage = (form: FormData, ip = `10.0.0.${++ipZaehler}`) =>
  new Request("https://www.fixum-objektservice.de/api/anfrage", {
    method: "POST",
    body: form,
    headers: { "x-forwarded-for": ip, accept: "application/json" },
  });

describe("Anfrage: Versand", () => {
  test("ohne Fotos: Mail an Fixum und Bestätigung an den Kunden", async () => {
    const { mails, versand } = postfach();
    const e = await bearbeite(anfrage(gueltig()), ENV, versand, JETZT);
    assert.deepEqual(e, { ok: true, vorname: "Anna" });
    assert.equal(mails.length, 2);

    const [an, kopie] = mails;
    assert.equal(
      an.subject,
      "Neue Anfrage: Entrümpelung / Haushaltsauflösung – Leer – Anna Muster",
    );
    assert.equal(an.to, ENV.CONTACT_TO);
    assert.equal(an.from, ENV.CONTACT_FROM);
    assert.equal(an.replyTo, "Anna Muster <anna@example.org>");
    assert.match(an.html!, /href="tel:01511234567"/);
    assert.match(an.html!, /<table/);
    assert.match(an.text!, /Ohne Fotos/);
    assert.equal(an.attachments!.length, 0);

    assert.equal(kopie.to, "anna@example.org");
    assert.equal(kopie.replyTo, ENV.CONTACT_TO);
    assert.match(
      kopie.text!,
      /Ich melde mich in der Regel innerhalb von 24 Stunden/,
    );
    assert.match(kopie.text!, /\+49 151 29628025/);
    assert.match(kopie.text!, /Leer/);
    assert.equal(kopie.attachments, undefined);
  });

  test("ohne E-Mail-Adresse: nur die Mail an Fixum, kein Reply-To", async () => {
    const { mails, versand } = postfach();
    const e = await bearbeite(
      anfrage(gueltig({ email: "" })),
      ENV,
      versand,
      JETZT,
    );
    assert.equal(e.ok, true);
    assert.equal(mails.length, 1);
    assert.equal(mails[0].replyTo, undefined);
  });

  test("1 Foto: als Anhang, Name und Typ vom Server", async () => {
    const { mails, versand } = postfach();
    const f = gueltig();
    f.append("fotos", jpeg(300_000));
    const e = await bearbeite(anfrage(f), ENV, versand, JETZT);
    assert.equal(e.ok, true);
    assert.deepEqual(
      mails[0].attachments!.map((a) => [a.filename, a.contentType]),
      [["foto-1.jpg", "image/jpeg"]],
    );
    assert.match(mails[0].html!, /1 Foto im Anhang/);
    assert.equal(mails[1].attachments, undefined, "Bestätigung ohne Fotos");
    assert.match(mails[1].text!, /ein Foto mitgeschickt/);
  });

  test("8 Fotos (zusammen knapp 4 MB): alle im Anhang", async () => {
    const { mails, versand } = postfach();
    const f = gueltig();
    for (let i = 0; i < 8; i++) f.append("fotos", jpeg(500_000));
    const e = await bearbeite(anfrage(f), ENV, versand, JETZT);
    assert.equal(e.ok, true);
    assert.equal(mails[0].attachments!.length, 8);
    assert.equal(mails[0].attachments![7].filename, "foto-8.jpg");
  });

  test("WhatsApp als Kontaktweg: Antwort-Link in der Mail", async () => {
    const { mails, versand } = postfach();
    await bearbeite(
      anfrage(gueltig({ kontaktweg: "whatsapp" })),
      ENV,
      versand,
      JETZT,
    );
    assert.match(mails[0].html!, /https:\/\/wa\.me\/491511234567/);
  });

  test("Mail an Fixum scheitert: 502, damit das Formular Telefon anbietet", async () => {
    const { versand } = postfach([1]);
    const e = await bearbeite(anfrage(gueltig()), ENV, versand, JETZT);
    assert.equal(e.ok, false);
    assert.equal(!e.ok && e.status, 502);
  });

  test("nur die Bestätigung scheitert: Anfrage gilt trotzdem als angekommen", async () => {
    const { mails, versand } = postfach([2]);
    const e = await bearbeite(anfrage(gueltig()), ENV, versand, JETZT);
    assert.equal(e.ok, true);
    assert.equal(mails.length, 2);
  });

  test("ohne SMTP-Variablen: 503, es wird nichts versucht", async () => {
    const { mails, versand } = postfach();
    const e = await bearbeite(
      anfrage(gueltig()),
      { ...ENV, SMTP_PASS: "" },
      versand,
      JETZT,
    );
    assert.equal(!e.ok && e.status, 503);
    assert.equal(mails.length, 0);
  });
});

describe("Anfrage: Prüfung", () => {
  test("Pflichtfelder fehlen: 400 mit Meldung je Feld", async () => {
    const { mails, versand } = postfach();
    const f = gueltig({
      leistung: "",
      ort: "",
      objektart: "villa",
      name: "",
      telefon: "",
    });
    f.delete("datenschutz");
    const e = await bearbeite(anfrage(f), ENV, versand, JETZT);
    assert.equal(e.ok, false);
    assert.equal(!e.ok && e.status, 400);
    assert.deepEqual(Object.keys((!e.ok && e.felder) || {}).sort(), [
      "datenschutz",
      "leistung",
      "name",
      "objektart",
      "ort",
      "telefon",
    ]);
    assert.equal(mails.length, 0);
  });

  test("Kontaktweg E-Mail: E-Mail Pflicht, Telefon nicht", async () => {
    const { versand } = postfach();
    const ohne = await bearbeite(
      anfrage(gueltig({ kontaktweg: "email", email: "", telefon: "" })),
      ENV,
      versand,
      JETZT,
    );
    assert.ok(!ohne.ok && ohne.felder?.email);
    assert.ok(!ohne.ok && !ohne.felder?.telefon);
    const mit = await bearbeite(
      anfrage(gueltig({ kontaktweg: "email", telefon: "" })),
      ENV,
      versand,
      JETZT,
    );
    assert.equal(mit.ok, true);
  });

  test("ungültige E-Mail und Telefonnummer werden gemeldet", async () => {
    const { versand } = postfach();
    const e = await bearbeite(
      anfrage(gueltig({ email: "anna@", telefon: "abc" })),
      ENV,
      versand,
      JETZT,
    );
    assert.ok(!e.ok && e.felder?.email && e.felder?.telefon);
  });

  test("9 Fotos: 413", async () => {
    const { versand } = postfach();
    const f = gueltig();
    for (let i = 0; i <= MAX_FOTOS; i++) f.append("fotos", jpeg(1000));
    const e = await bearbeite(anfrage(f), ENV, versand, JETZT);
    assert.equal(!e.ok && e.status, 413);
  });

  test("Fotos zusammen zu groß: 413", async () => {
    const { versand } = postfach();
    const f = gueltig();
    f.append("fotos", jpeg(2_400_000));
    f.append("fotos", jpeg(2_400_000));
    const e = await bearbeite(anfrage(f), ENV, versand, JETZT);
    assert.equal(!e.ok && e.status, 413);
  });

  test("kein Bild (PDF als .jpg getarnt): 415", async () => {
    const { mails, versand } = postfach();
    const f = gueltig();
    f.append(
      "fotos",
      new File([new TextEncoder().encode("%PDF-1.7 ...")], "rechnung.jpg", {
        type: "image/jpeg",
      }),
    );
    const e = await bearbeite(anfrage(f), ENV, versand, JETZT);
    assert.equal(!e.ok && e.status, 415);
    assert.equal(mails.length, 0);
  });

  test("Bildtypen werden an den ersten Bytes erkannt", () => {
    const kopf = (...b: number[]) =>
      new Uint8Array([...b, ...new Array(16).fill(0)]);
    const ascii = (s: string) => [...s].map((c) => c.charCodeAt(0));
    assert.equal(bildtyp(kopf(0xff, 0xd8, 0xff))?.typ, "image/jpeg");
    assert.equal(bildtyp(kopf(0x89, ...ascii("PNG")))?.typ, "image/png");
    assert.equal(
      bildtyp(kopf(...ascii("RIFF"), 0, 0, 0, 0, ...ascii("WEBP")))?.typ,
      "image/webp",
    );
    assert.equal(
      bildtyp(kopf(0, 0, 0, 0x18, ...ascii("ftypheic")))?.typ,
      "image/heic",
    );
    assert.equal(
      bildtyp(kopf(0, 0, 0, 0x18, ...ascii("ftypavif")))?.typ,
      "image/avif",
    );
    assert.equal(bildtyp(kopf(...ascii("GIF89a"))), null);
  });

  test("Zeilenumbrüche im Namen landen nicht im Betreff (Header-Injection)", async () => {
    const { mails, versand } = postfach();
    await bearbeite(
      anfrage(gueltig({ name: "Anna\r\nBcc: spam@example.org" })),
      ENV,
      versand,
      JETZT,
    );
    assert.doesNotMatch(mails[0].subject!, /[\r\n]/);
    assert.doesNotMatch(mails[0].replyTo!, /[\r\n]/);
  });

  test("HTML in der Beschreibung wird maskiert", async () => {
    const { mails, versand } = postfach();
    await bearbeite(
      anfrage(gueltig({ beschreibung: '<script>alert("x")</script>' })),
      ENV,
      versand,
      JETZT,
    );
    assert.doesNotMatch(mails[0].html!, /<script>/);
    assert.match(mails[0].html!, /&lt;script&gt;/);
  });
});

describe("Anfrage: Spam", () => {
  test("Honeypot ausgefüllt: scheinbar ok, aber keine Mail", async () => {
    const { mails, versand } = postfach();
    const e = await bearbeite(
      anfrage(gueltig({ _gotcha: "https://spam.example" })),
      ENV,
      versand,
      JETZT,
    );
    assert.equal(e.ok, true);
    assert.equal(mails.length, 0);
  });

  test("schneller als 3 Sekunden abgeschickt: keine Mail", async () => {
    const { mails, versand } = postfach();
    const e = await bearbeite(
      anfrage(gueltig({ _t: String(JETZT - 1000) })),
      ENV,
      versand,
      JETZT,
    );
    assert.equal(e.ok, true);
    assert.equal(mails.length, 0);
  });

  test("Rate-Limit: die 6. Anfrage in 10 Minuten von einer IP bekommt 429", async () => {
    const { mails, versand } = postfach();
    const ergebnisse = [];
    for (let i = 0; i < 6; i++) {
      ergebnisse.push(
        await bearbeite(
          anfrage(gueltig(), "192.0.2.77"),
          ENV,
          versand,
          JETZT + i,
        ),
      );
    }
    assert.deepEqual(
      ergebnisse.map((e) => (e.ok ? 200 : e.status)),
      [200, 200, 200, 200, 200, 429],
    );
    assert.equal(mails.length, 10);
    /* Nach 10 Minuten wieder frei */
    const spaeter = await bearbeite(
      anfrage(gueltig(), "192.0.2.77"),
      ENV,
      versand,
      JETZT + 10 * 60 * 1000 + 10,
    );
    assert.equal(spaeter.ok, true);
  });
});

describe("Anfrage: HTTP", () => {
  test("Statusabfrage nennt fehlende Variablen, keine Werte", async () => {
    const r = await GET(
      new Request("https://www.fixum-objektservice.de/api/anfrage"),
    );
    const daten = await r.json();
    assert.equal(daten.versand, "nicht eingerichtet");
    assert.deepEqual(daten.fehlt, [
      "SMTP_HOST",
      "SMTP_USER",
      "SMTP_PASS",
      "CONTACT_TO",
      "CONTACT_FROM",
    ]);
  });

  test("Variablen: Leerzeichen und mitkopierte Anführungszeichen werden entfernt", () => {
    const env = leseEnv({
      CONTACT_FROM: ' "Fixum Objektservice <info@fixum-objektservice.de>" ',
      SMTP_USER: "info@fixum-objektservice.de\n",
      SMTP_PASS: "",
      ANDERES: "x",
    });
    assert.deepEqual(env, {
      CONTACT_FROM: "Fixum Objektservice <info@fixum-objektservice.de>",
      SMTP_USER: "info@fixum-objektservice.de",
    });
  });

  test("ohne JavaScript (kein Accept: json): 303 auf Formular mit Fehler", async () => {
    /* process.env hat hier keine SMTP-Daten -> 503 -> zurück zum Formular */
    const f = gueltig();
    const r = await POST(
      new Request("https://www.fixum-objektservice.de/api/anfrage", {
        method: "POST",
        body: f,
        headers: { "x-forwarded-for": "198.51.100.1" },
      }),
    );
    assert.equal(r.status, 303);
    assert.equal(
      r.headers.get("location"),
      "https://www.fixum-objektservice.de/kontakt/?fehler=1#anfrage",
    );
  });

  test("mit JavaScript: JSON mit Status", async () => {
    const r = await POST(anfrage(gueltig()));
    assert.equal(r.status, 503);
    const daten = await r.json();
    assert.equal(daten.ok, false);
    assert.ok(daten.fehler);
  });
});

describe("Anfrage: Daten stimmen überein", () => {
  const alsObjekt = (l: Array<{ wert: string; label: string }>) =>
    Object.fromEntries(l.map((x) => [x.wert, x.label]));

  test("Auswahlwerte im Formular = Auswahlwerte im Server", () => {
    assert.deepEqual(alsObjekt(anfrageLeistungen), LEISTUNGEN);
    assert.deepEqual(alsObjekt(anfrageObjektarten), OBJEKTARTEN);
    assert.deepEqual(alsObjekt(anfrageZeitraeume), ZEITRAEUME);
    assert.deepEqual(alsObjekt(anfrageKontaktwege), KONTAKTWEGE);
  });

  test("Vorauswahl je Seite und je Rechner zeigt auf echte Leistungen und Seiten", () => {
    for (const [pfad, l] of Object.entries(leistungJeSeite)) {
      assert.ok(l in LEISTUNGEN, `${pfad}: ${l}`);
      assert.ok(existsSync(`src/pages${pfad.replace(/\/$/, "")}.astro`), pfad);
    }
    for (const l of Object.values(leistungJeRechner))
      assert.ok(l in LEISTUNGEN, l);
  });

  test("Firmendaten in der Bestätigung = src/data/site.ts", () => {
    const site = readFileSync("src/data/site.ts", "utf8");
    for (const wert of [
      FIRMA.telefon,
      FIRMA.telefonLink.replace("+", ""),
      FIRMA.inhaber,
    ]) {
      assert.ok(site.includes(wert), wert);
    }
    assert.ok(site.includes("Hermann-Allmers-Str. 13"));
  });

  test("Formular-Grenzen passen zum Server und zu Vercel (4,5 MB)", () => {
    const astro = readFileSync("src/components/Anfrage.astro", "utf8");
    assert.match(astro, new RegExp(`const MAX_FOTOS = ${MAX_FOTOS};`));
    const budget =
      Number(/const BUDGET = ([\d.]+) \* 1024 \* 1024;/.exec(astro)?.[1]) *
      1024 *
      1024;
    assert.ok(budget < MAX_GESAMT_BYTES, "Formular-Budget unter Server-Grenze");
    assert.ok(
      MAX_GESAMT_BYTES < 4.5 * 1024 * 1024,
      "Server-Grenze unter Vercel-Limit",
    );
  });

  test("Anfrage-Links", () => {
    assert.equal(anfrageHref(), "/kontakt/#anfrage");
    assert.equal(
      anfrageHref("umzug", "Leer"),
      "/kontakt/?leistung=umzug&ort=Leer#anfrage",
    );
  });

  test("Zieladressen nur aus Umgebungsvariablen, keine Adresse im Code", () => {
    const code = readFileSync("api/anfrage.ts", "utf8");
    assert.doesNotMatch(code, /(to|from):\s*["'`][^"'`]*@/);
  });
});
