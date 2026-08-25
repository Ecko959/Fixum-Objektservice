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
  gleichem Dateinamen in `public/images/`; danach WebP und AVIF neu erzeugen
  (siehe README) und `npm run build:og` laufen lassen.
- Mehrere Leistungen teilen sich derzeit ein Bild
  (Entrümpelung/Haushaltsauflösung sowie Boden/Möbelmontage). Eigene Motive
  wären besser, sind aber keine Voraussetzung.
- Die alte Einzelabbildung `public/images/reference-before-after.*` wird seit
  der Umstellung auf die Referenz-Galerie nicht mehr eingebunden und kann
  gelöscht werden.

## Referenzfotos

In `public/images/referenzen/` liegen die **echten Vorher/Nachher-Fotos**:

| Datei                                     | Referenz                              |
| ----------------------------------------- | ------------------------------------- |
| `dachgeschoss-raeumung-rueckbau-foto.png` | Dachgeschoss geräumt und zurückgebaut |
| `dachgeschoss-trockenbau-foto.png`        | Dachgeschoss ausgebaut                |
| `haushaltsaufloesung-wohnzimmer-foto.png` | Haushalt vollständig aufgelöst        |
| `wohnungsraeumung-neuvermietung-foto.png` | Wohnung für die Neuvermietung geräumt |
| `altbau-entkernung-ausbau-foto.png`       | Altbau entkernt und neu ausgebaut     |

Format: 4:3, vorher links, nachher rechts. Nach dem Einsetzen WebP und AVIF neu
erzeugen (siehe README) und die Texte in `src/data/references.ts` gegenlesen -
sie beschreiben, was auf den Fotos zu sehen sein soll.

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

`/rueckbau-trockenbau-emden/` überschneidet sich thematisch mit
`/entkernung-emden/`, `/trockenbau-emden/` und
`/kernsanierung-emden/`. Die Seite wurde deshalb auf das Paket
"beide Gewerke in einem Auftrag" umgestellt und zielt nicht mehr auf die
Einzelkeywords.

Wenn nach einigen Monaten aus der Search Console hervorgeht, dass die Seite
kaum eigene Impressionen sammelt, ist eine Zusammenlegung sinnvoll: Inhalt in
`/trockenbau-emden/` überführen und `/rueckbau-trockenbau-emden/` per
301-Weiterleitung darauf zeigen lassen. Vorher nicht löschen - eine bestehende
URL ohne Redirect zu entfernen kostet mehr, als sie einbringt.

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
