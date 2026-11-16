/* Ratgeber-Artikel unter /ratgeber/<slug>/.

   Jeder Artikel beginnt mit einer Kurzantwort (2–3 Sätze). Sie steht
   sichtbar oben auf der Seite und ist die Stelle, die Google-Snippets und
   KI-Assistenten am ehesten zitieren - deshalb konkret, mit Zahlen, ohne
   Werbesprache.

   Preise: nur die freigegebenen Ab-Preise aus preise.ts verwenden, nie
   eigene Zahlen in den Text schreiben (siehe Kommentar in preise.ts).

   Rechtliche Aussagen kurz halten und belegen (Gesetz oder BGH-Aktenzeichen)
   und immer auf Beratung durch Fachleute verweisen - wir sind Dienstleister,
   keine Rechtsberatung. */
import { entruempelungPreissatz, preise, preisHinweis } from "./preise";
import { fotos } from "./referenzen";
import { site } from "./site";
import type { FaqItem } from "./faq";

export interface Artikel {
  slug: string;
  /** H1 und Titel der Karte */
  titel: string;
  /** <title> - Marke vorn wie auf allen Seiten */
  metaTitel: string;
  /** Meta-Description, max. ca. 155 Zeichen */
  beschreibung: string;
  /** Kurzantwort oben im Artikel */
  kurzantwort: string;
  /** Fließtext als HTML (h2, p, ul, ol, a) */
  html: string;
  faq: FaqItem[];
  /** Passende Leistungsseiten [Label, Pfad] */
  leistungen: Array<[string, string]>;
  /** ISO-Datum */
  datum: string;
  aktualisiert?: string;
  /** Bildpfad aus referenzen.ts für Hero und Social Preview. Nur setzen,
      wenn ein Foto wirklich zum Thema passt - sonst weglassen, dann zeigt
      die Seite eine neutrale Fläche. Kein Foto mehrfach verwenden. */
  bild?: string;
  bildAlt?: string;
  /** Vorauswahl im Anfrageformular (Schlüssel aus api/anfrage.ts LEISTUNGEN) */
  anfrage?: string;
}

export const artikel: Artikel[] = [
  {
    slug: "was-kostet-eine-entruempelung",
    titel: "Was kostet eine Entrümpelung in Emden und Ostfriesland?",
    metaTitel: "Fixum Objektservice: Was kostet eine Entrümpelung?",
    beschreibung:
      "Entrümpelung in Emden und Ostfriesland: Preise pro m², was den Preis treibt, wie Sie sparen und warum ein Festpreis nach Besichtigung sicherer ist.",
    kurzantwort: `Eine Entrümpelung wird meist nach Wohnfläche und Füllgrad berechnet. Bei uns gelten als Richtwert: ${entruempelungPreissatz} Den Ausschlag geben Menge, Etage, Wege, Sperrgut und Entsorgungsart – deshalb gibt es den verbindlichen Festpreis erst nach einer kostenlosen Besichtigung.`,
    html: `
<h2>So setzt sich der Preis zusammen</h2>
<p>Eine Entrümpelung besteht aus drei Kostenblöcken: der <strong>Arbeitszeit</strong> (Tragen, Demontieren, Sortieren), den <strong>Fahrten</strong> mit dem Transporter und der <strong>Entsorgung</strong> nach Fraktionen – Holz, Metall, Elektro, Sperrmüll und Restmüll werden getrennt abgegeben und einzeln abgerechnet. Wie viel davon anfällt, hängt weniger von der Quadratmeterzahl als vom Füllgrad ab: Eine sparsam eingerichtete 60-m²-Wohnung ist schneller leer als eine 40-m²-Wohnung mit vollen Schränken, Keller und Dachboden.</p>

<h2>Richtwerte pro Quadratmeter</h2>
<ul>
  <li><strong>Normal möbliert:</strong> ${preise.entruempelungNormal.betrag} – übliche Einrichtung mit Möbeln und Hausrat.</li>
  <li><strong>Stark möbliert:</strong> ${preise.entruempelungStark.betrag} – viel Hausrat, volle Keller oder Dachböden.</li>
  <li><strong>Messie-Wohnung:</strong> ${preise.entruempelungMessie.betrag} – mit Schutzausrüstung, Ruhe und ohne Kommentar.</li>
</ul>
<p>${preisHinweis} Für einen ersten Rahmen zu Ihrem Objekt gibt es den <a href="/preisrechner/">Preisrechner</a>.</p>

<h2>Was den Preis nach oben treibt</h2>
<ul>
  <li><strong>Etage ohne Aufzug:</strong> Jede Treppe kostet Zeit – besonders bei Schränken, Waschmaschinen und Klavieren.</li>
  <li><strong>Lange Wege:</strong> Wenn der Transporter nicht vor der Tür halten kann, wird jeder Gang länger.</li>
  <li><strong>Keller, Dachboden, Garage:</strong> Sie werden oft vergessen und sind häufig voller als die Wohnung selbst.</li>
  <li><strong>Fest Verbautes:</strong> Einbauküchen, Wandschränke oder Teppiche, die mit raus sollen, sind Demontage und keine reine Räumung.</li>
  <li><strong>Problemstoffe:</strong> Farben, Lacke, Chemikalien und Altöl müssen gesondert abgegeben werden. Bei Verdacht auf Asbest oder alte Mineralwolle stoppen wir und holen einen zertifizierten Fachbetrieb dazu.</li>
</ul>

<h2>Wie Sie sparen können</h2>
<ul>
  <li><strong>Vorher aussortieren:</strong> Was Familie oder Freunde behalten wollen, sollte vor dem Termin klar markiert sein. Das spart Rückfragen und Zeit.</li>
  <li><strong>Verwertbares anrechnen lassen:</strong> Gut erhaltene Möbel, Werkzeug oder Metall können den Preis senken. Wir rechnen das im Angebot transparent an – solange der Bestand so bleibt wie bei der Besichtigung.</li>
  <li><strong>Arbeitskosten absetzen:</strong> Geht es um Ihren eigenen Haushalt, können Sie nach § 35a EStG 20 Prozent der Arbeits-, Fahrt- und Maschinenkosten von der Steuer abziehen, bis maximal 4.000 Euro im Jahr. Voraussetzung: Die Arbeitskosten stehen getrennt auf der Rechnung und Sie überweisen den Betrag. Ob das in Ihrem Fall gilt, klärt Ihre Steuerberatung.</li>
</ul>

<h2>Warum ein Festpreis sicherer ist als ein Stundensatz</h2>
<p>Ein Stundenlohn klingt günstig, verschiebt aber das Risiko zu Ihnen: Dauert es länger, zahlen Sie mehr. Beim Festpreis nach Besichtigung ist es umgekehrt – wir schauen uns das Objekt an, nennen einen schriftlichen Preis, und wenn der Keller voller ist als gedacht, ist das unser Kalkulationsrisiko. Für den vereinbarten Umfang gibt es keine Nachforderungen.</p>

<h2>Vorsicht bei Angeboten ohne Besichtigung</h2>
<p>Seriöse Preise entstehen vor Ort oder zumindest anhand aussagekräftiger Fotos aller Räume, inklusive Keller und Dachboden. Ein Telefonpreis „ab 199 Euro“ wird am Tag der Räumung häufig nachverhandelt. Fragen Sie deshalb immer nach einem schriftlichen Festpreis und danach, was genau darin enthalten ist: Entsorgung, besenreine Übergabe und Demontagen.</p>
`,
    faq: [
      {
        question: "Was kostet die Entrümpelung einer 3-Zimmer-Wohnung?",
        answer: `Als Faustregel gilt Wohnfläche mal Richtwert: normal möbliert ${preise.entruempelungNormal.betrag}, stark möbliert ${preise.entruempelungStark.betrag}. Keller, Dachboden, Etage und Sperrgut verändern den Preis deutlich – verbindlich ist der Festpreis nach kostenloser Besichtigung.`,
      },
      {
        question: "Ist die Entsorgung im Preis enthalten?",
        answer:
          "Ja. Unsere Festpreise enthalten Arbeit, Fahrten und die getrennte Entsorgung nach Fraktionen. Ausgenommen sind Schadstoffe wie Asbest, für die ein zertifizierter Fachbetrieb nötig ist.",
      },
      {
        question: "Kann ich eine Entrümpelung von der Steuer absetzen?",
        answer:
          "Für den eigenen Haushalt meist ja: Nach § 35a EStG sind 20 Prozent der Arbeits-, Fahrt- und Maschinenkosten absetzbar, maximal 4.000 Euro pro Jahr. Die Rechnung muss diese Kosten getrennt ausweisen und per Überweisung bezahlt werden.",
      },
    ],
    leistungen: [
      ["Entrümpelung", "/entruempelung/"],
      ["Haushaltsauflösung", "/haushaltsaufloesung/"],
      ["Preisrechner", "/preisrechner/"],
    ],
    datum: "2026-11-16",
    bild: fotos.wohnungsaufloesung.pfad,
    bildAlt: fotos.wohnungsaufloesung.alt,
  },

  {
    slug: "haushaltsaufloesung-todesfall-checkliste",
    titel: "Haushaltsauflösung nach einem Todesfall: Checkliste für Angehörige",
    metaTitel: "Fixum Objektservice: Haushaltsauflösung nach Todesfall",
    beschreibung:
      "Haushaltsauflösung nach einem Todesfall: was zuerst zu tun ist, welche Fristen beim Mietvertrag gelten und wie die Räumung ohne Stress gelingt.",
    kurzantwort:
      "Sichern Sie zuerst Dokumente und Wertsachen, klären Sie, wer erbt, und prüfen Sie die Fristen: Erben einer Mietwohnung können innerhalb eines Monats nach Kenntnis vom Tod außerordentlich mit der gesetzlichen Frist kündigen (§ 564 BGB). Die Räumung selbst sollte erst beginnen, wenn feststeht, was behalten, verteilt oder verkauft wird.",
    html: `
<p>Eine Wohnung aufzulösen ist nach einem Todesfall mehr als eine Räumung. Zwischen Trauer, Behördengängen und Erbfragen müssen viele Entscheidungen fallen – oft aus der Ferne, weil Angehörige nicht vor Ort wohnen. Diese Checkliste hilft, die richtige Reihenfolge einzuhalten.</p>

<h2>1. In den ersten Tagen: sichern, nicht räumen</h2>
<ul>
  <li><strong>Wichtige Unterlagen zusammensuchen:</strong> Testament, Versicherungspolicen, Kontoauszüge, Mietvertrag, Rentenbescheide, Verträge (Strom, Telefon, Zeitung, Abos).</li>
  <li><strong>Wertsachen und Erinnerungsstücke sichern:</strong> Schmuck, Bargeld, Fotos, Briefe. Was emotional wichtig ist, gehört nicht in einen Container.</li>
  <li><strong>Wohnung sichern:</strong> Fenster schließen, Heizung auf Frostschutz, Kühlschrank leeren, Briefkasten regelmäßig leeren lassen.</li>
  <li><strong>Nichts wegwerfen, bevor geklärt ist, wer erbt.</strong> Wer vorschnell Dinge verkauft oder verschenkt, kann damit unter Umständen das Erbe annehmen, obwohl eine Ausschlagung sinnvoll gewesen wäre. Im Zweifel vorher anwaltlich oder beim Nachlassgericht beraten lassen.</li>
</ul>

<h2>2. Mietwohnung: Fristen im Blick behalten</h2>
<p>Der Mietvertrag endet nicht automatisch mit dem Tod. Gibt es keine Mitbewohner, die das Mietverhältnis fortsetzen, geht es auf die Erben über. Dann können Erben und Vermieter <strong>innerhalb eines Monats</strong>, nachdem sie vom Tod erfahren haben, außerordentlich mit der gesetzlichen Frist kündigen (§ 564 BGB). Die gesetzliche Frist beträgt in der Regel drei Monate, so lange läuft auch die Miete weiter. Lebten Ehepartner oder Familienangehörige mit in der Wohnung, gelten eigene Regeln (§ 563 BGB).</p>
<p>Fragen Sie den Vermieter früh, ob ein früherer Auszug per Aufhebungsvertrag möglich ist. Viele Vermieter und Wohnungsgenossenschaften sind dazu bereit, wenn die Wohnung zügig übergeben werden kann.</p>

<h2>3. Verträge und Behörden</h2>
<ul>
  <li>Strom, Gas, Wasser: Zählerstände fotografieren und Verträge kündigen oder umschreiben.</li>
  <li>Telefon, Internet, Rundfunkbeitrag, Zeitungen und Mitgliedschaften kündigen. Eine Kopie der Sterbeurkunde reicht meist.</li>
  <li>Einen Nachsendeauftrag bei der Post einrichten, damit keine Rechnung verloren geht.</li>
</ul>

<h2>4. Den Hausrat aufteilen</h2>
<p>Gehen Sie die Wohnung möglichst gemeinsam mit allen Beteiligten durch und markieren Sie, was wer behalten möchte, zum Beispiel mit farbigen Klebepunkten. Was übrig bleibt, lässt sich verkaufen, spenden oder bei der Räumung verwerten. Sozialkaufhäuser und gemeinnützige Einrichtungen in der Region nehmen oft gut erhaltene Möbel und Haushaltswaren an. Fragen Sie dort vorher nach den Annahmebedingungen.</p>

<h2>5. Die Räumung beauftragen</h2>
<p>Holen Sie einen <strong>schriftlichen Festpreis nach Besichtigung</strong> ein und klären Sie vorab:</p>
<ul>
  <li>Ist die Entsorgung enthalten? Wird nach Fraktionen getrennt?</li>
  <li>Wird verwertbarer Hausrat auf den Preis angerechnet?</li>
  <li>Werden Fundstücke wie Dokumente, Fotos oder Bargeld gesammelt und übergeben?</li>
  <li>Muss jemand vor Ort sein, oder reicht die Schlüsselübergabe?</li>
  <li>Wird besenrein übergeben, und was bedeutet das im Mietvertrag? Mehr dazu im Beitrag <a href="/ratgeber/wohnung-besenrein-uebergeben/">Besenrein übergeben</a>.</li>
</ul>
<p>Viele Angehörige wohnen weit weg. Wir arbeiten deshalb auf Wunsch nach Schlüsselübergabe, sammeln persönliche Unterlagen und Erinnerungsstücke für Sie und schicken Fotos per WhatsApp, damit Sie aus der Ferne entscheiden können.</p>

<h2>6. Übergabe an den Vermieter</h2>
<p>Vereinbaren Sie den Übergabetermin erst, wenn die Räumung abgeschlossen ist, und lassen Sie sich ein Übergabeprotokoll unterschreiben. Fotos aller Räume nach der Räumung schützen vor späteren Streitigkeiten.</p>

<p><em>Hinweis: Dieser Beitrag ersetzt keine Rechtsberatung. Bei Erbfragen helfen Nachlassgericht, Notariat oder eine Fachanwaltskanzlei für Erbrecht.</em></p>
`,
    faq: [
      {
        question:
          "Wie schnell muss die Wohnung nach einem Todesfall geräumt sein?",
        answer:
          "Das hängt von der Kündigung ab. Erben können innerhalb eines Monats nach Kenntnis vom Tod außerordentlich mit der gesetzlichen Frist kündigen (§ 564 BGB), in der Regel drei Monate. Bis zum Ende des Mietverhältnisses muss die Wohnung geräumt übergeben sein. Ein früherer Auszug ist per Aufhebungsvertrag möglich.",
      },
      {
        question: "Muss ich bei der Haushaltsauflösung dabei sein?",
        answer:
          "Nein. Nach Schlüsselübergabe räumen wir eigenständig, sammeln Dokumente, Fotos und Erinnerungsstücke und dokumentieren das Ergebnis mit Fotos. Was Sie behalten möchten, legen wir vorher gemeinsam fest.",
      },
      {
        question: "Was passiert mit brauchbaren Möbeln?",
        answer:
          "Verwertbares wird weitergegeben oder verkauft und kann auf den Preis angerechnet werden. Der Rest wird nach Fraktionen getrennt entsorgt.",
      },
    ],
    leistungen: [
      ["Haushaltsauflösung", "/haushaltsaufloesung/"],
      ["Wohnungsräumung", "/wohnungsraeumung/"],
      ["Entrümpelung", "/entruempelung/"],
    ],
    datum: "2026-11-16",
    bild: fotos.wohnungsraeumung.pfad,
    bildAlt: fotos.wohnungsraeumung.alt,
  },

  {
    slug: "wohnung-besenrein-uebergeben",
    titel: "Besenrein übergeben: Was Mieter und Erben wirklich schulden",
    metaTitel: "Fixum Objektservice: Wohnung besenrein übergeben",
    beschreibung:
      "Was heißt besenrein? Was der BGH dazu sagt, was nicht dazugehört und wie die Wohnungsübergabe an Vermieter oder Genossenschaft ohne Streit gelingt.",
    kurzantwort:
      "Besenrein heißt: Die Wohnung ist leer und grob gereinigt. Der Bundesgerichtshof hat entschieden, dass sich die Pflicht zur besenreinen Rückgabe auf die Beseitigung grober Verschmutzungen beschränkt (Urteil vom 28.06.2006, VIII ZR 124/05). Eine Grundreinigung oder Renovierung ist damit nicht gemeint, es sei denn, der Mietvertrag regelt das wirksam anders.",
    html: `
<h2>Was „besenrein“ bedeutet</h2>
<p>Steht im Mietvertrag, die Wohnung sei besenrein zu übergeben, müssen Mieter oder Erben die Räume <strong>leer räumen und grob reinigen</strong>. Der Bundesgerichtshof hat das 2006 klargestellt: Die Pflicht beschränkt sich auf die Beseitigung grober Verschmutzungen (BGH, Urteil vom 28.06.2006, VIII ZR 124/05). Fenster putzen, Fliesen schrubben oder Kalk entfernen gehört nicht dazu.</p>

<h2>Checkliste für die besenreine Übergabe</h2>
<ul>
  <li>Alle Möbel, Hausrat und Müll entfernt, auch aus <strong>Keller, Dachboden, Garage und Abstellraum</strong>. Diese Räume werden besonders oft vergessen.</li>
  <li>Böden gefegt bzw. Teppichböden abgesaugt.</li>
  <li>Grobe Verschmutzungen beseitigt, zum Beispiel Essensreste, Flecken, Spinnweben.</li>
  <li>Dübel, Nägel und Haken je nach Mietvertrag entfernt oder belassen. Fragen Sie im Zweifel den Vermieter.</li>
  <li>Einbauten des Mieters zurückgebaut, wenn der Vermieter das verlangt.</li>
  <li>Alle Schlüssel vollständig, einschließlich Keller- und Briefkastenschlüssel.</li>
</ul>

<h2>Was nicht zu besenrein gehört</h2>
<ul>
  <li><strong>Grundreinigung:</strong> Fenster, Fliesenfugen, Backofen und Kalkablagerungen.</li>
  <li><strong>Schönheitsreparaturen:</strong> Ob gestrichen werden muss, regelt allein der Mietvertrag. Viele ältere Klauseln dazu sind unwirksam. Lassen Sie das im Zweifel prüfen, etwa beim Mieterverein.</li>
  <li><strong>Schäden über die normale Abnutzung hinaus:</strong> Diese sind kein Reinigungsthema, sondern eine Frage der Haftung.</li>
</ul>

<h2>Wohnungsgenossenschaften und Vorabnahme</h2>
<p>Viele Genossenschaften und Hausverwaltungen machen vor dem Auszug eine <strong>Vorabnahme</strong> und geben eine Liste mit, was raus muss und was bleiben darf. Diese Liste ist die beste Arbeitsgrundlage für die Räumung. Geben Sie sie Ihrem Räumungsbetrieb vorab, dann wird genau das erledigt, was die Abnahme verlangt, nicht mehr und nicht weniger.</p>

<h2>Übergabe ohne Streit</h2>
<ul>
  <li>Fotografieren Sie jeden Raum nach der Räumung, mit Datum.</li>
  <li>Lassen Sie sich bei der Übergabe ein <strong>Protokoll</strong> mit allen Mängeln unterschreiben. Was dort nicht steht, ist später schwer nachzufordern.</li>
  <li>Lesen Sie die Zählerstände gemeinsam ab.</li>
</ul>
<p>Bei uns ist die besenreine Übergabe im Festpreis enthalten. Beanstandet der Vermieter oder die Genossenschaft bei der Abnahme etwas, das zu unserer Leistung gehört, bessern wir kostenlos nach.</p>

<p><em>Hinweis: Dieser Beitrag ersetzt keine Rechtsberatung. Bei Streit um Kaution oder Schönheitsreparaturen helfen Mieterverein oder eine Fachanwaltskanzlei für Mietrecht.</em></p>
`,
    faq: [
      {
        question: "Muss ich bei besenreiner Übergabe die Fenster putzen?",
        answer:
          "Nein. Besenrein heißt nach der Rechtsprechung des BGH nur, dass grobe Verschmutzungen beseitigt sind (VIII ZR 124/05). Fenster putzen gehört zur Grundreinigung, die nur geschuldet ist, wenn der Mietvertrag das wirksam vereinbart.",
      },
      {
        question: "Gehören Keller und Dachboden zur besenreinen Übergabe?",
        answer:
          "Ja. Alle mitvermieteten Räume müssen leer und grob gereinigt sein, also auch Keller, Dachboden, Garage und Abstellräume.",
      },
      {
        question: "Ist die besenreine Übergabe bei Fixum im Preis enthalten?",
        answer:
          "Ja. Räumung und besenreine Übergabe sind im Festpreis enthalten. Beanstandet der Vermieter etwas, das zu unserer Leistung gehört, bessern wir kostenlos nach.",
      },
    ],
    leistungen: [
      ["Wohnungsräumung", "/wohnungsraeumung/"],
      ["Für Hausverwaltungen", "/fuer-hausverwaltungen/"],
      ["Entrümpelung", "/entruempelung/"],
    ],
    datum: "2026-11-16",
    bild: fotos.messieNachher.pfad,
    bildAlt: fotos.messieNachher.alt,
  },

  {
    slug: "sperrmuell-emden-oder-entruempelungsfirma",
    titel: "Sperrmüll in Emden oder Entrümpelungsfirma – was lohnt sich?",
    metaTitel: "Fixum Objektservice: Sperrmüll Emden oder Entrümpelung?",
    beschreibung:
      "Sperrmüll in Emden: was die städtische Abfuhr mitnimmt, wo die Grenzen liegen und wann sich eine Entrümpelungsfirma mehr lohnt.",
    kurzantwort:
      "In Emden kann jeder Haushalt Sperrmüll bis zu 4 m³ nach vorheriger Anmeldung beim Bau- und Entsorgungsbetrieb Emden (BEE) gegen Gebühr abholen lassen. Das reicht für einzelne Möbel. Eine Entrümpelungsfirma lohnt sich, wenn es mehr ist, wenn getragen und demontiert werden muss, wenn Bau- und Umbauabfälle dabei sind oder wenn ein fester Termin zählt.",
    html: `
<h2>Was die Sperrmüllabfuhr in Emden leistet</h2>
<p>In Emden ist der <strong>Bau- und Entsorgungsbetrieb Emden (BEE)</strong> zuständig. Sperrmüll wird nicht zu festen Terminen eingesammelt, sondern auf Anmeldung abgeholt, telefonisch oder über das Online-Formular auf bee-emden.de. Die Abholung kostet eine Gebühr. Pro Abholung sind bis zu <strong>4 m³</strong> möglich.</p>
<p>Zum Sperrmüll zählen zum Beispiel Schränke, Kommoden, Regale, Sofas, Betten, Matratzen, Teppiche, Fahrräder sowie Wasch- und Spülmaschinen, Trockner und Herde. <strong>Nicht</strong> dazu gehören Abfälle aus Bau- und Umbauarbeiten.</p>
<p>Wichtig für die Planung: Die Termine sind gefragt. Der BEE weist auf seiner Website darauf hin, dass Sperrmüll zeitweise ausgebucht ist und es zu Verzögerungen kommt. Wer einen festen Auszugstermin hat, sollte früh anmelden oder eine andere Lösung einplanen.</p>

<h2>Wann der Sperrmüll reicht</h2>
<ul>
  <li>Es geht um einzelne Möbelstücke oder ein Zimmer.</li>
  <li>Sie können die Sachen selbst an die Straße stellen.</li>
  <li>Es gibt keinen engen Termin, zum Beispiel keine Wohnungsübergabe.</li>
</ul>

<h2>Wann eine Entrümpelungsfirma die bessere Wahl ist</h2>
<ul>
  <li><strong>Mehr als 4 m³:</strong> Eine normal möblierte Wohnung kommt schnell auf ein Vielfaches davon, Keller und Dachboden nicht mitgerechnet.</li>
  <li><strong>Tragen und Demontieren:</strong> Schrankwände abbauen, Waschmaschinen aus dem Keller holen, Treppen ohne Aufzug: Das nimmt Ihnen die Abfuhr nicht ab.</li>
  <li><strong>Gemischte Abfälle:</strong> Neben Möbeln fallen fast immer Hausrat, Elektrogeräte, Holz, Metall und Restmüll an. Wir trennen nach Fraktionen und bringen alles zu den passenden Annahmestellen.</li>
  <li><strong>Bau- und Umbauabfälle:</strong> Alte Böden, Vertäfelungen oder Wandverkleidungen sind kein Sperrmüll.</li>
  <li><strong>Termin und Übergabe:</strong> Wenn die Wohnung zu einem festen Tag besenrein sein muss, zählt Planbarkeit mehr als der günstigste Weg.</li>
</ul>

<h2>Die Kombination aus beidem</h2>
<p>Manchmal ist eine Mischung sinnvoll: Was Sie selbst rausstellen können, geht über den Sperrmüll. Für den Rest, also schwere Teile, Keller oder die besenreine Übergabe, holen Sie sich ein Festpreisangebot. Sagen Sie uns bei der Besichtigung einfach, was schon angemeldet ist. Dann rechnen wir nur den Rest.</p>
`,
    faq: [
      {
        question: "Wie viel Sperrmüll holt die Stadt Emden ab?",
        answer:
          "Laut Bau- und Entsorgungsbetrieb Emden kann jeder Haushalt Sperrmüll bis zu 4 m³ nach vorheriger Anmeldung abholen lassen. Die Abholung ist gebührenpflichtig.",
      },
      {
        question: "Ist Bauschutt Sperrmüll?",
        answer:
          "Nein. Abfälle aus Bau- und Umbauarbeiten gehören nicht zum Sperrmüll und müssen gesondert entsorgt werden.",
      },
      {
        question: "Was ist, wenn der Sperrmülltermin zu spät kommt?",
        answer:
          "Dann ist eine Entrümpelung zum festen Termin die sicherere Lösung. Der BEE weist selbst darauf hin, dass es bei der Sperrmüllabfuhr zeitweise zu Verzögerungen kommt.",
      },
    ],
    leistungen: [
      ["Entrümpelung", "/entruempelung/"],
      ["Haushaltsauflösung", "/haushaltsaufloesung/"],
      ["Preisrechner", "/preisrechner/"],
    ],
    datum: "2026-11-16",
    bild: fotos.abstellraum.pfad,
    bildAlt: fotos.abstellraum.alt,
    anfrage: "entruempelung",
  },

  {
    slug: "umzug-checkliste",
    titel: "Umzug planen: Checkliste für einen stressfreien Umzugstag",
    metaTitel: "Fixum Objektservice: Umzug planen – Checkliste",
    beschreibung:
      "Umzug in Emden und Ostfriesland planen: Halteverbot, Kartons, Großgeräte, Möbelmontage und was am Umzugstag wirklich zählt – auch beim Firmenumzug.",
    kurzantwort: `Ein guter Umzug wird vorher entschieden: Halteverbot rechtzeitig bei der Straßenverkehrsbehörde beantragen (meist rund zwei Wochen Vorlauf), Kartons beschriften, Großgeräte vorbereiten und klären, welche Möbel demontiert werden müssen. Bei uns gilt als Richtwert: ${preise.umzug.leistung} ${preise.umzug.betrag}. ${preisHinweis}`,
    html: `
<h2>4 bis 6 Wochen vorher</h2>
<ul>
  <li><strong>Umfang klären:</strong> Was kommt mit, was wird verkauft, verschenkt oder entsorgt? Jedes Teil, das nicht umzieht, spart Zeit und Geld.</li>
  <li><strong>Angebot einholen:</strong> Am besten nach Besichtigung oder anhand von Fotos aller Räume, inklusive Keller, Dachboden und Schuppen.</li>
  <li><strong>Mietverträge und Termine:</strong> Kündigungsfrist, Übergabetermin der alten Wohnung und Schlüsselübergabe der neuen aufeinander abstimmen.</li>
</ul>

<h2>2 bis 3 Wochen vorher</h2>
<ul>
  <li><strong>Halteverbot beantragen:</strong> Ein Halteverbot vor der Tür beantragen Sie bei der Straßenverkehrsbehörde Ihrer Stadt oder Ihres Landkreises. Planen Sie rund zwei Wochen Vorlauf ein. Die genauen Fristen und Gebühren nennt die Behörde. Kurze Tragewege sparen am Umzugstag mehr Zeit als jeder zusätzliche Helfer.</li>
  <li><strong>Kartons packen:</strong> Schwere Sachen wie Bücher in kleine Kartons, leichte in große. Jeden Karton mit Zielraum beschriften.</li>
  <li><strong>Ummelden und Nachsendeauftrag:</strong> Nachsendeauftrag bei der Post einrichten, Verträge mit der neuen Adresse versehen.</li>
</ul>

<h2>Die Woche davor</h2>
<ul>
  <li><strong>Kühlschrank und Gefriertruhe:</strong> Rechtzeitig leeren und abtauen. Nach dem Transport einige Stunden stehen lassen, bevor sie wieder eingeschaltet werden. Die Herstellerangaben gehen vor.</li>
  <li><strong>Waschmaschine:</strong> Transportsicherung einsetzen, falls vorhanden. Ohne Sicherung kann die Trommel beim Transport Schaden nehmen.</li>
  <li><strong>Möbel:</strong> Klären, was zerlegt werden muss, zum Beispiel große Schränke, Betten und verschraubte Arbeitsplatten. Schrauben pro Möbelstück in einen beschrifteten Beutel.</li>
  <li><strong>Wertsachen und Unterlagen</strong> transportieren Sie selbst.</li>
</ul>

<h2>Am Umzugstag</h2>
<ul>
  <li>Eine Person, die vor Ort entscheidet, wohin was kommt.</li>
  <li>Zählerstände in alter und neuer Wohnung fotografieren.</li>
  <li>Nach dem Ausladen die alte Wohnung besenrein übergeben. Mehr dazu im Beitrag <a href="/ratgeber/wohnung-besenrein-uebergeben/">Besenrein übergeben</a>.</li>
</ul>

<h2>Sonderfall Firmenumzug</h2>
<p>Bei Werkstätten, Lagern und Büros lohnt eine eigene Planung. Regale und verschraubte Werkbänke müssen in transportfähige Teile zerlegt werden, und schwere Geräte wie Hubwagen brauchen einen eigenen Transport. Packen und beschriften können die Mitarbeitenden oft selbst. Das spart Kosten. Wichtig ist ein Plan für den neuen Standort: Was steht wo, damit am nächsten Werktag weitergearbeitet werden kann.</p>

<h2>Auch kurze Wege brauchen Planung</h2>
<p>Ein Umzug „nur ein paar Häuser weiter“ wird gern unterschätzt. Die Fahrt ist kurz, aber Tragen, Treppen, Großgeräte und Möbelmontage bleiben gleich. Kombiniert man den Umzug mit dem Ausräumen von Schuppen, Garage oder Dachboden, ist alles an einem Tag erledigt.</p>
`,
    faq: [
      {
        question: "Wie früh muss ich ein Halteverbot für den Umzug beantragen?",
        answer:
          "Rechnen Sie mit rund zwei Wochen Vorlauf bei der zuständigen Straßenverkehrsbehörde. Die genauen Fristen und Gebühren legt die jeweilige Stadt oder der Landkreis fest.",
      },
      {
        question: "Was kostet ein Umzug in Emden?",
        answer: `Als Richtwert gilt: ${preise.umzug.leistung} ${preise.umzug.betrag}. Menge, Etagen, Wege und Möbelmontage verändern den Preis. Verbindlich ist der Festpreis nach Besichtigung.`,
      },
      {
        question: "Bauen Sie Möbel und Küchen ab und wieder auf?",
        answer:
          "Ja, Demontage und Montage von Möbeln und Küchen gehören dazu. Elektro-, Gas- und Wasseranschlüsse übernimmt ein zugelassener Fachbetrieb.",
      },
    ],
    leistungen: [
      ["Umzüge & Transporte", "/umzug/"],
      ["Möbel- & Küchenmontage", "/kuechenmontage/"],
      ["Entrümpelung", "/entruempelung/"],
    ],
    datum: "2026-11-16",
    bild: fotos.umzug.pfad,
    bildAlt: fotos.umzug.alt,
    anfrage: "umzug",
  },

  {
    slug: "winterdienst-pflichten-eigentuemer",
    titel: "Winterdienst: Welche Pflichten Eigentümer und Vermieter haben",
    metaTitel: "Fixum Objektservice: Winterdienst-Pflichten für Eigentümer",
    beschreibung:
      "Räum- und Streupflicht im Winter: wer zuständig ist, wo die Regeln stehen, ob man sie abgeben kann und wie sich die Kosten absetzen lassen.",
    kurzantwort:
      "Fast alle Kommunen übertragen die Räum- und Streupflicht für Gehwege per Straßenreinigungssatzung auf die Grundstückseigentümer. Uhrzeiten, Breiten und Ausnahmen stehen in der Satzung Ihrer Stadt oder Gemeinde. Die Pflicht lässt sich an Mieter oder einen Dienstleister übertragen, kontrollieren muss der Eigentümer aber weiterhin.",
    html: `
<h2>Wer räumen und streuen muss</h2>
<p>Die Räum- und Streupflicht auf öffentlichen Gehwegen liegt zunächst bei der Kommune. Fast alle Städte und Gemeinden übertragen sie aber über ihre <strong>Straßenreinigungssatzung</strong> auf die Eigentümer der angrenzenden Grundstücke. Was genau gilt, ab welcher Uhrzeit, in welcher Breite und an welchen Tagen, steht in der Satzung oder Verordnung Ihrer Stadt oder Gemeinde. Die Regeln unterscheiden sich von Ort zu Ort, auch innerhalb Ostfrieslands.</p>

<h2>Was in der Praxis dazugehört</h2>
<ul>
  <li><strong>Gehweg vor dem Grundstück</strong> von Schnee räumen und bei Glätte streuen, in der Breite, die die Satzung vorgibt.</li>
  <li><strong>Zugänge</strong> zum Haus, zu Mülltonnen und Briefkästen sicher halten. Das liegt im eigenen Interesse, weil Sie für Stürze auf Ihrem Grundstück haften können.</li>
  <li><strong>Wiederholen</strong>, wenn es weiter schneit oder friert.</li>
  <li><strong>Nach dem Winter:</strong> Viele Satzungen verlangen, dass Streugut wieder zusammengekehrt wird.</li>
</ul>

<h2>Kann ich die Pflicht abgeben?</h2>
<p>Ja, an Mieter (über den Mietvertrag oder die Hausordnung) oder an einen Dienstleister. Der Eigentümer bleibt aber in der Verantwortung, regelmäßig zu kontrollieren, ob tatsächlich geräumt wird. Bei einem Dienstleister sollten Sie schriftlich festhalten, welche Flächen betreut werden, ab wann geräumt wird und wie Einsätze dokumentiert werden.</p>

<h2>Besonders kritisch: leerstehende Häuser und Abwesenheit</h2>
<p>Steht ein Haus leer oder sind Sie über den Winter verreist, räumt niemand „nebenbei“. Gerade dann lohnt ein fester Winterdienst. Häufig lässt er sich mit einer regelmäßigen Kontrolle des Hauses verbinden, siehe <a href="/ratgeber/haus-leerstand-winter/">Leerstehendes Haus im Winter</a>.</p>

<h2>Kosten absetzen</h2>
<p>Winterdienst durch einen Dienstleister zählt zu den haushaltsnahen Dienstleistungen. Nach § 35a EStG sind 20 Prozent der Arbeitskosten von der Steuer abziehbar. Der Bundesfinanzhof hat das auch für den Gehweg vor dem eigenen Grundstück bestätigt (BFH, Urteil vom 20.03.2014, VI R 55/12). Voraussetzung: Die Arbeitskosten stehen auf der Rechnung und werden überwiesen.</p>

<p><em>Hinweis: Dieser Beitrag ersetzt keine Rechtsberatung. Maßgeblich ist die Satzung Ihrer Kommune.</em></p>
`,
    faq: [
      {
        question: "Wo finde ich die Winterdienst-Regeln für meinen Ort?",
        answer:
          "In der Straßenreinigungssatzung bzw. -verordnung Ihrer Stadt oder Gemeinde. Dort stehen Uhrzeiten, Breiten und welche Straßen betroffen sind.",
      },
      {
        question: "Bin ich als Vermieter raus, wenn die Mieter räumen müssen?",
        answer:
          "Nicht ganz. Die Pflicht kann übertragen werden, der Eigentümer muss aber kontrollieren, dass sie auch erfüllt wird.",
      },
      {
        question: "Kann ich einen Winterdienst von der Steuer absetzen?",
        answer:
          "Ja, als haushaltsnahe Dienstleistung nach § 35a EStG: 20 Prozent der Arbeitskosten, auch für den öffentlichen Gehweg vor dem Grundstück (BFH VI R 55/12).",
      },
    ],
    leistungen: [
      ["Winterdienst & Außenanlagen", "/winterdienst/"],
      ["Hausmeisterservice", "/hausmeisterservice/"],
      ["Für Hausverwaltungen", "/fuer-hausverwaltungen/"],
    ],
    datum: "2026-11-16",
    anfrage: "sonstiges",
  },

  {
    slug: "haus-leerstand-winter",
    titel: "Leerstehendes Haus im Winter: So vermeiden Sie Schäden",
    metaTitel: "Fixum Objektservice: Leerstehendes Haus im Winter sichern",
    beschreibung:
      "Haus steht leer oder Sie sind monatelang weg? Was Wohngebäudeversicherungen verlangen, was regelmäßig kontrolliert werden sollte und wie eine Hausbetreuung hilft.",
    kurzantwort:
      "Wer ein Haus im Winter nicht bewohnt, muss es nach den üblichen Versicherungsbedingungen ausreichend beheizen und regelmäßig kontrollieren oder die Wasserleitungen absperren und entleeren. Sonst kann die Wohngebäudeversicherung bei Frost- und Wasserschäden kürzen. Ein fester Kontrollrhythmus mit kurzem Protokoll schützt Haus und Versicherungsschutz.",
    html: `
<h2>Was die Versicherung erwartet</h2>
<p>Die meisten Wohngebäudeversicherungen enthalten Pflichten für die kalte Jahreszeit: Das Gebäude muss <strong>ausreichend beheizt</strong> und das <strong>genügend häufig kontrolliert</strong> werden. Nicht genutzte Gebäude oder Gebäudeteile müssen außerdem kontrolliert werden, und die wasserführenden Leitungen sind dort <strong>abzusperren, zu entleeren und entleert zu halten</strong>. Wer das versäumt, riskiert nach einem Rohrbruch Kürzungen. Gerichte haben auch klargestellt: Dass noch Möbel im Haus stehen, macht es nicht zu einem bewohnten Haus.</p>
<p>Melden Sie längeren Leerstand außerdem Ihrer Versicherung. Welche Fristen und Pflichten genau gelten, steht in Ihren Vertragsbedingungen.</p>

<h2>Checkliste für Abwesenheit oder Leerstand</h2>
<ul>
  <li><strong>Heizung:</strong> Nicht abschalten, sondern auf eine frostsichere Temperatur einstellen. Funktion regelmäßig prüfen.</li>
  <li><strong>Wasser:</strong> Leitungen in ungenutzten Bereichen absperren und entleeren, Außenhähne frostsicher machen.</li>
  <li><strong>Lüften:</strong> Kurz stoßlüften bei Kontrollen, damit sich keine Feuchtigkeit und kein Schimmel bilden.</li>
  <li><strong>Außen:</strong> Laub von Wegen, Eingang und Terrasse entfernen, Dachrinnen und Abläufe frei halten.</li>
  <li><strong>Post und Eindruck:</strong> Briefkasten leeren, damit das Haus nicht verlassen wirkt.</li>
  <li><strong>Winterdienst:</strong> Auch ein leeres Haus hat eine Räum- und Streupflicht, siehe <a href="/ratgeber/winterdienst-pflichten-eigentuemer/">Winterdienst-Pflichten</a>.</li>
</ul>

<h2>Wie oft kontrollieren?</h2>
<p>Das hängt von Haus, Heizung und Witterung ab und davon, was Ihr Versicherungsvertrag verlangt. Bewährt hat sich ein fester Rhythmus, zum Beispiel ein Einsatz pro Monat, plus zusätzliche Kurzkontrollen bei starkem Frost oder nach Sturm. Jede Kontrolle sollte kurz dokumentiert werden: Datum, Temperatur, Auffälligkeiten, Fotos.</p>

<h2>Hausbetreuung durch einen Dienstleister</h2>
<p>Wenn Sie weit weg wohnen, übernimmt ein Hausmeisterservice die Kontrollen. Sinnvoll ist eine feste Pauschale pro Einsatz, ein vereinbarter Rhythmus und eine kurze Rückmeldung mit Fotos nach jedem Besuch. Grünschnitt, Laub und kleinere Arbeiten lassen sich direkt mit erledigen.</p>
`,
    faq: [
      {
        question: "Muss ich ein leerstehendes Haus im Winter heizen?",
        answer:
          "Nach den üblichen Bedingungen der Wohngebäudeversicherung: Entweder ausreichend beheizen und regelmäßig kontrollieren oder in nicht genutzten Bereichen die Wasserleitungen absperren und entleeren. Maßgeblich sind Ihre Vertragsbedingungen.",
      },
      {
        question: "Wie oft sollte ein leeres Haus kontrolliert werden?",
        answer:
          "Ein fester Rhythmus, etwa monatlich, plus Kurzkontrollen bei starkem Frost oder Sturm hat sich bewährt. Entscheidend ist, was Ihre Versicherung verlangt.",
      },
      {
        question: "Gilt ein Haus mit Möbeln als bewohnt?",
        answer:
          "Nein. Gerichte haben entschieden, dass das bloße Lagern von Möbeln keine Nutzung im Sinne der Wohngebäudeversicherung ist.",
      },
    ],
    leistungen: [
      ["Hausmeisterservice", "/hausmeisterservice/"],
      ["Winterdienst & Außenanlagen", "/winterdienst/"],
    ],
    datum: "2026-11-16",
    bild: fotos.dachzimmer.pfad,
    bildAlt: fotos.dachzimmer.alt,
    anfrage: "sonstiges",
  },

  {
    slug: "trockenbau-altbau-holzbalkendecke",
    titel: "Trockenbau im Altbau: Dielen, Holzbalken und schiefe Böden",
    metaTitel: "Fixum Objektservice: Trockenbau im Altbau",
    beschreibung:
      "Altbau mit Holzbalkendecke und Dielenboden ausbauen: was vor dem Trockenbau geklärt werden muss, wie Boden, Decke und Wände aufgebaut werden.",
    kurzantwort: `Im Altbau entscheidet der Untergrund: Bevor Trockenbau beginnt, müssen Holzbalken, Dielen und vorhandener Estrich geprüft und ausgeglichen werden. Bewährt hat sich die Reihenfolge Rückbau, Boden ausgleichen, Decke, Wände, Oberflächen. Als Richtwert gilt bei uns: ${preise.trockenbau.leistung} ${preise.trockenbau.betrag}. ${preisHinweis}`,
    html: `
<h2>Erst prüfen, dann planen</h2>
<p>Altbauten in Ostfriesland haben oft <strong>Holzbalkendecken mit Dielenböden</strong>, in Teilen auch alte Estriche, die über die Jahre schief geworden sind. Vor dem Ausbau sollte klar sein:</p>
<ul>
  <li>Sind die Balken tragfähig, trocken und frei von Schädlingen? Bei Zweifeln gehört ein Statiker oder Sachverständiger dazu.</li>
  <li>Wie stark weichen Böden und Wände von der Ebene ab?</li>
  <li>Wo laufen Leitungen? Anschlüsse an Strom, Wasser und Heizung legt ein zugelassener Fachbetrieb.</li>
  <li>Gibt es Hinweise auf Schadstoffe, etwa alte Dämmwolle oder asbesthaltige Bauteile? Dann zuerst prüfen lassen.</li>
</ul>

<h2>Der Boden: Dielen raus oder drauf aufbauen?</h2>
<p>Beides ist möglich. Bei losen oder beschädigten Dielen werden sie entfernt, die Balken bei Bedarf aufgedoppelt und mit Holzwerkstoffplatten belegt. Darauf kommt ein <strong>Trockenestrich</strong>. Sind die Dielen fest, kann auch direkt darauf aufgebaut werden, mit Ausgleich und passender Trittschalldämmung. Wo ein alter Estrich schief ist, wird er mit Ausgleichsmasse in die Ebene gebracht. Oft gibt es beides in einem Geschoss, und dann müssen beide Aufbauten am Ende auf gleicher Höhe enden.</p>

<h2>Decke und Wände</h2>
<ul>
  <li><strong>Decke:</strong> Unter Holzbalkendecken wird eine Unterkonstruktion gesetzt und mit Gipskarton beplankt. Das ergibt eine ebene Fläche und Platz für Leitungen und Einbauleuchten.</li>
  <li><strong>Vorsatzschalen:</strong> Krumme Altbauwände werden nicht verputzt, sondern mit einer Vorsatzschale gerade gestellt.</li>
  <li><strong>Bäder:</strong> In Feuchträumen gehören imprägnierte Platten und eine Abdichtung unter die Fliesen.</li>
</ul>

<h2>Die richtige Reihenfolge</h2>
<ol>
  <li>Räumen und nicht tragende Bauteile zurückbauen</li>
  <li>Untergrund prüfen, Leitungen durch Fachbetriebe vorbereiten</li>
  <li>Boden ausgleichen bzw. neu aufbauen</li>
  <li>Decke und Vorsatzschalen</li>
  <li>Spachteln, Oberflächen, Bodenbelag, Türen</li>
</ol>
<p>Wer Räumung, Rückbau und Ausbau von einem Betrieb machen lässt, spart Wartezeit zwischen den Gewerken und Diskussionen darüber, wer welchen Schaden verursacht hat.</p>

<h2>Material selbst kaufen?</h2>
<p>Möglich, und für manche Bauherren sinnvoll. Wichtig ist dann eine genaue Materialliste vom Ausführenden, damit nichts fehlt und keine Wartezeiten entstehen. Alternativ übernimmt der Betrieb die Beschaffung, mit Kostenvoranschlag vorab.</p>
`,
    faq: [
      {
        question: "Kann man Trockenestrich auf Dielen verlegen?",
        answer:
          "Ja, wenn die Dielen fest und tragfähig sind, mit Ausgleich und passender Trittschalldämmung. Lose oder beschädigte Dielen werden vorher entfernt und durch Holzwerkstoffplatten ersetzt.",
      },
      {
        question: "Was kostet Trockenbau im Altbau?",
        answer: `Als Richtwert gilt: ${preise.trockenbau.leistung} ${preise.trockenbau.betrag}. Untergrund, Ausgleich und Sonderbauteile verändern den Preis. Verbindlich ist der Festpreis nach Besichtigung.`,
      },
      {
        question: "Wer macht Strom und Wasser beim Ausbau?",
        answer:
          "Anschlüsse an Strom, Wasser und Heizung übernehmen zugelassene Fachbetriebe. Wir stimmen die Termine mit ihnen ab.",
      },
    ],
    leistungen: [
      ["Trockenbau", "/trockenbau/"],
      ["Rückbau + Trockenbau", "/rueckbau-trockenbau/"],
      ["Kernsanierung vorbereiten", "/kernsanierung/"],
    ],
    datum: "2026-11-16",
    bild: fotos.altbauTrockenbau.pfad,
    bildAlt: fotos.altbauTrockenbau.alt,
    anfrage: "trockenbau",
  },

  {
    slug: "feuchte-wand-vor-dem-innenausbau",
    titel: "Feuchte Wand: Was vor dem Innenausbau passieren muss",
    metaTitel: "Fixum Objektservice: Feuchte Wand vor dem Innenausbau",
    beschreibung:
      "Feuchte Außenwand oder mürber Sockelputz? Warum zuerst die Ursache behoben und die Wand getrocknet werden muss, bevor gespachtelt, verkleidet oder gestrichen wird.",
    kurzantwort:
      "Erst die Ursache, dann der Ausbau: Feuchtigkeit in der Wand muss von einem Fachbetrieb behoben werden, etwa mit einer Horizontalsperre oder einem Sanierputz. Danach muss die Wand trocknen, und erst wenn eine Messung das bestätigt, folgt der Innenausbau. Wer vorher verkleidet oder spachtelt, schließt die Feuchtigkeit ein.",
    html: `
<h2>Typische Anzeichen</h2>
<ul>
  <li>Dunkle Flecken oder Ränder im unteren Wandbereich</li>
  <li>Mürber, abbröckelnder Putz am Sockel, Salzausblühungen</li>
  <li>Muffiger Geruch, Schimmel hinter Möbeln</li>
  <li>Tapete, die sich unten löst</li>
</ul>

<h2>Warum man nicht einfach drüber baut</h2>
<p>Eine neue Vorsatzschale oder frische Spachtelung sieht zunächst gut aus. Bleibt die Ursache aber bestehen, wandert die Feuchtigkeit weiter und zeigt sich nach einigen Monaten wieder, dann hinter der neuen Oberfläche. Das kostet doppelt.</p>

<h2>Die sinnvolle Reihenfolge</h2>
<ol>
  <li><strong>Ursache klären:</strong> aufsteigende Feuchte, eine defekte Leitung, Kondensat oder ein Schaden von außen? Das gehört in die Hände eines Fachbetriebs für Bautenschutz.</li>
  <li><strong>Ursache beheben:</strong> zum Beispiel Horizontalsperre, Abdichtung oder Sanierputz durch den Fachbetrieb.</li>
  <li><strong>Trocknen lassen:</strong> je nach Wand und Jahreszeit mehrere Wochen, auf Wunsch mit Bautrockner.</li>
  <li><strong>Messen:</strong> Erst wenn eine Kontrollmessung bestätigt, dass die Wand trocken genug ist, geht es weiter.</li>
  <li><strong>Innenausbau:</strong> Spachteln, Dämmung, Boden und Anstrich.</li>
</ol>

<h2>Worauf es beim Ausbau ankommt</h2>
<ul>
  <li><strong>Hohlräume und Leitungen:</strong> Gerade im Sockelbereich älterer Häuser verlaufen manchmal Leitungen, auch Gas. Vor dem Bohren oder Abschlagen klären, was in der Wand liegt.</li>
  <li><strong>Diffusionsoffene Materialien:</strong> Nach einer Sanierung sollten Putz und Farbe Feuchtigkeit abgeben können. Fragen Sie den Bautenschutz-Fachbetrieb, welche Oberflächen er empfiehlt.</li>
  <li><strong>Heizkörper:</strong> Für die Arbeiten demontieren und danach wieder montieren lassen, statt um sie herum zu arbeiten.</li>
</ul>

<h2>Ein Ansprechpartner für den Ausbau</h2>
<p>Die Abdichtung macht der Fachbetrieb, den Rest ein Ausbaubetrieb. Bewährt hat sich, wenn beide sich direkt abstimmen. Dann muss der Auftraggeber keine Termine hin- und herschieben, und der Ausbau beginnt genau dann, wenn die Wand bereit ist.</p>
`,
    faq: [
      {
        question:
          "Kann ich eine feuchte Wand einfach mit Trockenbau verkleiden?",
        answer:
          "Nein. Ohne Behebung der Ursache bleibt die Feuchtigkeit in der Wand und zeigt sich später hinter der Verkleidung. Erst sanieren, trocknen, messen, dann ausbauen.",
      },
      {
        question: "Wie lange muss eine Wand nach der Sanierung trocknen?",
        answer:
          "Je nach Wand, Material und Jahreszeit mehrere Wochen. Entscheidend ist eine Kontrollmessung vor Beginn des Innenausbaus.",
      },
    ],
    leistungen: [
      ["Renovierung", "/renovierung/"],
      ["Trockenbau", "/trockenbau/"],
      ["Bodenverlegung", "/bodenverlegung/"],
    ],
    datum: "2026-11-16",
    bild: fotos.dachausbauTrockenbau.pfad,
    bildAlt: fotos.dachausbauTrockenbau.alt,
    anfrage: "trockenbau",
  },

  {
    slug: "gewerbeflaeche-rueckbau-mietende",
    titel: "Gewerbefläche zurückgeben: Rückbau und Räumung bei Mietende",
    metaTitel: "Fixum Objektservice: Gewerbefläche zurückbauen bei Mietende",
    beschreibung:
      "Laden, Büro oder Praxis aufgeben: was der Mieter bei Mietende zurückbauen muss, wie man den Rückbau plant und was Fachbetriebe übernehmen.",
    kurzantwort:
      "Bei Mietende muss der Mieter die Räume zurückgeben (§ 546 BGB) und eigene Einbauten grundsätzlich entfernen, also den ursprünglichen Zustand wiederherstellen, soweit nichts anderes vereinbart ist. Wer rechtzeitig plant, mit Vermieter-Abstimmung, Aufmaß und festem Zeitfenster, vermeidet Mietausfall-Forderungen und Nachverhandlungen.",
    html: `
<h2>Was zurückgebaut werden muss</h2>
<p>Grundsätzlich gilt: Was der Mieter eingebaut hat, baut er bei Mietende wieder aus. Typisch sind <strong>Trockenbauwände</strong>, Theken und Einbaumöbel, verklebte Teppichböden, Sauberlaufzonen, abgehängte Decken mit Leuchten sowie Beschriftungen und Werbeanlagen. Was im Einzelnen bleiben darf, regeln Mietvertrag und Absprachen mit dem Vermieter. Holen Sie sich das <strong>schriftlich</strong>, bevor die Arbeiten beginnen.</p>

<h2>So planen Sie den Rückbau</h2>
<ol>
  <li><strong>Mietvertrag lesen:</strong> Rückbaupflichten, Übergabetermin und Zustand bei Übergabe.</li>
  <li><strong>Begehung mit dem Vermieter:</strong> Liste, was raus muss und was bleiben darf.</li>
  <li><strong>Aufmaß:</strong> Wandlängen, Deckenflächen und Bodenflächen. Die Grundrisse helfen, entscheidend ist aber das Maß vor Ort.</li>
  <li><strong>Fachbetriebe einplanen:</strong> Strom, Klima, Gas und Wasser werden von zugelassenen Betrieben abgeklemmt und gesichert, bevor der Rückbau beginnt.</li>
  <li><strong>Entsorgung organisieren:</strong> Container vor der Tür, falls Platz ist, sonst Transporterfahrten. Bauabfälle werden getrennt.</li>
  <li><strong>Puffer bis zur Übergabe:</strong> Rückbau dauert je nach Fläche oft mehrere Arbeitstage. Planen Sie Reserve vor dem Übergabetermin ein.</li>
</ol>

<h2>Sonderfälle früh klären</h2>
<ul>
  <li><strong>Schadstoffe:</strong> Bei älteren Bodenbelägen, Klebern oder Dämmstoffen vorher prüfen lassen.</li>
  <li><strong>Strahlenschutz:</strong> In ehemaligen Röntgenräumen können Wände mit Blei verkleidet sein. Das muss vorab geklärt und fachgerecht entsorgt werden.</li>
  <li><strong>Akten und Datenträger:</strong> Gehören nicht in die normale Räumung. Sie müssen nach den geltenden Aufbewahrungs- und Datenschutzregeln behandelt werden.</li>
  <li><strong>Untergrund:</strong> Nach dem Entfernen von Teppich oder Fliesen bleiben oft Kleberreste und Vertiefungen. Ob geschliffen oder ausgeglichen werden muss, hängt von der Vereinbarung mit dem Vermieter ab.</li>
</ul>

<h2>Festpreis statt offener Abrechnung</h2>
<p>Für Rückbau bei Mietende ist ein Festpreis nach Aufmaß meist die sicherere Wahl. Er steht vor Beginn fest, und Positionen, die erst vor Ort entschieden werden, etwa ein Bodenausgleich, lassen sich als Option mit eigenem Preis aufnehmen.</p>

<p><em>Hinweis: Dieser Beitrag ersetzt keine Rechtsberatung. Bei Streit über Rückbaupflichten hilft eine Fachanwaltskanzlei für Mietrecht.</em></p>
`,
    faq: [
      {
        question: "Muss ich als Gewerbemieter meine Einbauten zurückbauen?",
        answer:
          "Grundsätzlich ja. Bei Rückgabe nach § 546 BGB ist der ursprüngliche Zustand wiederherzustellen, soweit nichts anderes vereinbart ist. Was bleiben darf, sollten Sie schriftlich mit dem Vermieter festhalten.",
      },
      {
        question: "Wer klemmt Strom und Klima beim Rückbau ab?",
        answer:
          "Zugelassene Fachbetriebe für Elektro und Klima, vor Beginn des Rückbaus. Wir stimmen uns mit ihnen ab.",
      },
    ],
    leistungen: [
      ["Entkernung", "/entkernung/"],
      ["Rückbau + Trockenbau", "/rueckbau-trockenbau/"],
      ["Für Hausverwaltungen", "/fuer-hausverwaltungen/"],
    ],
    datum: "2026-11-16",
    bild: fotos.rasterdecke.pfad,
    bildAlt: fotos.rasterdecke.alt,
    anfrage: "entkernung",
  },

  {
    slug: "wandkassetten-planen",
    titel: "Wandkassetten mit Zierleisten planen – auch unter Dachschrägen",
    metaTitel: "Fixum Objektservice: Wandkassetten richtig planen",
    beschreibung:
      "Wandkassetten aus Zierleisten: Abstände, Aufteilung, Dachschrägen, Heizkörper und Steckdosen. So wirkt das Ergebnis ruhig und hochwertig.",
    kurzantwort:
      "Wandkassetten wirken hochwertig, wenn die Abstände überall gleich sind. Bewährt haben sich rund 8 cm zwischen den Kassetten und zum Rand. Die Kassettenbreite ergibt sich aus der Wandlänge: (Wandlänge − Anzahl Abstände × 8 cm) ÷ Anzahl Kassetten. Heizkörper, Steckdosen und Dachschrägen werden vorher eingeplant, nicht nachträglich umgangen.",
    html: `
<h2>Erst zeichnen, dann kleben</h2>
<p>Wandkassetten aus Zierleisten sind eine günstige Art, einem Raum Charakter zu geben, gerade in Dachgeschossen und Altbauten. Der Unterschied zwischen „selbst gemacht“ und „wie vom Profi“ liegt fast nur in der Planung. Messen Sie jede Wand aus und zeichnen Sie die Aufteilung auf Papier oder direkt mit Bleistift an die Wand.</p>

<h2>Abstände und Aufteilung</h2>
<ul>
  <li><strong>Gleichmäßige Abstände:</strong> Rund 8 cm zwischen den Kassetten und zum Rand wirken ruhig. Wichtiger als das genaue Maß ist, dass es überall gleich ist.</li>
  <li><strong>Höhe:</strong> Ein paar Zentimeter Luft über der Fußleiste und unter der oberen Abschlussleiste, auf allen Wänden gleich.</li>
  <li><strong>Rechenbeispiel:</strong> Eine 4 m lange Wand mit drei Kassetten hat vier Abstände à 8 cm. (400 cm − 32 cm) ÷ 3 ergibt rund 1,23 m Kassettenbreite.</li>
  <li><strong>Ungerade Zahl wählen,</strong> wenn ein Fenster oder Bett mittig sitzt, damit eine Kassette in der Mitte liegt.</li>
</ul>

<h2>Dachschrägen und Drempel</h2>
<p>Unter Dachschrägen werden die Kassetten oben schräg angeschnitten und folgen der Neigung. Am niedrigen Drempel entstehen flache Kassetten. Damit sie zu den hohen Wänden passen, sollten die senkrechten Linien möglichst in einer Flucht weiterlaufen. Für die Winkel an Schrägen und Fenstern brauchen Sie eine verstellbare Gehrungslade oder Kappsäge. Mit 45 Grad allein kommt man dort nicht hin.</p>

<h2>Heizkörper, Steckdosen, Nischen</h2>
<ul>
  <li><strong>Heizkörper</strong> bekommen eine eigene, passend breite Kassette darüber oder bleiben bewusst ausgespart, symmetrisch zum Rest.</li>
  <li><strong>Steckdosen und Schalter</strong> sollten möglichst mitten in einer Kassette liegen, nicht auf einer Leiste. Das vorher anzeichnen.</li>
  <li><strong>Nischen</strong> wirken am besten mit eigenen, kleineren Kassetten im gleichen Abstandsraster.</li>
</ul>

<h2>Material und Aufwand</h2>
<p>Leisten aus Hartpolystyrol oder PU sind leicht, lassen sich gut schneiden und werden mit Montagekleber gesetzt. Anschließend werden Fugen gefüllt, und Wand und Leisten zusammen gestrichen. Der Aufwand wird meist unterschätzt: Ausmessen, Zuschnitt, Gehrungen und Sonderwinkel kosten mehr Zeit als das Kleben selbst. Für ein Wohnzimmer unter dem Dach mit rund 20 Kassetten sollten Sie mehrere Arbeitstage nur für die Montage einplanen.</p>
`,
    faq: [
      {
        question: "Welcher Abstand ist bei Wandkassetten üblich?",
        answer:
          "Bewährt haben sich rund 8 cm zwischen den Kassetten und zum Rand. Entscheidend ist, dass der Abstand an allen Wänden gleich ist.",
      },
      {
        question: "Wie berechne ich die Breite der Kassetten?",
        answer:
          "Wandlänge minus alle Abstände, geteilt durch die Anzahl der Kassetten. Beispiel: (400 cm − 4 × 8 cm) ÷ 3 ≈ 123 cm.",
      },
    ],
    leistungen: [
      ["Renovierung", "/renovierung/"],
      ["Trockenbau", "/trockenbau/"],
    ],
    datum: "2026-11-16",
    anfrage: "montage",
  },
];

export const findeArtikel = (slug: string) =>
  artikel.find((a) => a.slug === slug);

export const ratgeberPfad = (a: Pick<Artikel, "slug">) =>
  `/ratgeber/${a.slug}/`;

/* Autor für das Article-Markup - echte Person, stärkt E-E-A-T. */
export const autor = {
  name: site.owner,
  rolle: `Inhaber ${site.name}`,
};
