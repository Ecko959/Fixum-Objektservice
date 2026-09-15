# Offene Inhalte und Pflegepunkte

## Noch echte Angaben eintragen

- `src/data/site.ts`: `taxId` ergänzen, sobald die Steuernummer vorliegt. Bis
  dahin zeigt das Impressum "wird nachgetragen".
- `src/data/site.ts`: `googleProfile` mit der URL des Google-Unternehmensprofils
  füllen. Der Wert landet automatisch als `sameAs` im schema.org-Graph und als
  Link im Footer - beides sind spürbare lokale Suchsignale.
- `src/data/site.ts`: `geo` enthält aktuell den Ortsmittelpunkt von Emden. Für
  eine exakte Kartenposition die Koordinaten des Firmensitzes eintragen.
- `.env`: `PUBLIC_FORM_ENDPOINT` setzen, sobald Formspree aktiv ist. Ohne den
  Wert zeigt die Seite Telefon, WhatsApp und E-Mail statt eines Formulars.

## Fotos

- Aktuell verwendet die Seite mit Imagegen erzeugte, realistische
  Website-Bilder.
- Echte Baustellenfotos sind der größte Qualitätssprung, der ohne
  Code-Änderung möglich ist. Sie ersetzen die generierten Bilder unter
  gleichem Dateinamen in `src/assets/images/`. WebP und AVIF müssen **nicht**
  mehr von Hand erzeugt werden - das macht astro:assets beim Bauen. Danach
  nur noch `npm run build:og` laufen lassen.
- Mehrere Leistungen teilen sich derzeit ein Bild
  (Entrümpelung/Haushaltsauflösung sowie Boden/Möbelmontage). Eigene Motive
  wären besser, sind aber keine Voraussetzung.
- Die alte Einzelabbildung `src/assets/images/reference-before-after.png`
  wird seit der Umstellung auf die Referenz-Galerie nicht mehr eingebunden.
  Sie kostet im Build nichts mehr, weil astro:assets nur verarbeitet, was
  auch verwendet wird - sie kann trotzdem gelöscht werden.

## Referenzfotos

In `src/assets/images/referenzen/` liegen die **echten Vorher/Nachher-Fotos**:

| Datei                                     | Referenz                              |
| ----------------------------------------- | ------------------------------------- |
| `dachgeschoss-raeumung-rueckbau-foto.png` | Dachgeschoss geräumt und zurückgebaut |
| `dachgeschoss-trockenbau-foto.png`        | Dachgeschoss ausgebaut                |
| `haushaltsaufloesung-wohnzimmer-foto.png` | Haushalt vollständig aufgelöst        |
| `wohnungsraeumung-neuvermietung-foto.png` | Wohnung für die Neuvermietung geräumt |
| `altbau-entkernung-ausbau-foto.png`       | Altbau entkernt und neu ausgebaut     |

Format: 4:3, vorher links, nachher rechts. Nach dem Einsetzen die Texte in
`src/data/references.ts` gegenlesen - sie beschreiben, was auf den Fotos zu
sehen sein soll. WebP und AVIF entstehen beim Bauen von selbst.

Kommen weitere Referenzen dazu, gehören sie unter demselben Namensschema in
den Ordner und als Eintrag in `src/data/references.ts`.

## Kundenstimmen

- `src/data/testimonials.ts` ist bewusst leer, `showTestimonials` steht auf
  `false`.
- Keine Bewertungen eintragen, solange keine echten, freigegebenen
  Kundenstimmen vorliegen. Erfundene Bewertungen sind wettbewerbsrechtlich
  angreifbar, und `aggregateRating` ohne echte Grundlage verstößt gegen
  Googles Richtlinien für strukturierte Daten.

## Rechtliches

- AGB, Datenschutzerklärung und Widerrufsbelehrung stehen vollständig als
  HTML-Text auf den Seiten. Der Wortlaut ist aus den geprüften Fassungen
  übernommen (Stand 04.08.2026).
- Werden die geprüften Dokumente überarbeitet, müssen `src/pages/agb.astro`,
  `datenschutz.astro` und `widerruf.astro` nachgezogen werden. Das Stand-Datum
  steht als `stand`-Attribut oben in jeder Seite.
- Das Impressum enthält die bekannten Stammdaten sowie Hinweise zu
  EU-Streitschlichtung, Haftung und Urheberrecht.

### Zwei Punkte zu den PDFs in `public/docs/`

Die PDFs sind seit der Umstellung **nirgends mehr verlinkt**, liegen aber
weiterhin im Ordner und sind damit über ihre direkte URL erreichbar.

1. **`Fixum_Widerrufsbelehrung.pdf` enthält ab Seite 3 eine Anlage
   ("Textbaustein für Auftragsbestätigung und Auftragsformular" nebst
   Praxishinweisen).** Dieses Dokument bezeichnet sich selbst als internes
   Arbeitsmittel und ausdrücklich nicht als Bestandteil der Belehrung. In die
   HTML-Fassung wurde es deshalb nicht übernommen. Solange die PDF-Datei im
   Ordner liegt, ist der interne Teil aber weiterhin öffentlich abrufbar und
   möglicherweise bereits indexiert. Empfehlung: die Datei durch eine Fassung
   ohne Anlage ersetzen oder ganz entfernen.
2. Werden die PDFs weiterhin gebraucht, um Kunden die Unterlagen in Textform
   zu übergeben (die AGB setzen das voraus), können sie im Ordner bleiben -
   dann aber bitte Punkt 1 vorher klären.

### Offene Abwägung: Wertanrechnung in den AGB

Die Werbung mit der Anrechnung verwertbaren Hausrats auf den Preis wurde auf
Wunsch von allen Seiten entfernt - Startseite, Leistungsdaten, FAQ sowie den
Seiten zu Entrümpelung und Haushaltsauflösung.

In **§ 10 Abs. 2 der AGB** steht die Wertanrechnung weiterhin. Die Klausel ist
bedingt formuliert ("Eine _vereinbarte_ Wertanrechnung wird im Angebot
gesondert ausgewiesen") und regelt damit nur den Fall, dass sie im Einzelfall
tatsächlich vereinbart wird. Das ist kein Widerspruch zur entfernten Werbung:
Die Website verspricht nichts mehr, die AGB regeln den Einzelfall.

Soll die Wertanrechnung vollständig entfallen, muss zuerst die geprüfte
AGB-Fassung geändert werden - dann fallen § 10 Abs. 2 und der Zusatz in der
Überschrift weg und die Seite wird nachgezogen.

### Offene Abwägung: § 35a EStG in den AGB

Die Werbung mit "20 % zurück vom Finanzamt" wurde auf Wunsch von allen Seiten
entfernt. In **§ 5 Abs. 6 der AGB** steht weiterhin, dass Arbeits- und
Fahrtkosten getrennt ausgewiesen werden, "damit die Steuerermäßigung nach
§ 35a EStG in Anspruch genommen werden kann". Das ist keine Werbeaussage,
sondern eine vertragliche Zusage zur Rechnungsstellung - deshalb steht sie
noch drin. Soll sie ebenfalls raus, muss zuerst die geprüfte AGB-Fassung
geändert werden.

## Seitenstruktur - offener Punkt

`/rueckbau-trockenbau/` überschneidet sich thematisch mit
`/entkernung/`, `/trockenbau/` und
`/kernsanierung/`. Die Seite wurde deshalb auf das Paket
"beide Gewerke in einem Auftrag" umgestellt und zielt nicht mehr auf die
Einzelkeywords.

Wenn nach einigen Monaten aus der Search Console hervorgeht, dass die Seite
kaum eigene Impressionen sammelt, ist eine Zusammenlegung sinnvoll: Inhalt in
`/trockenbau/` überführen und `/rueckbau-trockenbau/` per
301-Weiterleitung darauf zeigen lassen. Vorher nicht löschen - eine bestehende
URL ohne Redirect zu entfernen kostet mehr, als sie einbringt.

## Seitenstruktur: Leistung ortsneutral, Ort als Unterseite

Seit dem Umbau gilt eine klare Trennung:

| Ebene | Beispiel | Aufgabe |
| --- | --- | --- |
| Leistung | `/trockenbau/` | Was Fixum macht, ortsneutral. Voller Leistungsumfang, Ablauf, Grenzen. |
| Leistung × Ort | `/trockenbau/aurich/` | Was an diesem Ort anders ist: Bausubstanz, Zufahrt, Entsorgung, örtliche Fragen. |
| Ort | `/einsatzgebiet/aurich/` | Der Ort als Ganzes, Einstieg in alle 13 Leistungen. |

Die Leistungsseiten hießen vorher `/leistung-emden/` und trugen "in Emden" in
der H1. Beides ist weg: Der Ortsbezug gehört auf die Ortsseiten, sonst
konkurrieren Leistungsseite und Ortsseite um dasselbe Keyword.

**Im `<title>` steht "Emden" weiterhin** - anders als in der H1. Der Titel ist
der Text, den Google im Suchergebnis zeigt, und "Trockenbau Emden" ist der
Suchbegriff. Wer das auch entfernt, verliert den lokalen Bezug genau dort, wo
er zählt. Wenn das nicht gewünscht ist, stehen die Titel in den
`metaTitle`-Zeilen der 13 Dateien unter `src/pages/`.

Muster für alle Titel: **Keyword + Emden vorn, Marke hinten, kein "in".**
Also `Renovierung Emden: Wände, Böden, Türen | Fixum` statt
`Renovierung in Emden - ... | Fixum Objektservice`. Das Füllwort "in" kostet
drei Zeichen von sechzig und bringt nichts. Grenze sind 60 Zeichen - danach
schneidet Google ab und schreibt den Titel oft selbst um.

## Der Quellenname über dem Suchergebnis

Google zeigt dort teils noch `fixum-objektservice.de` statt
`Fixum Objektservice`. **Am Code liegt das nicht** - die Signale sind
vollständig gesetzt und im Build nachgewiesen:

- `WebSite`-Knoten mit `name: "Fixum Objektservice"`, `url` auf der
  kanonischen Startseite und `alternateName` (`src/data/seo.ts`)
- `<meta property="og:site_name" content="Fixum Objektservice">` auf jeder
  Seite (`src/layouts/Base.astro`)

Den Quellennamen aktualisiert Google in eigenen Intervallen, erfahrungsgemäß
über Wochen, und er gilt für die ganze Domain statt je Seite. Ohne weitere
Änderung abwarten. Ändert sich nach ein paar Monaten nichts, gibt es in der
Search Console eine Rückmeldefunktion dafür.

## Einsatzgebiet- und Ortsseiten - vor dem Livegang prüfen

Es gibt 36 solcher Seiten: `/einsatzgebiet/` als Übersicht, 15 Ortsseiten
(Texte in `src/data/staedte.ts`) und 20 Leistungs-Ort-Seiten (Texte in
`src/data/leistungsseiten.ts`) - Entrümpelung, Entkernung, Trockenbau und Umzug
für Aurich, Leer, Norden, Moormerland und Krummhörn.

Bewusst **nicht** 15 × 13 automatisch erzeugte Kombinationen: Seiten, die sich
nur im Ortsnamen unterscheiden, wertet Google als Doorway-Pages - im Zweifel
zulasten der ganzen Domain. Weitere Kombinationen erst ergänzen, wenn die
Search Console Impressionen für den Suchbegriff zeigt, und dann mit eigenem
Text. Ein neuer Eintrag in `leistungsseiten.ts` erzeugt die Seite automatisch,
inklusive Verlinkung von Leistungs- und Ortsseite.

Diese Angaben stammen aus der Vorlage und sind **nicht verifiziert**:

- [ ] `entfernungKm` je Ort per Google Maps ab Hermann-Allmers-Str. 13
      bestätigen. Die Zahl steht sichtbar auf jeder Ortsseite und in der
      Anfahrts-FAQ.
- [ ] Ortsteil-Listen stichprobenartig gegenlesen.
- [ ] Zuständige Abfallwirtschaft je Landkreis bestätigen - der Absatz
      "Entsorgung" nennt sie beim Namen.
- [ ] Aussagen zu Anfahrt und Mindestauftrag bei Wittmund, Papenburg, Weener
      und Wiesmoor gegen die tatsächliche Preispolitik halten. Auf der
      Papenburg-Seite steht zum Beispiel, dass sich kleine Privataufträge bei
      der Entfernung selten lohnen.
- [ ] Rich-Results-Test für eine Ortsseite und eine Leistungs-Ort-Seite.
- [ ] Die 20 Leistungs-Ort-Texte einmal gegenlesen. Sie beschreiben, was in
      Aurich, Leer, Norden, Moormerland und Krummhörn baulich typisch ist -
      Altbau in Leer, Ferienobjekte in Norden, Gulfhöfe in der Krummhörn,
      Fehnsiedlungen in Moormerland. Das ist allgemeines Ortswissen und keine
      Aussage über bereits ausgeführte Aufträge, sollte aber zur eigenen
      Erfahrung passen.

## Weiterleitungen - erledigt, laufen über public/_redirects

Die 13 alten `/leistung-emden/`-Adressen leiten per **echter 301** auf die
neuen Adressen weiter, jeweils mit und ohne abschließenden Slash. Die Regeln
stehen in `public/_redirects`; Cloudflare Pages liest die Datei aus dem
Build-Verzeichnis, Netlify versteht dasselbe Format.

Vorher erzeugte `astro.config.mjs` dafür Seiten mit Meta-Refresh. Die wertet
Google nur als schwaches Signal und nicht als Umzug - der `redirects`-Block
ist deshalb entfernt.

Reihenfolge in der Datei beachten: Zuerst die drei Regeln, die den Host auf
`https://www.` normalisieren, danach die Slug-Regeln. Es gewinnt die erste
passende Zeile.

Geprüft mit `wrangler pages dev` und `curl -sI`: alle 26 Slug-Regeln liefern
301 auf das richtige Ziel. Adressen ohne Slash beantwortet Cloudflare selbst
mit 308 auf die Fassung mit Slash - das passt zu `trailingSlash: "always"`
und zum Canonical.

## Widerspruch zwischen FAQ und AGB - bitte entscheiden

Die FAQ auf `/entruempelung/` sagt jetzt: Sonderabfälle wie Farben, Batterien
und Elektrogeräte werden **bei der Besichtigung erfasst und als eigene
Position im Festpreis ausgewiesen**; taucht bei der Räumung unerwartet
Sonderabfall auf, wird das vor der Entsorgung mitgeteilt und abgestimmt.

In den AGB steht dagegen weiterhin, dass Entsorgungskosten für solche Abfälle
"zuzüglich Handlingpauschale gesondert berechnet" werden (Abschnitt zu den
Entsorgungskosten).

Beides zusammen ist widersprüchlich, und im Streitfall zählt die AGB-Klausel.
**An den AGB wurde nichts geändert** - Rechtstexte bleiben unangetastet. Diese
Stelle muss der Inhaber mit seinem Rechtsbeistand angleichen: entweder die
Klausel an die FAQ anpassen oder die FAQ zurück auf die Abrechnung nach
tatsächlichem Aufwand.


## Freistellungsbescheinigung § 48b EStG

`site.freistellung48b` steht auf `false`. Solange das so ist, schreibt die
Seite überall "beantragt" statt "auf Anfrage". Nach Erteilung die eine Zeile in
`src/data/site.ts` auf `true` setzen - Hero-Badge, Leistungsprofil, FAQ,
Startseite und die Meta-Beschreibung ziehen automatisch nach.

## Offen aus dem SEO-Audit - bewusst nicht umgesetzt

- **Kostenratgeber `/entruempelung-kosten-emden/`**: Das ist der Suchbegriff
  mit der höchsten Kaufnähe, aber eine Seite mit erfundenen Marktspannen wäre
  irreführende Werbung. Die Seite braucht echte eigene Zahlen - Preisspanne je
  m³ oder je Zimmergröße aus abgerechneten Aufträgen. Sobald die vorliegen,
  ist die Seite in einer Stunde gebaut.
- **Umzug "bis 3,5 t"**: Steht an acht Stellen auf der Seite. Wenn tatsächlich
  ein 7,5-Tonner eingesetzt wird, müssen die Angaben vereinheitlicht werden -
  und gewerbliche Transporte über 3,5 t zGG sind nach GüKG in der Regel
  erlaubnispflichtig. Vorher klären, dann anpassen.
- **"Eigene Fotos, keine Katalogbilder"** auf der Startseite: Die Aussage ist
  nur haltbar, wenn wirklich alle Referenzbilder von eigenen Baustellen
  stammen. Falls nicht, muss der Satz weg.
- **Leerstandsrechner, Kapazitätsanzeige, Ratgeberartikel**: sinnvoll, aber
  eigene Bausteine. Die Kapazitätsanzeige nur einbauen, wenn sie wöchentlich
  gepflegt wird - eine veraltete Angabe schadet mehr, als sie bringt.

## Weiterleitung von non-www auf www - muss beim Hoster passieren

Kanonische Adresse ist `https://www.fixum-objektservice.de`. Canonical, Open
Graph, Sitemap und schema.org geben ausschließlich diese Fassung aus. Solange
`https://fixum-objektservice.de` aber weiterhin ausliefert statt
weiterzuleiten, sieht Google zwei Seiten mit identischem Inhalt.

In `public/_redirects` liegt die Regel für **Netlify und Cloudflare Pages**.
Läuft die Seite woanders, gehört stattdessen eine der folgenden Fassungen in
die Hoster-Konfiguration - die Datei kann dann gelöscht werden.

**Vercel** (`vercel.json` im Projektwurzelverzeichnis):

```json
{
  "redirects": [
    {
      "source": "/:path*",
      "has": [{ "type": "host", "value": "fixum-objektservice.de" }],
      "destination": "https://www.fixum-objektservice.de/:path*",
      "permanent": true
    }
  ]
}
```

**Apache / klassisches Webhosting** (`.htaccess` im Wurzelverzeichnis):

```apache
RewriteEngine On
RewriteCond %{HTTP_HOST} ^fixum-objektservice\.de$ [NC]
RewriteRule ^(.*)$ https://www.fixum-objektservice.de/$1 [R=301,L]
```

**nginx**:

```nginx
server {
    server_name fixum-objektservice.de;
    return 301 https://www.fixum-objektservice.de$request_uri;
}
```

Nach dem Einrichten prüfen: `curl -I https://fixum-objektservice.de/` muss
`301` und `Location: https://www.fixum-objektservice.de/` liefern.

## Nach dem Livegang

- Google Search Console einrichten und die Sitemap
  `https://www.fixum-objektservice.de/sitemap-index.xml` einreichen. In der
  Search Console die `www`-Property anlegen - sie ist die kanonische Fassung.
- Google-Unternehmensprofil anlegen. Name, Adresse und Telefonnummer müssen
  exakt so geschrieben sein wie in `src/data/site.ts` - Abweichungen bei
  Schreibweise oder Formatierung schwächen das lokale Ranking.
- Rich-Result-Test für Startseite und eine Leistungsseite laufen lassen
  (LocalBusiness, BreadcrumbList, FAQPage, Service).
- Social-Preview mit dem Sharing-Debugger von Facebook und LinkedIn prüfen.

## Bilder laufen über astro:assets

Die Quelldateien liegen als PNG in `src/assets/images/`, nicht mehr in
`public/images/`. Beim Bauen erzeugt Astro daraus AVIF und WebP in drei
Breiten (480/800/1200, Hero 640/1024/1600) und hängt einen Inhalts-Hash an
den Dateinamen - damit ist eine dauerhafte Cache-Regel möglich.

`src/data/bilder.ts` bildet die alten Pfade (`/images/categories/x.png`) auf
die verarbeiteten Bilder ab. Deshalb konnten die Datendateien und die 16
Seiten unverändert bleiben; nur `Photo.astro`, `PageHero.astro`, der Hero in
`index.astro` und der Preload in `Base.astro` wurden angefasst.

Der Rückfall im `<img>` ist **JPEG, nicht PNG**. Er greift nur bei Browsern
ohne AVIF und ohne WebP. Mit PNG als Rückfall wog der Build 154 MB, mit JPEG
sind es 35 MB.

Ein neues Motiv braucht nur als PNG in den Ordner gelegt zu werden - Formate,
Größen und Hash entstehen beim nächsten Build.

**Noch offen:** Das Logo (`public/logo/fixum-lockup-blue-trim.png`, 72 KB) ist
inzwischen das größte Bild auf der Startseite - größer als das Hero-Foto.
Es liegt in `public/` und wird deshalb nicht verarbeitet. Eine WebP-Fassung
mit Transparenz würde dort noch einmal spürbar sparen.
