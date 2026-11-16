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
  /** Bildpfad aus referenzen.ts für Hero und Social Preview */
  bild: string;
  bildAlt: string;
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
    bild: fotos.abstellraum.pfad,
    bildAlt: fotos.abstellraum.alt,
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
