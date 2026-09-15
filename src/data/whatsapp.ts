/**
 * Betreffzeile für die WhatsApp-Links, abgeleitet aus dem Seitenpfad.
 *
 * Bewusst aus dem Pfad und nicht als Eigenschaft durchgereicht: Die
 * WhatsApp-Schaltfläche steht in fünf Komponenten (Hero, Kontaktleiste,
 * CTA-Band, Formular, Fußzeile), von denen zwei aus dem Layout kommen und
 * die Seite gar nicht kennen. Über den Pfad bekommen alle denselben Text,
 * ohne dass eine Seite etwas vergessen kann.
 */
import { leistungen, leistungsStadtSeiten } from "./leistungsseiten";
import { serviceMenuGroups } from "./serviceMenu";
import { findeStadt } from "./staedte";

const STANDARD = "Moin, ich habe eine Anfrage zu:";

/* Einige Menütitel passen nicht in den Satz "Anfrage zu ...". Aus
   "Umzüge & Transporte" würde sonst "Anfrage zu Umzüge & Transporte:".
   Hier steht die Fassung, die sich in einer Nachricht lesen lässt. */
const imSatz: Record<string, string> = {
  "/umzug/": "einem Umzug",
  "/bodenverlegung/": "Bodenverlegung und Türmontage",
  "/rueckbau-trockenbau/": "Rückbau und Trockenbau",
  "/kuechenmontage/": "Möbel- und Küchenmontage",
  "/winterdienst/": "Winterdienst und Außenanlagen",
};

/** Leistungsname je Hauptseite, z. B. "/trockenbau/" -> "Trockenbau". */
const leistungJePfad = new Map<string, string>(
  serviceMenuGroups.flatMap((g) =>
    g.items.map((i) => [i.href, imSatz[i.href] ?? i.label] as [string, string]),
  ),
);

const normalisiere = (pfad: string) => {
  const p = pfad.split(/[?#]/)[0];
  return p.endsWith("/") ? p : `${p}/`;
};

/**
 * Baut die Betreffzeile für einen Pfad.
 *
 * - Leistung + Ort  auf den Kombiseiten  (/trockenbau/aurich/)
 * - nur der Ort     auf den Ortsseiten   (/einsatzgebiet/aurich/)
 * - nur die Leistung auf den Leistungsseiten (/trockenbau/)
 * - sonst der neutrale Standardtext
 */
export const whatsappThema = (pfad: string): string => {
  const p = normalisiere(pfad);

  // Kombiseite: Leistung und Ort stehen beide fest.
  const kombi = leistungsStadtSeiten.find((s) => s.pfad === p);
  if (kombi) {
    const stadt = findeStadt(kombi.stadtSlug);
    const ort = stadt?.kurzName ?? stadt?.name;
    return `Moin, ich habe eine Anfrage zu ${leistungen[kombi.leistung].label} in ${ort}:`;
  }

  // Ortsseite: Es gibt keine einzelne Leistung, also nur der Ort.
  const ortsseite = p.match(/^\/einsatzgebiet\/([a-z-]+)\/$/);
  if (ortsseite) {
    const stadt = findeStadt(ortsseite[1]);
    if (stadt) {
      return `Moin, ich habe eine Anfrage zu einem Auftrag in ${stadt.kurzName ?? stadt.name}:`;
    }
  }

  // Leistungsseite: Ort bleibt weg, die Seite gilt für das ganze Gebiet.
  const leistung = leistungJePfad.get(p);
  if (leistung) return `Moin, ich habe eine Anfrage zu ${leistung}:`;

  return STANDARD;
};
