/**
 * Einsatzgebiet: drei Ortsseiten (/leer/, /norden/, /aurich/) und die
 * Übersicht /einsatzgebiet/.
 *
 * Warum nur drei Seiten: Vorher gab es 20 Seiten "Leistung × Ort" und 15
 * Seiten je Ort. Google hat sie als "Gefunden - zurzeit nicht indexiert"
 * liegen lassen - zu viele ähnliche Seiten, die mit den Hauptleistungsseiten
 * konkurrieren. Jetzt hat jeder größere Ort eine starke Seite mit allen
 * Leistungen; alle übrigen Orte stehen nur als Liste auf /einsatzgebiet/.
 * Die alten Adressen leiten per 301 weiter (vercel.json).
 *
 * Was hier nicht stehen darf: Preise (kommen aus preise.ts), erfundene
 * Projekte, Bewertungen oder exakte Kilometerangaben. Fahrzeiten sind
 * gerundet.
 */
import type { FotoName } from "./referenzen";

export type OrtsFaq = { frage: string; antwort: string };

export type OrtsLeistung =
  "entruempelung" | "umzug" | "trockenbau" | "entkernung";

export interface OrtSeite {
  slug: "leer" | "norden" | "aurich";
  /** Ortsname im Fließtext, z. B. "Leer". */
  name: string;
  landkreis: string;
  /** Gerundete Fahrzeit ab Emden, z. B. "ca. 30 Minuten". */
  fahrzeit: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  /** Ein Satz für die Karte auf /einsatzgebiet/. */
  teaser: string;
  heroFoto: FotoName;
  ortsteile: string[];
  /** Was an diesem Ort typischerweise ansteht. */
  lageTitel: string;
  lage: string;
  lageLink?: { text: string; href: string };
  /** Kurzbeschreibung der vier Leistungen mit Bezug zum Ort. */
  leistungen: Record<OrtsLeistung, string>;
  /** Orte im Umland, die wir von hier aus mit anfahren. */
  umgebung: string[];
  entsorgung: string;
  faq: OrtsFaq[];
  /**
   * PLATZHALTER Referenzprojekt - bleibt null, bis ein echtes Projekt aus
   * diesem Ort vorliegt (Foto in src/data/referenzen.ts, kurze Beschreibung).
   * Solange null, erscheint der Abschnitt nicht auf der Seite. Nichts
   * erfinden.
   */
  referenz: null | { foto: FotoName; titel: string; text: string };
}

/** Radius um Emden, in dem wir regelmäßig arbeiten. */
export const radiusText = "bis ca. 50 km um Emden";

const anfahrt = (name: string, fahrzeit: string): OrtsFaq => ({
  frage: `Was kostet die Anfahrt nach ${name}?`,
  antwort: `${name} liegt ${fahrzeit} von unserem Standort in Emden entfernt und damit gut in unserem Einsatzgebiet ${radiusText}. Die Anfahrt steht im Angebot als eigene Position, getrennt von der Arbeitszeit – Sie sehen also genau, was der Weg kostet. Die Besichtigung selbst ist kostenlos.`,
});

export const ortSeiten: OrtSeite[] = [
  {
    slug: "leer",
    name: "Leer",
    landkreis: "Landkreis Leer",
    fahrzeit: "ca. 30 Minuten",
    metaTitle: "Entrümpelung, Umzug & Trockenbau in Leer | Fixum Objektservice",
    metaDescription:
      "Entrümpelung, Umzug, Trockenbau und Entkernung in Leer, Loga, Heisfelde und Bingum. Festpreis nach kostenloser Besichtigung – ein Ansprechpartner.",
    h1: "Entrümpelung, Umzug, Trockenbau und Entkernung in Leer",
    intro:
      "Leer ist nach Emden die größte Stadt in unserem Einsatzgebiet – mit Altstadt, vielen Mietwohnungen und entsprechend vielen Vermietern und Hausverwaltungen. Von unserem Standort in Emden sind es ca. 30 Minuten. Wir räumen, ziehen um, bauen zurück und bauen neu aus: in der Innenstadt ebenso wie in Loga, Heisfelde, Bingum und Leerort. Ein Ansprechpartner, ein Festpreis nach kostenloser Besichtigung.",
    teaser:
      "Mieterwechsel aus einer Hand: Wohnungen räumen, zurückbauen und für die Neuvermietung herrichten – auch für Vermieter und Verwaltungen.",
    heroFoto: "wohnungsraeumung",
    ortsteile: [
      "Innenstadt",
      "Loga",
      "Heisfelde",
      "Bingum",
      "Leerort",
      "Logabirum",
      "Nüttermoor",
    ],
    lageTitel: "Was in Leer oft ansteht",
    lage: "Viele Anfragen aus Leer drehen sich um den Mieterwechsel. Die Wohnung ist gekündigt, der Vormieter hat Möbel stehen lassen, und bis zur Neuvermietung sollen Boden und Wände wieder in Ordnung sein. Das erledigen wir in einem Durchgang – räumen, zurückbauen, Trockenbau, Boden – mit Fotodokumentation für die Abnahme. Für Verwaltungen auch als Rahmenvereinbarung.",
    lageLink: {
      text: "Mieterwechsel für Hausverwaltungen",
      href: "/fuer-hausverwaltungen/",
    },
    leistungen: {
      entruempelung:
        "Wohnungsräumung beim Mieterwechsel, Haushaltsauflösung im Trauerfall, Keller und Dachboden. Sortenrein getrennt, besenrein übergeben.",
      umzug:
        "Wohnung oder Haus, innerhalb von Leer oder von Leer weg – mit Transporter bis 3,5 t, Möbelab- und -aufbau auf Wunsch.",
      trockenbau:
        "Ständerwände, Vorsatzschalen, abgehängte Decken und Dachschrägen in Altbau und Mietwohnung – Spachtelung bis Q3.",
      entkernung:
        "Alte Böden, nicht-tragende Wände und Einbauten raus, bevor saniert wird – sortenrein getrennt.",
    },
    umgebung: ["Westoverledingen", "Bunde", "Weener", "Moormerland", "Jemgum"],
    entsorgung:
      "Für die Entsorgung ist die Abfallwirtschaft des Landkreises Leer zuständig. Die normale Sperrmüllabholung passt zu einzelnen Stücken, nicht zu einer kompletten Wohnung mit Kellerraum. Wir trennen vor Ort nach Holz, Metall, Elektro und Restabfall – das hält die Kosten niedriger als ein Mischcontainer.",
    faq: [
      {
        frage: "Räumen Sie Wohnungen in Leer auch, wenn niemand vor Ort ist?",
        antwort:
          "Ja. Viele Aufträge kommen von Vermietern und Verwaltungen. Eine Schlüsselübergabe genügt, das Ergebnis dokumentieren wir mit Fotos.",
      },
      {
        frage: "Arbeiten Sie mit Hausverwaltungen in Leer zusammen?",
        antwort:
          "Ja, auch mit Rahmenvereinbarung, fester Reaktionszeit und Abrechnung pro Objekt oder gesammelt.",
      },
      anfahrt("Leer", "ca. 30 Minuten"),
      {
        frage: "Ziehen Sie auch von Leer nach Emden oder weiter um?",
        antwort:
          "Ja. Bei längeren Strecken kommt je weiterem Kilometer ein Aufschlag dazu. Den Rahmen zeigt Ihnen der Preisrechner, den Festpreis nennen wir nach der Besichtigung.",
      },
    ],
    referenz: null,
  },
  {
    slug: "norden",
    name: "Norden",
    landkreis: "Landkreis Aurich",
    fahrzeit: "ca. 35 Minuten",
    metaTitle:
      "Entrümpelung, Umzug & Trockenbau in Norden | Fixum Objektservice",
    metaDescription:
      "Entrümpelung, Umzug, Trockenbau und Entkernung in Norden und Norddeich – auch für Ferienwohnungen. Festpreis nach kostenloser Besichtigung.",
    h1: "Entrümpelung, Umzug, Trockenbau und Entkernung in Norden und Norddeich",
    intro:
      "Norden ist die älteste Stadt Ostfrieslands, Norddeich ihr Fährhafen zu den Inseln. Ca. 35 Minuten von Emden entfernt arbeiten wir hier für Privatleute und Erben – und besonders oft für Eigentümer von Ferienwohnungen, bei denen jede Arbeit in eine Buchungslücke passen muss.",
    teaser:
      "Ferienwohnungen zwischen zwei Buchungen räumen und renovieren, Haushaltsauflösungen in Norden und Norddeich.",
    heroFoto: "dachzimmer",
    ortsteile: [
      "Innenstadt",
      "Norddeich",
      "Süderneuland",
      "Westermarsch",
      "Leybuchtpolder",
      "Tidofeld",
    ],
    lageTitel: "Was in Norden oft ansteht",
    lage: "Ferienwohnungen haben ein enges Zeitfenster: Renoviert wird zwischen zwei Buchungsphasen, nicht mittendrin. Alte Einrichtung raus, Wand gestellt, Decke abgehängt, Boden neu – und zum vereinbarten Tag wieder vermietbar. Genau dafür gilt bei uns „Termin ist Termin“. Daneben lösen wir Haushalte auf, diskret und auf Wunsch ohne Ihre Anwesenheit.",
    lageLink: {
      text: "Renovierung zwischen zwei Buchungen",
      href: "/renovierung/",
    },
    leistungen: {
      entruempelung:
        "Haushaltsauflösung und Räumung von Ferienwohnungen vor der Renovierung – diskret, auf Wunsch ohne Ihre Anwesenheit.",
      umzug:
        "Umzüge innerhalb von Norden und Norddeich oder in die Region – mit Transporter bis 3,5 t und festem Termin.",
      trockenbau:
        "Wände stellen, Decken abhängen, Dachschrägen verkleiden – terminiert auf die Lücke zwischen zwei Buchungen.",
      entkernung:
        "Alte Böden, Einbauten und nicht-tragende Wände raus, bevor die Ferienwohnung neu ausgebaut wird.",
    },
    umgebung: ["Hage", "Großheide", "Dornum", "Brookmerland", "Krummhörn"],
    entsorgung:
      "Norden und Norddeich gehören zum Landkreis Aurich; zuständig ist dessen Abfallwirtschaft. Für eine komplette Räumung reicht die Sperrmüllabholung in der Regel nicht aus. Wir trennen vor Ort nach Fraktionen und entsorgen getrennt – das hält die Kosten niedrig.",
    faq: [
      {
        frage:
          "Renovieren Sie Ferienwohnungen in Norddeich zwischen zwei Buchungen?",
        antwort:
          "Ja. Nennen Sie uns das Zeitfenster bei der Anfrage. Wir planen Räumung und Ausbau darum herum und sagen verbindlich zu, ob es passt – oder eben nicht.",
      },
      {
        frage: "Muss ich bei der Haushaltsauflösung in Norden dabei sein?",
        antwort:
          "Nein. Nach der Besichtigung legen wir gemeinsam fest, was bleibt. Danach arbeiten wir mit Schlüsselübergabe und schicken Ihnen Fotos vom Ergebnis.",
      },
      {
        frage: "Können Sie die Wohnung danach regelmäßig betreuen?",
        antwort:
          "Kleinreparaturen und Objektbetreuung übernehmen wir einmalig oder als Rahmenvertrag. Elektro- und Sanitärarbeiten koordinieren wir mit Fachbetrieben.",
      },
      anfahrt("Norden", "ca. 35 Minuten"),
    ],
    referenz: null,
  },
  {
    slug: "aurich",
    name: "Aurich",
    landkreis: "Landkreis Aurich",
    fahrzeit: "ca. 30 Minuten",
    metaTitle:
      "Entrümpelung, Umzug & Trockenbau in Aurich | Fixum Objektservice",
    metaDescription:
      "Entrümpelung, Haushaltsauflösung, Umzug, Trockenbau und Entkernung in Aurich und allen Ortsteilen. Festpreis nach kostenloser Besichtigung.",
    h1: "Entrümpelung, Umzug, Trockenbau und Entkernung in Aurich",
    intro:
      "Aurich ist Kreisstadt und liegt ca. 30 Minuten von Emden entfernt. In der Kernstadt räumen und renovieren wir vor allem Wohnungen in Mehrfamilienhäusern. In Sandhorst, Walle, Wallinghausen oder Extum stehen dagegen viele Einfamilienhäuser aus den 60er- bis 80er-Jahren – und dort gehört fast immer mehr dazu als die Wohnfläche.",
    teaser:
      "Einfamilienhäuser in den Ortsteilen räumen und danach umbauen – Räumung, Rückbau und Trockenbau in einem Durchgang.",
    heroFoto: "dachausbauTrockenbau",
    ortsteile: [
      "Kernstadt",
      "Sandhorst",
      "Walle",
      "Wallinghausen",
      "Extum",
      "Haxtum",
      "Kirchdorf",
      "Popens",
      "Egels",
      "Middels",
      "Plaggenburg",
      "Schirum",
      "Tannenhausen",
    ],
    lageTitel: "Was in Aurich oft ansteht",
    lage: "Ein Haus wird nach Jahrzehnten geräumt – mit Garage, Schuppen und einem Dachboden, der lange nicht ausgeräumt wurde. Danach will der neue Eigentümer Wände versetzen, Decken abhängen oder das Dachgeschoss ausbauen. Räumung, Rückbau und Trockenbau machen wir in einem Durchgang, ohne Wartetage zwischen den Gewerken. Leitungsarbeiten übernehmen zugelassene Fachbetriebe, die wir koordinieren.",
    lageLink: {
      text: "Entrümpelung, Entkernung und Innenausbau aus einer Hand",
      href: "/entruempelung-entkernung-innenausbau/",
    },
    leistungen: {
      entruempelung:
        "Haushaltsauflösung im Einfamilienhaus inklusive Garage, Schuppen und Dachboden, Wohnungsräumung in der Kernstadt.",
      umzug:
        "Umzüge in Aurich und den Ortsteilen oder in die Region – mit Transporter bis 3,5 t, Möbelab- und -aufbau auf Wunsch.",
      trockenbau:
        "Raumteilung, abgehängte Decken, Dachgeschossausbau im Bestand – Spachtelung bis Q3.",
      entkernung:
        "Rückbau vor dem Einzug: alte Böden, Einbauschränke und nicht-tragende Wände raus, sortenrein getrennt.",
    },
    umgebung: ["Ihlow", "Südbrookmerland", "Großefehn", "Wiesmoor"],
    entsorgung:
      "Zuständig für die Entsorgung ist die Abfallwirtschaft des Landkreises Aurich. Die Sperrmüllabholung ist für einzelne Stücke gedacht, nicht für ein ganzes Haus. Wir trennen vor Ort nach Holz, Metall, Elektro und Restabfall und führen die Fraktionen getrennt der Entsorgung zu.",
    faq: [
      {
        frage: "Muss ich bei der Haushaltsauflösung in Aurich dabei sein?",
        antwort:
          "Nein. Nach der Besichtigung legen wir gemeinsam fest, was bleibt. Danach arbeiten wir mit Schlüsselübergabe und schicken Ihnen Fotos – praktisch für Angehörige, die nicht in Ostfriesland wohnen.",
      },
      {
        frage: "Räumen Sie Garage, Schuppen und Dachboden mit?",
        antwort:
          "Ja. Nebengebäude und Dachboden nehmen wir bei der Besichtigung mit auf; sie stehen dann im selben Festpreis.",
      },
      {
        frage: "Können Sie nach der Räumung direkt umbauen?",
        antwort:
          "Ja. Rückbau und Trockenbau schließen ohne Wartetag an die Räumung an. Leitungsarbeiten übernehmen zugelassene Fachbetriebe, die wir koordinieren.",
      },
      anfahrt("Aurich", "ca. 30 Minuten"),
    ],
    referenz: null,
  },
];

export const findeOrt = (slug: string) =>
  ortSeiten.find((o) => o.slug === slug);

/**
 * Alle Orte, die wir regelmäßig anfahren - für /einsatzgebiet/ und
 * schema.org. Nur Orte innerhalb von ca. 50 km Luftlinie um Emden.
 *
 * lat/lon: Ortsmitte, gerundet - nur für die schematische Karte auf
 * /einsatzgebiet/, nicht für Adressen.
 */
export type GebietsOrt = {
  name: string;
  lat: number;
  lon: number;
  /** Eigene Ortsseite, falls vorhanden. */
  seite?: string;
  /** Zusatz in der Liste, z. B. "mit Norddeich". */
  zusatz?: string;
};

export const emden: GebietsOrt = {
  name: "Emden",
  lat: 53.367,
  lon: 7.206,
  seite: "/",
};

export const gebiet: Array<{ kreis: string; orte: GebietsOrt[] }> = [
  { kreis: "Stadt Emden", orte: [emden] },
  {
    kreis: "Landkreis Aurich",
    orte: [
      { name: "Aurich", lat: 53.471, lon: 7.484, seite: "/aurich/" },
      {
        name: "Norden",
        zusatz: "mit Norddeich",
        lat: 53.596,
        lon: 7.206,
        seite: "/norden/",
      },
      { name: "Krummhörn", lat: 53.437, lon: 7.093 },
      { name: "Hinte", lat: 53.418, lon: 7.188 },
      { name: "Brookmerland", lat: 53.522, lon: 7.276 },
      { name: "Südbrookmerland", lat: 53.478, lon: 7.393 },
      { name: "Ihlow", lat: 53.405, lon: 7.447 },
      { name: "Großefehn", lat: 53.395, lon: 7.62 },
      { name: "Wiesmoor", lat: 53.416, lon: 7.733 },
      { name: "Hage", lat: 53.602, lon: 7.283 },
      { name: "Großheide", lat: 53.585, lon: 7.338 },
      { name: "Dornum", lat: 53.646, lon: 7.431 },
    ],
  },
  {
    kreis: "Landkreis Leer",
    orte: [
      { name: "Leer", lat: 53.231, lon: 7.461, seite: "/leer/" },
      { name: "Moormerland", lat: 53.31, lon: 7.49 },
      { name: "Westoverledingen", lat: 53.17, lon: 7.45 },
      { name: "Weener", lat: 53.163, lon: 7.356 },
      { name: "Bunde", lat: 53.183, lon: 7.268 },
      { name: "Jemgum", lat: 53.268, lon: 7.385 },
      { name: "Hesel", lat: 53.304, lon: 7.594 },
      { name: "Uplengen", lat: 53.305, lon: 7.75 },
      { name: "Rhauderfehn", lat: 53.13, lon: 7.56 },
      { name: "Ostrhauderfehn", lat: 53.133, lon: 7.633 },
    ],
  },
  {
    kreis: "Landkreis Wittmund",
    orte: [
      { name: "Wittmund", lat: 53.576, lon: 7.779 },
      { name: "Esens", lat: 53.648, lon: 7.611 },
      { name: "Friedeburg", lat: 53.453, lon: 7.835 },
      { name: "Holtriem", lat: 53.59, lon: 7.45 },
    ],
  },
  {
    kreis: "Landkreis Emsland",
    orte: [{ name: "Papenburg", lat: 53.077, lon: 7.404 }],
  },
];

/** Luftlinie in km (Näherung, für die Radiusprüfung im Test). */
export const luftlinieKm = (a: GebietsOrt, b: GebietsOrt) => {
  const kmProGradBreite = 110.57;
  const kmProGradLaenge =
    111.32 * Math.cos((((a.lat + b.lat) / 2) * Math.PI) / 180);
  return Math.hypot(
    (a.lat - b.lat) * kmProGradBreite,
    (a.lon - b.lon) * kmProGradLaenge,
  );
};

/** Alle Ortsnamen als flache Liste (schema.org areaServed). */
export const alleOrte = gebiet.flatMap((g) => g.orte.map((o) => o.name));
