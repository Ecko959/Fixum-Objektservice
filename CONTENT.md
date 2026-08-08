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

## Referenzfotos - offener Punkt

In `public/images/referenzen/` liegen derzeit **fünf beschriftete Platzhalter**.
Die echten Vorher/Nachher-Fotos müssen noch eingesetzt werden:

| Datei                                | Referenz                              |
| ------------------------------------ | ------------------------------------- |
| `dachgeschoss-raeumung-rueckbau.png` | Dachgeschoss geräumt und zurückgebaut |
| `dachgeschoss-trockenbau.png`        | Dachgeschoss ausgebaut                |
| `haushaltsaufloesung-wohnzimmer.png` | Haushalt vollständig aufgelöst        |
| `wohnungsraeumung-neuvermietung.png` | Wohnung für die Neuvermietung geräumt |
| `altbau-entkernung-ausbau.png`       | Altbau entkernt und neu ausgebaut     |

Format: 4:3, vorher links, nachher rechts. Nach dem Einsetzen WebP und AVIF neu
erzeugen (siehe README) und die Texte in `src/data/references.ts` gegenlesen -
sie beschreiben, was auf den Fotos zu sehen sein soll.

Solange die Platzhalter drin sind, darf die Seite nicht live gehen: Sie sind
sichtbar als Platzhalter markiert, aber eine Referenzsektion ohne Referenzen
wirkt schlechter als gar keine. Alternativ `showReferences` in
`src/data/site.ts` bis dahin auf `false` setzen.

## Kundenstimmen

- `src/data/testimonials.ts` ist bewusst leer, `showTestimonials` steht auf
  `false`.
- Keine Bewertungen eintragen, solange keine echten, freigegebenen
  Kundenstimmen vorliegen. Erfundene Bewertungen sind wettbewerbsrechtlich
  angreifbar, und `aggregateRating` ohne echte Grundlage verstößt gegen
  Googles Richtlinien für strukturierte Daten.

## Rechtliches

- AGB, Datenschutzerklärung und Widerrufsbelehrung sind als Original-PDFs
  eingebunden und zusätzlich als kurze HTML-Zusammenfassung sichtbar.
- Die Zusammenfassungen sind bewusst knapp gehalten und ersetzen die PDFs
  nicht. Wenn die PDFs überarbeitet werden, die Stichpunkte in
  `src/pages/agb.astro`, `datenschutz.astro` und `widerruf.astro` gegenprüfen.
- Das Impressum enthält die bekannten Stammdaten sowie Hinweise zu
  EU-Streitschlichtung, Haftung und Urheberrecht.

## Seitenstruktur - offener Punkt

`/entkernung-trockenbau/` überschneidet sich thematisch mit
`/entkernung-rueckbau/`, `/trockenbau-innenausbau/` und
`/kernsanierung-vorbereiten/`. Die Seite wurde deshalb auf das Paket
"beide Gewerke in einem Auftrag" umgestellt und zielt nicht mehr auf die
Einzelkeywords.

Wenn nach einigen Monaten aus der Search Console hervorgeht, dass die Seite
kaum eigene Impressionen sammelt, ist eine Zusammenlegung sinnvoll: Inhalt in
`/trockenbau-innenausbau/` überführen und `/entkernung-trockenbau/` per
301-Weiterleitung darauf zeigen lassen. Vorher nicht löschen - eine bestehende
URL ohne Redirect zu entfernen kostet mehr, als sie einbringt.

## Nach dem Livegang

- Google Search Console einrichten und die Sitemap
  `https://fixum-objektservice.de/sitemap-index.xml` einreichen.
- Google-Unternehmensprofil anlegen. Name, Adresse und Telefonnummer müssen
  exakt so geschrieben sein wie in `src/data/site.ts` - Abweichungen bei
  Schreibweise oder Formatierung schwächen das lokale Ranking.
- Rich-Result-Test für Startseite und eine Leistungsseite laufen lassen
  (LocalBusiness, BreadcrumbList, FAQPage, Service).
- Social-Preview mit dem Sharing-Debugger von Facebook und LinkedIn prüfen.
