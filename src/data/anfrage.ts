/**
 * Auswahlwerte des Anfrageformulars (src/components/Anfrage.astro).
 *
 * Die Schlüssel müssen mit api/anfrage.ts übereinstimmen - der Server prüft
 * gegen seine eigene Liste. tests/anfrage.test.ts vergleicht beide.
 */
import type { IconName } from "./icons";

export const anfrageLeistungen: Array<{
  wert: string;
  label: string;
  icon: IconName;
}> = [
  {
    wert: "entruempelung",
    label: "Entrümpelung / Haushaltsauflösung",
    icon: "karton",
  },
  { wert: "umzug", label: "Umzug", icon: "transporter" },
  { wert: "trockenbau", label: "Trockenbau / Innenausbau", icon: "platten" },
  { wert: "boden", label: "Bodenverlegung", icon: "dielen" },
  {
    wert: "entkernung",
    label: "Rückbau / Entkernung",
    icon: "vorschlaghammer",
  },
  { wert: "montage", label: "Montage / Kleinauftrag", icon: "akkuschrauber" },
  { wert: "sonstiges", label: "Sonstiges", icon: "clipboard" },
];

export const anfrageObjektarten = [
  { wert: "wohnung", label: "Wohnung" },
  { wert: "haus", label: "Haus" },
  { wert: "keller", label: "Keller / Dachboden" },
  { wert: "gewerbe", label: "Gewerbe" },
];

export const anfrageZeitraeume = [
  { wert: "sofort", label: "So bald wie möglich" },
  { wert: "wochen", label: "In den nächsten 2–4 Wochen" },
  { wert: "monate", label: "In 1–3 Monaten" },
  { wert: "offen", label: "Noch offen" },
];

export const anfrageKontaktwege = [
  { wert: "anruf", label: "Anruf" },
  { wert: "whatsapp", label: "WhatsApp" },
  { wert: "email", label: "E-Mail" },
];

/** Welche Leistung auf welcher Seite vorausgewählt ist. */
export const leistungJeSeite: Record<string, string> = {
  "/entruempelung/": "entruempelung",
  "/haushaltsaufloesung/": "entruempelung",
  "/wohnungsraeumung/": "entruempelung",
  "/umzug/": "umzug",
  "/trockenbau/": "trockenbau",
  "/renovierung/": "trockenbau",
  "/bodenverlegung/": "boden",
  "/entkernung/": "entkernung",
  "/kernsanierung/": "entkernung",
  "/rueckbau-trockenbau/": "entkernung",
  "/kuechenmontage/": "montage",
  "/hausmeisterservice/": "sonstiges",
  "/winterdienst/": "sonstiges",
};

/** Preisrechner-Leistung -> Formular-Leistung */
export const leistungJeRechner: Record<string, string> = {
  entruempelung: "entruempelung",
  umzug: "umzug",
  trockenbau: "trockenbau",
  montage: "montage",
  boden: "boden",
};

/** Link zum Formular, z. B. /kontakt/?leistung=umzug#anfrage. Auf Seiten
    mit Formular fängt Anfrage.astro den Klick ab (data-cta) und springt
    direkt zur Sektion; sonst führt der Link auf /kontakt/. */
export const anfrageHref = (leistung = "", ort = "") => {
  const p = new URLSearchParams();
  if (leistung) p.set("leistung", leistung);
  if (ort) p.set("ort", ort);
  const q = p.toString();
  return `/kontakt/${q ? `?${q}` : ""}#anfrage`;
};

/** Leistung der aktuellen Seite oder "" */
export const leistungFuer = (pfad: string) => leistungJeSeite[pfad] ?? "";
