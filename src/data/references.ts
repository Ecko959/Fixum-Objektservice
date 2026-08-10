/**
 * Referenzen aus echten Aufträgen.
 *
 * Jeder Eintrag ist ein Vorher/Nachher-Bild plus Einordnung: welches Objekt,
 * was genau gemacht wurde, welche Leistung dahintersteht. Der Verweis auf die
 * Leistungsseite ist zugleich eine der wenigen Stellen, an denen die Startseite
 * inhaltlich begründet nach innen verlinkt.
 *
 * Bilder liegen unter public/images/referenzen/ und werden wie alle anderen
 * Fotos als PNG plus WebP und AVIF vorgehalten (siehe README).
 */

export interface Reference {
  /** Pfad zum PNG; WebP und AVIF müssen unter gleichem Namen daneben liegen. */
  image: string;
  /** Beschreibt das Bild für Screenreader und die Bildersuche. */
  alt: string;
  title: string;
  text: string;
  /** Kurzform der Leistung, erscheint als Chip auf der Karte. */
  tag: string;
  href: string;
}

export const references: Reference[] = [
  {
    image: "/images/referenzen/dachgeschoss-raeumung-rueckbau-foto.png",
    alt: "Dachgeschoss in Ostfriesland vor und nach Räumung und nicht-tragendem Rückbau durch Fixum Objektservice",
    title: "Dachgeschoss geräumt und zurückgebaut",
    text: "Alter Ausbau, lose Dämmwolle und Hausrat raus, Dachstuhl freigelegt, Boden besenrein. Grundlage für den anschließenden Ausbau.",
    tag: "Entrümpelung & Rückbau",
    href: "/entkernung-emden/",
  },
  {
    image: "/images/referenzen/dachgeschoss-trockenbau-foto.png",
    alt: "Dachgeschoss vor und nach dem Trockenbau mit neuer Ständerwand und eingebautem Dachfenster",
    title: "Dachgeschoss ausgebaut",
    text: "Nach dem Rückbau: Ständerwand gestellt, beplankt, Dachfenster eingesetzt. Aus dem Abstellboden wird nutzbarer Wohnraum.",
    tag: "Trockenbau",
    href: "/trockenbau-emden/",
  },
  {
    image: "/images/referenzen/haushaltsaufloesung-wohnzimmer-foto.png",
    alt: "Vollständig eingerichtetes Wohnzimmer vor und nach der Haushaltsauflösung durch Fixum Objektservice",
    title: "Haushalt vollständig aufgelöst",
    text: "Komplette Einrichtung mit Schrankwand, Esstisch und Hausrat geräumt, sortenrein entsorgt und besenrein übergeben.",
    tag: "Haushaltsauflösung",
    href: "/haushaltsaufloesung-emden/",
  },
  {
    image: "/images/referenzen/wohnungsraeumung-neuvermietung-foto.png",
    alt: "Wohnzimmer mit Restmöbeln und Umzugskartons vor und nach der Wohnungsräumung",
    title: "Wohnung für die Neuvermietung geräumt",
    text: "Restmöbel, Kartons und Sperrmüll raus, Boden gereinigt. Die Einheit war am selben Tag wieder übergabefähig.",
    tag: "Wohnungsräumung",
    href: "/wohnungsraeumung-emden/",
  },
  {
    image: "/images/referenzen/altbau-entkernung-ausbau-foto.png",
    alt: "Entkernter Altbauraum mit freiliegendem Mauerwerk vor und nach dem Trockenbau mit gespachtelter Decke",
    title: "Altbau entkernt und neu ausgebaut",
    text: "Zurückgebaut bis auf das Mauerwerk, danach Vorsatzschalen und abgehängte Decke gestellt und gespachtelt.",
    tag: "Rückbau + Trockenbau",
    href: "/rueckbau-trockenbau-emden/",
  },
];
