export interface FaqItem {
  question: string;
  answer: string;
}

/** Allgemeine Fragen - werden auf der Startseite ausgespielt. */
export const faq: FaqItem[] = [
  {
    question: "Was kostet eine Entrümpelung in Emden?",
    answer:
      "Das hängt vom Volumen ab, nicht allein von der Quadratmeterzahl - eine vollgestellte Zweizimmerwohnung kann mehr Aufwand sein als ein leergeräumtes Haus. Deshalb schauen wir uns das Objekt an und nennen danach einen Festpreis, der schriftlich gilt. Besichtigung und Angebot sind kostenlos.",
  },
  {
    question: "Wie schnell bekomme ich einen Termin?",
    answer:
      "Die Besichtigung schaffen wir meist innerhalb von zwei Werktagen. Der Ausführungstermin liegt je nach Umfang bei ein bis zwei Wochen Vorlauf. Bei Wohnungsübergaben mit fester Frist sagen Sie es gleich beim Anruf - dann planen wir darum herum.",
  },
  {
    question: "Muss ich beim Termin dabei sein?",
    answer:
      "Nein. Viele Angehörige wohnen weit weg. Wir arbeiten nach Schlüsselübergabe und dokumentieren das Ergebnis mit Fotos. Was Sie behalten möchten, legen wir vorher gemeinsam fest.",
  },
  {
    question: "Machen Sie auch Elektro- und Sanitärarbeiten?",
    answer:
      "Anschlussarbeiten an Strom, Wasser und Heizung führen wir grundsätzlich nicht selbst aus. Die übernehmen zugelassene Fachbetriebe, die wir für Sie koordinieren - Sie müssen niemanden selbst suchen. Demontage, Rückbau, Trockenbau und alle Ausbauarbeiten machen wir selbst.",
  },
  {
    question: "Was ist mit Asbest oder alter Dämmwolle?",
    answer:
      "Schadstoffsanierung ist nicht Teil unserer Leistung. Bei Verdacht - vor allem bei Gebäuden vor 1993 - stoppen wir die Arbeit und holen einen zertifizierten Fachbetrieb dazu. Das steht so auch in jedem unserer Angebote, damit es hinterher keine Diskussion gibt.",
  },
  {
    question: "Was passiert mit dem Hausrat?",
    answer:
      "Brauchbares geben wir weiter oder führen es der Wiederverwertung zu, der Rest wird getrennt nach Fraktionen entsorgt - Holz, Metall, Elektro, Bauschutt und Restmüll. Auf Wunsch bekommen Sie einen Entsorgungsnachweis über die Fraktionen.",
  },
  {
    question: "Arbeiten Sie auch als Nachunternehmer?",
    answer:
      "Ja. Für Bauunternehmen, Generalunternehmer und Zimmereien übernehmen wir Trockenbau und Rückbau nach m²-Preis oder Tagessatz, Material bauseits möglich. Wir sind haftpflichtversichert; die Freistellungsbescheinigung nach § 48b EStG legen wir auf Anfrage vor.",
  },
  {
    question: "In welchem Gebiet sind Sie unterwegs?",
    answer:
      "Schwerpunkt ist Emden mit rund 50 km Umkreis - Aurich, Leer, Norden, Krummhörn, Moormerland und die Orte dazwischen. Größere Projekte fahren wir auf Anfrage auch weiter.",
  },
];

/**
 * Seitenspezifische Fragen. Sie stehen sichtbar auf der jeweiligen
 * Leistungsseite und erzeugen dort ein eigenes FAQ-Rich-Result.
 */
export const serviceFaq: Record<string, FaqItem[]> = {
  "/entruempelung-haushaltsaufloesung/": [
    {
      question: "Wie läuft eine Entrümpelung konkret ab?",
      answer:
        "Sie rufen an oder schicken Fotos per WhatsApp. Wir kommen zur kostenlosen Besichtigung, meist innerhalb von zwei Werktagen, und nennen danach einen schriftlichen Festpreis. Am Ausführungstag räumen wir das Objekt, trennen die Abfälle sortenrein und übergeben besenrein.",
    },
    {
      question: "Was passiert mit Farben, Batterien oder Elektrogeräten?",
      answer:
        "Diese Abfälle müssen gesondert entsorgt werden und sind deshalb nicht im normalen Volumenpreis enthalten. Wir sagen Ihnen vor der Ausführung, was zusammenkommt, und rechnen die tatsächlichen Entsorgungskosten zuzüglich Handlingpauschale ab - keine Überraschung auf der Schlussrechnung.",
    },
    {
      question: "Räumen Sie auch Messie-Wohnungen?",
      answer:
        "Ja, mit der nötigen Ruhe und ohne Kommentar. Solche Objekte brauchen mehr Zeit, Schutzausrüstung und manchmal eine Vorabreinigung. Das kalkulieren wir bei der Besichtigung ein und sagen Ihnen vorher, was auf Sie zukommt.",
    },
    {
      question: "Bekomme ich einen Entsorgungsnachweis?",
      answer:
        "Auf Wunsch ja. Für Hausverwaltungen und Nachlassabwicklungen ist das oft nötig. Wir dokumentieren die Fraktionen und legen die Belege der Entsorgungsstellen bei.",
    },
  ],
  "/entkernung-rueckbau/": [
    {
      question: "Was bedeutet nicht-tragender Rückbau?",
      answer:
        "Wir entfernen alles, was nicht zur Tragstruktur des Gebäudes gehört: Bodenbeläge, Trennwände in Leichtbauweise, abgehängte Decken, Einbauten, Sanitärobjekte und Paneele. Tragende Wände, Decken und Stützen fassen wir nicht an - dafür braucht es Statik und einen entsprechenden Fachbetrieb.",
    },
    {
      question: "Warum trennen Sie den Bauschutt vor Ort?",
      answer:
        "Ein Mischcontainer ist deutlich teurer als sortenreine Fraktionen. Holz, Metall, Bauschutt und Restmüll getrennt zu sammeln kostet uns etwas Zeit und spart Ihnen bares Geld bei der Entsorgung. Der Vorteil steht direkt im Angebot.",
    },
    {
      question: "Was passiert bei Asbestverdacht?",
      answer:
        "Wir stoppen den betroffenen Bereich sofort. Bei Gebäuden vor 1993 sind Asbest, KMF oder PAK-Kleber möglich. Die Beprobung und Sanierung übernimmt ein zertifizierter Fachbetrieb - das ist gesetzlich vorgeschrieben und steht so in jedem unserer Angebote.",
    },
  ],
  "/trockenbau-innenausbau/": [
    {
      question: "Welche Spachtelqualität brauche ich?",
      answer:
        "Q1 reicht für Flächen, die verkleidet werden. Q2 ist der Standard für Raufaser und Strukturtapeten. Q3 brauchen Sie für glatte Anstriche und Vliestapeten. Q4 - also die spiegelglatte Fläche für Streiflicht und Glanzlacke - bieten wir nicht an. Wir sagen Ihnen im Angebot, welche Stufe zu Ihrer geplanten Oberfläche passt.",
    },
    {
      question: "Wie wird Trockenbau abgerechnet?",
      answer:
        "Für Privatkunden nach Festpreis auf Basis des Aufmaßes. Für Bauunternehmen nach m²-Preis oder Tagessatz, Material auf Wunsch bauseits. Beide Varianten enthalten Profile, Platten, Dämmung und Spachtelung im vereinbarten Umfang.",
    },
    {
      question: "Machen Sie auch Schallschutz und Brandschutz?",
      answer:
        "Schallschutzlösungen mit entsprechendem Aufbau und Dämmung ja. Geprüfte Brandschutzkonstruktionen mit Verwendbarkeitsnachweis führen wir nicht als eigene Leistung aus - dafür ist ein Betrieb mit passendem Nachweis zuständig.",
    },
  ],
  "/haushaltsaufloesung/": [
    {
      question: "Wie diskret läuft eine Nachlassauflösung ab?",
      answer:
        "Unauffällige Fahrzeuge, keine Beschriftung am Container, keine Gespräche im Treppenhaus. Persönliche Dokumente, Fotos und Erinnerungsstücke legen wir zur Seite und übergeben sie Ihnen - sie landen nie im Container.",
    },
    {
      question: "Ich wohne weit weg. Geht das trotzdem?",
      answer:
        "Ja, das ist bei uns eher die Regel als die Ausnahme. Wir arbeiten nach Schlüsselübergabe, stimmen vorher per Telefon und Fotos ab, was bleibt, und dokumentieren das Ergebnis. Sie müssen für den Termin nicht anreisen.",
    },
    {
      question: "Was ist mit Unterlagen und Wertsachen?",
      answer:
        "Alles, was nach Dokument, Schmuck, Bargeld oder Erinnerungsstück aussieht, wird gesammelt und Ihnen übergeben. Das ist Teil des Auftrags und kostet nicht extra.",
    },
  ],
  "/wohnungsraeumung/": [
    {
      question: "Was heißt besenrein genau?",
      answer:
        "Die Wohnung ist vollständig leer, grob gefegt und übergabefähig. Feuchtreinigung, Fensterputz oder Renovierung sind nicht enthalten, lassen sich aber dazubuchen. Was genau vereinbart ist, steht im Angebot - damit es bei der Abnahme keine Diskussion gibt.",
    },
    {
      question: "Wie schnell geht eine Räumung bei Mieterwechsel?",
      answer:
        "Eine durchschnittliche Wohnung räumen wir an einem Tag. Bei festen Übergabeterminen planen wir rückwärts vom Termin - sagen Sie die Frist gleich beim ersten Anruf, dann halten wir den Slot frei.",
    },
    {
      question: "Bekomme ich eine Fotodokumentation?",
      answer:
        "Ja, auf Wunsch vor, während und nach der Räumung. Für Hausverwaltungen und Eigentümer ist das die einfachste Grundlage für die Abnahme und gegenüber dem Vormieter.",
    },
  ],
  "/montage-boden/": [
    {
      question: "Muss der Untergrund vorbereitet werden?",
      answer:
        "Meistens ja. Alte Beläge müssen runter, der Estrich muss trocken und eben sein. Kleinere Unebenheiten gleichen wir mit Ausgleichsmasse aus. Ob das nötig ist, sehen wir beim Aufmaß und schreiben es ins Angebot.",
    },
    {
      question: "Verlegen Sie auch Material, das ich selbst gekauft habe?",
      answer:
        "Ja. Sagen Sie uns Hersteller, Typ und Menge, dann prüfen wir vorab, ob Verschnitt und Zubehör reichen. Für Material- und Produktmängel haften wir in dem Fall nicht - für die Verlegung schon.",
    },
    {
      question: "Können Türen und Boden zusammen gemacht werden?",
      answer:
        "Das ist sogar der bessere Weg. Zargen und Türblätter werden auf die spätere Bodenhöhe abgestimmt, sonst schleift die Tür oder es bleibt eine Fuge. Wir planen beides in einem Aufmaß.",
    },
  ],
  "/moebel-kuechenmontage/": [
    {
      question: "Schließen Sie die Küchengeräte an?",
      answer:
        "Nein. Elektro-, Gas- und Wasseranschlüsse gehören zu zugelassenen Fachbetrieben - das ist keine Formalie, sondern Vorschrift. Wir bauen die Küche auf, richten sie aus, montieren Fronten und Arbeitsplatte und koordinieren auf Wunsch den Anschlusstermin.",
    },
    {
      question: "Bauen Sie auch alte Möbel ab?",
      answer:
        "Ja, Demontage und Entsorgung übernehmen wir gleich mit. In Kombination mit einer Entrümpelung oder einem Umzug ist das meist deutlich günstiger als zwei getrennte Aufträge.",
    },
  ],
  "/umzuege-transporte/": [
    {
      question: "Bis zu welcher Größe machen Sie Umzüge?",
      answer:
        "Bis 3,5 t Fahrzeuggröße - also Wohnungen, kleinere Häuser, Büros und Objektfahrten. Für Fernumzüge mit großem LKW sind wir der falsche Ansprechpartner und sagen das auch gleich.",
    },
    {
      question: "Kann ich Umzug und Entrümpelung kombinieren?",
      answer:
        "Genau dafür ist der Ablauf gedacht: Was mitkommt, wird transportiert, der Rest direkt entsorgt. Ein Team, ein Termin, eine Rechnung - das spart gegenüber zwei getrennten Aufträgen spürbar.",
    },
  ],
  "/hausmeisterservice/": [
    {
      question: "Gibt es feste Konditionen im Rahmenvertrag?",
      answer:
        "Ja. Für wiederkehrende Leistungen vereinbaren wir Stundensätze, Reaktionszeiten und den Leistungsumfang schriftlich. Damit ist die Kostenseite für Verwaltungen planbar und muss nicht jedes Mal neu verhandelt werden.",
    },
    {
      question: "Welche Reparaturen übernehmen Sie?",
      answer:
        "Alles im handwerklichen Kleinbereich: Türen, Schlösser, Beschläge, Silikonfugen, Befestigungen, kleine Trockenbauschäden. Nicht dabei sind Arbeiten an Strom, Gas, Wasser und Heizung - die übernehmen zugelassene Fachbetriebe.",
    },
  ],
  "/winterdienst-aussenanlagen/": [
    {
      question: "Erfüllt der Winterdienst meine Räum- und Streupflicht?",
      answer:
        "Ja, das ist der Zweck der Vereinbarung. Wir legen die zu räumenden Flächen, die Einsatzzeiten und die Streumittel schriftlich fest. Die Verkehrssicherungspflicht geht damit im vereinbarten Umfang auf uns über - was genau abgedeckt ist, steht im Vertrag.",
    },
    {
      question: "Ab wann wird geräumt?",
      answer:
        "Werktags in der Regel bis 7 Uhr, sonn- und feiertags bis 9 Uhr, danach nach Bedarf. Bei anhaltendem Schneefall wird nachgeräumt. Die konkreten Zeiten halten wir in der Vereinbarung fest.",
    },
  ],
  "/kernsanierung-vorbereiten/": [
    {
      question: "Übernehmen Sie die komplette Kernsanierung?",
      answer:
        "Nein, und das sagen wir bewusst deutlich. Wir übernehmen die Vorbereitung: Räumen, nicht-tragenden Rückbau, Trockenbau, Boden und Montage. Strom, Wasser, Heizung, Statik, Fenster und Schadstoffe liegen bei zugelassenen Fachbetrieben, die wir für Sie koordinieren.",
    },
    {
      question: "In welcher Reihenfolge läuft so ein Projekt?",
      answer:
        "Räumen, Rückbau, dann kommen die Fachbetriebe für Leitungen, danach Trockenbau, Boden und Montage. Wir planen die Übergabepunkte mit, damit niemand auf den anderen wartet oder doppelt anrücken muss.",
    },
  ],
  "/entkernung-trockenbau/": [
    {
      question: "Was bringt es, Rückbau und Trockenbau zusammen zu vergeben?",
      answer:
        "Es entfällt die teuerste Schnittstelle im Ausbau: die Übergabe zwischen zwei Firmen. Kein Wartetag zwischen den Gewerken, keine Diskussion darüber, wer welchen Schaden verursacht hat, eine Baustelleneinrichtung statt zwei und ein Ansprechpartner für den Gesamttermin.",
    },
    {
      question: "Bekomme ich ein Angebot oder zwei?",
      answer:
        "Ein Angebot mit getrennt ausgewiesenen Positionen für Rückbau und Ausbau. So sehen Sie, was welcher Teil kostet, und können einzelne Positionen streichen, ohne dass der Rest neu kalkuliert werden muss.",
    },
  ],
};
