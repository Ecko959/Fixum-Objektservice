import type { IconName } from "./icons";

export interface ServiceMenuItem {
  label: string;
  href: string;
  icon: IconName;
  description: string;
}

export const serviceMenuGroups: Array<{
  title: string;
  items: ServiceMenuItem[];
}> = [
  {
    title: "Räumen",
    items: [
      {
        label: "Entrümpelung",
        href: "/entruempelung-emden/",
        icon: "crate",
        description: "Wohnung, Haus, Keller, Dachboden, Garage.",
      },
      {
        label: "Haushaltsauflösung",
        href: "/haushaltsaufloesung-emden/",
        icon: "home",
        description: "Nachlass, Umzug ins Heim, diskrete Abwicklung.",
      },
      {
        label: "Wohnungsräumung",
        href: "/wohnungsraeumung-emden/",
        icon: "key",
        description: "Besenrein für Übergabe, Vermietung oder Verkauf.",
      },
      {
        label: "Umzüge & Transporte",
        href: "/umzug-emden/",
        icon: "truck",
        description: "Privat, Gewerbe und Objektfahrten bis 3,5 t.",
      },
    ],
  },
  {
    title: "Rückbau & Ausbau",
    items: [
      {
        label: "Entkernung",
        href: "/entkernung-emden/",
        icon: "hammer",
        description: "Nicht-tragender Rückbau, sortenrein getrennt.",
      },
      {
        label: "Trockenbau",
        href: "/trockenbau-emden/",
        icon: "wall",
        description: "Wände, Decken, Dachschrägen, Q1 bis Q3.",
      },
      {
        label: "Rückbau + Trockenbau",
        href: "/rueckbau-trockenbau-emden/",
        icon: "layers",
        description: "Beide Gewerke in einem Durchgang, ein Angebot.",
      },
      {
        label: "Boden & Türen",
        href: "/bodenverlegung-emden/",
        icon: "door",
        description: "Laminat, Vinyl, Teppich, Türen und Zargen.",
      },
    ],
  },
  {
    title: "Objektservice",
    items: [
      {
        label: "Möbel- & Küchenmontage",
        href: "/kuechenmontage-emden/",
        icon: "wrench",
        description: "Ohne Elektro-, Gas- und Wasseranschlüsse.",
      },
      {
        label: "Hausmeisterservice",
        href: "/hausmeisterservice-emden/",
        icon: "clipboard",
        description: "Objektbetreuung, Kleinreparaturen, Rahmenvertrag.",
      },
      {
        label: "Winterdienst & Außenanlagen",
        href: "/winterdienst-emden/",
        icon: "snow",
        description: "Räum- und Streupflicht zuverlässig erfüllt.",
      },
      {
        label: "Kernsanierung vorbereiten",
        href: "/kernsanierung-emden/",
        icon: "building",
        description: "Räumen, Rückbau, Ausbau - Fachbetriebe koordiniert.",
      },
    ],
  },
];

export const allServiceMenuItems = serviceMenuGroups.flatMap(
  (group) => group.items,
);
