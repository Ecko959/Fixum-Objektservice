export const serviceMenuGroups = [
  {
    title: "Räumen",
    items: [
      {
        label: "Entrümpelung",
        href: "/entruempelung-haushaltsaufloesung",
        description: "Wohnung, Haus, Keller, Dachboden, Garage.",
      },
      {
        label: "Haushaltsauflösung",
        href: "/haushaltsaufloesung",
        description: "Nachlass, Umzug ins Heim, diskrete Abwicklung.",
      },
      {
        label: "Wohnungsräumung",
        href: "/wohnungsraeumung",
        description: "Besenrein für Übergabe, Vermietung oder Verkauf.",
      },
      {
        label: "Umzüge & Transporte",
        href: "/umzuege-transporte",
        description: "Privat, Gewerbe und Objektfahrten bis 3,5 t.",
      },
    ],
  },
  {
    title: "Rückbau & Ausbau",
    items: [
      {
        label: "Entkernung",
        href: "/entkernung-rueckbau",
        description: "Nicht-tragender Rückbau, sortenrein getrennt.",
      },
      {
        label: "Trockenbau",
        href: "/trockenbau-innenausbau",
        description: "Wände, Decken, Dachschrägen, Q1 bis Q3.",
      },
      {
        label: "Montage & Boden",
        href: "/montage-boden",
        description: "Türen, Zargen, Laminat, Vinyl, Teppich.",
      },
      {
        label: "Möbel & Küchenmontage",
        href: "/moebel-kuechenmontage",
        description: "Ohne Elektro-, Gas- und Wasseranschlüsse.",
      },
    ],
  },
  {
    title: "Objektservice",
    items: [
      {
        label: "Hausmeisterservice",
        href: "/hausmeisterservice",
        description: "Objektbetreuung, Kleinreparaturen, Rahmenvertrag.",
      },
      {
        label: "Winterdienst & Außenanlagen",
        href: "/winterdienst-aussenanlagen",
        description: "Laufende Pflege nach klarer Vereinbarung.",
      },
      {
        label: "Kernsanierung vorbereiten",
        href: "/kernsanierung-vorbereiten",
        description: "Räumen, Rückbau, Ausbau - Fachbetriebe koordiniert.",
      },
      {
        label: "Für Hausverwaltungen",
        href: "/fuer-hausverwaltungen",
        description: "Mieterwechsel in einem Durchgang.",
      },
    ],
  },
];

export const allServiceMenuItems = serviceMenuGroups.flatMap(
  (group) => group.items,
);
