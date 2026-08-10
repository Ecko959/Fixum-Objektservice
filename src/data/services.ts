export interface Service {
  title: string;
  href: string;
  image: string;
  text: string;
  bullets?: string[];
  /** Kurzform für Chips und Sekundärnavigation. */
  short: string;
}

/**
 * Kanonische Leistungsliste. Jeder Eintrag zeigt auf genau eine Seite.
 *
 * Die Titel sind bewusst gegeneinander abgegrenzt: verwandte Seiten dürfen
 * sich nicht auf dasselbe Hauptkeyword ausrichten, sonst konkurrieren sie
 * in der Suche gegeneinander.
 */
export const services: Service[] = [
  {
    title: "Entrümpelung & Haushaltsauflösung",
    short: "Entrümpelung",
    href: "/entruempelung-emden/",
    image: "/images/categories/haushaltsaufloesung.png",
    text: "Wohnung, Haus, Keller, Dachboden, Garage. Wir räumen, trennen sortenrein und übergeben besenrein - auf Wunsch mit Entsorgungsnachweis und Fotodokumentation.",
    bullets: [
      "Kostenlose Besichtigung",
      "Sortenreine Entsorgung",
      "Besenreine Übergabe",
    ],
  },
  {
    title: "Entkernung & Rückbau",
    short: "Entkernung",
    href: "/entkernung-emden/",
    image: "/images/categories/entkernung-rueckbau.png",
    text: "Nicht-tragender Rückbau bis auf den Rohbau: alte Böden, Wände, Einbauten, Sanitärobjekte. Wir trennen direkt vor Ort nach Fraktionen - das spart Entsorgungskosten.",
    bullets: [
      "Nicht-tragender Rückbau",
      "Sortenreine Trennung",
      "Klare Leistungsgrenzen",
    ],
  },
  {
    title: "Trockenbau & Innenausbau",
    short: "Trockenbau",
    href: "/trockenbau-emden/",
    image: "/images/categories/trockenbau-innenausbau.png",
    text: "Ständerwände, Vorsatzschalen, Schallschutz, abgehängte Decken, Dachschrägen, Spachtelung Q1 bis Q3. Für private Modernisierer und als Nachunternehmer.",
    bullets: ["Wände und Decken", "Spachtelung Q1-Q3", "Nachunternehmer"],
  },
  {
    title: "Bodenverlegung & Türmontage",
    short: "Boden & Türen",
    href: "/bodenverlegung-emden/",
    image: "/images/categories/montage-boden.png",
    text: "Laminat, Vinyl und Teppich fachgerecht verlegt, Türen und Zargen sauber gesetzt - der Schritt, der aus einem leeren Raum wieder einen fertigen macht.",
    bullets: ["Laminat, Vinyl, Teppich", "Türen und Zargen", "Nach Aufmaß"],
  },
  {
    title: "Umzüge & Transporte",
    short: "Umzüge",
    href: "/umzug-emden/",
    image: "/images/categories/umzuege-transporte.png",
    text: "Privat- und Firmenumzüge bis 3,5 t, im Team und zum Festpreis. Kombinierbar mit Entrümpelung, damit nur eine Firma anrückt.",
    bullets: ["Bis 3,5 t", "Festpreis", "Mit Demontage"],
  },
  {
    title: "Hausmeisterservice",
    short: "Hausmeister",
    href: "/hausmeisterservice-emden/",
    image: "/images/categories/hausmeister-winterdienst.png",
    text: "Objektbetreuung, Kleinreparaturen, Außenanlagen und Winterdienst - einmalig oder als laufender Rahmenvertrag mit festen Konditionen.",
    bullets: ["Kleinreparaturen", "Objektkontrolle", "Rahmenvertrag"],
  },
  {
    title: "Haushaltsauflösung & Nachlass",
    short: "Nachlass",
    href: "/haushaltsaufloesung-emden/",
    image: "/images/categories/haushaltsaufloesung.png",
    text: "Diskrete Auflösung von Nachlässen und Haushalten - im Trauerfall oder beim Umzug ins Heim. Auf Wunsch komplett ohne Ihre Anwesenheit.",
    bullets: ["Diskret und ruhig", "Auch ohne Anwesenheit", "Feste Termine"],
  },
  {
    title: "Wohnungsräumung",
    short: "Wohnungsräumung",
    href: "/wohnungsraeumung-emden/",
    image: "/images/categories/wohnungsraeumung.png",
    text: "Besenreine Räumung für Übergabe, Mieterwechsel, Verkauf oder Neuvermietung - mit Fotodokumentation zur Abnahme.",
    bullets: ["Für die Übergabe", "Fotodokumentation", "Feste Termine"],
  },
  {
    title: "Möbel- & Küchenmontage",
    short: "Möbelmontage",
    href: "/kuechenmontage-emden/",
    image: "/images/categories/montage-boden.png",
    text: "Möbel und Küchen fachgerecht aufgebaut und ausgerichtet - ohne Elektro-, Gas- und Wasseranschlüsse, die gehören zugelassenen Fachbetrieben.",
    bullets: ["Möbel und Küchen", "Auch Demontage", "Klare Grenzen"],
  },
  {
    title: "Winterdienst & Außenanlagen",
    short: "Winterdienst",
    href: "/winterdienst-emden/",
    image: "/images/categories/hausmeister-winterdienst.png",
    text: "Räum- und Streupflicht zuverlässig erfüllt, dazu einfache Außenpflege und laufende Objektarbeiten nach Vereinbarung.",
    bullets: ["Räum- und Streudienst", "Grünpflege", "Nach Vereinbarung"],
  },
  {
    title: "Kernsanierung vorbereiten",
    short: "Kernsanierung",
    href: "/kernsanierung-emden/",
    image: "/images/categories/kernsanierung-vorbereiten.png",
    text: "Räumen, nicht-tragender Rückbau, Trockenbau und die Koordination zugelassener Fachbetriebe - die komplette Vorbereitung aus einer Hand.",
    bullets: [
      "Räumen und Rückbau",
      "Ausbau danach",
      "Fachbetriebe koordiniert",
    ],
  },
];

/** Die drei Kernleistungen - Startseite und Footer heben sie hervor. */
export const primaryServices = services.slice(0, 3);

export const offerCatalog = services.map((service) => service.title);

export const serviceByHref = (href: string) =>
  services.find(
    (service) => service.href.replace(/\/+$/, "") === href.replace(/\/+$/, ""),
  );
