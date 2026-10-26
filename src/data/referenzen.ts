/* Echte Projektfotos von Fixum Objektservice - zentraler Katalog.

   Alle Bilder der Website kommen von hier: Seiten-Heros, Leistungskarten,
   Ortsseiten und die Referenz-Sektion auf der Startseite.

   Neues Foto ergänzen:
   1. Datei unverändert nach src/assets/images/referenzen/<name>.webp legen
      (JPG/PNG gehen auch - Astro erzeugt beim Bauen WebP und AVIF in
      480, 960 und 1400 px Breite).
   2. Unten bei `fotos` einen Eintrag mit Pfad und Alt-Text anlegen.
   3. Soll es in der Referenz-Sektion erscheinen: bei `referenzen` an der
      gewünschten Stelle einfügen (stärkste Bilder zuerst).

   Alt-Texte beschreiben, was wirklich zu sehen ist, und nennen die
   Leistung. Die Region steht nur dort, wo es um den Auftrag als Ganzes geht.
   Zuschnitte (z. B. nur die Nachher-Hälfte einer Collage) liegen unter
   src/assets/images/zuschnitte/ und sind aus den Originalen erzeugt -
   die Originale selbst bleiben unverändert. */

export interface Foto {
  pfad: string;
  alt: string;
}

export const fotos = {
  /* --- Collagen und Einzelfotos (Originale) --- */
  altbauTrockenbau: {
    pfad: "/images/referenzen/altbau-trockenbau.webp",
    alt: "Altbauzimmer vorher mit freiliegendem Mauerwerk, nachher mit Trockenbauwänden und gespachtelter Decke – Trockenbau in Ostfriesland",
  },
  dachbodenRueckbau: {
    pfad: "/images/referenzen/dachboden-rueckbau.webp",
    alt: "Dachboden vorher voller Schutt und Dämmwolle, nachher geräumt und zurückgebaut – Entkernung in Ostfriesland",
  },
  wohnungsaufloesung: {
    pfad: "/images/referenzen/wohnungsaufloesung.webp",
    alt: "Esszimmer vor und nach der Wohnungsauflösung: Schrankwand, Esstisch und Kartons geräumt, Raum besenrein – Entrümpelung in Ostfriesland",
  },
  dachzimmer: {
    pfad: "/images/referenzen/dachzimmer.webp",
    alt: "Renoviertes Dachzimmer mit Gaubenfenster, weißen Wänden und hellgrauem Laminatboden",
  },
  entruempelungMessie: {
    pfad: "/images/referenzen/entruempelung-messie.webp",
    alt: "Messie-Wohnung vorher stark vermüllt, nachher vollständig geräumt – Entrümpelung in Ostfriesland",
  },
  badDecke: {
    pfad: "/images/referenzen/bad-decke.webp",
    alt: "Badezimmer vor und nach der Renovierung der Decke, mit Einbaustrahlern und abgedeckter Einrichtung",
  },
  kuecheLicht: {
    pfad: "/images/referenzen/kueche-licht.webp",
    alt: "Landhausküche mit Unterbauleuchten über der Arbeitsplatte nach der Montage",
  },
  wohnungsraeumung: {
    pfad: "/images/referenzen/wohnungsraeumung-neuvermietung.png",
    alt: "Wohnzimmer vor und nach der Wohnungsräumung für die Neuvermietung: Sofa, Kartons und Hausrat entfernt",
  },
  dachausbauTrockenbau: {
    pfad: "/images/referenzen/dachausbau-trockenbau.webp",
    alt: "Dachgeschossausbau im Trockenbau: Gipskartonplatten am Drempel, OSB-Platten an der Wand und Werkzeug auf den Dielen",
  },
  umzug: {
    pfad: "/images/referenzen/umzug.webp",
    alt: "Gesicherte Umzugsladung im Transporter: Möbel mit Spanngurten, Umzugsdecken und Luftpolsterfolie",
  },
  messieSchlafzimmer: {
    pfad: "/images/referenzen/entruempelung-messie-schlafzimmer.webp",
    alt: "Schlafzimmer einer Messie-Wohnung vor und nach der Räumung",
  },
  rasterdecke: {
    pfad: "/images/referenzen/rasterdecke.webp",
    alt: "Abgehängte Rasterdecke mit eingesetzter Rasterleuchte in einem Gewerbeflur",
  },
  badFliesen: {
    pfad: "/images/referenzen/bad-fliesen.webp",
    alt: "Badezimmer im Ausbau mit neuen Wandfliesen, Abschlussleiste und Vorwand",
  },
  abstellraum: {
    pfad: "/images/referenzen/entruempelung-abstellraum.webp",
    alt: "Vollgestellter Abstellraum vor der Entrümpelung mit Waschmaschine, Matratzen, Lattenrost und Müllsäcken",
  },
  badRueckbau: {
    pfad: "/images/referenzen/bad-rueckbau.webp",
    alt: "Badezimmer beim Rückbau: alte Fliesen entfernt, Vorwandelement und Leitungen freigelegt",
  },

  /* --- Zuschnitte aus den Collagen --- */
  wohnungsaufloesungVorher: {
    pfad: "/images/zuschnitte/wohnungsaufloesung-vorher.webp",
    alt: "Esszimmer vor der Haushaltsauflösung mit Schrankwand, Esstisch und Umzugskartons",
  },
  wohnungsaufloesungNachher: {
    pfad: "/images/zuschnitte/wohnungsaufloesung-nachher.webp",
    alt: "Leeres, besenreines Esszimmer nach der Wohnungsauflösung",
  },
  dachbodenNachher: {
    pfad: "/images/zuschnitte/dachboden-rueckbau-nachher.webp",
    alt: "Geräumter Dachboden nach dem Rückbau mit freigelegtem Dachstuhl und besenreinen Dielen",
  },
  altbauNachher: {
    pfad: "/images/zuschnitte/altbau-trockenbau-nachher.webp",
    alt: "Altbauzimmer nach dem Trockenbau mit neuen Wänden und gespachtelter Gipskartondecke",
  },
  messieNachher: {
    pfad: "/images/zuschnitte/entruempelung-messie-nachher.webp",
    alt: "Vollständig geräumtes Zimmer nach einer Messie-Entrümpelung",
  },
  badDeckeNachher: {
    pfad: "/images/zuschnitte/bad-decke-nachher.webp",
    alt: "Renoviertes Badezimmer mit frisch gestrichener Decke und Einbaustrahlern",
  },
} satisfies Record<string, Foto>;

export type FotoName = keyof typeof fotos;

export interface Referenz {
  foto: FotoName;
  /** Bildunterschrift "Leistung · Typ" */
  leistung: string;
  typ: string;
  kategorie:
    | "Entrümpelung"
    | "Entkernung"
    | "Trockenbau"
    | "Renovierung"
    | "Montage"
    | "Umzug"
    | "Gewerbe";
}

/** Referenz-Sektion und Lightbox - in dieser Reihenfolge, stärkste zuerst.
    Bilder, die nur den Zustand vorher zeigen (Abstellraum, Bad-Rückbau),
    stehen bewusst hinten und nirgends sonst auf der Seite. */
export const referenzen: Referenz[] = [
  {
    foto: "altbauTrockenbau",
    leistung: "Trockenbau",
    typ: "Altbauzimmer",
    kategorie: "Trockenbau",
  },
  {
    foto: "dachbodenRueckbau",
    leistung: "Entkernung",
    typ: "Dachboden",
    kategorie: "Entkernung",
  },
  {
    foto: "wohnungsaufloesung",
    leistung: "Haushaltsauflösung",
    typ: "Esszimmer",
    kategorie: "Entrümpelung",
  },
  {
    foto: "dachzimmer",
    leistung: "Renovierung",
    typ: "Dachzimmer",
    kategorie: "Renovierung",
  },
  {
    foto: "entruempelungMessie",
    leistung: "Entrümpelung",
    typ: "Messie-Wohnung",
    kategorie: "Entrümpelung",
  },
  {
    foto: "badDecke",
    leistung: "Renovierung",
    typ: "Badezimmer",
    kategorie: "Renovierung",
  },
  {
    foto: "kuecheLicht",
    leistung: "Montage",
    typ: "Küche mit Unterbauleuchten",
    kategorie: "Montage",
  },
  {
    foto: "wohnungsraeumung",
    leistung: "Wohnungsräumung",
    typ: "Wohnzimmer",
    kategorie: "Entrümpelung",
  },
  {
    foto: "dachausbauTrockenbau",
    leistung: "Trockenbau",
    typ: "Dachausbau",
    kategorie: "Trockenbau",
  },
  {
    foto: "umzug",
    leistung: "Umzug",
    typ: "Gesicherte Ladung",
    kategorie: "Umzug",
  },
  {
    foto: "messieSchlafzimmer",
    leistung: "Entrümpelung",
    typ: "Schlafzimmer",
    kategorie: "Entrümpelung",
  },
  {
    foto: "rasterdecke",
    leistung: "Trockenbau",
    typ: "Rasterdecke im Gewerbe",
    kategorie: "Gewerbe",
  },
  {
    foto: "badFliesen",
    leistung: "Innenausbau",
    typ: "Badezimmer",
    kategorie: "Renovierung",
  },
  {
    foto: "abstellraum",
    leistung: "Entrümpelung",
    typ: "Abstellraum",
    kategorie: "Entrümpelung",
  },
  {
    foto: "badRueckbau",
    leistung: "Rückbau",
    typ: "Badezimmer",
    kategorie: "Entkernung",
  },
];
