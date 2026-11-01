/**
 * Kontaktformular -> E-Mail. Vercel Function unter POST /api/anfrage.
 *
 * Die Website bleibt statisch; nur dieser Endpunkt läuft auf dem Server
 * (Region Frankfurt, siehe vercel.json). Versand über das SMTP-Postfach
 * info@fixum-objektservice.de bei IONOS (nodemailer).
 *
 * Umgebungsvariablen (Vercel -> Settings -> Environment Variables):
 *   SMTP_HOST      smtp.ionos.de
 *   SMTP_PORT      465 (SSL/TLS) oder 587 (STARTTLS)
 *   SMTP_SECURE    optional: "true"/"false"; ohne Angabe true bei Port 465
 *   SMTP_USER      komplette E-Mail-Adresse des Postfachs
 *   SMTP_PASS      Passwort des Postfachs
 *   CONTACT_TO     Empfänger der Anfragen
 *   CONTACT_FROM   Absender, muss zum IONOS-Postfach gehören,
 *                  z. B. "Fixum Objektservice <info@fixum-objektservice.de>"
 *
 * Fotos werden nicht gespeichert: Sie liegen nur während der Anfrage im
 * Arbeitsspeicher und gehen als Anhang an CONTACT_TO.
 *
 * Bewusst ohne Importe aus src/: Vercel führt die Datei als eigenes Modul
 * aus. Die Auswahlwerte stehen deshalb hier und in src/data/anfrage.ts -
 * ein Test (tests/anfrage.test.ts) prüft, dass beide gleich sind.
 */
import nodemailer, { type SendMailOptions } from "nodemailer";

/* ---------------------------------------------------------------- Daten */

export const LEISTUNGEN = {
  entruempelung: "Entrümpelung / Haushaltsauflösung",
  umzug: "Umzug",
  trockenbau: "Trockenbau / Innenausbau",
  boden: "Bodenverlegung",
  entkernung: "Rückbau / Entkernung",
  montage: "Montage / Kleinauftrag",
  sonstiges: "Sonstiges",
} as const;

export const OBJEKTARTEN = {
  wohnung: "Wohnung",
  haus: "Haus",
  keller: "Keller / Dachboden",
  gewerbe: "Gewerbe",
} as const;

export const ZEITRAEUME = {
  sofort: "So bald wie möglich",
  wochen: "In den nächsten 2–4 Wochen",
  monate: "In 1–3 Monaten",
  offen: "Noch offen",
} as const;

export const KONTAKTWEGE = {
  anruf: "Anruf",
  whatsapp: "WhatsApp",
  email: "E-Mail",
} as const;

/* Firmendaten für die Bestätigung - wie in src/data/site.ts (Test prüft). */
export const FIRMA = {
  name: "Fixum Objektservice",
  inhaber: "Eckhard Singer",
  telefon: "+49 151 29628025",
  telefonLink: "+4915129628025",
  adresse: "Hermann-Allmers-Str. 13, 26721 Emden",
  web: "https://www.fixum-objektservice.de",
  whatsapp: "4915129628025",
  /** Logo für Mails: 440 px breit, angezeigt mit 220 px (scharf auf Retina). */
  logo: "https://www.fixum-objektservice.de/logo/fixum-mail.png",
};

/* Grenzen. Vercel nimmt höchstens 4,5 MB pro Anfrage an; das Formular
   verkleinert Fotos vorher so, dass sie zusammen unter 4 MB bleiben. */
export const MAX_FOTOS = 8;
export const MAX_FOTO_BYTES = 4 * 1024 * 1024;
export const MAX_GESAMT_BYTES = 4.3 * 1024 * 1024;
/** Schneller als das abgeschickt wird kein Mensch. */
export const MIN_AUSFUELLZEIT_MS = 3000;

/* ------------------------------------------------------------- Typen */

export interface Env {
  SMTP_HOST?: string;
  SMTP_PORT?: string;
  SMTP_SECURE?: string;
  SMTP_USER?: string;
  SMTP_PASS?: string;
  CONTACT_TO?: string;
  CONTACT_FROM?: string;
}

export type Versand = {
  sendMail: (mail: SendMailOptions) => Promise<unknown>;
};

type Foto = { name: string; typ: string; daten: Buffer };

export interface Anfrage {
  leistung: keyof typeof LEISTUNGEN;
  ort: string;
  objektart: keyof typeof OBJEKTARTEN;
  groesse: string;
  zeitraum: keyof typeof ZEITRAEUME | "";
  beschreibung: string;
  name: string;
  telefon: string;
  email: string;
  /** Mehrfachauswahl, mindestens ein Weg */
  kontaktwege: Array<keyof typeof KONTAKTWEGE>;
  seite: string;
  fotos: Foto[];
}

export type Ergebnis =
  | { ok: true; vorname: string; bot?: true }
  | {
      ok: false;
      status: number;
      fehler: string;
      felder?: Record<string, string>;
    };

/* ------------------------------------------------------- Rate-Limit */

/* Einfaches Limit pro IP im Speicher der laufenden Function: höchstens
   5 Anfragen in 10 Minuten. Lückenhaft, weil Vercel mehrere Instanzen
   startet und jede ihren eigenen Speicher hat - gegen Spamwellen aus einer
   Quelle reicht es trotzdem.

   SPÄTER (falls Spam kommt): hier Upstash Redis einhängen, z. B. über
   @upstash/ratelimit (Vercel Marketplace, Variablen UPSTASH_REDIS_REST_URL
   und UPSTASH_REDIS_REST_TOKEN). Die Funktion behält ihre Signatur, nur
   der Speicher wechselt von der Map zu Redis. */
const LIMIT = 5;
const FENSTER_MS = 10 * 60 * 1000;
const treffer = new Map<string, number[]>();

export const ratenLimit = (ip: string, jetzt = Date.now()): boolean => {
  const liste = (treffer.get(ip) ?? []).filter((t) => jetzt - t < FENSTER_MS);
  if (liste.length >= LIMIT) {
    treffer.set(ip, liste);
    return false;
  }
  liste.push(jetzt);
  treffer.set(ip, liste);
  /* Speicher klein halten */
  if (treffer.size > 5000) treffer.clear();
  return true;
};

/* --------------------------------------------------------- Prüfung */

const text = (form: FormData, feld: string, max: number) =>
  String(form.get(feld) ?? "")
    .replace(/\r\n?/g, "\n")
    .trim()
    .slice(0, max);

/** Für Betreff und Kopfzeilen: keine Zeilenumbrüche. */
const zeile = (wert: string) => wert.replace(/[\r\n]+/g, " ").trim();

const istSchluessel = <T extends object>(
  o: T,
  k: string,
): k is Extract<keyof T, string> => Object.prototype.hasOwnProperty.call(o, k);

const EMAIL = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]{2,}$/;
const TELEFON = /^[+()\d][\d\s()/+.-]{5,28}$/;

/** Bildtyp anhand der ersten Bytes - der angegebene MIME-Typ zählt nicht. */
export const bildtyp = (
  b: Uint8Array,
): { typ: string; endung: string } | null => {
  const ascii = (von: number, bis: number) =>
    String.fromCharCode(...b.subarray(von, bis));
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff)
    return { typ: "image/jpeg", endung: "jpg" };
  if (b[0] === 0x89 && ascii(1, 4) === "PNG")
    return { typ: "image/png", endung: "png" };
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP")
    return { typ: "image/webp", endung: "webp" };
  if (ascii(4, 8) === "ftyp") {
    const marke = ascii(8, 12);
    if (marke === "avif") return { typ: "image/avif", endung: "avif" };
    if (
      ["heic", "heix", "hevc", "hevx", "mif1", "msf1", "heis"].includes(marke)
    )
      return { typ: "image/heic", endung: "heic" };
  }
  return null;
};

type Pruefung =
  { bot: true } | { anfrage: Anfrage } | Extract<Ergebnis, { ok: false }>;

export async function pruefe(
  form: FormData,
  jetzt = Date.now(),
): Promise<Pruefung> {
  /* Honeypot: Menschen sehen das Feld nicht. Bots bekommen "ok". */
  if (text(form, "_gotcha", 200)) return { bot: true };
  /* Mindestzeit: _t setzt das Skript beim Laden. Ohne JavaScript fehlt es -
     dann greift nur der Honeypot. */
  const start = Number(form.get("_t"));
  if (start && jetzt - start < MIN_AUSFUELLZEIT_MS) return { bot: true };

  const felder: Record<string, string> = {};
  const leistung = text(form, "leistung", 40);
  const ort = text(form, "ort", 100);
  const objektart = text(form, "objektart", 20);
  const groesse = text(form, "groesse", 60);
  const zeitraum = text(form, "zeitraum", 20);
  const beschreibung = text(form, "beschreibung", 3000);
  const name = zeile(text(form, "name", 100));
  const telefon = zeile(text(form, "telefon", 40));
  const email = zeile(text(form, "email", 200));
  const wegeRoh = form.getAll("kontaktweg").map((w) => String(w).trim());
  const kontaktwege = [
    ...new Set(wegeRoh.filter((w) => istSchluessel(KONTAKTWEGE, w))),
  ] as Anfrage["kontaktwege"];

  if (!istSchluessel(LEISTUNGEN, leistung))
    felder.leistung = "Bitte wählen Sie aus, was Sie planen.";
  if (!ort) felder.ort = "Bitte geben Sie Ort oder Postleitzahl an.";
  if (!istSchluessel(OBJEKTARTEN, objektart))
    felder.objektart = "Bitte wählen Sie die Art des Objekts.";
  if (zeitraum && !istSchluessel(ZEITRAEUME, zeitraum))
    felder.zeitraum = "Bitte wählen Sie einen Zeitraum.";
  if (!name) felder.name = "Bitte geben Sie Ihren Namen an.";
  if (!kontaktwege.length || kontaktwege.length !== wegeRoh.length)
    felder.kontaktweg = "Bitte wählen Sie mindestens einen Weg.";
  /* E-Mail ist immer Pflicht; Telefon nur für Rückruf oder WhatsApp. */
  if (!email) felder.email = "Bitte geben Sie Ihre E-Mail-Adresse an.";
  else if (!EMAIL.test(email))
    felder.email = "Bitte prüfen Sie die E-Mail-Adresse.";
  const telefonNoetig =
    kontaktwege.includes("anruf") || kontaktwege.includes("whatsapp");
  if (telefonNoetig && !telefon)
    felder.telefon = "Für Rückruf oder WhatsApp brauchen wir Ihre Nummer.";
  else if (telefon && !TELEFON.test(telefon))
    felder.telefon = "Bitte prüfen Sie die Telefonnummer.";
  if (!form.get("datenschutz"))
    felder.datenschutz = "Bitte bestätigen Sie die Einwilligung.";

  if (Object.keys(felder).length) {
    return {
      ok: false,
      status: 400,
      fehler: "Bitte prüfen Sie die markierten Angaben.",
      felder,
    };
  }

  const dateien = form
    .getAll("fotos")
    .filter(
      (f): f is File =>
        typeof f === "object" && f !== null && "arrayBuffer" in f && f.size > 0,
    );
  if (dateien.length > MAX_FOTOS) {
    return {
      ok: false,
      status: 413,
      fehler: `Bitte höchstens ${MAX_FOTOS} Fotos mitschicken.`,
    };
  }
  let gesamt = 0;
  const fotos: Foto[] = [];
  for (const [i, datei] of dateien.entries()) {
    if (datei.size > MAX_FOTO_BYTES) {
      return {
        ok: false,
        status: 413,
        fehler: "Ein Foto ist zu groß. Bitte ein kleineres auswählen.",
      };
    }
    gesamt += datei.size;
    if (gesamt > MAX_GESAMT_BYTES) {
      return {
        ok: false,
        status: 413,
        fehler:
          "Die Fotos sind zusammen zu groß. Bitte ein, zwei Fotos weniger senden.",
      };
    }
    const daten = Buffer.from(await datei.arrayBuffer());
    const art = bildtyp(daten);
    if (!art) {
      return {
        ok: false,
        status: 415,
        fehler: "Bitte nur Fotos (JPEG, PNG, WebP oder HEIC) anhängen.",
      };
    }
    fotos.push({ name: `foto-${i + 1}.${art.endung}`, typ: art.typ, daten });
  }

  return {
    anfrage: {
      leistung: leistung as Anfrage["leistung"],
      ort: zeile(ort),
      objektart: objektart as Anfrage["objektart"],
      groesse: zeile(groesse),
      zeitraum: zeitraum as Anfrage["zeitraum"],
      beschreibung,
      name,
      telefon,
      email,
      kontaktwege,
      seite: zeile(text(form, "seite", 200)),
      fotos,
    },
  };
}

/* ------------------------------------------------------------- Mails */

export const escapeHtml = (wert: string) =>
  wert.replace(
    /[&<>"']/g,
    (z) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        z
      ]!,
  );

/** Telefonnummer für tel:-Links: nur +, Ziffern. */
export const telLink = (nummer: string) => nummer.replace(/[^\d+]/g, "");

/** wa.me braucht die Nummer international ohne +, z. B. 49151... */
export const waNummer = (nummer: string) => {
  let n = nummer.replace(/[^\d+]/g, "");
  if (n.startsWith("+")) n = n.slice(1);
  else if (n.startsWith("00")) n = n.slice(2);
  else if (n.startsWith("0")) n = `49${n.slice(1)}`;
  return n;
};

const vorname = (name: string) => name.split(/\s+/)[0] ?? name;

/** Angaben als [Bezeichnung, Klartext, HTML] - für beide Mails. */
const zeilen = (a: Anfrage): Array<[string, string, string]> => {
  const z: Array<[string, string, string?]> = [
    ["Leistung", LEISTUNGEN[a.leistung]],
    ["Ort / PLZ", a.ort],
    ["Objekt", OBJEKTARTEN[a.objektart]],
    ["Größe", a.groesse],
    ["Wunschzeitraum", a.zeitraum ? ZEITRAEUME[a.zeitraum] : ""],
    ["Beschreibung", a.beschreibung],
    ["Name", a.name],
    [
      "Telefon",
      a.telefon,
      a.telefon
        ? `<a href="tel:${escapeHtml(telLink(a.telefon))}">${escapeHtml(a.telefon)}</a>`
        : "",
    ],
    [
      "E-Mail",
      a.email,
      a.email
        ? `<a href="mailto:${escapeHtml(a.email)}">${escapeHtml(a.email)}</a>`
        : "",
    ],
    ["Kontakt bevorzugt", a.kontaktwege.map((w) => KONTAKTWEGE[w]).join(", ")],
  ];
  return z
    .filter(([, wert]) => wert)
    .map(([feld, wert, html]) => [feld, wert, html ?? escapeHtml(wert)]);
};

const tabelle = (reihen: Array<[string, string, string]>) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;max-width:640px;border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#101b31">
${reihen
  .map(
    ([feld, , html]) =>
      `<tr><td style="padding:10px 16px 10px 0;border-bottom:1px solid #dce5f2;color:#55637d;vertical-align:top;white-space:nowrap;width:160px">${feld}</td><td style="padding:10px 0;border-bottom:1px solid #dce5f2;white-space:pre-wrap">${html}</td></tr>`,
  )
  .join("\n")}
</table>`;

export const betreff = (a: Anfrage) =>
  zeile(`Neue Anfrage: ${LEISTUNGEN[a.leistung]} – ${a.ort} – ${a.name}`).slice(
    0,
    180,
  );

export const mailAnMich = (a: Anfrage, env: Env): SendMailOptions => {
  const reihen = zeilen(a);
  const wa =
    a.telefon && a.kontaktwege.includes("whatsapp")
      ? `<p style="margin:16px 0 0"><a href="https://wa.me/${waNummer(a.telefon)}" style="color:#1668c4;font-weight:bold">Per WhatsApp antworten</a></p>`
      : "";
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;color:#101b31">
<h1 style="margin:0 0 4px;font-size:20px;color:#132a5c">${escapeHtml(LEISTUNGEN[a.leistung])} in ${escapeHtml(a.ort)}</h1>
<p style="margin:0 0 16px;color:#55637d">Neue Anfrage über die Website${a.seite ? ` (Seite ${escapeHtml(a.seite)})` : ""}${a.fotos.length ? ` · ${a.fotos.length} Foto${a.fotos.length > 1 ? "s" : ""} im Anhang` : " · ohne Fotos"}</p>
${tabelle(reihen)}
${wa}
${a.telefon ? `<p style="margin:16px 0 0"><a href="tel:${escapeHtml(telLink(a.telefon))}" style="display:inline-block;padding:10px 18px;background:#1668c4;color:#ffffff;text-decoration:none;font-weight:bold;border-radius:4px">${escapeHtml(a.telefon)} anrufen</a></p>` : ""}
</div>`;
  const klartext = [
    `Neue Anfrage über die Website${a.seite ? ` (${a.seite})` : ""}`,
    "",
    ...reihen.map(([feld, wert]) => `${feld}: ${wert}`),
    "",
    a.fotos.length ? `${a.fotos.length} Foto(s) im Anhang` : "Ohne Fotos",
  ].join("\n");
  return {
    from: env.CONTACT_FROM,
    to: env.CONTACT_TO,
    ...(a.email
      ? { replyTo: `${zeile(a.name).replace(/[<>"]/g, "")} <${a.email}>` }
      : {}),
    subject: betreff(a),
    text: klartext,
    html,
    attachments: a.fotos.map((f) => ({
      filename: f.name,
      content: f.daten,
      contentType: f.typ,
    })),
  };
};

/** "telefonisch, per WhatsApp oder per E-Mail" */
const wegText = (wege: Anfrage["kontaktwege"]) => {
  const teile = wege.map((w) =>
    w === "anruf"
      ? "telefonisch"
      : w === "whatsapp"
        ? "per WhatsApp"
        : "per E-Mail",
  );
  return teile.length > 1
    ? `${teile.slice(0, -1).join(", ")} oder ${teile.at(-1)}`
    : (teile[0] ?? "");
};

/* Farben der Marke für Mails (Inline-Styles, E-Mail-Programme kennen
   keine CSS-Variablen): Navy und Blau tragen, Kupfer nur als Akzent. */
const MAIL = {
  navy: "#132a5c",
  navyTief: "#0a1730",
  blau: "#1668c4",
  text: "#101b31",
  grau: "#55637d",
  linie: "#dce5f2",
  grund: "#eef2f8",
  hell: "#f5f8fc",
  kupfer: "#b08d57",
  kupferHell: "#cfab72",
  schrift: "Arial,Helvetica,sans-serif",
};

/** Angaben als ruhige Liste - für die Bestätigung */
const angabenListe = (reihen: Array<[string, string, string]>) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;font-family:${MAIL.schrift};font-size:14px;line-height:1.5">
${reihen
  .map(
    ([feld, , html]) =>
      `<tr><td style="padding:10px 16px 10px 0;border-bottom:1px solid ${MAIL.linie};color:${MAIL.grau};vertical-align:top;width:38%">${feld}</td><td style="padding:10px 0;border-bottom:1px solid ${MAIL.linie};color:${MAIL.text};white-space:pre-wrap">${html.replace(/<a /g, `<a style="color:${MAIL.blau};text-decoration:none" `)}</td></tr>`,
  )
  .join("\n")}
</table>`;

export const bestaetigung = (a: Anfrage, env: Env): SendMailOptions | null => {
  if (!a.email) return null;
  const reihen = zeilen(a).filter(([feld]) => feld !== "E-Mail");
  const weg = wegText(a.kontaktwege);
  const vor = vorname(a.name);
  const fotosSatz = a.fotos.length
    ? `Sie haben ${a.fotos.length === 1 ? "ein Foto" : `${a.fotos.length} Fotos`} mitgeschickt – danke, das hilft uns bei der Einschätzung.`
    : "";
  const schritte: Array<[string, string, string]> = [
    [
      "01",
      "Rückmeldung",
      `Wir melden uns in der Regel innerhalb von 24 Stunden ${weg} bei Ihnen.`,
    ],
    [
      "02",
      "Besichtigung",
      "Kostenlos und unverbindlich, zu einem Termin, der Ihnen passt.",
    ],
    [
      "03",
      "Festpreis-Angebot",
      "Schriftlich, mit klarem Leistungsumfang – ohne Überraschungen.",
    ],
  ];
  const p = (t: string) =>
    `<p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:${MAIL.text}">${t}</p>`;
  const html = `<!doctype html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><style>@media (max-width:480px){.rand{padding-left:24px!important;padding-right:24px!important}}</style><title>Ihre Anfrage bei ${FIRMA.name}</title></head>
<body style="margin:0;padding:0;background:${MAIL.grund}">
<div style="display:none;max-height:0;overflow:hidden">Danke, ${escapeHtml(vor)} – Ihre Anfrage ist bei uns angekommen. Wir melden uns in der Regel innerhalb von 24 Stunden.</div>
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:${MAIL.grund};font-family:${MAIL.schrift}">
<tr><td align="center" style="padding:32px 12px">
<table role="presentation" cellpadding="0" cellspacing="0" width="600" style="width:100%;max-width:600px;border-collapse:collapse;background:#ffffff;border:1px solid ${MAIL.linie}">

<tr><td class="rand" style="padding:30px 40px 24px">
<a href="${FIRMA.web}" style="text-decoration:none"><img src="${FIRMA.logo}" width="220" height="49" alt="${FIRMA.name}" style="display:block;width:220px;height:auto;border:0;font-family:${MAIL.schrift};font-size:20px;font-weight:bold;color:${MAIL.navy}"></a>
<div style="width:44px;height:2px;margin-top:20px;background:${MAIL.kupfer};line-height:2px;font-size:0">&nbsp;</div>
</td></tr>

<tr><td class="rand" style="padding:34px 40px;background:${MAIL.navy}">
<p style="margin:0 0 10px;font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:${MAIL.kupferHell}">Anfrage eingegangen</p>
<p style="margin:0 0 8px;font-size:26px;line-height:1.25;font-weight:bold;color:#ffffff">Vielen Dank, ${escapeHtml(vor)}.</p>
<p style="margin:0;font-size:15px;line-height:1.6;color:#c9d6ea">Ihre Anfrage ist bei uns angekommen.</p>
</td></tr>

<tr><td class="rand" style="padding:34px 40px 8px">
${p(`Guten Tag ${escapeHtml(a.name)},`)}
${p(`vielen Dank für Ihr Vertrauen. Wir sehen uns Ihre Angaben${a.fotos.length ? " und Fotos" : ""} in Ruhe an und melden uns zeitnah bei Ihnen.`)}
${fotosSatz ? p(fotosSatz) : ""}
</td></tr>

<tr><td class="rand" style="padding:8px 40px 6px">
<p style="margin:0 0 14px;font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:${MAIL.navy}">So geht es weiter</p>
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse">
${schritte
  .map(
    ([nr, titel, satz], i) =>
      `<tr><td width="44" style="padding:14px 0;vertical-align:top;${i ? `border-top:1px solid ${MAIL.linie};` : ""}font-size:13px;font-weight:bold;letter-spacing:1px;color:${MAIL.kupfer}">${nr}</td><td style="padding:14px 0;vertical-align:top;${i ? `border-top:1px solid ${MAIL.linie};` : ""}"><p style="margin:0 0 3px;font-size:15px;font-weight:bold;color:${MAIL.navy}">${titel}</p><p style="margin:0;font-size:14px;line-height:1.55;color:${MAIL.grau}">${satz}</p></td></tr>`,
  )
  .join("\n")}
</table>
</td></tr>

<tr><td class="rand" style="padding:22px 40px 30px">
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;background:${MAIL.hell};border-left:3px solid ${MAIL.blau}">
<tr><td style="padding:18px 22px">
<p style="margin:0 0 12px;font-size:14px;line-height:1.5;color:${MAIL.text}"><strong style="color:${MAIL.navy}">Es eilt?</strong> Rufen Sie uns direkt an oder schreiben Sie per WhatsApp.</p>
<a href="tel:${FIRMA.telefonLink}" style="display:inline-block;padding:12px 20px;margin:0 8px 6px 0;background:${MAIL.blau};color:#ffffff;font-size:14px;font-weight:bold;text-decoration:none;border-radius:4px">${FIRMA.telefon}</a>
<a href="https://wa.me/${FIRMA.whatsapp}" style="display:inline-block;padding:11px 19px;margin:0 0 6px;border:1px solid ${MAIL.navy};color:${MAIL.navy};font-size:14px;font-weight:bold;text-decoration:none;border-radius:4px">WhatsApp</a>
</td></tr>
</table>
</td></tr>

<tr><td class="rand" style="padding:0 40px 10px">
<p style="margin:0 0 6px;font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:${MAIL.navy}">Ihre Angaben</p>
${angabenListe(reihen)}
</td></tr>

<tr><td class="rand" style="padding:28px 40px 36px">
<p style="margin:0;font-size:15px;line-height:1.65;color:${MAIL.text}">Freundliche Grüße<br><strong style="color:${MAIL.navy}">Ihr Team von ${FIRMA.name}</strong></p>
</td></tr>

<tr><td class="rand" style="padding:24px 40px;background:${MAIL.hell};border-top:1px solid ${MAIL.linie};font-size:12px;line-height:1.7;color:${MAIL.grau}">
<strong style="color:${MAIL.navy}">${FIRMA.name}</strong> · Inhaber ${FIRMA.inhaber}<br>
${FIRMA.adresse}<br>
<a href="tel:${FIRMA.telefonLink}" style="color:${MAIL.grau};text-decoration:none">${FIRMA.telefon}</a> · <a href="${FIRMA.web}" style="color:${MAIL.grau};text-decoration:none">${FIRMA.web.replace("https://www.", "")}</a>
<p style="margin:12px 0 0;font-size:11px;color:#8592a8">Diese E-Mail wurde automatisch versendet, weil Sie auf unserer Website eine Anfrage gestellt haben. Für Rückfragen antworten Sie einfach auf diese Nachricht.</p>
</td></tr>

</table>
</td></tr>
</table>
</body></html>`;
  const klartext = [
    `Guten Tag ${a.name},`,
    "",
    `vielen Dank für Ihr Vertrauen – Ihre Anfrage ist bei uns angekommen. Wir sehen uns Ihre Angaben${a.fotos.length ? " und Fotos" : ""} in Ruhe an und melden uns zeitnah bei Ihnen.`,
    ...(fotosSatz ? ["", fotosSatz] : []),
    "",
    "So geht es weiter:",
    ...schritte.map(([nr, titel, satz]) => `${nr} ${titel}: ${satz}`),
    "",
    `Es eilt? Rufen Sie uns an: ${FIRMA.telefon}`,
    "",
    "Ihre Angaben:",
    ...reihen.map(([feld, wert]) => `${feld}: ${wert}`),
    "",
    "Freundliche Grüße",
    `Ihr Team von ${FIRMA.name}`,
    "",
    `${FIRMA.name} · Inhaber ${FIRMA.inhaber}`,
    FIRMA.adresse,
    FIRMA.web,
  ].join("\n");
  return {
    from: env.CONTACT_FROM,
    to: a.email,
    replyTo: env.CONTACT_TO,
    subject: `Ihre Anfrage bei ${FIRMA.name}`,
    text: klartext,
    html,
  };
};

/* ---------------------------------------------------------- Ablauf */

const PFLICHT_ENV = [
  "SMTP_HOST",
  "SMTP_USER",
  "SMTP_PASS",
  "CONTACT_TO",
  "CONTACT_FROM",
] as const;

export const versandBereit = (env: Env) => PFLICHT_ENV.every((k) => env[k]);

/** Werte aus Vercel bereinigen: Leerzeichen und versehentlich mitkopierte
    Anführungszeichen ("Fixum <info@…>") entfernen. */
export const leseEnv = (roh: Record<string, string | undefined>): Env => {
  const env: Env = {};
  for (const k of [
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_SECURE",
    "SMTP_USER",
    "SMTP_PASS",
    "CONTACT_TO",
    "CONTACT_FROM",
  ] as const) {
    const wert = roh[k]
      ?.trim()
      .replace(/^(["'])(.*)\1$/, "$2")
      .trim();
    if (wert) env[k] = wert;
  }
  return env;
};

export const smtpVersand = (env: Env) => {
  const port = Number(env.SMTP_PORT || 465);
  const secure = env.SMTP_SECURE
    ? env.SMTP_SECURE.toLowerCase() === "true"
    : port === 465;
  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port,
    secure,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });
};

export async function bearbeite(
  request: Request,
  env: Env,
  versand?: Versand,
  jetzt = Date.now(),
): Promise<Ergebnis> {
  if (!versandBereit(env)) {
    return {
      ok: false,
      status: 503,
      fehler: "Der Versand ist gerade nicht eingerichtet.",
    };
  }
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unbekannt";
  if (!ratenLimit(ip, jetzt)) {
    return {
      ok: false,
      status: 429,
      fehler: "Zu viele Anfragen in kurzer Zeit. Bitte rufen Sie uns an.",
    };
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return { ok: false, status: 400, fehler: "Die Anfrage war nicht lesbar." };
  }

  const geprueft = await pruefe(form, jetzt);
  if ("bot" in geprueft) return { ok: true, vorname: "", bot: true };
  if (!("anfrage" in geprueft)) return geprueft;
  const { anfrage } = geprueft;

  const transport = versand ?? smtpVersand(env);
  try {
    await transport.sendMail(mailAnMich(anfrage, env));
  } catch (fehler) {
    console.error(
      "Versand an Fixum fehlgeschlagen:",
      (fehler as Error)?.message,
    );
    return {
      ok: false,
      status: 502,
      fehler: "Der Versand hat nicht geklappt.",
    };
  }
  /* Die Bestätigung ist ein Extra: Schlägt sie fehl, ist die Anfrage
     trotzdem angekommen. */
  const kopie = bestaetigung(anfrage, env);
  if (kopie) {
    try {
      await transport.sendMail(kopie);
    } catch (fehler) {
      console.error("Bestätigung nicht versendet:", (fehler as Error)?.message);
    }
  }
  return { ok: true, vorname: vorname(anfrage.name) };
}

/* Vercel: Web-Standard-Handler (Node.js-Laufzeit). */
export async function POST(request: Request): Promise<Response> {
  const ergebnis = await bearbeite(request, leseEnv(process.env));
  const perScript = request.headers.get("accept")?.includes("application/json");
  if (perScript) {
    return Response.json(
      ergebnis.ok
        ? { ok: true, vorname: ergebnis.vorname }
        : { ok: false, fehler: ergebnis.fehler, felder: ergebnis.felder },
      { status: ergebnis.ok ? 200 : ergebnis.status },
    );
  }
  /* Ohne JavaScript: Danke-Seite oder zurück zum Formular. */
  const ziel = ergebnis.ok ? "/danke/" : "/kontakt/?fehler=1#anfrage";
  return Response.redirect(new URL(ziel, request.url).toString(), 303);
}

/* Statusabfrage im Browser: /api/anfrage zeigt, ob alle Variablen da sind,
   /api/anfrage?pruefen=1 meldet sich zusätzlich testweise beim Mailserver
   an (ohne etwas zu senden). Zeigt nur Namen fehlender Variablen, nie
   Werte. */
export async function GET(request: Request): Promise<Response> {
  const env = leseEnv(process.env);
  const fehlt = PFLICHT_ENV.filter((k) => !env[k]);
  const antwort: Record<string, unknown> = {
    versand: fehlt.length ? "nicht eingerichtet" : "eingerichtet",
    fehlt,
  };
  if (!fehlt.length && new URL(request.url).searchParams.has("pruefen")) {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unbekannt";
    if (!ratenLimit(`pruefen:${ip}`)) {
      antwort.smtp = "Zu viele Prüfungen, bitte in 10 Minuten erneut.";
    } else {
      try {
        await smtpVersand(env).verify();
        antwort.smtp = `Anmeldung bei ${env.SMTP_HOST} erfolgreich`;
      } catch (fehler) {
        antwort.smtp = `Anmeldung fehlgeschlagen: ${String((fehler as Error)?.message).slice(0, 200)}`;
      }
    }
  }
  return Response.json(antwort, { headers: { "cache-control": "no-store" } });
}
