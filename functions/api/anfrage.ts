/**
 * Kontaktformular -> E-Mail an Fixum, mit Fotos als Anhang.
 *
 * Läuft als Cloudflare Pages Function unter POST /api/anfrage. Der Rest der
 * Website bleibt statisch; nur dieser eine Endpunkt läuft auf dem Server.
 *
 * Versand über Resend (resend.com). Einstellungen in Cloudflare Pages unter
 * Settings -> Variables and Secrets:
 *   RESEND_API_KEY  Pflicht. Ohne Schlüssel zeigt die Website statt des
 *                   Formulars Telefon, WhatsApp und E-Mail.
 *   ANFRAGE_AN      Empfänger, Standard info@fixum-objektservice.de
 *   ANFRAGE_VON     Absender, Standard "Fixum Website <onboarding@resend.dev>".
 *                   Die Standardadresse darf nur an die E-Mail des
 *                   Resend-Kontos senden. Für einen eigenen Absender
 *                   (z. B. anfrage@fixum-objektservice.de) die Domain bei
 *                   Resend bestätigen.
 *
 * Mit JavaScript schickt das Formular per fetch und bekommt JSON zurück.
 * Ohne JavaScript ist es ein normales Formular - dann leitet die Funktion
 * nach dem Versand auf /danke/ weiter.
 */

export interface Env {
  RESEND_API_KEY?: string;
  ANFRAGE_AN?: string;
  ANFRAGE_VON?: string;
}

/* Grenzen für Fotos. Das Formular verkleinert Handyfotos vor dem Hochladen
   auf etwa 0,3-0,8 MB; die Grenzen hier fangen nur Ausreißer ab. Resend
   nimmt bis 40 MB je Mail (nach Base64), deshalb 25 MB Rohdaten. */
export const MAX_FOTOS = 6;
export const MAX_FOTO_BYTES = 10 * 1024 * 1024;
export const MAX_GESAMT_BYTES = 25 * 1024 * 1024;

const PFLICHT = ["name", "telefon", "thema"] as const;

type Ergebnis = { ok: true } | { ok: false; status: number; fehler: string };

const text = (form: FormData, feld: string) =>
  String(form.get(feld) ?? "")
    .trim()
    .slice(0, 4000);

const escapeHtml = (wert: string) =>
  wert.replace(
    /[&<>"']/g,
    (z) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        z
      ]!,
  );

/* Base64 ohne Node-Buffer - in Workers gibt es nur btoa. In Stücken, weil
   String.fromCharCode bei großen Arrays den Stack sprengt. */
const base64 = (daten: ArrayBuffer) => {
  const bytes = new Uint8Array(daten);
  let binaer = "";
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binaer += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(binaer);
};

const dateiname = (name: string, index: number) => {
  const sauber = name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w.-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return sauber || `foto-${index + 1}.jpg`;
};

export async function bearbeiteAnfrage(
  request: Request,
  env: Env,
  senden: typeof fetch = fetch,
): Promise<Ergebnis> {
  if (!env.RESEND_API_KEY) {
    return {
      ok: false,
      status: 503,
      fehler: "Versand ist nicht eingerichtet.",
    };
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return { ok: false, status: 400, fehler: "Anfrage nicht lesbar." };
  }

  /* Honeypot: Menschen sehen das Feld nicht. Ist es gefüllt, war es ein
     Bot - der bekommt ein "ok", damit er nicht weiterprobiert. */
  if (text(form, "_gotcha")) return { ok: true };

  for (const feld of PFLICHT) {
    if (!text(form, feld)) {
      return { ok: false, status: 422, fehler: `Pflichtfeld fehlt: ${feld}` };
    }
  }
  if (!form.get("datenschutz")) {
    return { ok: false, status: 422, fehler: "Datenschutzhinweis fehlt." };
  }

  const email = text(form, "email");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, status: 422, fehler: "E-Mail-Adresse ungültig." };
  }

  const fotos = form
    .getAll("fotos")
    .filter(
      (f): f is File => typeof f === "object" && f !== null && f.size > 0,
    );
  if (fotos.length > MAX_FOTOS) {
    return { ok: false, status: 413, fehler: `Höchstens ${MAX_FOTOS} Fotos.` };
  }
  let gesamt = 0;
  for (const foto of fotos) {
    if (!foto.type.startsWith("image/")) {
      return { ok: false, status: 415, fehler: "Nur Bilddateien erlaubt." };
    }
    if (foto.size > MAX_FOTO_BYTES) {
      return { ok: false, status: 413, fehler: "Ein Foto ist zu groß." };
    }
    gesamt += foto.size;
  }
  if (gesamt > MAX_GESAMT_BYTES) {
    return {
      ok: false,
      status: 413,
      fehler: "Die Fotos sind zusammen zu groß.",
    };
  }

  const angaben: Array<[string, string]> = [
    ["Name / Firma", text(form, "name")],
    ["Telefon", text(form, "telefon")],
    ["E-Mail", email],
    ["Thema", text(form, "thema")],
    ["Objekt & Ort", text(form, "objekt_ort")],
    ["Nachricht", text(form, "nachricht")],
    ["Seite", text(form, "seite")],
    ["Fotos", fotos.length ? `${fotos.length} im Anhang` : "keine"],
  ];

  const html = `<h2 style="font-family:Arial,sans-serif;color:#132a5c">Neue Anfrage über die Website</h2>
<table style="font-family:Arial,sans-serif;font-size:15px;border-collapse:collapse">
${angaben
  .filter(([, wert]) => wert)
  .map(
    ([feld, wert]) =>
      `<tr><td style="padding:6px 16px 6px 0;color:#55637d;vertical-align:top">${feld}</td><td style="padding:6px 0;white-space:pre-wrap">${escapeHtml(wert)}</td></tr>`,
  )
  .join("\n")}
</table>`;

  const klartext = angaben
    .filter(([, wert]) => wert)
    .map(([feld, wert]) => `${feld}: ${wert}`)
    .join("\n");

  const attachments = await Promise.all(
    fotos.map(async (foto, i) => ({
      filename: dateiname(foto.name, i),
      content: base64(await foto.arrayBuffer()),
    })),
  );

  const antwort = await senden("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.ANFRAGE_VON || "Fixum Website <onboarding@resend.dev>",
      to: [env.ANFRAGE_AN || "info@fixum-objektservice.de"],
      subject: `Anfrage: ${text(form, "thema")} – ${text(form, "name")}`,
      html,
      text: klartext,
      ...(email ? { reply_to: email } : {}),
      ...(attachments.length ? { attachments } : {}),
    }),
  });

  if (!antwort.ok) {
    return { ok: false, status: 502, fehler: "Versand fehlgeschlagen." };
  }
  return { ok: true };
}

export async function onRequestPost(context: {
  request: Request;
  env: Env;
}): Promise<Response> {
  const { request, env } = context;
  const perScript = request.headers.get("Accept")?.includes("application/json");
  const ergebnis = await bearbeiteAnfrage(request, env);

  if (perScript) {
    return Response.json(
      ergebnis.ok ? { ok: true } : { ok: false, fehler: ergebnis.fehler },
      {
        status: ergebnis.ok ? 200 : ergebnis.status,
      },
    );
  }
  /* Ohne JavaScript: Danke-Seite oder zurück zum Kontakt mit Hinweis. */
  const ziel = ergebnis.ok ? "/danke/" : "/kontakt/?fehler=1";
  return Response.redirect(new URL(ziel, request.url).toString(), 303);
}
