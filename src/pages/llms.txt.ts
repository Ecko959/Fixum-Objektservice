/* /llms.txt - Kurzprofil für KI-Assistenten und KI-Suchen (llmstxt.org).

   Wird beim Bauen aus denselben Daten erzeugt wie die Website: Firmendaten
   aus site.ts, Preise aus preise.ts, Orte aus staedte.ts. Ändert sich dort
   etwas, zieht diese Datei automatisch nach. */
import type { APIRoute } from "astro";
import preisConfig from "../data/preise.config.json";
import {
  alleLeistungen,
  rechnerBereit,
  type Leistung,
} from "../lib/preisrechner";
import { leistungsStadtSeiten, leistungen } from "../data/leistungsseiten";
import { festpreisHinweis, preise, preisHinweis } from "../data/preise";
import { absolute } from "../data/seo";
import { kettePfad, site } from "../data/site";
import { findeStadt } from "../data/staedte";

const link = (titel: string, pfad: string, text: string) =>
  `- [${titel}](${absolute(pfad)}): ${text}`;

const preiszeile = (p: { leistung: string; betrag?: string }) =>
  `- ${p.leistung}: ${p.betrag}`;

/* Nur Rechner nennen, die auf der Website auch erscheinen. */
const rechnerLabel: Record<Leistung, string> = {
  entruempelung: "Entrümpelung",
  umzug: "Umzug",
  trockenbau: "Trockenbau",
  montage: "Montage",
  boden: "Boden",
};
const rechnerAktiv = alleLeistungen
  .filter((l) => rechnerBereit(preisConfig, l))
  .map((l) => rechnerLabel[l]);
const rechnerNamen =
  rechnerAktiv.length > 1
    ? `${rechnerAktiv.slice(0, -1).join(", ")} und ${rechnerAktiv[rechnerAktiv.length - 1]}`
    : rechnerAktiv.join("");

export const GET: APIRoute = () => {
  const ortsseiten = leistungsStadtSeiten.map((s) => {
    const stadt = findeStadt(s.stadtSlug)!;
    const l = leistungen[s.leistung];
    return link(
      `${l.label} in ${stadt.name}`,
      s.pfad,
      `${l.serviceType} in ${stadt.name}.`,
    );
  });

  const text = `# ${site.name}

> ${site.name} ist ein inhabergeführter Betrieb für Objektservice aus Emden (Ostfriesland). Schwerpunkt ist die komplette Leistungskette aus einer Hand: Entrümpelung, Entkernung (nicht tragender Rückbau) und Innenausbau mit Trockenbau, Boden und Montage. Dazu kommen Umzüge und Transporte bis ${site.maxTonnage} sowie Hausmeisterservice und Winterdienst.

## Unternehmensdaten

- Name: ${site.name}
- Inhaber: ${site.owner}
- Adresse: ${site.street}, ${site.zip} ${site.city}
- Telefon: ${site.phoneDisplay}
- E-Mail: ${site.email}
- Website: ${site.domain}/
- Öffnungszeiten: ${site.hours}
- Einsatzgebiet: Emden, Aurich, Leer, Norden und Ostfriesland (ca. ${site.radiusKm} km um Emden)

## Leistungen

${link("Entrümpelung, Entkernung & Innenausbau aus einer Hand", kettePfad, "Die komplette Leistungskette mit einem Ansprechpartner und einem Angebot.")}
${link("Entrümpelung", "/entruempelung/", "Wohnungen, Häuser, Keller, Dachböden, Garagen; sortenreine Entsorgung, besenreine Übergabe.")}
${link("Haushaltsauflösung", "/haushaltsaufloesung/", "Nachlass, Umzug ins Heim, auf Wunsch ohne Anwesenheit der Auftraggeber.")}
${link("Wohnungsräumung", "/wohnungsraeumung/", "Besenrein zur Übergabe, Mieterwechsel, Neuvermietung.")}
${link("Entkernung", "/entkernung/", "Nicht tragender Rückbau von Böden, Trennwänden, Decken und Einbauten, sortenrein getrennt.")}
${link("Trockenbau", "/trockenbau/", "Ständerwände, Vorsatzschalen, abgehängte Decken, Dachschrägen, Spachtelung Q1 bis Q3.")}
${link("Boden & Türen", "/bodenverlegung/", "Laminat, Vinyl, Teppich; Türen und Zargen.")}
${link("Möbel- & Küchenmontage", "/kuechenmontage/", "Aufbau, Ausrichtung, Befestigung; Demontage alter Möbel und Küchen.")}
${link("Umzüge & Transporte", "/umzug/", `Privat- und kleinere Büroumzüge, Transporte bis ${site.maxTonnage}.`)}
${link("Hausmeisterservice", "/hausmeisterservice/", "Objektkontrolle, Kleinreparaturen, Außenanlagen, Rahmenvertrag.")}
${link("Winterdienst", "/winterdienst/", "Räum- und Streupflicht nach schriftlicher Vereinbarung.")}
${link("Kernsanierung vorbereiten", "/kernsanierung/", "Räumen, Rückbau, Ausbau; Koordination zugelassener Fachbetriebe.")}

## Preise (Richtwerte)

${[
  preise.entruempelungNormal,
  preise.entruempelungStark,
  preise.entruempelungMessie,
  preise.umzug,
  preise.trockenbau,
]
  .map(preiszeile)
  .join("\n")}
- Entkernung, Boden, Montage, Hausmeisterservice und Winterdienst: ${festpreisHinweis}.

${preisHinweis}

${link("Preisrechner", "/preisrechner/", `Unverbindlicher Richtwert als Spanne für ${rechnerNamen}.`)}

## Nicht im Leistungsumfang

Arbeiten an Strom, Gas, Wasser und Heizung, Eingriffe in die Statik und Schadstoffsanierung (z. B. Asbest, KMF) führt ${site.name} nicht selbst aus. Dafür werden zugelassene Fachbetriebe koordiniert.

## Leistungen in Orten des Einsatzgebiets

${ortsseiten.join("\n")}
${link("Einsatzgebiet", "/einsatzgebiet/", "Alle Orte im Einsatzgebiet mit Entfernung ab Emden.")}

## Kontakt

${link("Kontakt und Anfrage", "/kontakt/", "Telefon, WhatsApp, E-Mail und Anfrageformular.")}
${link("Über uns", "/ueber-uns/", `Inhaber ${site.owner}, Arbeitsweise.`)}
`;

  return new Response(text, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
