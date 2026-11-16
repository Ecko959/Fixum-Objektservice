/* Projektberichte unter /referenzen/<slug>/.

   Nur abgerechnete, echte Aufträge. Regeln:
   - Keine Namen, keine Straßen - Ort höchstens auf Ortsteil-Ebene.
   - Keine Einzelpreise (siehe preise.ts: auf der Website stehen nur die
     freigegebenen Ab-Preise).
   - Fotos nur mit Einverständnis der Auftraggeber (Datenschutzerklärung
     Ziffer 3.3). Ohne freigegebenes Foto bleibt `foto` leer - dann zeigt die
     Seite das Leistungsbild der Kategorie mit entsprechendem Hinweis.
   - Fakten aus Angebot/Rechnung übernehmen, nichts ausschmücken. */
import { fotos, type Foto } from "./referenzen";

export interface Projekt {
  slug: string;
  titel: string;
  metaTitel: string;
  beschreibung: string;
  ort: string;
  /** Zeitraum der Ausführung, z. B. "Oktober 2026" */
  zeitraum: string;
  leistung: string;
  /** Kurzfakten als [Label, Wert] */
  fakten: Array<[string, string]>;
  kurz: string;
  html: string;
  /** Freigegebenes Foto genau dieses Auftrags */
  foto?: Foto;
  /** Kategoriebild, falls kein Auftragsfoto freigegeben ist */
  symbolbild: Foto;
  leistungen: Array<[string, string]>;
  /** Veröffentlichungsdatum der Seite (ISO) */
  datum: string;
}

export const projekte: Projekt[] = [
  {
    slug: "wohnungsentruempelung-rhede",
    titel: "Wohnungsentrümpelung in Rhede (Ems)",
    metaTitel: "Fixum Objektservice: Entrümpelung in Rhede (Ems)",
    beschreibung:
      "Projektbericht: Entrümpelung einer Erdgeschosswohnung in Rhede (Ems) inklusive Bad und Keller – zum schriftlichen Festpreis, Einbauküche blieb stehen.",
    ort: "Rhede (Ems)",
    zeitraum: "Oktober 2026",
    leistung: "Entrümpelung",
    fakten: [
      ["Objekt", "Erdgeschosswohnung mit Bad und Keller"],
      ["Umfang", "Komplette Räumung, Einbauküche bleibt"],
      ["Entsorgung", "Container der Auftraggeberin, Überhang per Transporter"],
      ["Preis", "Schriftlicher Festpreis nach Besichtigung"],
    ],
    kurz: "Eine Erdgeschosswohnung in Rhede sollte komplett geräumt werden, die Einbauküche aber stehen bleiben. Vor Ort kam der Keller samt Waschmaschine und Trockner dazu.",
    html: `
<h2>Ausgangslage</h2>
<p>Die Auftraggeberin wollte eine Erdgeschosswohnung in Rhede vollständig räumen lassen. Die Einbauküche sollte in der Wohnung bleiben, das kleine Bad musste mit geräumt werden. Einen 10-m³-Mischcontainer hatte die Auftraggeberin selbst bestellt. Was nicht mehr hineinpasste, sollten wir mit dem Transporter abfahren.</p>

<h2>Angebot</h2>
<p>Nach der Besichtigung gab es einen schriftlichen Festpreis mit getrennt ausgewiesenen Positionen für Arbeitslohn, Fahrten inklusive Überhang und Schutzausrüstung. Die getrennte Aufstellung der Arbeitskosten ist wichtig für die Steuer: Privatkunden können sie nach § 35a EStG anteilig absetzen. Eingeplant waren zwei Werktage.</p>

<h2>Ausführung</h2>
<ul>
  <li>Räumung aller Zimmer und des Bades, die Einbauküche blieb unberührt.</li>
  <li>Container befüllt, den Überhang per Transporter abgefahren.</li>
  <li>Auf Wunsch der Auftraggeberin am selben Einsatz zusätzlich den <strong>Keller geräumt</strong>, inklusive Waschmaschine und Trockner.</li>
</ul>

<h2>Ergebnis</h2>
<p>Die Wohnung war geräumt und bereit für die nächsten Schritte. Direkt im Anschluss hat die Auftraggeberin ein Angebot für die Renovierung angefragt: alten Vinylboden raus, neuer Klick-Belag und Wände spachteln. Räumen und Renovieren aus einer Hand spart Abstimmung zwischen mehreren Firmen.</p>
`,
    symbolbild: fotos.wohnungsaufloesung,
    leistungen: [
      ["Entrümpelung", "/entruempelung/"],
      ["Wohnungsräumung", "/wohnungsraeumung/"],
      ["Renovierung", "/renovierung/"],
    ],
    datum: "2026-11-16",
  },

  {
    slug: "wandkassetten-dachgeschoss-riepe",
    titel: "Wandkassetten im Dachgeschoss in Riepe (Ihlow)",
    metaTitel: "Fixum Objektservice: Wandkassetten im Dachgeschoss, Riepe",
    beschreibung:
      "Projektbericht: 21 Wandkassetten aus Zierleisten in einem Dachgeschoss-Wohnzimmer in Riepe (Ihlow) – mit Dachschrägen, Drempel, Nische und Heizkörpern.",
    ort: "Riepe (Gemeinde Ihlow)",
    zeitraum: "September 2026",
    leistung: "Innenausbau",
    fakten: [
      ["Raum", "Dachgeschoss-Wohnzimmer mit Schrägen und Drempel"],
      ["Umfang", "21 Kassetten inkl. 3 in einer Nische"],
      ["Montagezeit", "4 Arbeitstage"],
      ["Material", "Gestellt von der Auftraggeberin"],
    ],
    kurz: "Ein Wohnzimmer unter dem Dach sollte mit Wandkassetten aus Zierleisten aufgewertet werden. Die Herausforderung waren Dachschrägen, ein niedriger Drempel, Heizkörper und Steckdosen.",
    html: `
<h2>Ausgangslage</h2>
<p>Im Dachgeschoss eines Hauses in Riepe sollte das Wohnzimmer mit klassischen Wandkassetten gestaltet werden. Der Raum hat Dachschrägen, eine rund 6 Meter lange Drempelwand mit nur etwa 60 cm Höhe, eine gegenüberliegende hohe Wand, eine Giebelwand mit 4,54 m und eine Fensterwand. Die Leisten aus Hartpolystyrol und EPS hatte die Auftraggeberin selbst besorgt.</p>

<h2>Planung</h2>
<p>Damit das Ergebnis ruhig wirkt, haben wir einheitliche Abstände festgelegt: rund 80 mm zwischen den Kassetten und zum Rand, 90 mm über der Fußleiste und 80 mm unter der oberen Abschlussleiste. Die Giebelwand wurde in drei gleich breite Kassetten von je etwa 1,41 m geteilt. Die niedrigen Kassetten unter der Schräge sind so gesetzt, dass sie zu den hohen Wänden symmetrisch wirken.</p>

<h2>Ausführung</h2>
<ul>
  <li>Ausmessen, Anzeichnen und Zuschnitt aller Leisten, Gehrungen und Sonderwinkel an Fenster und Schrägen.</li>
  <li>Heizkörper und Steckdosen in die Kassettenaufteilung eingeplant statt einfach überbaut.</li>
  <li>Schräge Kassetten entlang der Dachschrägen, dazu drei zusätzliche Kassetten in einer Nische.</li>
  <li>Insgesamt <strong>21 Kassetten in 4 Arbeitstagen</strong> montiert und verklebt.</li>
</ul>

<h2>Ergebnis</h2>
<p>Die Kassettenaufteilung läuft jetzt durchgehend um den Raum, auch unter den Schrägen und in der Nische. Der Anstrich von Wand und Leisten gehörte nicht zu unserem Auftrag. Weil Material und Anstrich bei der Auftraggeberin lagen, blieb der Auftrag schlank. Diese Arbeitsteilung bieten wir bei Renovierungen grundsätzlich an.</p>
`,
    symbolbild: fotos.dachzimmer,
    leistungen: [
      ["Renovierung", "/renovierung/"],
      ["Trockenbau", "/trockenbau/"],
      ["Möbel- & Küchenmontage", "/kuechenmontage/"],
    ],
    datum: "2026-11-16",
  },

  {
    slug: "notsicherung-balkontuer-emden",
    titel: "Notsicherung einer Balkontür nach Einbruch in Emden",
    metaTitel: "Fixum Objektservice: Notsicherung Balkontür, Emden",
    beschreibung:
      "Projektbericht: Befund und provisorische Sicherung einer aufgebrochenen Balkontür in Emden, danach Angebot für die neue Tür inklusive Rahmen und Montage.",
    ort: "Emden",
    zeitraum: "September 2026",
    leistung: "Objektservice",
    fakten: [
      ["Anlass", "Aufgebrochene Balkontür"],
      ["Sofortmaßnahme", "Befund und provisorische Sicherung"],
      ["Folgeschritt", "Angebot für neue Balkontür inkl. Rahmen und Montage"],
    ],
    kurz: "Nach einem Einbruch war eine Balkontür nicht mehr sicher. Wir haben den Schaden aufgenommen, die Tür provisorisch gesichert und danach ein Angebot für den Austausch erstellt.",
    html: `
<h2>Ausgangslage</h2>
<p>Nach einem Aufbruch war die Balkontür einer Wohnung in Emden beschädigt. Zuerst musste die Wohnung wieder gesichert werden, danach brauchte der Auftraggeber eine Lösung für den dauerhaften Ersatz.</p>

<h2>Ausführung</h2>
<ul>
  <li><strong>Befund:</strong> Schaden an Tür und Rahmen vor Ort aufgenommen.</li>
  <li><strong>Provisorische Sicherung:</strong> Tür gesichert, damit die Wohnung bis zum Austausch geschützt ist.</li>
  <li>Befund und Sicherung wurden als eigener Auftrag abgerechnet, getrennt vom späteren Austausch.</li>
</ul>

<h2>Nächster Schritt</h2>
<p>Im Anschluss hat der Auftraggeber ein Angebot für eine neue Balkontür inklusive Rahmen und Montage erhalten. Sofortmaßnahme und Austausch kommen so aus einer Hand.</p>
`,
    symbolbild: fotos.dachausbauTrockenbau,
    leistungen: [
      ["Hausmeisterservice", "/hausmeisterservice/"],
      ["Renovierung", "/renovierung/"],
    ],
    datum: "2026-11-16",
  },
];

export const projektPfad = (p: Pick<Projekt, "slug">) =>
  `/referenzen/${p.slug}/`;
