export const serviceMenuGroups = [
  {
    title: "Räumen",
    items: [
      {
        label: "Entrümpelung",
        href: "/entruempelung-haushaltsaufloesung/",
        description: "Wohnung, Haus, Keller, Dachboden, Garage.",
      },
      {
        label: "Haushaltsauflösung",
        href: "/haushaltsaufloesung/",
        description: "Nachlass, Umzug ins Heim, diskrete Abwicklung.",
      },
      {
        label: "Wohnungsräumung",
        href: "/wohnungsraeumung/",
        description: "Besenrein für Übergabe, Vermietung oder Verkauf.",
      },
      {
        label: "Umzüge & Transporte",
        href: "/umzuege-transporte/",
        description: "Privat, Gewerbe und Objektfahrten bis 3,5 t.",
      },
    ],
  },
  {
    title: "Rückbau & Ausbau",
    items: [
      {
        label: "Entkernung",
        href: "/entkernung-rueckbau/",
        description: "Nicht-tragender Rückbau, sortenrein getrennt.",
      },
      {
        label: "Trockenbau",
        href: "/trockenbau-innenausbau/",
        description: "Wände, Decken, Dachschrägen, Q1 bis Q3.",
      },
      {
        label: "Rückbau + Trockenbau",
        href: "/entkernung-trockenbau/",
        description: "Beide Gewerke in einem Durchgang, ein Angebot.",
      },
      {
        label: "Boden & Türen",
        href: "/montage-boden/",
        description: "Laminat, Vinyl, Teppich, Türen und Zargen.",
      },
    ],
  },
  {
    title: "Objektservice",
    items: [
      {
        label: "Möbel- & Küchenmontage",
        href: "/moebel-kuechenmontage/",
        description: "Ohne Elektro-, Gas- und Wasseranschlüsse.",
      },
      {
        label: "Hausmeisterservice",
        href: "/hausmeisterservice/",
        description: "Objektbetreuung, Kleinreparaturen, Rahmenvertrag.",
      },
      {
        label: "Winterdienst & Außenanlagen",
        href: "/winterdienst-aussenanlagen/",
        description: "Räum- und Streupflicht zuverlässig erfüllt.",
      },
      {
        label: "Kernsanierung vorbereiten",
        href: "/kernsanierung-vorbereiten/",
        description: "Räumen, Rückbau, Ausbau - Fachbetriebe koordiniert.",
      },
    ],
  },
];

export const allServiceMenuItems = serviceMenuGroups.flatMap(
  (group) => group.items,
);
