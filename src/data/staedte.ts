/**
 * Einsatzgebiet-Daten für /einsatzgebiet/[slug]/ und /[leistung]/[stadt]/.
 *
 * Jeder Ort hat eigenen Text zu Objektlage, Entsorgungszuständigkeit und
 * eigene Fragen. Seiten, die sich nur im Ortsnamen unterscheiden, wertet
 * Google als Doorway-Pages - im Zweifel zulasten der ganzen Domain.
 *
 * OFFEN vor dem Livegang: Die Entfernungen sind Schätzwerte ab
 * Hermann-Allmers-Str. 13 und müssen einmal gegengeprüft werden, ebenso die
 * Ortsteillisten. Siehe CONTENT.md.
 */

export type Faq = { frage: string; antwort: string };
export type Schwerpunkt = { titel: string; text: string; href: string };

export type Stadt = {
  slug: string;
  name: string;
  /** Kurzform für abgeleitete Titel. "Norden & Norddeich" sprengt sonst die
      Zeichengrenze der Leistungs-Stadt-Titel. Ohne Angabe gilt name. */
  kurzName?: string;
  landkreis: string;
  entfernungKm: number;
  ortsteile: string[];
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  objektlage: string;
  schwerpunkte: Schwerpunkt[];
  entsorgung: string;
  faq: Faq[];
  nachbarn: string[];
};

const L = {
  entruempelung: "/entruempelung/",
  haushalt: "/haushaltsaufloesung/",
  raeumung: "/wohnungsraeumung/",
  entkernung: "/entkernung/",
  trockenbau: "/trockenbau/",
  renovierung: "/renovierung/",
  hausmeister: "/hausmeisterservice/",
  umzug: "/umzug/",
  verwaltung: "/fuer-hausverwaltungen/",
  bau: "/fuer-bauunternehmen/",
};

const anfahrtFaq = (name: string, km: number): Faq => ({
  frage: `Was kostet die Anfahrt nach ${name}?`,
  antwort: `${name} liegt rund ${km} km von unserem Standort in Emden entfernt. Die Anfahrt steht im Angebot als eigene Position, getrennt von der Arbeitszeit – Sie sehen also genau, was der Weg kostet. Die Besichtigung selbst ist kostenlos.`,
});

export const staedte: Stadt[] = [
  {
    slug: "aurich",
    name: "Aurich",
    landkreis: "Landkreis Aurich",
    entfernungKm: 26,
    ortsteile: [
      "Sandhorst",
      "Walle",
      "Wallinghausen",
      "Popens",
      "Egels",
      "Extum",
      "Haxtum",
      "Kirchdorf",
      "Middels",
      "Plaggenburg",
      "Schirum",
      "Tannenhausen",
    ],
    metaTitle: "Fixum Objektservice: Entrümpelung & Trockenbau Aurich",
    metaDescription:
      "Entrümpelung, Haushaltsauflösung, Entkernung und Trockenbau in Aurich und allen Ortsteilen. Festpreis nach kostenloser Besichtigung, ein Ansprechpartner.",
    h1: "Entrümpelung, Entkernung und Trockenbau in Aurich",
    intro:
      "Aurich ist Kreisstadt und liegt rund 26 km von Emden entfernt. Ob Haushaltsauflösung in Sandhorst, Wohnungsräumung in der Innenstadt oder Trockenbau im Einfamilienhaus in Walle – Sie bekommen denselben Ablauf wie in Emden: Besichtigung, schriftlicher Festpreis, gehaltener Termin.",
    objektlage:
      "In Aurich treffen Mehrfamilienhäuser in der Kernstadt auf viele Einfamilienhäuser aus den 60er- bis 80er-Jahren in den Ortsteilen. Genau dort fällt oft beides an: Ein Haus wird nach Jahrzehnten geräumt, und der neue Eigentümer will Wände versetzen, Decken abhängen oder das Dachgeschoss ausbauen. Diese Kette machen wir in einem Durchgang.",
    schwerpunkte: [
      {
        titel: "Haushaltsauflösung",
        text: "Nachlass oder Umzug ins Heim – auf Wunsch ohne Ihre Anwesenheit, mit Fotodokumentation.",
        href: L.haushalt,
      },
      {
        titel: "Rückbau vor dem Einzug",
        text: "Alte Böden, Einbauschränke und nicht-tragende Wände raus, sortenrein getrennt.",
        href: L.entkernung,
      },
      {
        titel: "Trockenbau im Bestand",
        text: "Raumteilung, abgehängte Decken, Dachschrägen – Spachtelung bis Q3.",
        href: L.trockenbau,
      },
    ],
    entsorgung:
      "Sperrmüll und Wertstoffhöfe laufen in Aurich über die Abfallwirtschaft des Landkreises Aurich, nicht über die Stadt Emden. Die kommunale Sperrmüllabholung ist für einzelne Möbelstücke gedacht, nicht für ein ganzes Haus. Bei einer Räumung trennen wir vor Ort nach Holz, Metall, Elektro und Restabfall und führen die Fraktionen getrennt der Entsorgung zu.",
    faq: [
      {
        frage: "Muss ich bei der Haushaltsauflösung in Aurich dabei sein?",
        antwort:
          "Nein. Nach der Besichtigung legen wir gemeinsam fest, was bleibt. Danach arbeiten wir mit Schlüsselübergabe und schicken Ihnen Fotos vom Ergebnis – das ist vor allem für Angehörige praktisch, die nicht in Ostfriesland wohnen.",
      },
      {
        frage: "Können Sie nach der Räumung direkt umbauen?",
        antwort:
          "Ja. Rückbau und Trockenbau schließen ohne Wartetag an die Räumung an. Leitungsarbeiten übernehmen zugelassene Fachbetriebe, die wir koordinieren.",
      },
      anfahrtFaq("Aurich", 26),
    ],
    nachbarn: ["ihlow", "suedbrookmerland", "grossefehn", "wiesmoor"],
  },
  {
    slug: "leer",
    name: "Leer",
    landkreis: "Landkreis Leer",
    entfernungKm: 30,
    ortsteile: [
      "Loga",
      "Heisfelde",
      "Bingum",
      "Leerort",
      "Logabirum",
      "Nüttermoor",
      "Innenstadt",
    ],
    metaTitle: "Fixum Objektservice: Entrümpelung & Trockenbau Leer",
    metaDescription:
      "Entrümpelung, Wohnungsräumung, Entkernung und Trockenbau in Leer, Loga, Heisfelde und Bingum. Festpreis nach Besichtigung – auch für Vermieter und Verwaltungen.",
    h1: "Entrümpelung, Entkernung und Trockenbau in Leer",
    intro:
      "Leer ist die größte Stadt im Umkreis nach Emden – mit Altstadt, vielen Mietwohnungen und einem hohen Anteil an Vermietern und Verwaltungen. Wir arbeiten hier von Emden aus, rund 30 km entfernt, in Leer selbst sowie in Loga, Heisfelde, Bingum und den übrigen Ortsteilen.",
    objektlage:
      "In Leer kommen viele Anfragen rund um den Mieterwechsel: Die Wohnung ist gekündigt, der Vormieter hat Möbel stehen lassen, und bis zur Neuvermietung sollen Boden und Wände wieder in Ordnung sein. Wir räumen, bauen zurück und renovieren in einem Durchgang – mit Fotodokumentation für die Abnahme.",
    schwerpunkte: [
      {
        titel: "Wohnungsräumung für Vermieter",
        text: "Zurückgelassene Möbel und Hausrat raus, besenrein, mit Fotos zur Abnahme.",
        href: L.raeumung,
      },
      {
        titel: "Mieterwechsel-Paket",
        text: "Räumen, Boden neu, Wände herrichten – eine Rechnung, weniger Leerstandstage.",
        href: L.verwaltung,
      },
      {
        titel: "Trockenbau & Renovierung",
        text: "Raumteilung, Vorsatzschalen, Decken und Böden ohne Eingriff in Leitungen.",
        href: L.renovierung,
      },
    ],
    entsorgung:
      "Für Leer ist die Abfallwirtschaft des Landkreises Leer zuständig. Die normale Sperrmüllabholung passt zu einzelnen Stücken, nicht zu einer kompletten Wohnung mit Kellerraum. Wir trennen vor Ort und führen Holz, Metall, Elektro und Restabfall getrennt der Entsorgung zu – das senkt die Entsorgungskosten gegenüber einem Mischcontainer.",
    faq: [
      {
        frage: "Räumen Sie Wohnungen in Leer auch ohne Mieter vor Ort?",
        antwort:
          "Ja. Viele Aufträge kommen von Vermietern und Verwaltungen. Schlüsselübergabe genügt, das Ergebnis dokumentieren wir mit Fotos.",
      },
      {
        frage: "Arbeiten Sie mit Hausverwaltungen in Leer zusammen?",
        antwort:
          "Ja, auch mit Rahmenvereinbarung, fester Reaktionszeit und Abrechnung pro Objekt oder gesammelt.",
      },
      anfahrtFaq("Leer", 30),
    ],
    nachbarn: ["moormerland", "westoverledingen", "weener", "uplengen"],
  },
  {
    slug: "norden",
    name: "Norden & Norddeich",
    kurzName: "Norden",
    landkreis: "Landkreis Aurich",
    entfernungKm: 32,
    ortsteile: [
      "Norddeich",
      "Süderneuland",
      "Westermarsch",
      "Leybuchtpolder",
      "Tidofeld",
      "Innenstadt",
    ],
    metaTitle: "Fixum Objektservice: Entrümpelung Norden & Norddeich",
    metaDescription:
      "Entrümpelung, Haushaltsauflösung und Renovierung in Norden und Norddeich – auch für Ferienwohnungen zwischen zwei Saisons. Festpreis nach Besichtigung.",
    h1: "Entrümpelung, Trockenbau und Renovierung in Norden und Norddeich",
    intro:
      "Norden ist die älteste Stadt Ostfrieslands, Norddeich der Fährhafen zu den Inseln. Rund 32 km von Emden entfernt arbeiten wir hier für Privatleute, Erben und – besonders häufig – für Eigentümer von Ferienwohnungen.",
    objektlage:
      "Ferienwohnungen haben ein enges Zeitfenster: Renoviert wird zwischen zwei Buchungsphasen, nicht mittendrin. Alte Einrichtung raus, Boden neu, eine Wand gestellt oder die Decke abgehängt – und zum vereinbarten Tag wieder vermietbar. Genau dafür ist unser Grundsatz „Termin ist Termin“ gemacht.",
    schwerpunkte: [
      {
        titel: "Ferienwohnung auffrischen",
        text: "Räumen, Boden, Wände, Türen – terminiert auf Ihre Buchungslücke.",
        href: L.renovierung,
      },
      {
        titel: "Haushaltsauflösung",
        text: "Diskret, auf Wunsch ohne Anwesenheit, besenrein übergeben.",
        href: L.haushalt,
      },
      {
        titel: "Hausmeister & Objektbetreuung",
        text: "Kleinreparaturen und laufende Betreuung für vermietete Objekte.",
        href: L.hausmeister,
      },
    ],
    entsorgung:
      "Norden und Norddeich gehören zum Landkreis Aurich; zuständig ist dessen Abfallwirtschaft. Für eine komplette Räumung reicht die Sperrmüllabholung in der Regel nicht aus. Wir trennen vor Ort nach Fraktionen und entsorgen getrennt – das hält die Kosten niedrig.",
    faq: [
      {
        frage:
          "Renovieren Sie Ferienwohnungen in Norddeich zwischen zwei Buchungen?",
        antwort:
          "Ja. Sagen Sie uns das Zeitfenster bei der Anfrage, dann planen wir Räumung und Ausbau darum herum und sagen verbindlich zu, ob es passt – oder eben nicht.",
      },
      {
        frage: "Können Sie die Wohnung regelmäßig betreuen?",
        antwort:
          "Kleinreparaturen und Objektbetreuung übernehmen wir einmalig oder als Rahmenvertrag. Elektro- und Sanitärarbeiten koordinieren wir mit Fachbetrieben.",
      },
      anfahrtFaq("Norden", 32),
    ],
    nachbarn: ["krummhoern", "suedbrookmerland", "hinte", "aurich"],
  },
  {
    slug: "krummhoern",
    name: "Krummhörn",
    landkreis: "Landkreis Aurich",
    entfernungKm: 14,
    ortsteile: [
      "Pewsum",
      "Greetsiel",
      "Loquard",
      "Upleward",
      "Campen",
      "Rysum",
      "Groothusen",
      "Manslagt",
      "Pilsum",
      "Visquard",
      "Hamswehrum",
      "Uttum",
      "Woquard",
      "Eilsum",
    ],
    metaTitle: "Fixum Objektservice: Entrümpelung & Trockenbau Krummhörn",
    metaDescription:
      "Entrümpelung von Häusern, Scheunen und Dachböden in der Krummhörn – Pewsum, Greetsiel und alle Warfendörfer. Festpreis nach kostenloser Besichtigung.",
    h1: "Entrümpelung und Ausbau in der Krummhörn",
    intro:
      "Die Krummhörn liegt direkt vor unserer Haustür – rund 14 km von Emden. Wir arbeiten in Pewsum, Greetsiel und allen Warfendörfern zwischen Rysum und Manslagt.",
    objektlage:
      "Typisch für die Krummhörn sind große Grundstücke mit Nebengebäuden: alte Gulfhöfe, Scheunen, Stallungen und Dachböden, in denen sich über Generationen viel angesammelt hat. Eine Räumung ist hier oft größer als die Wohnfläche vermuten lässt. Deshalb schätzen wir nach Volumen, nicht nach Quadratmetern – und nennen danach einen Festpreis.",
    schwerpunkte: [
      {
        titel: "Haus, Scheune, Dachboden",
        text: "Auch Nebengebäude und Stallungen, sortenrein nach Holz, Metall und Restabfall.",
        href: L.entruempelung,
      },
      {
        titel: "Nicht-tragender Rückbau",
        text: "Alte Einbauten und Verkleidungen raus – als Vorbereitung für den Umbau.",
        href: L.entkernung,
      },
      {
        titel: "Ausbau",
        text: "Trockenbau, Böden und Türen, wenn aus Altbestand wieder Wohnraum werden soll.",
        href: L.trockenbau,
      },
    ],
    entsorgung:
      "Die Krummhörn gehört zum Landkreis Aurich. Bei Hofstellen fällt oft viel Altholz und Metall an – Metall kann verwertet werden, sauber getrenntes Holz ist deutlich günstiger als Mischabfall. Deshalb trennen wir direkt auf dem Hof. Bei Verdacht auf Asbest (z. B. alte Wellplatten auf Nebengebäuden) stoppen wir und holen einen zertifizierten Fachbetrieb.",
    faq: [
      {
        frage: "Entrümpeln Sie auch Scheunen und Nebengebäude?",
        antwort:
          "Ja. Wichtig ist nur: Asbesthaltige Dach- oder Wandplatten fassen wir nicht an. Das klären wir bei der Besichtigung und schreiben es ins Angebot.",
      },
      {
        frage: "Wie wird bei großen Hofstellen gerechnet?",
        antwort:
          "Nach geschätztem Volumen und Aufwand, nicht nach Wohnfläche. Das Ergebnis ist ein schriftlicher Festpreis.",
      },
      anfahrtFaq("die Krummhörn", 14),
    ],
    nachbarn: ["hinte", "norden"],
  },
  {
    slug: "hinte",
    name: "Hinte",
    landkreis: "Landkreis Aurich",
    entfernungKm: 8,
    ortsteile: [
      "Loppersum",
      "Suurhusen",
      "Osterhusen",
      "Cirkwehrum",
      "Groß Midlum",
      "Westerhusen",
      "Canhusen",
    ],
    metaTitle: "Fixum Objektservice: Entrümpelung & Trockenbau Hinte",
    metaDescription:
      "Entrümpelung, Haushaltsauflösung und Trockenbau in Hinte und allen Ortsteilen – direkt an der Stadtgrenze Emden. Kurze Anfahrt, Festpreis nach Besichtigung.",
    h1: "Entrümpelung und Trockenbau in Hinte",
    intro:
      "Hinte grenzt direkt an Emden – rund 8 km bis zu uns. Das heißt für Sie: kurze Anfahrt, schnelle Besichtigung und oft auch kurzfristige Termine in Loppersum, Suurhusen, Osterhusen und den übrigen Ortsteilen.",
    objektlage:
      "In Hinte überwiegen Einfamilienhäuser und ländliche Grundstücke mit Garage oder Schuppen. Häufige Anlässe sind Hausverkäufe nach einem Todesfall oder der Umzug in eine kleinere Wohnung – und danach die Modernisierung durch die neuen Eigentümer.",
    schwerpunkte: [
      {
        titel: "Haushaltsauflösung vor dem Verkauf",
        text: "Haus leer und besenrein, damit Makler und Käufer besichtigen können.",
        href: L.haushalt,
      },
      {
        titel: "Umzug & Entrümpelung kombiniert",
        text: "Was mitkommt, wird transportiert – der Rest in einem Zug entsorgt.",
        href: L.umzug,
      },
      {
        titel: "Modernisierung",
        text: "Rückbau, Trockenbau und Böden für die neuen Eigentümer.",
        href: L.trockenbau,
      },
    ],
    entsorgung:
      "Hinte gehört zum Landkreis Aurich, auch wenn es direkt an Emden grenzt – für Sperrmüll und Wertstoffhöfe gelten also andere Regeln als in der Stadt Emden. Bei einer Räumung übernehmen wir die getrennte Entsorgung komplett.",
    faq: [
      {
        frage: "Geht es in Hinte auch kurzfristig?",
        antwort:
          "Durch die kurze Anfahrt oft ja. Bei fester Frist – etwa einem Notartermin oder der Schlüsselübergabe – sagen Sie es bitte gleich beim Anruf.",
      },
      {
        frage: "Können Sie Umzug und Räumung verbinden?",
        antwort:
          "Ja. Was mit soll, transportieren wir; alles andere wird im selben Einsatz geräumt und entsorgt.",
      },
      anfahrtFaq("Hinte", 8),
    ],
    nachbarn: ["krummhoern", "suedbrookmerland", "ihlow"],
  },
  {
    slug: "moormerland",
    name: "Moormerland",
    landkreis: "Landkreis Leer",
    entfernungKm: 20,
    ortsteile: [
      "Warsingsfehn",
      "Neermoor",
      "Veenhusen",
      "Oldersum",
      "Jheringsfehn",
      "Boekzetelerfehn",
      "Hatshausen",
      "Tergast",
      "Gandersum",
      "Rorichum",
      "Terborg",
    ],
    metaTitle: "Fixum Objektservice: Entrümpelung & Trockenbau Moormerland",
    metaDescription:
      "Entrümpelung, Haushaltsauflösung, Rückbau und Trockenbau in Moormerland – Warsingsfehn, Neermoor, Veenhusen, Oldersum. Festpreis nach kostenloser Besichtigung.",
    h1: "Entrümpelung und Trockenbau in Moormerland",
    intro:
      "Moormerland liegt zwischen Emden und Leer, rund 20 km von unserem Standort. Wir arbeiten in Warsingsfehn, Neermoor, Veenhusen, Oldersum und allen weiteren Ortsteilen.",
    objektlage:
      "Moormerland ist geprägt von Einfamilienhäusern, viele davon aus den 70er- und 80er-Jahren. Beim Eigentümerwechsel steht oft ein Doppelschritt an: erst das Haus leerräumen, dann modernisieren – neue Raumaufteilung, abgehängte Decken, neue Böden. Beides machen wir nacheinander ohne Übergabe an eine zweite Firma.",
    schwerpunkte: [
      {
        titel: "Hausräumung",
        text: "Wohnräume, Keller, Dachboden und Garage in einem Einsatz.",
        href: L.entruempelung,
      },
      {
        titel: "Rückbau + Trockenbau",
        text: "Beide Gewerke in einem Durchgang und einem Angebot.",
        href: "/rueckbau-trockenbau/",
      },
      {
        titel: "Böden & Türen",
        text: "Laminat, Vinyl, Türen und Zargen als letzter Schritt vor dem Einzug.",
        href: "/bodenverlegung/",
      },
    ],
    entsorgung:
      "Moormerland gehört zum Landkreis Leer. Die getrennte Entsorgung nach Fraktionen übernehmen wir – bei Häusern aus den 70er- und 80er-Jahren prüfen wir vorab, ob Verdacht auf Schadstoffe wie alte Mineralwolle oder asbesthaltige Platten besteht.",
    faq: [
      {
        frage: "Mein Haus ist von 1978 – ist das beim Rückbau ein Problem?",
        antwort:
          "Nicht automatisch. Bei Gebäuden vor 1993 achten wir besonders auf Asbest und alte Dämmstoffe. Bei Verdacht wird zuerst geprüft; Schadstoffsanierung übernimmt ein zertifizierter Fachbetrieb.",
      },
      {
        frage: "Kann direkt nach der Räumung umgebaut werden?",
        antwort:
          "Ja, das ist unser Standardablauf: räumen, rückbauen, ausbauen – jeder Schritt einzeln buchbar.",
      },
      anfahrtFaq("Moormerland", 20),
    ],
    nachbarn: ["leer", "ihlow", "westoverledingen"],
  },
  {
    slug: "ihlow",
    name: "Ihlow",
    landkreis: "Landkreis Aurich",
    entfernungKm: 22,
    ortsteile: [
      "Ihlowerfehn",
      "Simonswolde",
      "Riepe",
      "Ochtelbur",
      "Westerende-Kirchloog",
      "Ludwigsdorf",
      "Barstede",
      "Bangstede",
      "Lübbertsfehn",
      "Fahne",
    ],
    metaTitle: "Fixum Objektservice: Entrümpelung & Trockenbau Ihlow",
    metaDescription:
      "Entrümpelung, Haushaltsauflösung und Trockenbau in Ihlow – Ihlowerfehn, Simonswolde, Riepe, Ochtelbur. Festpreis nach Besichtigung, ein Ansprechpartner.",
    h1: "Entrümpelung und Haushaltsauflösung in Ihlow",
    intro:
      "Ihlow liegt rund 22 km von Emden, zwischen Emden und Aurich. Wir arbeiten in Ihlowerfehn, Simonswolde, Riepe, Ochtelbur und den übrigen Ortsteilen.",
    objektlage:
      "In Ihlow gibt es viele freistehende Häuser mit großem Grundstück, Schuppen und Werkstatt. Bei Haushaltsauflösungen ist oft nicht die Wohnung der größte Posten, sondern das, was sich in Nebengebäuden angesammelt hat. Das sehen wir bei der Besichtigung und rechnen es von Anfang an ein.",
    schwerpunkte: [
      {
        titel: "Haushaltsauflösung",
        text: "Haus, Schuppen und Werkstatt – diskret und besenrein.",
        href: L.haushalt,
      },
      {
        titel: "Entrümpelung Nebengebäude",
        text: "Metall, Holz und Restabfall vor Ort getrennt.",
        href: L.entruempelung,
      },
      {
        titel: "Renovierung",
        text: "Böden, Wände und Türen, wenn das Haus verkauft oder vermietet werden soll.",
        href: L.renovierung,
      },
    ],
    entsorgung:
      "Ihlow gehört zum Landkreis Aurich. Werkstätten enthalten oft Farben, Lacke und Öle – das ist Sonderabfall und wird getrennt behandelt. Bei der Besichtigung klären wir, was davon anfällt.",
    faq: [
      {
        frage: "Nehmen Sie auch Farben und Öle aus der Werkstatt mit?",
        antwort:
          "Das klären wir bei der Besichtigung. Sonderabfälle werden getrennt erfasst und stehen als eigene Position im Angebot.",
      },
      {
        frage: "Was passiert mit Werkzeug und Maschinen?",
        antwort:
          "Brauchbares geben wir weiter oder führen es der Verwertung zu. Was Sie behalten möchten, legen wir vorher gemeinsam fest.",
      },
      anfahrtFaq("Ihlow", 22),
    ],
    nachbarn: ["aurich", "moormerland", "grossefehn", "hinte"],
  },
  {
    slug: "suedbrookmerland",
    name: "Südbrookmerland",
    landkreis: "Landkreis Aurich",
    entfernungKm: 24,
    ortsteile: [
      "Moordorf",
      "Victorbur",
      "Uthwerdum",
      "Wiegboldsbur",
      "Theene",
      "Münkeboe",
      "Moorhusen",
      "Bedekaspel",
      "Engerhafe",
      "Oldeborg",
      "Forlitz-Blaukirchen",
    ],
    metaTitle: "Fixum Objektservice: Entrümpelung & Ausbau Südbrookmerland",
    metaDescription:
      "Entrümpelung, Haushaltsauflösung, Rückbau und Trockenbau in Südbrookmerland – Moordorf, Victorbur, Münkeboe, Theene. Festpreis nach kostenloser Besichtigung.",
    h1: "Entrümpelung und Trockenbau in Südbrookmerland",
    intro:
      "Südbrookmerland liegt rund 24 km von Emden, am Großen Meer. Wir sind in Moordorf, Victorbur, Münkeboe, Theene und allen anderen Ortsteilen im Einsatz.",
    objektlage:
      "Neben Wohnhäusern gibt es rund um das Große Meer viele Ferienhäuser und Wochenendgrundstücke. Bei Verkauf oder Erbfall sollen diese oft komplett leer und in vermietbarem Zustand übergeben werden – Räumung und kleine Renovierung aus einer Hand.",
    schwerpunkte: [
      {
        titel: "Haus- und Wohnungsräumung",
        text: "Besenrein, mit Fotos zur Übergabe.",
        href: L.raeumung,
      },
      {
        titel: "Ferienhaus übergabefertig",
        text: "Räumen, Boden und Wände auffrischen, zum festen Termin.",
        href: L.renovierung,
      },
      {
        titel: "Trockenbau",
        text: "Raumteilung, Decken und Dachschrägen.",
        href: L.trockenbau,
      },
    ],
    entsorgung:
      "Südbrookmerland gehört zum Landkreis Aurich. Wir trennen bei der Räumung nach Fraktionen und entsorgen getrennt; auf Wunsch mit Entsorgungsnachweis.",
    faq: [
      {
        frage: "Räumen Sie auch Ferienhäuser am Großen Meer?",
        antwort:
          "Ja, inklusive Nebengebäude. Auf Wunsch schließt eine Renovierung an, damit das Haus direkt verkauft oder vermietet werden kann.",
      },
      {
        frage: "Bekomme ich Fotos vom Ergebnis?",
        antwort: "Ja, auf Wunsch dokumentieren wir Zustand vorher und nachher.",
      },
      anfahrtFaq("Südbrookmerland", 24),
    ],
    nachbarn: ["aurich", "norden", "ihlow", "hinte"],
  },
  {
    slug: "grossefehn",
    name: "Großefehn",
    landkreis: "Landkreis Aurich",
    entfernungKm: 36,
    ortsteile: [
      "Ostgroßefehn",
      "Westgroßefehn",
      "Mittegroßefehn",
      "Timmel",
      "Holtrop",
      "Aurich-Oldendorf",
      "Bagband",
      "Strackholt",
      "Spetzerfehn",
      "Felde",
      "Wrisse",
      "Ulbargen",
      "Akelsbarg",
    ],
    metaTitle: "Fixum Objektservice: Entrümpelung & Ausbau Großefehn",
    metaDescription:
      "Entrümpelung, Haushaltsauflösung, Rückbau und Trockenbau in Großefehn – Ostgroßefehn, Timmel, Holtrop, Spetzerfehn. Festpreis nach kostenloser Besichtigung.",
    h1: "Entrümpelung und Ausbau in Großefehn",
    intro:
      "Großefehn gilt als älteste Fehnsiedlung Ostfrieslands. Rund 36 km von Emden arbeiten wir in Ost-, Mitte- und Westgroßefehn, Timmel, Holtrop, Spetzerfehn und den übrigen Ortsteilen.",
    objektlage:
      "Entlang der Fehnkanäle stehen viele ältere Häuser mit Anbauten, die über Jahrzehnte erweitert wurden. Wer so ein Haus übernimmt, will meist die alten Einbauten loswerden und die Räume neu aufteilen. Wir räumen, bauen nicht-tragend zurück und stellen die neuen Wände – Eingriffe in tragende Teile nur mit Statiker.",
    schwerpunkte: [
      {
        titel: "Hausräumung",
        text: "Auch Anbauten, Dachböden und Schuppen.",
        href: L.entruempelung,
      },
      {
        titel: "Entkernung",
        text: "Alte Verkleidungen, Böden und Einbauten raus, sortenrein.",
        href: L.entkernung,
      },
      {
        titel: "Neue Raumaufteilung",
        text: "Ständerwände, Vorsatzschalen, abgehängte Decken.",
        href: L.trockenbau,
      },
    ],
    entsorgung:
      "Großefehn gehört zum Landkreis Aurich. Beim Rückbau älterer Häuser trennen wir Bauschutt, Holz und Metall – Mischabfall ist der teuerste Weg und lässt sich meist vermeiden.",
    faq: [
      {
        frage: "Lohnt sich die Anfahrt aus Emden für Großefehn?",
        antwort:
          "Für eine Räumung oder einen Umbau über mehrere Stunden ja – die Anfahrt ist dann ein kleiner Teil des Preises. Für sehr kleine Einzelaufträge sagen wir Ihnen ehrlich, wenn ein Betrieb vor Ort günstiger ist.",
      },
      {
        frage: "Können Sie eine Wand zwischen zwei Räumen entfernen?",
        antwort:
          "Nicht-tragende Wände ja. Ob eine Wand trägt, klärt bei Unsicherheit ein Statiker – ohne Freigabe entfernen wir nichts.",
      },
      anfahrtFaq("Großefehn", 36),
    ],
    nachbarn: ["aurich", "wiesmoor", "ihlow", "uplengen"],
  },
  {
    slug: "westoverledingen",
    name: "Westoverledingen",
    landkreis: "Landkreis Leer",
    entfernungKm: 42,
    ortsteile: [
      "Ihrhove",
      "Flachsmeer",
      "Steenfelde",
      "Völlen",
      "Völlenerfehn",
      "Völlenerkönigsfehn",
      "Grotegaste",
      "Ihren",
      "Mitling-Mark",
      "Esklum",
      "Großwolde",
    ],
    metaTitle: "Fixum Objektservice: Entrümpelung & Ausbau Westoverledingen",
    metaDescription:
      "Entrümpelung, Haushaltsauflösung und Trockenbau in Westoverledingen – Ihrhove, Flachsmeer, Steenfelde, Völlen. Festpreis nach kostenloser Besichtigung.",
    h1: "Entrümpelung und Trockenbau in Westoverledingen",
    intro:
      "Westoverledingen liegt südlich von Leer, rund 42 km von Emden. Wir sind in Ihrhove, Flachsmeer, Steenfelde, Völlen und allen weiteren Ortsteilen unterwegs.",
    objektlage:
      "Hier kommen die meisten Anfragen von Familien, die ein Elternhaus auflösen oder ein älteres Haus gekauft haben. Oft wohnen die Angehörigen nicht mehr in der Region – deshalb arbeiten wir auf Wunsch komplett nach Schlüsselübergabe und halten Sie mit Fotos auf dem Laufenden.",
    schwerpunkte: [
      {
        titel: "Elternhaus auflösen",
        text: "Ohne dass Sie extra anreisen müssen, mit Fotodokumentation.",
        href: L.haushalt,
      },
      {
        titel: "Rückbau vor der Sanierung",
        text: "Nicht-tragend, sortenrein, mit klaren Leistungsgrenzen.",
        href: L.entkernung,
      },
      {
        titel: "Trockenbau",
        text: "Wände, Decken und Dachschrägen im Bestand.",
        href: L.trockenbau,
      },
    ],
    entsorgung:
      "Westoverledingen gehört zum Landkreis Leer. Die getrennte Entsorgung übernehmen wir komplett – Sie müssen weder Sperrmüll anmelden noch einen Container bestellen.",
    faq: [
      {
        frage: "Ich wohne weit weg – wie läuft das ab?",
        antwort:
          "Besichtigung mit einer Vertrauensperson oder per Schlüsselübergabe, Festpreis per E-Mail, Ausführung ohne Ihre Anwesenheit, Fotos vom Ergebnis. Was bleiben soll, legen wir vorher schriftlich fest.",
      },
      {
        frage: "Muss ich einen Container bestellen?",
        antwort:
          "Nein. Transport und getrennte Entsorgung sind Teil unseres Angebots.",
      },
      anfahrtFaq("Westoverledingen", 42),
    ],
    nachbarn: ["leer", "papenburg", "weener", "moormerland"],
  },
  {
    slug: "weener",
    name: "Weener",
    landkreis: "Landkreis Leer",
    entfernungKm: 45,
    ortsteile: [
      "Stapelmoor",
      "Möhlenwarf",
      "Holthusen",
      "Kirchborgum",
      "Weenermoor",
      "Diele",
      "Vellage",
      "Tichelwarf",
    ],
    metaTitle: "Fixum Objektservice: Entrümpelung & Rückbau Weener",
    metaDescription:
      "Entrümpelung, Haushaltsauflösung, Rückbau und Trockenbau in Weener und im Rheiderland. Festpreis nach kostenloser Besichtigung, Anfahrt transparent ausgewiesen.",
    h1: "Entrümpelung und Haushaltsauflösung in Weener",
    intro:
      "Weener ist die Stadt im Rheiderland, nah an der niederländischen Grenze und rund 45 km von Emden. Wir arbeiten in Weener, Stapelmoor, Möhlenwarf, Holthusen und den umliegenden Orten.",
    objektlage:
      "Im Rheiderland stehen viele ältere Backsteinhäuser und landwirtschaftlich geprägte Grundstücke. Haushaltsauflösungen umfassen hier häufig auch Scheunen und Dachböden. Wir schauen uns alles an, bevor wir einen Preis nennen – dann gibt es hinterher keine Überraschung.",
    schwerpunkte: [
      {
        titel: "Haushaltsauflösung",
        text: "Haus, Dachboden und Nebengebäude in einem Auftrag.",
        href: L.haushalt,
      },
      {
        titel: "Entrümpelung",
        text: "Sortenreine Trennung, besenreine Übergabe.",
        href: L.entruempelung,
      },
      {
        titel: "Rückbau & Ausbau",
        text: "Wenn das Haus anschließend modernisiert werden soll.",
        href: "/rueckbau-trockenbau/",
      },
    ],
    entsorgung:
      "Weener gehört zum Landkreis Leer. Bei älteren Nebengebäuden prüfen wir vorab auf asbesthaltige Platten – die sind Sache eines zertifizierten Fachbetriebs und werden im Angebot ausgeklammert.",
    faq: [
      {
        frage: "Kommen Sie für eine Räumung bis nach Weener?",
        antwort:
          "Ja. Die Anfahrt steht als eigene Position im Angebot. Bei kleinen Aufträgen sagen wir Ihnen offen, ob sich die Strecke für Sie rechnet.",
      },
      {
        frage: "Werden Scheune und Dachboden mitgeräumt?",
        antwort:
          "Wenn Sie es wünschen, ja. Wir nehmen bei der Besichtigung alle Gebäude auf, damit der Festpreis vollständig ist.",
      },
      anfahrtFaq("Weener", 45),
    ],
    nachbarn: ["leer", "westoverledingen", "papenburg"],
  },
  {
    slug: "uplengen",
    name: "Uplengen",
    landkreis: "Landkreis Leer",
    entfernungKm: 48,
    ortsteile: [
      "Remels",
      "Hollen",
      "Jübberde",
      "Stapel",
      "Kleinoldendorf",
      "Poghausen",
      "Selverde",
      "Neudorf",
      "Nordgeorgsfehn",
      "Südgeorgsfehn",
      "Bühren",
    ],
    metaTitle: "Fixum Objektservice: Entrümpelung & Trockenbau Uplengen",
    metaDescription:
      "Entrümpelung, Haushaltsauflösung und Trockenbau in Uplengen – Remels, Hollen, Jübberde, Stapel. Festpreis nach kostenloser Besichtigung.",
    h1: "Entrümpelung und Trockenbau in Uplengen",
    intro:
      "Uplengen liegt im Osten des Landkreises Leer, rund 48 km von Emden. Wir arbeiten in Remels, Hollen, Jübberde, Stapel und den übrigen Ortsteilen – vor allem bei größeren Räumungen und Ausbauprojekten.",
    objektlage:
      "In Uplengen sind die Grundstücke groß und die Häuser oft über Generationen bewohnt. Das bedeutet: viel Volumen bei der Räumung und häufig ein Modernisierungsbedarf danach. Bei dieser Größenordnung spielt die Anfahrt kaum eine Rolle.",
    schwerpunkte: [
      {
        titel: "Große Hausräumungen",
        text: "Mehrere Tage, mehrere Gebäude, ein Festpreis.",
        href: L.entruempelung,
      },
      {
        titel: "Entkernung",
        text: "Vorbereitung für die Sanierung des Bestands.",
        href: L.entkernung,
      },
      {
        titel: "Kernsanierung vorbereiten",
        text: "Räumen, Rückbau, Ausbau – Fachbetriebe koordiniert.",
        href: "/kernsanierung/",
      },
    ],
    entsorgung:
      "Uplengen gehört zum Landkreis Leer. Bei großen Räumungen macht die sortenreine Trennung den größten Unterschied bei den Entsorgungskosten – das kalkulieren wir von Anfang an ein.",
    faq: [
      {
        frage: "Übernehmen Sie auch mehrtägige Räumungen?",
        antwort: "Ja. Umfang und Dauer stehen im Angebot, der Preis ist fest.",
      },
      {
        frage: "Koordinieren Sie auch Elektriker und Sanitär?",
        antwort:
          "Ja, als Koordination zugelassener Fachbetriebe. Diese Arbeiten führen wir nicht selbst aus.",
      },
      anfahrtFaq("Uplengen", 48),
    ],
    nachbarn: ["grossefehn", "wiesmoor", "leer"],
  },
  {
    slug: "wiesmoor",
    name: "Wiesmoor",
    landkreis: "Landkreis Aurich",
    entfernungKm: 48,
    ortsteile: [
      "Hinrichsfehn",
      "Marcardsmoor",
      "Mullberg",
      "Voßbarg",
      "Wiesederfehn",
      "Zwischenbergen",
      "Auricher Wiesmoor",
    ],
    metaTitle: "Fixum Objektservice: Entrümpelung & Trockenbau Wiesmoor",
    metaDescription:
      "Entrümpelung, Haushaltsauflösung, Rückbau und Trockenbau in Wiesmoor und Ortsteilen wie Hinrichsfehn und Marcardsmoor. Festpreis nach kostenloser Besichtigung.",
    h1: "Entrümpelung und Trockenbau in Wiesmoor",
    intro:
      "Die Blumenstadt Wiesmoor liegt rund 48 km von Emden. Wir arbeiten in Wiesmoor und den Ortsteilen Hinrichsfehn, Marcardsmoor, Voßbarg und Zwischenbergen.",
    objektlage:
      "Wiesmoor ist vergleichsweise jung gewachsen, mit vielen Einfamilienhäusern aus den Nachkriegs- und Siedlungsjahrzehnten. Dazu kommen Ferienhäuser und Vermietungsobjekte. Häufige Aufträge: Hausräumung vor dem Verkauf und Modernisierung danach.",
    schwerpunkte: [
      {
        titel: "Hausräumung vor dem Verkauf",
        text: "Leer, besenrein und fotografiert für das Exposé.",
        href: L.haushalt,
      },
      {
        titel: "Ferienhaus renovieren",
        text: "Boden, Wände, Türen – zum vereinbarten Termin.",
        href: L.renovierung,
      },
      {
        titel: "Trockenbau",
        text: "Neue Räume, abgehängte Decken, Dachausbau.",
        href: L.trockenbau,
      },
    ],
    entsorgung:
      "Wiesmoor gehört zum Landkreis Aurich. Wir übernehmen Transport und getrennte Entsorgung, damit Sie sich weder um Sperrmülltermine noch um Container kümmern müssen.",
    faq: [
      {
        frage: "Können Sie das Haus für den Makler vorbereiten?",
        antwort:
          "Ja. Wir räumen, übergeben besenrein und machen auf Wunsch Fotos vom leeren Zustand. Kleine Renovierungen können direkt anschließen.",
      },
      {
        frage: "Lohnt sich die Anfahrt nach Wiesmoor?",
        antwort:
          "Bei Räumungen und Umbauten über mehrere Stunden in der Regel ja. Bei Kleinstaufträgen sagen wir es Ihnen ehrlich, wenn ein Betrieb vor Ort günstiger wäre.",
      },
      anfahrtFaq("Wiesmoor", 48),
    ],
    nachbarn: ["grossefehn", "aurich", "uplengen", "wittmund"],
  },
  {
    slug: "wittmund",
    name: "Wittmund",
    landkreis: "Landkreis Wittmund",
    entfernungKm: 52,
    ortsteile: [
      "Carolinensiel",
      "Harlesiel",
      "Leerhafe",
      "Burhafe",
      "Funnix",
      "Asel",
      "Willen",
      "Blersum",
      "Buttforde",
    ],
    metaTitle: "Fixum Objektservice: Entrümpelung & Renovierung Wittmund",
    metaDescription:
      "Entrümpelung, Haushaltsauflösung und Renovierung in Wittmund, Carolinensiel und Harlesiel – auch für Ferienwohnungen. Festpreis nach kostenloser Besichtigung.",
    h1: "Entrümpelung und Renovierung in Wittmund",
    intro:
      "Wittmund ist Kreisstadt am Rand unseres Einsatzgebiets, rund 52 km von Emden. Wir übernehmen hier vor allem größere Räumungen und Renovierungen – in Wittmund selbst sowie in Carolinensiel und Harlesiel.",
    objektlage:
      "Carolinensiel und Harlesiel leben stark vom Tourismus; viele Wohnungen werden als Ferienwohnung vermietet. Renoviert wird in der Nebensaison und mit festem Enddatum. Wir planen Räumung und Ausbau auf dieses Zeitfenster.",
    schwerpunkte: [
      {
        titel: "Ferienwohnung in der Nebensaison",
        text: "Räumen, renovieren, rechtzeitig wieder vermietbar.",
        href: L.renovierung,
      },
      {
        titel: "Haushaltsauflösung",
        text: "Diskret, besenrein, auf Wunsch ohne Anwesenheit.",
        href: L.haushalt,
      },
      {
        titel: "Trockenbau",
        text: "Grundriss anpassen, Decken abhängen, Dachschrägen.",
        href: L.trockenbau,
      },
    ],
    entsorgung:
      "Wittmund hat einen eigenen Landkreis mit eigener Abfallwirtschaft – die Regeln unterscheiden sich von Emden und vom Landkreis Aurich. Die getrennte Entsorgung übernehmen wir im Rahmen des Auftrags.",
    faq: [
      {
        frage: "Fahren Sie auch nach Carolinensiel?",
        antwort:
          "Ja, für Räumungen und Renovierungen. Kleine Einzelaufträge sind bei dieser Entfernung meist bei einem Betrieb vor Ort günstiger – das sagen wir Ihnen dann auch.",
      },
      {
        frage: "Schaffen Sie die Renovierung bis zum Saisonstart?",
        antwort:
          "Nennen Sie uns das Enddatum bei der Anfrage. Wir sagen nur zu, wenn wir es halten können.",
      },
      anfahrtFaq("Wittmund", 52),
    ],
    nachbarn: ["wiesmoor", "aurich", "norden"],
  },
  {
    slug: "papenburg",
    name: "Papenburg",
    landkreis: "Landkreis Emsland",
    entfernungKm: 55,
    ortsteile: [
      "Aschendorf",
      "Obenende",
      "Untenende",
      "Bokel",
      "Herbrum",
      "Tunxdorf",
      "Nenndorf",
      "Papenburg-Umland",
    ],
    metaTitle: "Fixum Objektservice: Trockenbau & Entrümpelung Papenburg",
    metaDescription:
      "Trockenbau als Nachunternehmer, Entkernung und größere Räumungen in Papenburg und Aschendorf. Verbindliche Termine, Abrechnung nach m² oder Tagessatz.",
    h1: "Trockenbau, Entkernung und Räumung in Papenburg",
    intro:
      "Papenburg liegt bereits im Emsland, rund 55 km von Emden. Hier arbeiten wir vor allem an größeren Projekten: als Trockenbau-Nachunternehmer für Bau- und Ausbaubetriebe, bei Entkernungen und bei umfangreichen Räumungen.",
    objektlage:
      "Papenburg ist ein starker Wirtschafts- und Baustandort. Für Betriebe, die Ausbaugewerke vergeben, zählt vor allem eines: dass der Nachunternehmer am zugesagten Tag auf der Baustelle steht. Genau das ist unser Angebot – abgerechnet nach m² oder Tagessatz, Material auf Wunsch bauseits.",
    schwerpunkte: [
      {
        titel: "Trockenbau als Sub",
        text: "Ständerwerk, Beplankung, Decken – nach m² oder Tagessatz.",
        href: L.bau,
      },
      {
        titel: "Entkernung",
        text: "Nicht-tragender Rückbau mit sortenreiner Trennung.",
        href: L.entkernung,
      },
      {
        titel: "Große Räumungen",
        text: "Häuser und Gewerbeflächen, mehrtägig zum Festpreis.",
        href: L.entruempelung,
      },
    ],
    entsorgung:
      "Papenburg gehört zum Landkreis Emsland mit eigener Abfallwirtschaft. Bei Rückbauprojekten klären wir die Fraktionen und den Containerdienst vorab schriftlich, damit es keine Nachberechnung wegen Falschbefüllung gibt.",
    faq: [
      {
        frage: "Arbeiten Sie als Nachunternehmer im Emsland?",
        antwort:
          "Ja, bei Projekten ab etwa einem Arbeitstag. Abrechnung nach m² oder Tagessatz, Betriebshaftpflicht mit Subunternehmer-Klausel.",
      },
      {
        frage: "Kommen Sie für kleine Privataufträge nach Papenburg?",
        antwort:
          "Ehrlich gesagt lohnt sich das für Sie bei dieser Entfernung selten. Bei Räumungen oder Umbauten über mehrere Tage sind wir gern da.",
      },
      anfahrtFaq("Papenburg", 55),
    ],
    nachbarn: ["westoverledingen", "weener", "leer"],
  },
];

export const findeStadt = (slug: string) =>
  staedte.find((s) => s.slug === slug);

export const landkreise = Array.from(new Set(staedte.map((s) => s.landkreis)));

/* Die Leistungs-Stadt-Seiten (/trockenbau/aurich/ und die übrigen 19) stehen
   in src/data/leistungsseiten.ts. Getrennt, weil diese Datei die Orte
   beschreibt und jene das, was Fixum dort konkret macht. */
