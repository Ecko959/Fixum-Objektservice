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
  kontaktweg: keyof typeof KONTAKTWEGE;
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
  const kontaktweg = text(form, "kontaktweg", 20) || "anruf";

  if (!istSchluessel(LEISTUNGEN, leistung))
    felder.leistung = "Bitte wählen Sie aus, was Sie planen.";
  if (!ort) felder.ort = "Bitte geben Sie Ort oder Postleitzahl an.";
  if (!istSchluessel(OBJEKTARTEN, objektart))
    felder.objektart = "Bitte wählen Sie die Art des Objekts.";
  if (zeitraum && !istSchluessel(ZEITRAEUME, zeitraum))
    felder.zeitraum = "Bitte wählen Sie einen Zeitraum.";
  if (!name) felder.name = "Bitte geben Sie Ihren Namen an.";
  if (!istSchluessel(KONTAKTWEGE, kontaktweg))
    felder.kontaktweg = "Bitte wählen Sie, wie wir Sie erreichen.";
  const telefonNoetig = kontaktweg !== "email";
  if (telefonNoetig && !telefon)
    felder.telefon = "Bitte geben Sie Ihre Telefonnummer an.";
  else if (telefon && !TELEFON.test(telefon))
    felder.telefon = "Bitte prüfen Sie die Telefonnummer.";
  if (kontaktweg === "email" && !email)
    felder.email = "Bitte geben Sie Ihre E-Mail-Adresse an.";
  else if (email && !EMAIL.test(email))
    felder.email = "Bitte prüfen Sie die E-Mail-Adresse.";
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
      kontaktweg: kontaktweg as Anfrage["kontaktweg"],
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
    ["Kontakt bevorzugt", KONTAKTWEGE[a.kontaktweg]],
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

export const mailAnMich = (
  a: Anfrage,
  env: Env,
): SendMailOptions => {
  const reihen = zeilen(a);
  const wa =
    a.telefon && a.kontaktweg === "whatsapp"
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

export const bestaetigung = (
  a: Anfrage,
  env: Env,
): SendMailOptions | null => {
  if (!a.email) return null;
  const reihen = zeilen(a).filter(([feld]) => feld !== "E-Mail");
  const weg =
    a.kontaktweg === "email"
      ? "per E-Mail"
      : a.kontaktweg === "whatsapp"
        ? "per WhatsApp"
        : "telefonisch";
  const fotosSatz = a.fotos.length
    ? `Sie haben ${a.fotos.length === 1 ? "ein Foto" : `${a.fotos.length} Fotos`} mitgeschickt – danke, das hilft mir bei der Einschätzung.`
    : "";
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#101b31;max-width:640px">
<p>Guten Tag ${escapeHtml(a.name)},</p>
<p>vielen Dank für Ihre Anfrage – sie ist bei mir angekommen. Ich melde mich in der Regel innerhalb von 24 Stunden ${weg} bei Ihnen.</p>
<p>Wenn es eilt, erreichen Sie mich direkt unter <a href="tel:${FIRMA.telefonLink}" style="color:#1668c4;font-weight:bold">${FIRMA.telefon}</a>.</p>
${fotosSatz ? `<p>${fotosSatz}</p>` : ""}
<p style="margin:24px 0 8px;font-weight:bold;color:#132a5c">Ihre Angaben im Überblick</p>
${tabelle(reihen)}
<p style="margin-top:24px">Viele Grüße<br>${FIRMA.inhaber}<br>${FIRMA.name}</p>
<p style="color:#55637d;font-size:13px">${FIRMA.adresse} · <a href="${FIRMA.web}" style="color:#55637d">${FIRMA.web.replace("https://", "")}</a></p>
</div>`;
  const klartext = [
    `Guten Tag ${a.name},`,
    "",
    `vielen Dank für Ihre Anfrage – sie ist bei mir angekommen. Ich melde mich in der Regel innerhalb von 24 Stunden ${weg} bei Ihnen.`,
    `Wenn es eilt, erreichen Sie mich direkt unter ${FIRMA.telefon}.`,
    ...(fotosSatz ? ["", fotosSatz] : []),
    "",
    "Ihre Angaben im Überblick:",
    ...reihen.map(([feld, wert]) => `${feld}: ${wert}`),
    "",
    "Viele Grüße",
    FIRMA.inhaber,
    FIRMA.name,
    FIRMA.adresse,
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

export const versandBereit = (env: Env) =>
  Boolean(
    env.SMTP_HOST &&
    env.SMTP_USER &&
    env.SMTP_PASS &&
    env.CONTACT_TO &&
    env.CONTACT_FROM,
  );

export const smtpVersand = (env: Env): Versand => {
  const port = Number(env.SMTP_PORT || 465);
  const secure = env.SMTP_SECURE ? env.SMTP_SECURE === "true" : port === 465;
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
  const ergebnis = await bearbeite(request, process.env as Env);
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

export function GET(): Response {
  return new Response("Method Not Allowed", {
    status: 405,
    headers: { Allow: "POST" },
  });
}
