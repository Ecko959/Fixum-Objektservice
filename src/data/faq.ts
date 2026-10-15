import { preise, steuerHinweis } from "./preise";
import { site } from "./site";

export interface FaqItem {
  question: string;
  answer: string;
}

/** Allgemeine Fragen - werden auf der Startseite ausgespielt. */
export const faq: FaqItem[] = [
  {
    question: "Was kostet eine Entrümpelung in Emden?",
    answer: `Als Richtwert ${preise.entruempelung.betrag} bei leicht möblierten Räumen im Erdgeschoss, üblich sind 20–40 €/m² - je nach Füllgrad, Etage und Entsorgung. Verbindlich ist der Festpreis nach der kostenlosen Besichtigung, und der gilt schriftlich. ${steuerHinweis}`,
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
      "Ja. Für Bauunternehmen, Generalunternehmer und Zimmereien übernehmen wir Trockenbau und Rückbau nach m²-Preis oder Tagessatz, Material bauseits möglich. Wir sind haftpflichtversichert. Die Freistellungsbescheinigung nach § 48b EStG ist beantragt - den aktuellen Stand nennen wir offen, wenn Sie danach fragen.",
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
  "/entruempelung/": [
    {
      question: "Was kostet eine Entrümpelung in Emden?",
      answer: `Als Richtwert ${preise.entruempelung.betrag} bei leicht möblierten Räumen im Erdgeschoss. Üblich sind 20–40 €/m², je nach Füllgrad, Etage und Entsorgung. Verbindlich ist der Festpreis nach der kostenlosen Besichtigung. ${steuerHinweis}`,
    },
    {
      question: "Wie läuft eine Entrümpelung konkret ab?",
      answer:
        "Sie rufen an oder schicken Fotos per WhatsApp. Wir kommen zur kostenlosen Besichtigung, meist innerhalb von zwei Werktagen, und nennen danach einen schriftlichen Festpreis. Am Ausführungstag räumen wir das Objekt, trennen die Abfälle sortenrein und übergeben besenrein.",
    },
    {
      question: "Was passiert mit Farben, Batterien oder Elektrogeräten?",
      answer:
        "Diese Abfälle müssen gesondert entsorgt werden. Wir erfassen sie bei der Besichtigung und weisen sie als eigene Position im Festpreis aus - Sie sehen also, was dieser Teil kostet, und der Preis gilt. Taucht bei der Räumung Sonderabfall auf, der vorher nicht sichtbar war, sagen wir Ihnen das vor der Entsorgung und stimmen das weitere Vorgehen mit Ihnen ab.",
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
    {
      question: "Muss ich bei der Entrümpelung dabei sein?",
      answer:
        "Nein. Wir arbeiten nach Schlüsselübergabe und dokumentieren das Ergebnis auf Wunsch mit Fotos. Was Sie behalten möchten, legen wir vorher gemeinsam fest - am Telefon, per Fotos oder bei der Besichtigung.",
    },
    {
      question: "Entrümpeln Sie ein ganzes Haus oder auch nur einzelne Räume?",
      answer:
        "Beides. Wir räumen komplette Häuser und Wohnungen genauso wie einzelne Keller, Dachböden oder Garagen - in Emden und im Umkreis von rund 50 km, also auch in Aurich, Leer und Norden.",
    },
  ],
  "/entkernung/": [
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
    {
      question: "Was kostet eine Entkernung?",
      answer:
        "Dafür gibt es bei uns einen Festpreis nach Besichtigung. Fläche, Bauteile, Bodenaufbau und Entsorgungsmengen unterscheiden sich von Objekt zu Objekt zu stark für einen pauschalen Richtwert. Die Besichtigung ist kostenlos, Rückbau und Entsorgung stehen im Angebot als eigene Positionen.",
    },
    {
      question: "Übernehmen Sie nach der Entkernung auch den Innenausbau?",
      answer:
        "Ja. Trockenbau, Boden, Türen und Montage machen wir selbst - direkt im Anschluss und ohne Übergabe an eine zweite Firma. Wenn Sie nur den Rückbau brauchen, ist das genauso in Ordnung.",
    },
    {
      question: "Trennen Sie auch Strom- und Wasserleitungen?",
      answer:
        "Nein. Anschlüsse an Strom, Wasser und Heizung trennt ein zugelassener Fachbetrieb, bevor wir zurückbauen. Den Termin stimmen wir auf Wunsch für Sie ab, damit Sie niemanden selbst suchen müssen.",
    },
  ],
  "/trockenbau/": [
    {
      question: "Was kostet eine Trockenbauwand?",
      answer: `Als Richtwert ${preise.trockenbau.betrag}, ${preise.trockenbau.bedingung.replace(/\.$/, "")}. Verbindlich ist der Festpreis nach Besichtigung und Aufmaß. ${steuerHinweis}`,
    },
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
    {
      question: "Bringen Sie das Material mit?",
      answer:
        "Auf Wunsch komplett: Profile, Platten, Dämmung und Spachtel. Bauseits gestelltes Material verarbeiten wir genauso - das steht dann so im Angebot.",
    },
    {
      question: "Können die alten Wände vorher auch raus?",
      answer:
        "Ja. Nicht-tragende Wände, alte Verkleidungen und Böden bauen wir selbst zurück und trennen das Material sortenrein. Danach geht der Trockenbau ohne Wartetag weiter - dasselbe Team, ein Angebot.",
    },
    {
      question: "Verlegen Sie auch die Leitungen in der neuen Wand?",
      answer:
        "Nein. Wir bauen die Wand so, dass Platz für Leitungen und Dosen bleibt. Elektro- und Sanitärleitungen legt ein zugelassener Fachbetrieb, dessen Termin wir auf Wunsch mit abstimmen.",
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
    {
      question: "Was kostet eine Haushaltsauflösung in Emden?",
      answer: `Sie wird wie eine Entrümpelung kalkuliert: als Richtwert ${preise.entruempelung.betrag} bei leicht möblierten Räumen im Erdgeschoss, üblich sind 20–40 €/m² je nach Füllgrad, Etage und Entsorgung. Verbindlich ist der Festpreis nach der kostenlosen Besichtigung. ${steuerHinweis}`,
    },
    {
      question: "Bekommt die Erbengemeinschaft einen Nachweis?",
      answer:
        "Auf Wunsch ja: Festpreis in Textform, Fotodokumentation und Entsorgungsbelege über die Fraktionen. Damit ist für alle Beteiligten nachvollziehbar, was gemacht wurde.",
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
  "/bodenverlegung/": [
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
    {
      question: "Welche Bodenbeläge verlegen Sie?",
      answer:
        "Laminat, Vinyl, Klick-Systeme und Teppich. Parkett verkleben, schleifen oder versiegeln gehört nicht zu unseren Leistungen.",
    },
    {
      question: "Was kostet die Bodenverlegung?",
      answer:
        "Festpreis nach Besichtigung. Fläche, Belag und Zustand des Untergrunds bestimmen den Aufwand, Vorarbeiten wie Ausgleichsmasse stehen als eigene Position im Angebot. Die Besichtigung ist kostenlos.",
    },
  ],
  "/kuechenmontage/": [
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
    {
      question: "Bauen Sie auch Möbel aus dem Möbelhaus auf?",
      answer:
        "Ja, Möbel aller gängigen Hersteller nach Aufbauanleitung - inklusive sicherer Wandbefestigung mit passender Dübeltechnik.",
    },
    {
      question: "Passen Sie die Arbeitsplatte an?",
      answer:
        "Ja. Arbeitsplatten werden zugeschnitten, eingepasst und abgedichtet, Fronten, Griffe und Auszüge eingestellt.",
    },
    {
      question: "Was kostet eine Küchenmontage?",
      answer:
        "Festpreis nach Besichtigung. Oft lässt sich der Aufwand schon aus dem Planungsplan oder der Bestellliste einschätzen. Umfang, Wandbeschaffenheit und Anschlusssituation bestimmen den Preis.",
    },
  ],
  "/umzug/": [
    {
      question: "Was kostet ein Umzug in Emden?",
      answer: `Als Richtwert: Eine 2-Zimmer-Wohnung im Nahbereich, etwa von Emden nach Norden, ${preise.umzug.betrag} mit Transporter bis ${site.maxTonnage}, Tragen und Fahrt. Montage, Etagen ohne Aufzug und größere Haushalte kalkulieren wir nach Besichtigung oder Fotos. Sie bekommen einen Festpreis für Team, Fahrzeug und Fahrten, keinen Stundensatz mit offenem Ende. ${steuerHinweis}`,
    },
    {
      question: "Ziehen Sie auch von Emden aus über weitere Strecken um?",
      answer:
        "Ja, innerhalb Ostfrieslands. Die Anfahrt wird im Angebot gesondert ausgewiesen, damit Sie sehen, was der Weg kostet.",
    },

    {
      question: "Bis zu welcher Größe machen Sie Umzüge?",
      answer: `Bis ${site.maxTonnage} Fahrzeuggröße - also Wohnungen, kleinere Häuser, Büros und Objektfahrten. Für Fernumzüge mit großem LKW sind wir der falsche Ansprechpartner und sagen das auch gleich.`,
    },
    {
      question: "Kann ich Umzug und Entrümpelung kombinieren?",
      answer:
        "Genau dafür ist der Ablauf gedacht: Was mitkommt, wird transportiert, der Rest direkt entsorgt. Ein Team, ein Termin, eine Rechnung - das spart gegenüber zwei getrennten Aufträgen spürbar.",
    },
    {
      question: "Bauen Sie Möbel ab und wieder auf?",
      answer:
        "Ja, nach Absprache. Schränke, Betten und Regale werden demontiert, transportiert und am Ziel wieder aufgebaut. Den Aufwand dafür nehmen wir in den Festpreis auf.",
    },
    {
      question: "Wie schützen Sie Treppenhaus und Wohnung?",
      answer:
        "Treppenhaus, Türzargen und Böden werden vor dem Tragen abgesichert. Das gehört bei uns zum Umzug dazu und steht nicht als Extra im Angebot.",
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
    {
      question: "Geht das auch einmalig ohne Vertrag?",
      answer:
        "Ja. Einzelne Arbeiten erledigen wir auf Abruf. Der Rahmenvertrag lohnt sich, wenn regelmäßig etwas anfällt.",
    },
    {
      question: "Übernehmen Sie auch den Winterdienst?",
      answer:
        "Ja, nach schriftlicher Vereinbarung mit festgelegten Flächen, Einsatzzeiten und Streumitteln - auf Wunsch zusammen mit der laufenden Betreuung.",
    },
    {
      question: "Was kostet der Hausmeisterservice?",
      answer:
        "Festpreis nach Besichtigung: Wir gehen das Objekt einmal durch und halten Umfang, Turnus und Konditionen schriftlich fest. Für wiederkehrende Leistungen stehen die Konditionen im Rahmenvertrag.",
    },
  ],
  "/winterdienst/": [
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
    {
      question: "Stellen Sie das Streumittel?",
      answer:
        "Ja, die vereinbarten Streumittel stellen und lagern wir. Welche das sind, steht in der Vereinbarung.",
    },
    {
      question: "Bekomme ich einen Nachweis über die Einsätze?",
      answer:
        "Auf Wunsch dokumentieren wir die Einsätze. Das ist im Schadensfall die Grundlage, um zu zeigen, dass geräumt und gestreut wurde.",
    },
    {
      question: "Was kostet der Winterdienst?",
      answer:
        "Festpreis nach Besichtigung: Flächen, Einsatzzeiten und Streumittel werden vor Ort aufgenommen und schriftlich vereinbart.",
    },
  ],
  "/kernsanierung/": [
    {
      question: "Was kostet die Vorbereitung einer Kernsanierung in Emden?",
      answer:
        "Bei ganzen Objekten hängt das so stark an Baujahr, Zustand und Umfang, dass eine Zahl ohne Besichtigung nichts wert wäre. Wir kommen vorbei, nehmen den Bestand auf und schicken ein Angebot, in dem Räumung, Rückbau und Ausbau als getrennte Positionen stehen - so sehen Sie, welcher Schritt was kostet.",
    },
    {
      question: "Brauche ich wirklich eine Kernsanierung?",
      answer:
        "Nicht immer. Wenn Leitungen, Statik und Gebäudehülle in Ordnung sind und es nur um Böden, Wände und Türen geht, reicht eine Renovierung - das ist deutlich schneller und günstiger. Was Ihr Objekt braucht, sagen wir bei der Besichtigung ehrlich, auch wenn die Antwort gegen den größeren Auftrag spricht.",
    },

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
  "/renovierung/": [
    {
      question: "Was kostet eine Renovierung in Emden?",
      answer:
        "Das hängt an Fläche, Zustand und Umfang - eine Wohnung mit neuem Boden und hergerichteten Wänden liegt in einer anderen Größenordnung als ein einzelner Raum. Deshalb nennen wir keinen Quadratmeterpreis ins Blaue, sondern kommen vorbei, sehen uns Untergrund und Wände an und schicken danach einen Festpreis. Die Besichtigung ist kostenlos.",
    },
    {
      question: "Worin unterscheidet sich Renovierung von Kernsanierung?",
      answer:
        "Bei der Renovierung bleibt der Raum, wie er ist, und wird aufgefrischt: Boden, Wandflächen, Türen, kleinere Trockenbauarbeiten. Bei der Kernsanierung wird alles bis auf den Rohbau zurückgebaut, inklusive Leitungen. Wenn Sie unsicher sind, was Ihr Objekt braucht, sagen wir es Ihnen bei der Besichtigung - auch wenn weniger reicht als gedacht.",
    },
    {
      question: "Renovieren Sie auch nur einzelne Räume?",
      answer:
        "Ja. Ein Zimmer mit neuem Boden und frisch gespachtelten Wänden ist ein normaler Auftrag. Der Aufwand pro Quadratmeter ist bei kleinen Flächen etwas höher, weil An- und Abfahrt sowie Baustelleneinrichtung gleich bleiben - das steht aber vorher im Angebot.",
    },
    {
      question: "Streichen Sie auch?",
      answer:
        "Wir bereiten Wände und Decken so vor, dass gestrichen werden kann - spachteln, schleifen, Q1 bis Q3. Den Anstrich selbst führen wir nicht aus. Wenn Sie das aus einer Hand möchten, stimmen wir den Termin mit einem Malerbetrieb ab, sodass die Flächen zur richtigen Zeit fertig sind.",
    },
    {
      question: "Wie lange dauert die Renovierung einer Wohnung?",
      answer:
        "Eine durchschnittliche Wohnung mit Boden, Wandvorbereitung und Türen schaffen wir in wenigen Tagen. Den genauen Zeitraum nennen wir im Angebot - und der zugesagte Termin gilt.",
    },
  ],
  "/rueckbau-trockenbau/": [
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
