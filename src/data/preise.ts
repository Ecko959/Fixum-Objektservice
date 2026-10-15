/* Preisangaben - die einzige Stelle, an der Zahlen stehen.

   Alles hier ist vom Inhaber freigegeben. Leistungsseiten, Startseiten-FAQ,
   Zentralseite und llms.txt lesen von hier; wer einen Preis ändert, ändert
   ihn damit überall zugleich. Keine weiteren Zahlen ergänzen, ohne dass sie
   freigegeben sind - auch keine Spannen "zur Orientierung".

   Leistungen ohne Richtwert (Entkernung, Boden, Montage, Hausmeisterservice,
   Winterdienst) bekommen bewusst keinen Betrag, sondern nur den Hinweis auf
   den Festpreis nach Besichtigung. */

/** Steht direkt neben jedem Betrag. */
export const festpreisHinweis = "Festpreis nach Besichtigung";

/** Steuerhinweis unter jeder Preisangabe, Wortlaut vom Inhaber vorgegeben. */
export const steuerHinweis =
  "Alle Preise sind Nettopreise, es wird keine Umsatzsteuer ausgewiesen (§ 19 UStG).";

export interface Preisposition {
  /** Was bepreist wird, z. B. "Entrümpelung". */
  leistung: string;
  /** Betrag mit Einheit, z. B. "ab 15 €/m² Wohnfläche". Fehlt bei Leistungen ohne Richtwert. */
  betrag?: string;
  /** Wofür der Betrag gilt bzw. wovon er abhängt. */
  bedingung: string;
  /** Hinweis direkt neben dem Betrag. */
  festpreis: string;
  /** Maschinenlesbar für schema.org: Mindestbetrag in Euro und Einheit. */
  ab?: number;
  einheit?: string;
}

export const preise = {
  entruempelung: {
    leistung: "Entrümpelung",
    betrag: "ab 15 €/m² Wohnfläche",
    bedingung:
      "bei leicht möblierten Räumen im Erdgeschoss. Üblich sind 20–40 €/m², je nach Füllgrad, Etage und Entsorgung.",
    festpreis: "Festpreis nach kostenloser Besichtigung",
    ab: 15,
    einheit: "m² Wohnfläche",
  },
  trockenbau: {
    leistung: "Trockenbauwand",
    betrag: "ab 45 €/m²",
    bedingung: "je nach Wandaufbau, Dämmung und Oberflächenqualität.",
    festpreis: "Festpreis nach Besichtigung und Aufmaß",
    ab: 45,
    einheit: "m² Wandfläche",
  },
  umzug: {
    leistung: "Umzug einer 2-Zimmer-Wohnung im Nahbereich (z. B. Emden–Norden)",
    betrag: "ab 600 €",
    bedingung:
      "mit Transporter bis 3,5 t, Tragen und Fahrt. Montage, Etagen ohne Aufzug und größere Haushalte nach Besichtigung oder Fotos.",
    festpreis: festpreisHinweis,
    ab: 600,
  },
  entkernung: {
    leistung: "Entkernung und nicht tragender Rückbau",
    bedingung:
      "Der Aufwand hängt an Fläche, Bauteilen, Bodenaufbau und Entsorgungsmengen.",
    festpreis: festpreisHinweis,
  },
  boden: {
    leistung: "Bodenverlegung",
    bedingung:
      "Der Aufwand hängt an Fläche, Belag und Zustand des Untergrunds.",
    festpreis: festpreisHinweis,
  },
  montage: {
    leistung: "Demontage und Montage",
    bedingung: "Der Aufwand hängt an Umfang, Zugänglichkeit und Material.",
    festpreis: festpreisHinweis,
  },
  hausmeister: {
    leistung: "Hausmeisterservice und Winterdienst",
    bedingung:
      "Umfang, Flächen und Einsatzzeiten werden vor Ort aufgenommen und schriftlich vereinbart.",
    festpreis: festpreisHinweis,
  },
} satisfies Record<string, Preisposition>;

export type PreisSchluessel = keyof typeof preise;
