/* Sichtbare Preise der Website.

   Auf der Website stehen nur die fünf Ab-Preise. Ihre Zahlen kommen aus
   src/data/preise.config.json (Abschnitt "abPreise") - dort und nur dort
   werden sie geändert. Alle übrigen Werte stecken ausschließlich im
   Preisrechner und erscheinen nie als Text auf einer Seite.

   Leistungen ohne Ab-Preis (Entkernung, Boden, Montage, Hausmeisterservice,
   Winterdienst) zeigen nur "Festpreis nach Besichtigung". */
import config from "./preise.config.json";

const ab = config.abPreise;

/** Steht direkt neben jedem Ab-Preis. Wortlaut vom Inhaber vorgegeben. */
export const preisHinweis =
  "Richtwert ohne Umsatzsteuer (§ 19 UStG). Verbindlicher Festpreis nach kostenloser Besichtigung.";

export const festpreisHinweis = "Festpreis nach Besichtigung";

export interface Preisposition {
  /** Was bepreist wird. */
  leistung: string;
  /** Kurze Erläuterung, ohne weitere Zahlen. */
  zusatz?: string;
  /** Sichtbarer Ab-Preis, z. B. "ab 15 €/m²". Fehlt bei Leistungen ohne Ab-Preis. */
  betrag?: string;
  /** Maschinenlesbar für schema.org. */
  ab?: number;
  einheit?: string;
}

const zahl = (n: number) => n.toLocaleString("de-DE");

export const preise = {
  entruempelungNormal: {
    leistung: "Entrümpelung, normal möbliert",
    zusatz: "Übliche Einrichtung mit Möbeln und Hausrat.",
    betrag: `ab ${zahl(ab.entruempelungNormal)} €/m²`,
    ab: ab.entruempelungNormal,
    einheit: "m² Wohnfläche",
  },
  entruempelungStark: {
    leistung: "Entrümpelung, stark möbliert",
    zusatz: "Viel Hausrat, volle Keller oder Dachböden.",
    betrag: `ab ${zahl(ab.entruempelungStark)} €/m²`,
    ab: ab.entruempelungStark,
    einheit: "m² Wohnfläche",
  },
  entruempelungMessie: {
    leistung: "Messie-Wohnung",
    zusatz: "Mit Ruhe, Schutzausrüstung und ohne Kommentar.",
    betrag: `ab ${zahl(ab.entruempelungMessie)} €/m²`,
    ab: ab.entruempelungMessie,
    einheit: "m² Wohnfläche",
  },
  umzug: {
    leistung: "Umzug einer 2-Zimmer-Wohnung im Nahbereich",
    zusatz: "Zum Beispiel Emden–Norden, mit Transporter bis 3,5 t.",
    betrag: `ab ${zahl(ab.umzugZweiZimmerNahbereich)} €`,
    ab: ab.umzugZweiZimmerNahbereich,
  },
  trockenbau: {
    leistung: "Trockenbauwand",
    zusatz: "Inklusive Material.",
    betrag: `ab ${zahl(ab.trockenbauwandInklMaterial)} €/m² inkl. Material`,
    ab: ab.trockenbauwandInklMaterial,
    einheit: "m² Wandfläche",
  },
  entkernung: {
    leistung: "Entkernung und nicht-tragender Rückbau",
    zusatz:
      "Fläche, Bauteile und Entsorgungsmengen unterscheiden sich von Objekt zu Objekt zu stark für einen Richtwert.",
  },
  boden: {
    leistung: "Bodenverlegung",
    zusatz: "Laminat, Vinyl und Teppich.",
  },
  montage: {
    leistung: "Möbel-, Küchen- und Türmontage",
    zusatz: "Ohne Elektro-, Gas- und Wasseranschlüsse.",
  },
  hausmeister: {
    leistung: "Hausmeisterservice und Winterdienst",
    zusatz:
      "Umfang und Einsatzzeiten werden vor Ort aufgenommen und schriftlich vereinbart.",
  },
} satisfies Record<string, Preisposition>;

export type PreisSchluessel = keyof typeof preise;

/** Die drei Entrümpelungsstufen - als Karten auf den Räumungsseiten. */
export const entruempelungsStufen: PreisSchluessel[] = [
  "entruempelungNormal",
  "entruempelungStark",
  "entruempelungMessie",
];

/** Satz für FAQ-Antworten zur Entrümpelung, nur mit den Ab-Preisen. */
export const entruempelungPreissatz = `Normal möblierte Wohnungen ab ${zahl(ab.entruempelungNormal)} €/m², stark möbliert oder mit vollen Kellern und Dachböden ab ${zahl(ab.entruempelungStark)} €/m², Messie-Wohnungen ab ${zahl(ab.entruempelungMessie)} €/m².`;
