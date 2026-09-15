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
        href: "/entruempelung/",
        icon: "crate",
        description: "Wohnung, Haus, Keller, Dachboden, Garage.",
      },
      {
        label: "Haushaltsauflösung",
        href: "/haushaltsaufloesung/",
        icon: "home",
        description: "Nachlass, Umzug ins Heim, diskrete Abwicklung.",
      },
      {
        label: "Wohnungsräumung",
        href: "/wohnungsraeumung/",
        icon: "key",
        description: "Besenrein für Übergabe, Vermietung oder Verkauf.",
      },
      {
        label: "Umzüge & Transporte",
        href: "/umzug/",
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
        href: "/entkernung/",
        icon: "hammer",
        description: "Nicht-tragender Rückbau, sortenrein getrennt.",
      },
      {
        label: "Trockenbau",
        href: "/trockenbau/",
        icon: "wall",
        description: "Wände, Decken, Dachschrägen, Q1 bis Q3.",
      },
      {
        label: "Rückbau + Trockenbau",
        href: "/rueckbau-trockenbau/",
        icon: "layers",
        description: "Beide Gewerke in einem Durchgang, ein Angebot.",
      },
      {
        label: "Renovierung",
        href: "/renovierung/",
        icon: "pen",
        description: "Boden, Wände, Türen - ohne Eingriff in den Rohbau.",
      },
      {
        label: "Boden & Türen",
        href: "/bodenverlegung/",
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
        href: "/kuechenmontage/",
        icon: "wrench",
        description: "Ohne Elektro-, Gas- und Wasseranschlüsse.",
      },
      {
        label: "Hausmeisterservice",
        href: "/hausmeisterservice/",
        icon: "clipboard",
        description: "Objektbetreuung, Kleinreparaturen, Rahmenvertrag.",
      },
      {
        label: "Winterdienst & Außenanlagen",
        href: "/winterdienst/",
        icon: "snow",
        description: "Räum- und Streupflicht zuverlässig erfüllt.",
      },
      {
        label: "Kernsanierung vorbereiten",
        href: "/kernsanierung/",
        icon: "building",
        description: "Räumen, Rückbau, Ausbau - Fachbetriebe koordiniert.",
      },
    ],
  },
];

export const allServiceMenuItems = serviceMenuGroups.flatMap(
  (group) => group.items,
);
