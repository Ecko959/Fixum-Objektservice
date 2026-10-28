# Fixum Objektservice Website

Statische Astro-Website für Fixum Objektservice. Gehostet auf Vercel, ohne externe Laufzeit-Ressourcen: keine Google Fonts, keine CDNs, kein Tracking, keine Cookies.

## Lokal starten

```bash
npm install
npm run dev
```

## Build prüfen

```bash
npm run build     # astro check + astro build
npm run preview   # gebautes dist/ lokal ansehen
```

## Projektstruktur

```
src/
  data/          Stammdaten, Leistungen, FAQ, SEO-Bausteine
  layouts/       Base.astro - Head, Meta, JSON-LD, Rahmen
  components/    Wiederverwendbare Bausteine
  pages/         Eine Datei pro URL
  styles/        global.css - Design-Tokens und Basis-Layout
scripts/         build-og.mjs erzeugt die Social-Preview-Grafik
public/          Bilder, Logos, Quell-PDFs der Rechtstexte, robots.txt
```

## Stammdaten ändern

Telefon, WhatsApp, E-Mail, Adresse, Öffnungszeiten, Einsatzgebiet und
Geokoordinaten stehen ausschließlich in `src/data/site.ts`. Von dort ziehen
Header, Footer, Formular, Buttons, Impressum und alle schema.org-Angaben ihre
Werte. Es gibt keine zweite Stelle, an der die Telefonnummer gepflegt wird.

## Design-System

`src/styles/global.css` definiert alle Tokens: Farben, Schriftskala,
Abstände, Radien, Schatten und Bewegungskurven. Komponenten greifen
ausschließlich über CSS-Variablen darauf zu.

Zwei Regeln sind wichtig, wenn neue Abschnitte dazukommen:

- **`.container` nie mit `margin: 0` oder `max-width` überschreiben.** Beides
  hebt die Zentrierung auf und der Block klebt am Viewport-Rand. Zeilenlängen
  stattdessen an den Kind-Elementen begrenzen (siehe `.section-head > *`).
- **Sekundäre Buttons auf hellen Flächen innerhalb dunkler Sektionen** bekommen
  über `.card:not(.card--glass) .btn--secondary` automatisch die helle Variante.
  Neue helle Container in dunklen Sektionen dort ergänzen.

Scroll-Animationen laufen über `data-reveal` (optional gruppiert mit
`data-reveal-group` für gestaffelten Einsatz). Ohne JavaScript und bei
`prefers-reduced-motion` bleibt alles sichtbar; zusätzlich blendet ein
Timeout nach 3 Sekunden alles ein, falls der Observer ausfällt.

## SEO

Zentral gepflegt, nicht pro Seite dupliziert:

- **`src/data/seo.ts`** baut den schema.org-Graph: LocalBusiness mit
  Geokoordinaten, Öffnungszeiten und Einsatzradius, WebSite, WebPage,
  BreadcrumbList, Service und FAQPage. Alle Knoten sind über feste `@id`-Werte
  verbunden.
- **`src/layouts/Base.astro`** rendert Title, Description, Robots, Canonical,
  Open Graph, Twitter Cards, Geo-Meta und den JSON-LD-Graph. Jede Seite
  übergibt `title`, `description`, `canonical` und ihre `breadcrumbs`.
- **Canonical-URLs** enden immer auf `/` und sind damit identisch zur Sitemap.
  Interne Links sollten ebenfalls mit Slash geschrieben werden, sonst entsteht
  ein unnötiger Redirect.
- **`noindex`** setzen Seiten ohne Suchwert selbst (`/danke/`, `404`); sie sind
  zusätzlich aus Sitemap und robots.txt ausgeschlossen.
- **FAQ-Rich-Results** werden nur ausgespielt, wo die Fragen auch sichtbar auf
  der Seite stehen (`src/data/faq.ts`, `serviceFaq` pro Leistungsseite).

### Neue Leistungsseite anlegen

1. Eintrag in `src/data/services.ts` und `src/data/serviceMenu.ts` ergänzen.
2. Optional Fragen unter dem Pfad-Schlüssel in `serviceFaq` (`src/data/faq.ts`).
3. Seite in `src/pages/` anlegen, die `ServiceDetailPage` nutzt - Breadcrumbs,
   Service-Schema, FAQ-Schema, Einsatzgebiet und interne Verlinkung kommen
   dadurch automatisch mit.

Wichtig: Titel und H1 verwandter Seiten müssen sich unterscheiden. Zwei Seiten,
die auf dasselbe Hauptkeyword zielen, nehmen sich gegenseitig die Sichtbarkeit.

## Social-Preview-Bild

`public/og.png` (1200x630) wird aus einem echten Projektfoto (renoviertes
Dachzimmer), Logo-Lockup und Textebene zusammengesetzt:

```bash
npm run build:og
```

Das Bild muss ein PNG oder JPEG sein - Facebook, LinkedIn, WhatsApp und X
rendern kein SVG als `og:image`. Nach Änderungen an Claim, Telefonnummer oder
Hintergrundbild das Skript erneut ausführen.

## Anfrageformular

Ein Bauteil für alle Seiten: `src/components/Anfrage.astro` (drei Schritte:
Vorhaben, Details mit Fotos, Kontakt). Es steht vollständig auf `/kontakt/`
und als Abschluss-Sektion (`#anfrage`) auf Startseite, Leistungs-, Orts- und
Firmenseiten.

**Versand:** Vercel Function `api/anfrage.ts` (Region Frankfurt, siehe
`vercel.json`). Sie prüft alle Angaben, schickt die Anfrage mit Fotos im
Anhang an `CONTACT_TO` und eine Bestätigung ohne Fotos an den Kunden, falls
er eine E-Mail-Adresse angibt. Versendet wird über das IONOS-Postfach
(SMTP, nodemailer). Fotos werden nirgends gespeichert.

**Variablen** in Vercel → Project → Settings → Environment Variables, für
„Production“ und „Preview“, danach neu deployen:

| Variable       | Beispiel                                             |
| -------------- | ---------------------------------------------------- |
| `SMTP_HOST`    | `smtp.ionos.de`                                      |
| `SMTP_PORT`    | `465` (SSL/TLS) – alternativ `587` (STARTTLS)        |
| `SMTP_SECURE`  | optional; ohne Angabe `true` bei 465, sonst `false`  |
| `SMTP_USER`    | `info@fixum-objektservice.de` (ganze Adresse)        |
| `SMTP_PASS`    | Passwort des Postfachs (als „Sensitive“)             |
| `CONTACT_TO`   | `info@fixum-objektservice.de`                        |
| `CONTACT_FROM` | `Fixum Objektservice <info@fixum-objektservice.de>`  |

`CONTACT_FROM` muss zum IONOS-Postfach gehören, sonst lehnt IONOS ab. Fehlt
eine Variable, antwortet die Function mit 503 und das Formular zeigt
Telefon und WhatsApp als Ausweg.

**Vorbelegung:** Links mit `data-cta="umzug"` springen auf Seiten mit
Formular direkt dorthin und wählen die Leistung vor; ohne Formular führen
sie auf `/kontakt/?leistung=umzug#anfrage`. `data-cta-text` füllt die
Beschreibung (z. B. das Ergebnis des Preisrechners). Welche Seite welche
Leistung vorwählt, steht in `src/data/anfrage.ts`.

**Fotos:** bis 8. Das Formular verkleinert sie im Browser auf 1600 px
(JPEG 0,8) und rechnet notfalls weiter herunter, damit alles unter 4 MB
bleibt – Vercel nimmt höchstens 4,5 MB pro Anfrage an. Der Server prüft Typ
(an den ersten Bytes) und Größe noch einmal.

**Spamschutz:** unsichtbares Feld (Honeypot), Mindest-Ausfüllzeit von drei
Sekunden, höchstens 5 Anfragen je IP in 10 Minuten (im Speicher der
Function; wo Upstash Redis später eingehängt wird, steht im Code). Kein
reCAPTCHA.

**Lokal testen:** `npm test` prüft die Function mit einem Versand-Ersatz
(ohne Mails zu verschicken).

## Fotos und Referenzen

Alle Bilder sind echte Projektfotos. Sie stehen zentral in
`src/data/referenzen.ts`:

- `fotos` - jedes Foto mit Pfad und Alt-Text. Seiten, Leistungskarten
  (`src/data/services.ts`) und Ortsseiten (`src/data/orte.ts`)
  verweisen darauf.
- `referenzen` - Reihenfolge, Bildunterschrift („Leistung · Typ“) und
  Kategorie für die Referenz-Sektion der Startseite und ihre Lightbox.

Originale liegen unverändert in `src/assets/images/referenzen/`, Zuschnitte
einzelner Collage-Hälften in `src/assets/images/zuschnitte/`. AVIF und WebP
in 480/960/1400 px erzeugt astro:assets beim Bauen - nichts von Hand
konvertieren.

Die Referenz-Sektion (`src/components/ReferenzMarquee.astro`) zeigt zwei
endlos laufende Fotoreihen und eine Lightbox. Ohne JavaScript und bei
„Bewegung reduzieren“ sind die Reihen normal scrollbar. Über `showReferences`
in `src/data/site.ts` lässt sich die Sektion abschalten.

Nach einem neuen Hero-Foto `npm run build:og` ausführen.

## Rechtstexte

AGB, Datenschutzerklärung und Widerrufsbelehrung stehen vollständig als HTML
auf den jeweiligen Seiten - kein PDF-Download, kein eingebettetes Dokument.
Das Impressum ebenfalls.

Gemeinsame Hülle ist `src/components/LegalPage.astro`: Brotkrumen, Kopfbereich
mit Stand-Datum, Inhaltsverzeichnis mit Sprungmarken und die Typografie des
Fließtexts. Jede Seite liefert nur die Abschnitte:

```astro
<LegalPage title="…" stand="04.08.2026" sections={[["p1", "Geltungsbereich"]]}>
  <section id="p1">
    <h2>§ 1 Geltungsbereich</h2>
    <p>…</p>
  </section>
</LegalPage>
```

Die IDs im `sections`-Array müssen den `id`-Attributen der Abschnitte
entsprechen - sonst zeigt das Inhaltsverzeichnis ins Leere.

Für hervorgehobene Passagen (Rechtsgrundlagen, Schlusshinweise) gibt es
`<div class="legal-note">`.

**Wortlaut ändern:** Die Texte sind aus den geprüften Fassungen übernommen
(Stand 04.08.2026, Quellen in `public/docs/`). Inhaltliche Änderungen gehören
zuerst in das geprüfte Dokument und erst danach in die Seite - nicht
umgekehrt.

## Vercel

- Build command: `npm run build`
- Output directory: `dist`
- Weiterleitungen (301): `vercel.json`
- Formular: Vercel Function `api/anfrage.ts`, Region `fra1`
- Variables: `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`,
  `CONTACT_TO`, `CONTACT_FROM` (siehe „Anfrageformular“)
