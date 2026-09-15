/**
 * Leistung × Ort: die Seiten unter /trockenbau/aurich/ und ihre 19 Geschwister.
 *
 * Vier Leistungen für fünf Orte. Bewusst nicht 13 × 15: Seiten, die sich nur
 * im Ortsnamen unterscheiden, wertet Google als Doorway-Pages, und zwar im
 * Zweifel zulasten der ganzen Domain. Jeder Eintrag hier beschreibt etwas,
 * das in diesem Ort tatsächlich anders ist als anderswo - Bausubstanz,
 * Zufahrt, Zuständigkeit für die Entsorgung, typischer Anlass. Wo das nicht
 * gelingt, gehört die Kombination nicht in diese Datei.
 *
 * Was hier nicht stehen darf: Preise, Projektzahlen, Referenzen oder
 * Bewertungen, die nicht belegt sind. Siehe CONTENT.md.
 */
import type { Faq } from "./staedte";
import { findeStadt } from "./staedte";

export type LeistungsSchluessel =
  | "entruempelung"
  | "entkernung"
  | "trockenbau"
  | "umzug";

export type Leistung = {
  label: string;
  hauptseite: string;
  serviceType: string;
  bild: string;
  badges: string[];
  /** Muster für den Seitentitel. {ort} wird ersetzt. */
  titel: string;
};

export const leistungen: Record<LeistungsSchluessel, Leistung> = {
  entruempelung: {
    label: "Entrümpelung",
    hauptseite: "/entruempelung/",
    serviceType: "Entrümpelung und Haushaltsauflösung",
    bild: "/images/categories/haushaltsaufloesung.png",
    badges: ["Besichtigung kostenlos", "Festpreis schriftlich", "Besenrein"],
    titel: "Entrümpelung {ort} zum Festpreis | Fixum Objektservice",
  },
  entkernung: {
    label: "Entkernung",
    hauptseite: "/entkernung/",
    serviceType: "Entkernung und nicht-tragender Rückbau",
    bild: "/images/categories/entkernung-rueckbau.png",
    badges: ["Sortenrein getrennt", "Klare Leistungsgrenze", "Ohne Statik"],
    titel: "Entkernung & Rückbau {ort} | Fixum Objektservice",
  },
  trockenbau: {
    label: "Trockenbau",
    hauptseite: "/trockenbau/",
    serviceType: "Trockenbau und Innenausbau",
    bild: "/images/categories/trockenbau-innenausbau.png",
    badges: ["Spachtelung Q1-Q3", "Festpreis nach Aufmaß", "Auch als Sub"],
    titel: "Trockenbau {ort}: Wände, Decken, Dachausbau | Fixum",
  },
  umzug: {
    label: "Umzug",
    hauptseite: "/umzug/",
    serviceType: "Umzüge und Transporte",
    bild: "/images/categories/umzuege-transporte.png",
    badges: ["Fester Termin", "Möbelmontage", "Ein Ansprechpartner"],
    titel: "Umzug {ort} - Termin steht schriftlich | Fixum",
  },
};

export type LeistungsStadtInhalt = {
  /** Meta-Beschreibung, 120 bis 160 Zeichen. Von Hand geschrieben und nicht
      aus dem Intro abgeleitet: Abgeleitete Beschreibungen wiederholen die
      Überschrift und brechen mitten im Satz ab. */
  meta: string;
  /** Hero-Text, zwei bis drei Sätze. */
  intro: string;
  /** Was an diesem Ort baulich oder organisatorisch typisch ist. */
  lage: string;
  /** Konkrete Arbeiten, die hier regelmäßig anfallen. */
  punkte: string[];
  /** Anfahrt, Entsorgungsweg, Terminlage - das Örtliche am Ablauf. */
  ablauf: string;
  faq: Faq[];
};

type Karte = Partial<Record<LeistungsSchluessel, LeistungsStadtInhalt>>;

const inhalte: Record<string, Karte> = {
  /* ------------------------------------------------------------------ */
  aurich: {
    entruempelung: {
      meta:
        "Entrümpelung in Aurich und den Ortsteilen: Wohnung, Haus, Keller, Dachboden, Garage. Kostenlose Besichtigung, Festpreis in Textform, besenreine Übergabe.",
      intro:
        "Eine Entrümpelung in Aurich beginnt mit einer kostenlosen Besichtigung, meist innerhalb von zwei Werktagen. Danach steht ein Festpreis in Textform - auch dann, wenn Keller und Dachboden voller sind als beim Telefonat gedacht.",
      lage:
        "Aurich zerfällt für uns in zwei Arten von Aufträgen. In der Kernstadt sind es überwiegend Wohnungen in Mehrfamilienhäusern: Treppenhaus schützen, Tragewege abdecken, Nachbarn vorher informieren. In Sandhorst, Walle, Wallinghausen oder Extum stehen dagegen Einfamilienhäuser aus den sechziger bis achtziger Jahren, und dort gehört fast immer mehr dazu als die Wohnfläche - Garage, Schuppen, Gartenhaus, oft ein Dachboden, der drei Jahrzehnte lang nie ausgeräumt wurde.",
      punkte: [
        "Komplette Haushaltsauflösung inklusive Nebengebäuden, Garage und Dachboden",
        "Einzelne Wohnungen im Mehrfamilienhaus mit Schutz von Treppenhaus und Aufzug",
        "Trennung nach Holz, Metall, Elektroaltgeräten und Restabfall direkt am Objekt",
        "Demontage von Einbauküchen, Einbauschränken und Bodenbelägen auf Wunsch",
        "Besenreine Übergabe, auf Wunsch mit Fotodokumentation für Angehörige",
      ],
      ablauf:
        "Aurich liegt rund 26 km von unserem Standort entfernt, die Anfahrt steht als eigene Position im Angebot. Für die Entsorgung ist die Abfallwirtschaft des Landkreises Aurich zuständig, nicht der Betrieb der Stadt Emden - das betrifft Sie vor allem dann, wenn Sie Teile selbst wegbringen wollen. Die kommunale Sperrmüllabholung ist für einzelne Möbelstücke gedacht und trägt einen ganzen Haushalt nicht.",
      faq: [
        {
          frage: "Muss ich bei der Entrümpelung in Aurich anwesend sein?",
          antwort:
            "Nein. Bei der Besichtigung legen wir gemeinsam fest, was bleibt und was mitgeht, am besten mit Klebepunkten oder einer Liste. Danach arbeiten wir mit Schlüsselübergabe und schicken Fotos vom Ergebnis. Für Angehörige, die nicht in Ostfriesland wohnen, ist das meist der entscheidende Punkt.",
        },
        {
          frage: "Wie schnell bekomme ich in Aurich einen Termin?",
          antwort:
            "Die Besichtigung schaffen wir meist innerhalb von zwei Werktagen. Für die Ausführung planen Sie je nach Umfang ein bis zwei Wochen Vorlauf ein. Wenn eine Übergabefrist feststeht, sagen Sie es bitte gleich beim ersten Anruf - dann richten wir die Planung danach aus.",
        },
        {
          frage: "Was passiert mit Sachen, die noch brauchbar sind?",
          antwort:
            "Verwertbares geben wir weiter oder führen es der Wiederverwertung zu, statt es in den Container zu werfen. Was das für Ihren Preis bedeutet, sehen wir bei der Besichtigung und schreiben es ins Angebot. Pauschale Zusagen dazu machen wir am Telefon nicht.",
        },
      ],
    },
    entkernung: {
      meta:
        "Entkernung und nicht-tragender Rückbau in Aurich: Böden, Einbauten, Trennwände raus, sortenrein getrennt. Klare Leistungsgrenze, Statik bleibt unangetastet.",
      intro:
        "Entkernung in Aurich heißt bei uns: alles Nicht-Tragende raus, die Statik bleibt unangetastet. Wir entfernen Böden, Einbauten, Vorsatzschalen und nicht-tragende Wände und übergeben eine Fläche, auf der der Ausbau sofort weiterlaufen kann.",
      lage:
        "Der typische Auftrag in Aurich ist ein Haus aus den sechziger bis achtziger Jahren, das den Eigentümer wechselt. Darin steckt meist dieselbe Schichtung: Teppich auf Estrich, darunter eine Ausgleichsschicht, Holzpaneele an Decken und Wänden, Einbauschränke aus der Bauzeit, ein Bad mit Fliesen bis zur Decke. Bei Gebäuden aus dieser Zeit ist außerdem der Blick auf Schadstoffe Pflicht, nicht Kür.",
      punkte: [
        "Nicht-tragende Trennwände, Vorsatzschalen und Einbauten entfernen",
        "Bodenbeläge, Estrichaufbauten, Paneele und Deckenverkleidungen zurückbauen",
        "Sanitärobjekte und Einbauküchen demontieren, ohne Anschlüsse zu trennen",
        "Staubschutz stellen, Fluchtwege und angrenzende Bereiche abdecken",
        "Material nach Fraktionen getrennt sammeln und abfahren",
      ],
      ablauf:
        "Bei Gebäuden mit Baujahr vor 1993 stoppen wir den betroffenen Bereich sofort, wenn sich ein Verdacht auf Asbest, künstliche Mineralfasern oder PAK-haltige Kleber ergibt. Die Sanierung übernimmt dann ein zugelassener Fachbetrieb, nicht wir. Das steht so in jedem Angebot, damit es auf der Baustelle keine Diskussion gibt. Tragende Bauteile, Elektro, Sanitär und Heizung gehören ebenfalls in andere Hände.",
      faq: [
        {
          frage: "Können Sie in Aurich Rückbau und Ausbau zusammen machen?",
          antwort:
            "Ja, und das ist der eigentliche Vorteil. Trockenbau, Boden und Montage schließen ohne Wartetag an den Rückbau an, weil dasselbe Team weiterarbeitet. Leitungsarbeiten koordinieren wir mit zugelassenen Fachbetrieben, führen sie aber nicht selbst aus.",
        },
        {
          frage: "Woran erkenne ich, ob eine Wand tragend ist?",
          antwort:
            "Sicher nur am Grundriss oder durch einen Statiker. Bei der Besichtigung ordnen wir Wandaufbauten, Leitungsverläufe und Deckenauflager ein und sagen Ihnen, was ohne Freigabe nicht geht. Wo Zweifel bleiben, bleibt die Wand stehen, bis die Freigabe vorliegt.",
        },
        {
          frage: "Wie viel Schmutz entsteht im bewohnten Haus?",
          antwort:
            "Mehr als die meisten erwarten, deshalb gehört Staubschutz bei uns zum Angebot und nicht zu den Extras. Wir schotten den Arbeitsbereich ab, decken Tragewege ab und halten Fluchtwege frei. In bewohnten Objekten stimmen wir die Arbeitszeiten vorher ab.",
        },
      ],
    },
    trockenbau: {
      meta:
        "Trockenbau in Aurich: Ständerwände, Vorsatzschalen, abgehängte Decken, Dachausbau. Spachtelung Q1 bis Q3, privat zum Festpreis, gewerblich als Sub.",
      intro:
        "Trockenbau in Aurich für private Modernisierer und als Nachunternehmer für Betriebe im Landkreis: Ständerwände, Vorsatzschalen, abgehängte Decken und Dachschrägen, gespachtelt bis Q3.",
      lage:
        "Die Siedlungshäuser in den Auricher Ortsteilen haben fast alle dasselbe ungenutzte Potenzial unter dem Dach: eine Kehlbalkenlage, in der bisher Kartons stehen. Daraus werden Kinder- oder Arbeitszimmer, und dafür braucht es Dachschrägen, Drempel und eine saubere Anschlussebene. In der Kernstadt geht es häufiger um Aufteilung - eine große Wohnung wird geteilt, ein Ladenlokal wird Büro, und dann zählt vor allem der Schallschutz zwischen den Einheiten.",
      punkte: [
        "Ständerwände in Einfach- und Doppelbeplankung, auf Wunsch mit Schallschutz",
        "Vorsatzschalen vor unebenen oder kalten Außenwänden",
        "Abgehängte Decken mit Aussparungen für Leuchten und Lüftung",
        "Dachschrägen, Drempel und Kehlbalkenlage im Dachgeschossausbau",
        "Spachtelung Q1 bis Q3, je nach späterer Oberfläche",
      ],
      ablauf:
        "Privat rechnen wir als Festpreis nach Aufmaß ab, gewerblich nach Quadratmeter oder Tagessatz, Material auf Wunsch bauseits. Die Spachtelstufe steht im Angebot: Q2 reicht für Raufaser und Tapete, Q3 für glatte Anstriche im Streiflicht. Q4 bieten wir nicht an - wer eine Hochglanzoberfläche braucht, ist bei einem Stuckateur besser aufgehoben.",
      faq: [
        {
          frage: "Arbeiten Sie in Aurich auch als Nachunternehmer?",
          antwort:
            "Ja, für Bau- und Ausbaubetriebe im Landkreis, sinnvoll ab etwa einem Arbeitstag. Wir sind betriebshaftpflichtversichert und sagen Termine verbindlich zu. Abgerechnet wird nach Quadratmeter oder Tagessatz, Material stellen wir oder Sie.",
        },
        {
          frage: "Welche Spachtelqualität brauche ich?",
          antwort:
            "Das hängt allein daran, was darauf kommt. Für Raufaser und strukturierte Tapete genügt Q2. Für glatte, matte Anstriche empfehlen wir Q3, weil Streiflicht sonst jede Unebenheit zeigt. Welche Stufe kalkuliert ist, steht im Angebot.",
        },
        {
          frage: "Kann ich das Dachgeschoss ausbauen lassen, während ich im Haus wohne?",
          antwort:
            "In der Regel ja, weil sich das Dachgeschoss gut abschotten lässt. Wir stellen Staubschutz, decken den Treppenaufgang ab und stimmen die lauten Arbeiten mit Ihnen ab. Eingriffe in tragende Teile der Dachkonstruktion nur mit Freigabe durch einen Statiker.",
        },
      ],
    },
    umzug: {
      meta:
        "Umzug in Aurich und zwischen Aurich und Emden: fester Termin, Möbelmontage auf Wunsch, Räumung der alten Adresse im selben Auftrag. Preis nach Besichtigung.",
      intro:
        "Umzug in Aurich oder zwischen Aurich und Emden: ein Team, ein Ansprechpartner, ein Termin, der schriftlich steht. Auf Wunsch mit Ab- und Aufbau der Möbel und mit der Räumung dessen, was nicht mitkommt.",
      lage:
        "Die Strecke Emden - Aurich gehört zu unseren häufigsten Umzugswegen, in beide Richtungen. In der Kernstadt ist die Frage meist das Treppenhaus: Altbau ohne Aufzug, enge Wendelung, schmale Podeste. In den Ortsteilen ist es eher die Zufahrt - lange Einfahrten, weicher Untergrund im Winter, Carports, die einen großen Transporter nicht durchlassen. Beides klären wir bei der Besichtigung, nicht am Umzugstag.",
      punkte: [
        "Verpacken auf Wunsch, oder nur Tragen und Fahren, wenn Sie selbst packen",
        "Möbel demontieren und am Zielort wieder aufbauen",
        "Küchen ab- und anschließen lassen, Anschlussarbeiten über Fachbetriebe",
        "Seniorenumzüge ins betreute Wohnen oder ins Heim, in ruhigem Tempo",
        "Räumung und Entsorgung dessen, was nicht mit umzieht, im selben Auftrag",
      ],
      ablauf:
        "Was mitkommt und was nicht, ist die Frage, die den Preis bestimmt - deshalb schauen wir uns beide Adressen an, bevor wir ein Angebot schreiben. Wenn am Zielort eine Halteverbotszone nötig ist, sagen wir Ihnen rechtzeitig, was zu beantragen ist. Zum Fuhrpark und zu Gewichtsgrenzen steht alles auf der Hauptseite zu Umzügen.",
      faq: [
        {
          frage: "Können Sie Umzug und Entrümpelung in Aurich zusammen machen?",
          antwort:
            "Ja, und meistens ist das die günstigere Variante. Was mitkommt, wird transportiert, der Rest wird im selben Durchgang geräumt und sortenrein entsorgt. Sie haben einen Ansprechpartner und ein Angebot statt zwei getrennter Aufträge.",
        },
        {
          frage: "Wie lange dauert ein Umzug von Emden nach Aurich?",
          antwort:
            "Die 26 km fallen kaum ins Gewicht, entscheidend sind Menge, Etage und Zugang. Eine normale Drei-Zimmer-Wohnung ist üblicherweise ein Tagesauftrag. Verbindlich wird es erst nach der Besichtigung, weil Treppenhaus und Zufahrt den Unterschied machen.",
        },
        {
          frage: "Bauen Sie die Küche ab und wieder auf?",
          antwort:
            "Den Korpus und die Fronten ja. Das Trennen und Anschließen von Strom, Wasser und Gas gehört in die Hände zugelassener Fachbetriebe - wir koordinieren den Termin, führen die Arbeit aber nicht selbst aus.",
        },
      ],
    },
  },

  /* ------------------------------------------------------------------ */
  leer: {
    entruempelung: {
      meta:
        "Entrümpelung in Leer, von der Altbauwohnung in der Altstadt bis zum Haus in Loga oder Heisfelde. Halteverbotszone inklusive, Festpreis, besenreine Übergabe.",
      intro:
        "Entrümpelung in Leer, von der Altbauwohnung in der Altstadt bis zum Haus in Loga oder Heisfelde. Kostenlose Besichtigung, Festpreis in Textform, besenreine Übergabe zum vereinbarten Termin.",
      lage:
        "Leer ist der Ort, an dem der Weg nach draußen schwieriger ist als das Räumen selbst. Die Altstadt hat schmale Gassen, teilweise Fußgängerbereiche und Häuser, in denen die Treppe eng gewendelt ist und kein Aufzug existiert. Wer dort im dritten Obergeschoss räumt, trägt jeden Gegenstand über dieselbe Treppe. In Loga, Heisfelde, Bingum und Logabirum sind es dagegen klassische Einfamilienhäuser mit Keller, Garage und Dachboden - mehr Volumen, aber unkomplizierter Zugang.",
      punkte: [
        "Altbauwohnungen in der Altstadt, auch in oberen Etagen ohne Aufzug",
        "Komplette Haushaltsauflösungen im Einfamilienhaus samt Keller und Garage",
        "Schutz von Treppenhaus, Handlauf und historischen Böden auf dem Tragweg",
        "Sortenreine Trennung von Holz, Metall, Elektro und Restabfall",
        "Übergabefertige Räumung zum Termin des Notars oder der Verwaltung",
      ],
      ablauf:
        "Leer liegt rund 30 km entfernt. Für die Entsorgung ist die Abfallwirtschaft des Landkreises Leer zuständig. In der Altstadt brauchen wir für den Transporter fast immer eine Halteverbotszone, manchmal auch eine Ausnahmegenehmigung für die Einfahrt in den Fußgängerbereich - beides muss mit Vorlauf beantragt werden. Wir sagen Ihnen bei der Besichtigung, was in Ihrem Fall nötig ist.",
      faq: [
        {
          frage: "Wie kommen Sie in der Leeraner Altstadt an das Objekt heran?",
          antwort:
            "Mit Vorbereitung. Wir beantragen rechtzeitig eine Halteverbotszone vor dem Haus, damit der Tragweg kurz bleibt, und klären vorab, ob die Straße zu den Zeiten befahren werden darf. Kurzfristige Termine sind in der Altstadt deshalb schwieriger als anderswo.",
        },
        {
          frage: "Wird der Preis höher, wenn es keinen Aufzug gibt?",
          antwort:
            "Etage und Tragweg gehen in die Kalkulation ein, weil sie unmittelbar Zeit kosten. Genau deshalb schauen wir uns das Objekt vorher an, statt am Telefon zu schätzen. Im Angebot steht dann ein Preis, der auch gilt, wenn der Tag länger wird als gedacht.",
        },
        {
          frage: "Können Sie bei laufender Nachlassregelung schon räumen?",
          antwort:
            "Erst wenn geklärt ist, wer verfügen darf - eine Erbengemeinschaft muss sich einig sein. Wir können aber vorher besichtigen und ein Angebot schreiben, damit Sie eine belastbare Zahl haben, solange die Formalitäten laufen.",
        },
      ],
    },
    entkernung: {
      meta:
        "Rückbau im Leeraner Altbau: behutsam freilegen statt abräumen, Dielen und Stuck auf Wunsch erhalten. Nicht-tragend, sortenrein getrennt, Festpreis in Textform.",
      intro:
        "Rückbau im Leeraner Altbau heißt: behutsam trennen, was raus soll, und stehen lassen, was das Haus ausmacht. Wir entfernen Nicht-Tragendes, ohne die Substanz zu beschädigen, die später wieder sichtbar werden soll.",
      lage:
        "In Leer stehen viele Häuser aus der Gründerzeit und dem frühen zwanzigsten Jahrhundert, oft in geschlossener Bauweise. Darin liegt der Unterschied zum Nachkriegsbau: Unter Teppich und Spanplatte liegen häufig Dielenböden, hinter Rigips steckt Stuck, und die Wandaufbauten sind selten das, was der Grundriss vermuten lässt. Rückbau ist hier Freilegen, nicht Abräumen. Wo ein Gebäude unter Denkmalschutz steht, richtet sich der Umfang nach der Abstimmung mit der Behörde, die der Eigentümer führt.",
      punkte: [
        "Abgehängte Decken und Verkleidungen der siebziger Jahre entfernen",
        "Bodenaufbauten schichtweise zurückbauen, Dielung nach Absprache erhalten",
        "Nicht-tragende Trennwände aus späteren Umbauten herausnehmen",
        "Sanitärobjekte und Einbauten demontieren, ohne Anschlüsse zu trennen",
        "Fundstücke sichern statt entsorgen, wenn sie erhaltenswert sind",
      ],
      ablauf:
        "Im Altbau vor 1993 gilt die Schadstofffrage besonders: Bodenkleber, alte Dämmungen und Brandschutzverkleidungen sind die üblichen Verdächtigen. Bei Verdacht stoppen wir den Bereich und ein zugelassener Fachbetrieb übernimmt. Eingriffe in tragende Bauteile machen wir grundsätzlich nicht - im Altbau schon gar nicht, weil Lastwege dort oft anders verlaufen als im Plan.",
      faq: [
        {
          frage: "Können Sie im denkmalgeschützten Haus in Leer arbeiten?",
          antwort:
            "Ja, im abgestimmten Rahmen. Die Abstimmung mit der Denkmalbehörde führt der Eigentümer, wir arbeiten nach dem, was dabei festgelegt wurde. Was erhalten bleiben soll, halten wir vor Beginn schriftlich fest, damit es nicht am Bautag entschieden werden muss.",
        },
        {
          frage: "Bleiben die Dielen unter dem alten Teppich erhalten?",
          antwort:
            "Wenn Sie das möchten und der Zustand es hergibt, ja. Wir nehmen die oberen Schichten dann vorsichtig ab statt sie herauszureißen. Das dauert länger und steht deshalb als eigene Position im Angebot - Sie entscheiden nach der Besichtigung.",
        },
        {
          frage: "Was ist mit dem Schutt bei einem Haus ohne Einfahrt?",
          antwort:
            "Dann arbeiten wir mit kleineren Gebinden und kurzen Abfuhrintervallen statt mit einem Container vor der Tür. Das planen wir vorher ein, weil es den Ablauf und den Preis beeinflusst. In der Altstadt ist das eher die Regel als die Ausnahme.",
        },
      ],
    },
    trockenbau: {
      meta:
        "Trockenbau in Leer: Vorsatzschalen vor krummen Altbauwänden, Schallschutz zwischen Wohneinheiten, abgehängte Decken, Dachausbau. Spachtelung Q1 bis Q3.",
      intro:
        "Trockenbau in Leer, überwiegend im Bestand: Vorsatzschalen vor krummen Altbauwänden, Schallschutz zwischen aufgeteilten Wohnungen, abgehängte Decken und Dachschrägen. Gespachtelt bis Q3.",
      lage:
        "Im Leeraner Altbau ist keine Wand gerade und keine Decke waagerecht - das ist kein Mangel, sondern der Normalzustand eines Hauses, das über hundert Jahre gearbeitet hat. Trockenbau ist hier deshalb oft die einzige sinnvolle Antwort: Eine Vorsatzschale gleicht aus, was Putz nicht mehr rettet, und schafft nebenbei Platz für Leitungen und Dämmung. Dazu kommt das Thema Schallschutz, weil viele große Altbauwohnungen inzwischen geteilt sind und Trittschall in diesen Häusern erstaunlich weit trägt.",
      punkte: [
        "Vorsatzschalen zum Ausgleich krummer Wände und für Leitungsführung",
        "Trennwände mit erhöhtem Schallschutz zwischen Wohneinheiten",
        "Abgehängte Decken, auch zum Verdecken von Installationen",
        "Dachschrägen und Drempel im Dachgeschossausbau",
        "Spachtelung Q1 bis Q3, abgestimmt auf die spätere Oberfläche",
      ],
      ablauf:
        "Im Altbau messen wir vor dem Angebot auf, weil der Ausgleich einer schiefen Wand den Materialbedarf spürbar verändert. Bei Schallschutz sagen wir vorher, was der gewählte Aufbau leisten kann und was nicht - Trittschall über die Decke lässt sich mit einer Wand nicht lösen. Privat rechnen wir als Festpreis nach Aufmaß ab, gewerblich nach Quadratmeter oder Tagessatz.",
      faq: [
        {
          frage: "Hilft eine Vorsatzschale gegen feuchte Außenwände?",
          antwort:
            "Nein, und das ist wichtig. Eine Vorsatzschale verdeckt Feuchtigkeit, beseitigt sie aber nicht - im schlechtesten Fall schafft sie dahinter ideale Bedingungen für Schimmel. Die Ursache muss vorher weg. Wenn wir bei der Besichtigung Feuchte finden, sagen wir das, auch wenn es den Auftrag verzögert.",
        },
        {
          frage: "Wie viel Schallschutz ist zwischen zwei Wohnungen möglich?",
          antwort:
            "Deutlich mehr als bei einer einfachen Ständerwand, wenn der Aufbau stimmt: doppelte Beplankung, entkoppelte Profile, Dämmung im Hohlraum. Welchen Aufbau wir kalkulieren, steht im Angebot. Werte garantieren wir nicht, weil sie von der Ausführung des ganzen Bauteils abhängen, nicht nur von der Wand.",
        },
        {
          frage: "Arbeiten Sie in Leer auch für Betriebe?",
          antwort:
            "Ja, als Nachunternehmer im Trockenbau, sinnvoll ab etwa einem Arbeitstag. Betriebshaftpflicht mit Subunternehmer-Klausel liegt vor, Termine sagen wir verbindlich zu. Abrechnung nach Quadratmeter oder Tagessatz.",
        },
      ],
    },
    umzug: {
      meta:
        "Umzug in Leer: enge Altstadtgassen, Treppenhäuser ohne Aufzug, Halteverbotszone rechtzeitig beantragt. Fester Termin, Möbelmontage, Preis nach Besichtigung.",
      intro:
        "Umzug in Leer oder von Leer nach Emden: fester Termin, klarer Preis, ein Ansprechpartner. Auf Wunsch mit Möbelmontage und mit der Räumung der alten Wohnung im selben Auftrag.",
      lage:
        "Umzüge in der Leeraner Altstadt sind Logistik, nicht Muskelkraft. Der Transporter muss nah genug stehen, sonst wird aus einem Tagesauftrag zwei, und in den engen Straßen geht das fast nie ohne Halteverbotszone. Dazu kommen Treppenhäuser, die für die Möbel von heute nie gebaut wurden - was nicht durchs Treppenhaus passt, geht durchs Fenster oder gar nicht. In Loga, Heisfelde und Bingum ist der Zugang unkomplizierter, dafür sind die Haushalte meist größer.",
      punkte: [
        "Halteverbotszone rechtzeitig beantragen, damit der Tragweg kurz bleibt",
        "Möbel demontieren, transportieren und am Zielort wieder aufbauen",
        "Enge Treppenhäuser mit Schutz für Handlauf, Stufen und Wände",
        "Seniorenumzüge ins betreute Wohnen, mit Zeit statt Tempo",
        "Räumung und Entsorgung dessen, was nicht mitkommt",
      ],
      ablauf:
        "Wir sehen uns beide Adressen an, bevor wir ein Angebot schreiben - bei einem Umzug innerhalb von Leer bedeutet das zwei kurze Termine statt einer bösen Überraschung. Bei Möbeln, die nicht durchs Treppenhaus passen, sagen wir das vorher und nicht am Umzugstag. Zu Fahrzeugen und Gewichtsgrenzen steht alles auf der Hauptseite zu Umzügen.",
      faq: [
        {
          frage: "Kümmern Sie sich um die Halteverbotszone in Leer?",
          antwort:
            "Ja, das übernehmen wir auf Wunsch und rechnen die Gebühr transparent ab. Wichtig ist der Vorlauf: Kurzfristig ist eine Zone in der Altstadt oft nicht mehr zu bekommen, und dann wird der Tragweg lang und der Umzug teuer.",
        },
        {
          frage: "Was passiert mit Möbeln, die nicht durchs Treppenhaus passen?",
          antwort:
            "Das klären wir bei der Besichtigung, nicht am Umzugstag. Manches lässt sich weiter zerlegen als der Hersteller vorsieht, manches nicht. Wo es baulich möglich ist, arbeiten wir mit einem Möbellift - das planen und kalkulieren wir dann vorher ein.",
        },
        {
          frage: "Können Sie die alte Wohnung nach dem Umzug räumen?",
          antwort:
            "Ja, das ist der häufigste Fall. Was mitkommt, wird transportiert, der Rest im selben Durchgang geräumt und sortenrein entsorgt, und die Wohnung geht besenrein zurück an den Vermieter. Ein Auftrag, ein Angebot, ein Ansprechpartner.",
        },
      ],
    },
  },

  /* ------------------------------------------------------------------ */
  norden: {
    entruempelung: {
      meta:
        "Entrümpelung in Norden und Norddeich: Ferienwohnungen zwischen zwei Saisons, Haushaltsauflösungen, Nebengebäude. Festpreis, Fotodokumentation für Auswärtige.",
      intro:
        "Entrümpelung in Norden und Norddeich, von der Ferienwohnung nach dem Eigentümerwechsel bis zur kompletten Haushaltsauflösung. Kostenlose Besichtigung, Festpreis in Textform, Termin, der hält.",
      lage:
        "Norden hat zwei Taktgeber, und beide sind saisonal. Ferienwohnungen und Ferienhäuser werden zwischen den Vermietungszeiträumen geräumt, und dieses Fenster ist kurz - im Herbst und Winter ist Platz dafür, in der Hauptsaison praktisch nicht. Dazu kommen die klassischen Haushaltsauflösungen in der Kernstadt und in den Ortsteilen, bei denen Angehörige oft weit entfernt wohnen und den Ablauf aus der Ferne steuern müssen.",
      punkte: [
        "Ferienwohnungen und Ferienhäuser komplett räumen, inklusive Inventar",
        "Haushaltsauflösungen im Einfamilienhaus samt Keller, Garage und Schuppen",
        "Einzelne Wohnungen im Mehrfamilienhaus mit Schutz des Treppenhauses",
        "Sortenreine Trennung nach Holz, Metall, Elektroaltgeräten und Restabfall",
        "Besenreine Übergabe mit Fotodokumentation für auswärtige Eigentümer",
      ],
      ablauf:
        "Norden liegt rund 32 km entfernt, zuständig ist die Abfallwirtschaft des Landkreises Aurich. Wenn Sie eine Ferienimmobilie räumen lassen, sagen Sie uns bitte früh, bis wann der nächste Vermietungszeitraum beginnt - danach richten wir die Planung aus. Für Eigentümer, die nicht vor Ort sind, arbeiten wir mit Schlüsselübergabe und dokumentieren das Ergebnis mit Fotos.",
      faq: [
        {
          frage: "Können Sie eine Ferienwohnung zwischen zwei Vermietungen räumen?",
          antwort:
            "Ja, wenn der Vorlauf stimmt. Sagen Sie uns das Enddatum des laufenden und das Startdatum des nächsten Zeitraums, dann planen wir dazwischen. In der Hauptsaison sind die Fenster eng, außerhalb ist fast alles möglich.",
        },
        {
          frage: "Ich wohne nicht in Ostfriesland. Geht das trotzdem?",
          antwort:
            "Das ist in Norden eher die Regel. Wir besichtigen, schicken das Angebot, arbeiten nach Schlüsselübergabe und dokumentieren mit Fotos. Was bleiben soll, halten wir vorher schriftlich fest, damit nichts verloren geht, was Ihnen wichtig ist.",
        },
        {
          frage: "Räumen Sie auch den Bootsschuppen oder das Gartenhaus mit?",
          antwort:
            "Ja, Nebengebäude gehören für uns zum Objekt und nicht zu den Nachträgen. Sagen Sie bei der Besichtigung, was alles dazugehört - dann steht es im Festpreis und wird später nicht zum Streitpunkt.",
        },
      ],
    },
    entkernung: {
      meta:
        "Rückbau in Norden und Norddeich: Ferienobjekte im Zeitfenster der Zwischensaison entkernen. Bäder, Böden, Trennwände raus - ohne Wartetage bis zum Ausbau.",
      intro:
        "Rückbau in Norden und Norddeich, meistens dann, wenn aus einem in die Jahre gekommenen Objekt wieder etwas Vermietbares werden soll. Wir nehmen alles Nicht-Tragende heraus und übergeben ausbaufertig.",
      lage:
        "Der typische Auftrag hier ist die Modernisierung einer Ferienwohnung, und der entscheidende Faktor ist Zeit. Zwischen Ende der einen und Beginn der nächsten Saison liegt ein festes Fenster, und wer darin Rückbau, Ausbau und Ausstattung unterbringen will, kann sich keine Wartetage zwischen den Gewerken leisten. Dazu kommt die Lage an der Küste: In Objekten nahe am Deich ist Feuchtigkeit ein Thema, das beim Öffnen von Bodenaufbauten regelmäßig sichtbar wird.",
      punkte: [
        "Bäder und Küchen vollständig zurückbauen, ohne Anschlüsse zu trennen",
        "Bodenbeläge und Estrichaufbauten entfernen, Untergrund beurteilen",
        "Nicht-tragende Trennwände und Einbauten herausnehmen",
        "Deckenverkleidungen und Paneele der Bauzeit zurückbauen",
        "Material sortenrein trennen und abfahren, Fläche besenrein übergeben",
      ],
      ablauf:
        "Wenn wir beim Öffnen des Bodens Feuchtigkeit oder Schimmel finden, sagen wir es sofort und halten den Bereich an, statt darüber hinwegzuarbeiten. Das kostet Sie im ersten Moment Zeit und erspart Ihnen im zweiten einen Schaden, der nach der ersten Saison wiederkommt. Bei Baujahren vor 1993 gilt zusätzlich die Schadstoffregel: Bei Verdacht stoppen wir, ein zugelassener Fachbetrieb übernimmt.",
      faq: [
        {
          frage: "Schaffen Sie Rückbau und Ausbau in der Zwischensaison?",
          antwort:
            "Bei realistischem Umfang ja, und das ist genau der Grund, beides aus einer Hand zu vergeben - es entfallen die Wartetage zwischen den Gewerken. Was in Ihrem Zeitfenster machbar ist, sagen wir nach der Besichtigung ehrlich, auch wenn die Antwort manchmal nein lautet.",
        },
        {
          frage: "Was, wenn unter dem Boden Feuchtigkeit auftaucht?",
          antwort:
            "Dann stoppen wir dort und informieren Sie, bevor wir weitermachen. Die Ursache zu beseitigen ist Sache eines Fachbetriebs für Abdichtung oder Sanierung. Neu aufbauen, ohne die Ursache zu klären, machen wir nicht - das Ergebnis hält sonst keine zwei Jahre.",
        },
        {
          frage: "Können Sie mehrere Einheiten nacheinander machen?",
          antwort:
            "Ja, das ist bei Ferienobjekten häufig und planerisch sinnvoll. Wir stimmen die Reihenfolge so ab, dass immer nur eine Einheit außer Betrieb ist, soweit der Grundriss das zulässt.",
        },
      ],
    },
    trockenbau: {
      meta:
        "Trockenbau in Norden und Norddeich: Einheiten aufteilen, Schallschutz zwischen Ferienwohnungen, Dachgeschoss ausbauen, Decken abhängen. Spachtelung bis Q3.",
      intro:
        "Trockenbau in Norden und Norddeich: Einheiten aufteilen, Schallschutz zwischen Ferienwohnungen, Dachgeschosse ausbauen, Decken abhängen. Spachtelung bis Q3, Festpreis nach Aufmaß.",
      lage:
        "In Ferienobjekten hat Trockenbau eine Aufgabe, die er sonst selten hat: Er entscheidet mit über die Bewertung. Wer in einer Ferienwohnung nachts den Nachbarn hört, schreibt das in die Rezension, und das wirkt länger als jede Renovierung. Deshalb geht es hier selten nur um eine Wand, sondern um einen Aufbau, der Luft- und Trittschall im Blick hat. Der zweite große Posten ist das Dachgeschoss - aus ungenutztem Raum unter der Schräge wird eine zusätzliche vermietbare Einheit.",
      punkte: [
        "Trennwände zwischen Wohneinheiten mit erhöhtem Schallschutz",
        "Aufteilung großer Grundrisse in mehrere vermietbare Einheiten",
        "Dachschrägen, Drempel und Kehlbalkenlage im Dachgeschossausbau",
        "Abgehängte Decken, auch zur Aufnahme von Leitungen und Leuchten",
        "Vorsatzschalen vor kalten oder unebenen Außenwänden",
      ],
      ablauf:
        "Bei Schallschutz sagen wir vor dem Angebot, was der gewählte Aufbau leisten kann - und dass eine Wand nichts gegen Trittschall von oben ausrichtet. Wo eine Aufteilung neue Einheiten schafft, sind Brandschutz und Rettungswege zu prüfen; das ist Sache Ihres Planers, wir bauen nach dem, was festgelegt wurde. Privat Festpreis nach Aufmaß, gewerblich nach Quadratmeter oder Tagessatz.",
      faq: [
        {
          frage: "Wie leise wird es zwischen zwei Ferienwohnungen?",
          antwort:
            "Mit doppelter Beplankung, entkoppelten Profilen und Dämmung im Hohlraum deutlich leiser als mit einer einfachen Ständerwand. Welchen Aufbau wir kalkulieren, steht im Angebot. Konkrete Dezibelwerte garantieren wir nicht, weil sie von Decke, Boden und Nebenwegen abhängen, nicht allein von der Wand.",
        },
        {
          frage: "Lässt sich das Dachgeschoss zur eigenen Einheit ausbauen?",
          antwort:
            "Baulich oft ja. Ob es genehmigungsfähig ist, hängt an Raumhöhe, zweitem Rettungsweg und Brandschutz - das klärt Ihr Planer oder Architekt mit der Behörde. Wir bauen Schrägen, Drempel und Trennwände nach dieser Vorgabe.",
        },
        {
          frage: "Arbeiten Sie in der Zwischensaison auch im Blockauftrag?",
          antwort:
            "Ja, mehrere Einheiten nacheinander sind in Norden die Regel und für beide Seiten planbarer als Einzeltermine. Sprechen Sie uns früh an, weil die Zwischensaison bei allen Eigentümern dasselbe kurze Fenster ist.",
        },
      ],
    },
    umzug: {
      meta:
        "Umzug in Norden und Norddeich, auch für Zweitwohnungen und Teilräumungen. Fester Termin, Möbelmontage auf Wunsch, klarer Preis nach kostenloser Besichtigung.",
      intro:
        "Umzug in Norden und Norddeich: fester Termin, klarer Preis, Möbelmontage auf Wunsch. Auch für Zweitwohnungen und für den Wechsel zwischen Küste und Festland.",
      lage:
        "Umzüge in Norden haben oft eine Besonderheit: Es zieht nicht ein ganzer Haushalt um, sondern ein halber. Zweitwohnungen werden aufgelöst oder bezogen, Möbel gehen in die eine Richtung und Hausrat in die andere. Das lässt sich gut planen, wenn man vorher weiß, was wohin gehört - und schlecht, wenn es am Umzugstag entschieden wird. In Norddeich kommt die Nähe zum Fährhafen hinzu, was regelmäßig die Frage nach den Inseln aufwirft.",
      punkte: [
        "Umzüge innerhalb von Norden und zwischen Norden und Emden",
        "Auflösung oder Einrichtung von Zweitwohnungen, auch in Teilen",
        "Möbel demontieren, transportieren und wieder aufbauen",
        "Seniorenumzüge ins betreute Wohnen, in ruhigem Tempo",
        "Räumung und Entsorgung dessen, was nicht mitkommt",
      ],
      ablauf:
        "Wir sehen uns beide Adressen an und halten fest, was mitkommt - gerade bei Zweitwohnungen spart diese halbe Stunde am meisten Ärger. Umzüge auf die Inseln bieten wir nicht pauschal an: Fähre, Inselverkehr und die dortigen Zufahrtsregeln machen daraus einen anderen Auftrag als eine Fahrt über Land. Fragen Sie im Einzelfall, dann sagen wir Ihnen ehrlich, ob wir der richtige Betrieb dafür sind.",
      faq: [
        {
          frage: "Ziehen Sie auch auf die Inseln um?",
          antwort:
            "Nicht als Standardleistung. Fährzeiten, begrenzter Fahrzeugverkehr und die Regeln vor Ort machen aus einem Umzug ein eigenes Projekt, für das oft spezialisierte Betriebe die bessere Wahl sind. Fragen Sie trotzdem - wenn wir es nicht sinnvoll leisten können, sagen wir das statt es zu versuchen.",
        },
        {
          frage: "Können Sie eine Zweitwohnung nur teilweise ausräumen?",
          antwort:
            "Ja. Dann legen wir bei der Besichtigung fest, was mitgeht, was bleibt und was entsorgt wird, am besten mit Markierungen vor Ort. Diese Liste ist Teil des Angebots, damit am Umzugstag niemand raten muss.",
        },
        {
          frage: "Wie weit im Voraus muss ich einen Termin abstimmen?",
          antwort:
            "Für Norden planen Sie je nach Umfang ein bis zwei Wochen Vorlauf ein. Rund um Saisonwechsel wird es enger, weil dann viele Eigentümer gleichzeitig planen - je früher Sie anfragen, desto eher bekommen Sie Ihren Wunschtermin.",
        },
      ],
    },
  },

  /* ------------------------------------------------------------------ */
  moormerland: {
    entruempelung: {
      meta:
        "Entrümpelung in Moormerland: Warsingsfehn, Veenhusen, Neermoor, Oldersum. Haus, Keller, Garage und Werkstatt, sortenrein getrennt. Nur 20 km ab Emden.",
      intro:
        "Entrümpelung in Moormerland, von Warsingsfehn über Veenhusen und Neermoor bis Oldersum. Kostenlose Besichtigung, Festpreis in Textform, besenreine Übergabe.",
      lage:
        "Moormerland ist eine Flächengemeinde aus vielen Ortsteilen, und die Grundstücke tragen ihre Geschichte: Die Fehnsiedlungen haben lange, schmale Parzellen, auf denen über Jahrzehnte angebaut wurde - Garage, Werkstatt, Gartenhaus, oft noch ein alter Stall. Bei einer Haushaltsauflösung ist deshalb selten die Wohnfläche der große Posten, sondern das, was drumherum steht. Der Vorteil für Sie: Mit rund 20 km ist Moormerland eines unserer nächstgelegenen Ziele, was die Anfahrtsposition im Angebot spürbar klein hält.",
      punkte: [
        "Haushaltsauflösungen im Einfamilienhaus samt Keller und Dachboden",
        "Nebengebäude: Garage, Werkstatt, Gartenhaus, Schuppen und alte Ställe",
        "Einzelne Wohnungen mit Schutz von Treppenhaus und Tragewegen",
        "Sortenreine Trennung nach Holz, Metall, Elektroaltgeräten und Restabfall",
        "Fachgerechte Abgabe von Altreifen, Farbresten und Elektrogeräten",
      ],
      ablauf:
        "Für die Entsorgung ist die Abfallwirtschaft des Landkreises Leer zuständig. Auf älteren Grundstücken taucht regelmäßig auf, was über Jahrzehnte in der Werkstatt liegen blieb: Altöl, Farb- und Lackreste, alte Batterien, manchmal Reifen. Das sind Sonderabfälle mit eigenen Annahmestellen - wir erfassen sie bei der Besichtigung und weisen sie im Angebot getrennt aus, statt sie im Container verschwinden zu lassen.",
      faq: [
        {
          frage: "Räumen Sie auch Werkstatt und Stall mit?",
          antwort:
            "Ja, Nebengebäude gehören zum Objekt. Sagen Sie bei der Besichtigung, was alles dazugehört, dann steht es im Festpreis. Gerade auf Fehngrundstücken lohnt der Rundgang über das ganze Grundstück, weil sich dort oft mehr angesammelt hat als im Haus.",
        },
        {
          frage: "Was passiert mit Altöl, Farbe und alten Batterien?",
          antwort:
            "Die gehen getrennt zu den dafür vorgesehenen Annahmestellen, nicht in den Restabfall. Wir weisen diese Positionen im Angebot gesondert aus, weil sie anders abgerechnet werden als Mischabfall. Verstecken lässt sich das ohnehin nicht - und sollte es auch nicht.",
        },
        {
          frage: "Lohnt sich ein kleiner Auftrag bei 20 km Entfernung?",
          antwort:
            "Ja. Moormerland liegt für uns nah genug, dass sich auch ein Kellerraum oder eine einzelne Garage rechnet. Die Anfahrt steht als eigene Position im Angebot, Sie sehen also genau, was der Weg kostet.",
        },
      ],
    },
    entkernung: {
      meta:
        "Rückbau in Moormerland: Paneele, Teppich, Estrich, Einbauschränke und alte Bäder raus. Nicht-tragend, sortenrein getrennt, Fläche ausbaufertig übergeben.",
      intro:
        "Rückbau in Moormerland, meist im Generationswechsel: Ein Haus aus den siebziger oder achtziger Jahren wechselt den Besitzer, und vor dem Einzug soll alles Alte raus. Genau dafür sind wir da.",
      lage:
        "Die Eigenheime in Warsingsfehn, Veenhusen und Neermoor stammen überwiegend aus einer Bauphase, deren Innenausbau man wiedererkennt: Holzpaneele an Decken und Wänden, Teppich auf Estrich, geflieste Bäder bis unter die Decke, Einbauschränke aus der Bauzeit und häufig ein ausgebauter Dachboden mit Spanplatten und Mineralwolle dahinter. Das alles lässt sich schnell und sauber zurückbauen, wenn man weiß, in welcher Reihenfolge - und wo man vorher genauer hinsieht.",
      punkte: [
        "Deckenpaneele, Wandverkleidungen und Einbauschränke entfernen",
        "Teppich, Estrichaufbauten und Ausgleichsschichten zurückbauen",
        "Bäder vollständig entkernen, ohne Anschlüsse zu trennen",
        "Nicht-tragende Trennwände und alte Dachgeschossausbauten herausnehmen",
        "Sortenrein trennen, abfahren und die Fläche ausbaufertig übergeben",
      ],
      ablauf:
        "Bei Häusern mit Baujahr vor 1993 prüfen wir vor Beginn, wo Schadstoffe zu erwarten sind - in dieser Bauphase sind vor allem alte Bodenkleber und Dämmstoffe die üblichen Kandidaten. Bei Verdacht stoppen wir den betroffenen Bereich sofort, ein zugelassener Fachbetrieb übernimmt. Tragende Bauteile bleiben unangetastet, Elektro, Sanitär und Heizung gehören in andere Hände. Beides steht in jedem Angebot.",
      faq: [
        {
          frage: "Kann der Ausbau direkt an den Rückbau anschließen?",
          antwort:
            "Ja, und in Moormerland ist das der Regelfall. Trockenbau, Boden und Montage machen wir mit demselben Team, sodass zwischen Rückbau und Ausbau kein Wartetag entsteht. Leitungsarbeiten koordinieren wir mit Fachbetrieben, führen sie aber nicht selbst aus.",
        },
        {
          frage: "Wie gehen Sie mit Mineralwolle im Dachgeschoss um?",
          antwort:
            "Vorsichtig und mit Schutzausrüstung. Bei Dämmstoffen, die vor 1996 eingebaut wurden, kann es sich um alte künstliche Mineralfasern handeln - die sind anders zu behandeln als heutige Ware. Wo der Verdacht besteht, stoppen wir und lassen klären, bevor wir weitermachen.",
        },
        {
          frage: "Wie lange dauert die Entkernung eines Einfamilienhauses?",
          antwort:
            "Je nach Umfang meist einige Tage bis eine gute Woche. Belastbar wird die Zahl erst nach der Besichtigung, weil Bodenaufbauten und Bäder die größten Unbekannten sind. Im Angebot steht ein Zeitfenster, keine vage Schätzung.",
        },
      ],
    },
    trockenbau: {
      meta:
        "Trockenbau in Moormerland: Dachgeschossausbau, neue Raumaufteilung, Vorsatzschalen, abgehängte Decken. Spachtelung Q1 bis Q3, auch kleinere Aufträge.",
      intro:
        "Trockenbau in Moormerland für private Modernisierer und als Nachunternehmer: Ständerwände, Vorsatzschalen, abgehängte Decken, Dachschrägen. Spachtelung bis Q3, Festpreis nach Aufmaß.",
      lage:
        "In den Eigenheimen der siebziger und achtziger Jahre geht es fast immer um dieselben zwei Dinge. Erstens der Dachboden: Die Kehlbalkenlage ist da, die Höhe reicht meistens, und aus Abstellfläche wird ein Kinder- oder Arbeitszimmer. Zweitens der Grundriss im Erdgeschoss, der für eine Wohnweise gebaut wurde, die es so nicht mehr gibt - kleine getrennte Räume, wo heute Küche und Wohnbereich zusammengehören. Beides ist Trockenbau, und beides lässt sich im bewohnten Haus machen.",
      punkte: [
        "Dachgeschossausbau mit Schrägen, Drempel und Kehlbalkenlage",
        "Ständerwände für neue Raumaufteilung, auf Wunsch mit Schallschutz",
        "Vorsatzschalen vor kalten Außenwänden und zur Leitungsführung",
        "Abgehängte Decken mit Aussparungen für Leuchten und Lüftung",
        "Spachtelung Q1 bis Q3, je nach späterer Oberfläche",
      ],
      ablauf:
        "Mit 20 km Anfahrt sind in Moormerland auch kleinere Aufträge sinnvoll, für die sich ein weiter Weg nicht lohnen würde - eine einzelne Wand oder eine abgehängte Decke etwa. Privat rechnen wir als Festpreis nach Aufmaß ab, gewerblich nach Quadratmeter oder Tagessatz. Die Spachtelstufe steht im Angebot: Q2 für Tapete, Q3 für glatte Anstriche. Q4 bieten wir nicht an.",
      faq: [
        {
          frage: "Reicht die Höhe für einen Dachgeschossausbau?",
          antwort:
            "Das messen wir bei der Besichtigung. Entscheidend ist nicht nur die Höhe im First, sondern wie viel Fläche eine ausreichende Stehhöhe hat - und was die Landesbauordnung für Aufenthaltsräume verlangt. Wenn es knapp wird, sagen wir das, bevor Sie planen.",
        },
        {
          frage: "Kann eine Wand raus, damit Küche und Wohnzimmer zusammenkommen?",
          antwort:
            "Wenn sie nicht tragend ist, ja. Ob sie tragend ist, klären wir vorher anhand von Grundriss und Deckenauflager, im Zweifel mit einem Statiker. Ohne Freigabe fassen wir tragende Bauteile nicht an - da gibt es bei uns keinen Ermessensspielraum.",
        },
        {
          frage: "Nehmen Sie auch kleine Aufträge an?",
          antwort:
            "In Moormerland ja, die Entfernung macht das möglich. Eine einzelne Ständerwand oder eine abgehängte Decke ist ein normaler Auftrag für uns, kein Sonderfall.",
        },
      ],
    },
    umzug: {
      meta:
        "Umzug in Moormerland und Richtung Emden oder Leer: kurze Wege, fester Termin, Möbelmontage. Keller, Dachboden und Garage werden vorher mit eingeplant.",
      intro:
        "Umzug in Moormerland oder zwischen Moormerland und Emden: kurze Wege, fester Termin, Möbelmontage auf Wunsch. Auf Wunsch räumen wir die alte Adresse im selben Auftrag.",
      lage:
        "Moormerland liegt für einen Umzug fast ideal: 20 km nach Emden, kurze Wege nach Leer, und die meisten Objekte sind Einfamilienhäuser mit ebenerdigem Zugang. Das macht Umzüge hier planbar. Was regelmäßig unterschätzt wird, ist das Volumen - wer zwanzig Jahre in einem Haus mit Keller, Dachboden und Garage gewohnt hat, zieht mit deutlich mehr um als jemand aus einer Wohnung. Deshalb schauen wir uns vorher an, was tatsächlich mitkommt.",
      punkte: [
        "Umzüge innerhalb der Gemeinde und in Richtung Emden oder Leer",
        "Möbel demontieren, transportieren und am Zielort wieder aufbauen",
        "Keller, Dachboden und Garage mit einplanen statt am Tag entdecken",
        "Seniorenumzüge ins betreute Wohnen, mit Zeit statt Tempo",
        "Räumung und Entsorgung dessen, was nicht mitkommt",
      ],
      ablauf:
        "Wir besichtigen beide Adressen, bevor wir ein Angebot schreiben. Bei Fehngrundstücken schauen wir uns dabei besonders die Zufahrt an: lange Einfahrten und weicher Untergrund sind im Winter ein echtes Thema für einen beladenen Transporter. Zu Fahrzeugen und Gewichtsgrenzen steht alles auf der Hauptseite zu Umzügen.",
      faq: [
        {
          frage: "Können Sie Umzug und Entrümpelung zusammen abwickeln?",
          antwort:
            "Ja, und bei einem Hausumzug ist das fast immer sinnvoll. Was mitkommt, wird transportiert, der Rest im selben Durchgang geräumt und sortenrein entsorgt. Ein Ansprechpartner, ein Angebot, ein Termin.",
        },
        {
          frage: "Kommt der Transporter über meine Einfahrt?",
          antwort:
            "Das sehen wir uns bei der Besichtigung an. Lange, unbefestigte Einfahrten sind bei Nässe für ein beladenes Fahrzeug problematisch. Wo es eng wird, laden wir von der Straße aus um - das planen wir vorher ein, damit es am Umzugstag keine Überraschung wird.",
        },
        {
          frage: "Wie viel Vorlauf brauchen Sie?",
          antwort:
            "Je nach Umfang ein bis zwei Wochen. Zum Monatsende und zu den Schulferien wird es erfahrungsgemäß enger, weil dann die meisten Mietverhältnisse wechseln. Wenn Ihr Termin feststeht, melden Sie sich gern früher.",
        },
      ],
    },
  },

  /* ------------------------------------------------------------------ */
  krummhoern: {
    entruempelung: {
      meta:
        "Entrümpelung in der Krummhörn, von Pewsum bis Greetsiel: Wohnhaus, Ferienhaus, Scheune und Stall. Sortenrein getrennt, Festpreis, nur 14 km ab Emden.",
      intro:
        "Entrümpelung in der Krummhörn, von Pewsum bis Greetsiel. Ob Wohnhaus, Ferienhaus oder ein alter Hof mit Scheune - kostenlose Besichtigung, Festpreis in Textform, besenreine Übergabe.",
      lage:
        "Die Krummhörn besteht aus vielen kleinen Dörfern, und die Objekte unterscheiden sich stärker voneinander als in einer Stadt. Ein Reihenhaus in Pewsum ist ein überschaubarer Auftrag. Ein Gulfhof mit Scheune und Stall ist etwas völlig anderes: große Volumina, teilweise alte Landtechnik, Reste von Futtermitteln, manchmal Bauschutt aus früheren Umbauten, und all das unter einem Dach, unter dem man nicht überall gefahrlos steht. In Greetsiel kommen Ferienhäuser hinzu, die beim Eigentümerwechsel komplett geräumt werden.",
      punkte: [
        "Wohnhäuser und Ferienhäuser komplett räumen, inklusive Inventar",
        "Scheunen, Ställe und Nebengebäude mit großem Volumen",
        "Alte Landtechnik, Metallschrott und Holz sortenrein trennen",
        "Sonderabfälle wie Altöl, Farbreste und Altreifen getrennt erfassen",
        "Besenreine Übergabe, auf Wunsch mit Fotodokumentation",
      ],
      ablauf:
        "Mit rund 14 km ist die Krummhörn unser nächstes Einsatzgebiet außerhalb von Emden, zuständig für die Entsorgung ist der Landkreis Aurich. Bei alten Hofgebäuden sehen wir uns vor dem Angebot die Standsicherheit an, soweit das ohne Fachgutachten möglich ist - in eine Scheune mit durchgefaultem Dachstuhl gehen wir nicht hinein, und dann sagen wir das auch. Die Dorfstraßen sind stellenweise eng, das planen wir beim Stellplatz für Container und Transporter mit ein.",
      faq: [
        {
          frage: "Räumen Sie auch eine komplette Scheune?",
          antwort:
            "Ja, das ist in der Krummhörn ein normaler Auftrag. Wichtig ist der Blick auf die Standsicherheit vor Beginn: Wo der Dachstuhl oder die Balkenlage nicht mehr tragfähig aussehen, arbeiten wir nicht ohne fachliche Beurteilung. Sicherheit geht vor Termin.",
        },
        {
          frage: "Was ist mit altem Metallschrott und Landtechnik?",
          antwort:
            "Metall trennen wir sortenrein und führen es der Verwertung zu. Ob und wie sich das auf Ihren Preis auswirkt, sehen wir bei der Besichtigung und schreiben es ins Angebot. Pauschale Zusagen am Telefon machen wir dazu nicht.",
        },
        {
          frage: "Kommen Sie mit dem Fahrzeug durch die Dorfstraßen?",
          antwort:
            "Meistens ja, aber nicht überall bis vor die Tür. Wir schauen uns die Zufahrt bei der Besichtigung an und legen fest, wo Container und Transporter stehen können. In Greetsiel ist das in der Saison ein eigenes Thema, das wir vorher klären.",
        },
      ],
    },
    entkernung: {
      meta:
        "Rückbau in alter Bausubstanz der Krummhörn: Einbauten späterer Umbauten raus, Ständerwerk unangetastet. Feuchte wird gemeldet, nicht überbaut.",
      intro:
        "Rückbau in der Krummhörn, häufig in alter Bausubstanz: Wir nehmen heraus, was spätere Jahrzehnte hineingebaut haben, und lassen unangetastet, was das Gebäude trägt.",
      lage:
        "Die alten Häuser und Höfe der Krummhörn sind baulich etwas anderes als ein Nachkriegsbau, und das hat Folgen für den Rückbau. Bei einem Gulfhof übernimmt ein hölzernes Ständergerüst im Inneren die Last des Daches - was dort aussieht wie eine gewöhnliche Wand, kann Teil der Konstruktion sein. Dazu kommen Einbauten aus mehreren Umbauphasen, hinter denen der ursprüngliche Aufbau steckt. Und die Außenwände haben oft keine Sperrschicht, weshalb beim Öffnen des Bodens regelmäßig Feuchtigkeit sichtbar wird.",
      punkte: [
        "Einbauten und Verkleidungen späterer Umbauphasen entfernen",
        "Bodenaufbauten schichtweise öffnen und den Untergrund beurteilen",
        "Nicht-tragende Trennwände herausnehmen, Konstruktion unangetastet lassen",
        "Bäder und Küchen zurückbauen, ohne Anschlüsse zu trennen",
        "Material sortenrein trennen, abfahren und die Fläche übergeben",
      ],
      ablauf:
        "In alter Bausubstanz gilt bei uns eine einfache Regel: Im Zweifel bleibt es stehen, bis ein Statiker es freigegeben hat. Das gilt besonders für alles, was zum Ständergerüst eines Gulfhofs gehören könnte. Wenn wir beim Öffnen von Böden oder Wänden Feuchtigkeit finden, halten wir den Bereich an und sagen es Ihnen - darüber hinwegzubauen wäre der teuerste Fehler des ganzen Projekts. Für Baujahre vor 1993 gilt zusätzlich die Schadstoffregel.",
      faq: [
        {
          frage: "Können Sie eine Scheune zu Wohnraum umbauen?",
          antwort:
            "Den Rückbau und den anschließenden Trockenbau ja. Die Umnutzung selbst ist ein Genehmigungsverfahren mit Statik, Brandschutz und Wärmeschutz - das gehört zu Architekt und Fachplaner. Wir arbeiten nach der Planung, die dabei entsteht.",
        },
        {
          frage: "Woran erkennen Sie tragende Teile im alten Hof?",
          antwort:
            "An Deckenauflagern, Balkenrichtung und dem sichtbaren Ständerwerk - aber nur bis zu einem Punkt. In einem Gulfhof ist die Lastabtragung anders als in einem Wohnhaus, und ein Irrtum ist dort nicht reparabel. Deshalb holen wir bei Unklarheit einen Statiker dazu, statt zu vermuten.",
        },
        {
          frage: "Was, wenn die Wände feucht sind?",
          antwort:
            "Dann melden wir es, bevor wir weiterarbeiten. Alte Außenwände ohne Sperrschicht ziehen Feuchtigkeit aus dem Boden, das ist in der Krummhörn nicht ungewöhnlich. Wer darauf einen neuen Aufbau setzt, ohne die Ursache zu klären, hat den Schaden in zwei Jahren wieder - und dann größer.",
        },
      ],
    },
    trockenbau: {
      meta:
        "Trockenbau in der Krummhörn: Innenausbau in Höfen und Ferienwohnungen, Vorsatzschalen, Trennwände, Dachschrägen. Spachtelung Q1 bis Q3, 14 km ab Emden.",
      intro:
        "Trockenbau in der Krummhörn: Innenausbau in alten Häusern und Höfen, Ferienwohnungen, Dachgeschosse. Vorsatzschalen, Trennwände, Decken und Schrägen, gespachtelt bis Q3.",
      lage:
        "Im Bestand der Krummhörn ist Trockenbau die Technik, mit der ein altes Gebäude bewohnbar wird, ohne dass man seine Substanz opfert. Eine Vorsatzschale schafft die Ebene für Dämmung und Leitungen, ohne die Außenwand anzutasten. Trennwände teilen einen großen, ungegliederten Raum, wie ihn ein umgenutztes Wirtschaftsteil hat. Und weil viele dieser Objekte als Ferienwohnung genutzt werden, spielt Schallschutz zwischen den Einheiten eine größere Rolle als in einem Einfamilienhaus.",
      punkte: [
        "Vorsatzschalen mit Raum für Dämmung und Leitungsführung",
        "Trennwände zur Gliederung großer Räume, auf Wunsch mit Schallschutz",
        "Dachschrägen, Drempel und Kehlbalkenlage im Ausbau",
        "Abgehängte Decken, auch zur Aufnahme von Installationen",
        "Spachtelung Q1 bis Q3, abgestimmt auf die spätere Oberfläche",
      ],
      ablauf:
        "Vor einer Vorsatzschale an einer alten Außenwand prüfen wir die Feuchtigkeit. Ist die Wand feucht, bauen wir nicht davor - eine Vorsatzschale verdeckt das Problem und schafft dahinter die Bedingungen, unter denen Schimmel am besten wächst. Das sagen wir auch dann, wenn es den Auftrag verzögert. Der Aufbau, den wir kalkulieren, steht im Angebot, ebenso die Spachtelstufe. Privat Festpreis nach Aufmaß, gewerblich nach Quadratmeter oder Tagessatz.",
      faq: [
        {
          frage: "Kann ich eine alte Außenwand einfach mit Trockenbau dämmen?",
          antwort:
            "Nur wenn die Wand trocken ist und der Aufbau bauphysikalisch zur Wand passt. Eine Innendämmung vor einer feuchten Wand macht den Schaden schlimmer, nicht kleiner. Bei alten Wänden ohne Sperrschicht lassen wir das vorher beurteilen, statt es auszuprobieren.",
        },
        {
          frage: "Lässt sich ein großer Raum im alten Hof sinnvoll teilen?",
          antwort:
            "Ja, das ist einer der häufigsten Aufträge hier. Wichtig sind Anschlüsse an Bestandswände und Decke, die selten gerade sind - deshalb messen wir vorher auf, statt nach Standardmaß zu kalkulieren. Tragende Teile bleiben unangetastet.",
        },
        {
          frage: "Wie nah ist die Krummhörn für Sie?",
          antwort:
            "Rund 14 km, also unser nächstes Einsatzgebiet außerhalb von Emden. Auch kleinere Aufträge sind hier deshalb ohne Weiteres möglich. Die Anfahrt steht als eigene Position im Angebot.",
        },
      ],
    },
    umzug: {
      meta:
        "Umzug in der Krummhörn: enge Dorfstraßen und Warften vorher eingeplant, Stellplatz und Tragweg festgelegt. Fester Termin, Möbelmontage, kurze Anfahrt.",
      intro:
        "Umzug in der Krummhörn oder zwischen Krummhörn und Emden: kurze Anfahrt, fester Termin, Möbelmontage auf Wunsch. Auch für Ferienhäuser und Zweitwohnsitze.",
      lage:
        "Die Krummhörn ist nah, aber nicht überall leicht anzufahren. Viele Dörfer liegen auf Warften, die Straßen sind eng, und vor manchen Häusern ist schlicht kein Platz für einen großen Transporter samt Rampe. In Greetsiel kommt in der Saison der Besucherverkehr dazu, der die Frage nach dem Stellplatz verschärft. Das alles ist lösbar, wenn man es vorher weiß - und ärgerlich, wenn es am Umzugstag auffällt.",
      punkte: [
        "Umzüge innerhalb der Krummhörn und in Richtung Emden",
        "Möbel demontieren, transportieren und am Zielort wieder aufbauen",
        "Ferienhäuser und Zweitwohnsitze ein- oder ausräumen, auch in Teilen",
        "Stellplatz und Tragweg vorher festlegen statt am Umzugstag suchen",
        "Räumung und Entsorgung dessen, was nicht mitkommt",
      ],
      ablauf:
        "Wir sehen uns beide Adressen an und legen dabei fest, wo das Fahrzeug steht und wie der Tragweg läuft. In den engen Dorfstraßen ist das die wichtigste halbe Stunde des ganzen Auftrags. Bei Terminen in Greetsiel während der Saison planen wir den Stellplatz besonders sorgfältig. Zu Fahrzeugen und Gewichtsgrenzen steht alles auf der Hauptseite zu Umzügen.",
      faq: [
        {
          frage: "Kommen Sie mit dem Transporter bis vor die Tür?",
          antwort:
            "Nicht überall. In engen Dorfstraßen und auf Warften laden wir manchmal von einem Stellplatz in der Nähe um. Wo das nötig ist, sehen wir bei der Besichtigung und rechnen den längeren Tragweg von vornherein ein, statt ihn am Umzugstag zu entdecken.",
        },
        {
          frage: "Können Sie ein Ferienhaus nur teilweise räumen?",
          antwort:
            "Ja. Wir legen bei der Besichtigung fest, was mitgeht, was bleibt und was entsorgt wird, am besten mit Markierungen vor Ort. Diese Aufstellung ist Teil des Angebots, damit am Tag selbst niemand raten muss.",
        },
        {
          frage: "Lohnt sich ein kleiner Transport bei 14 km?",
          antwort:
            "Ja, die Krummhörn liegt für uns direkt vor der Haustür. Auch ein einzelner Möbeltransport oder eine Teilräumung ist ein normaler Auftrag. Die Anfahrt weisen wir getrennt aus, damit Sie sehen, was der Weg kostet.",
        },
      ],
    },
  },
};

export type LeistungsStadtSeite = {
  leistung: LeistungsSchluessel;
  stadtSlug: string;
  inhalt: LeistungsStadtInhalt;
  /** Fertiger Pfad, z. B. /trockenbau/aurich/ */
  pfad: string;
};

/* Reihenfolge fest verdrahtet, damit Navigation und Sitemap stabil bleiben
   und nicht von der Schlüsselreihenfolge eines Objekts abhängen. */
const reihenfolge: LeistungsSchluessel[] = [
  "entruempelung",
  "entkernung",
  "trockenbau",
  "umzug",
];

export const leistungsStadtSeiten: LeistungsStadtSeite[] = Object.entries(
  inhalte,
).flatMap(([stadtSlug, karte]) =>
  reihenfolge
    .filter((l) => karte[l])
    .map((l) => ({
      leistung: l,
      stadtSlug,
      inhalt: karte[l]!,
      pfad: `/${l}/${stadtSlug}/`,
    })),
);

/** Alle Leistungs-Unterseiten eines Ortes, für die Ortsseite. */
export const seitenFuerStadt = (stadtSlug: string) =>
  leistungsStadtSeiten.filter((s) => s.stadtSlug === stadtSlug);

/** Alle Orte zu einer Leistung, für die Leistungs-Hauptseite. */
export const staedteFuerLeistung = (leistung: LeistungsSchluessel) =>
  leistungsStadtSeiten.filter((s) => s.leistung === leistung);

/* Fällt beim Build auf, wenn ein Ortsschlüssel nicht zu staedte.ts passt -
   besser hier als in einer 404, die niemand bemerkt. */
for (const slug of Object.keys(inhalte)) {
  if (!findeStadt(slug)) {
    throw new Error(
      `leistungsseiten.ts: "${slug}" gibt es in staedte.ts nicht.`,
    );
  }
}
