# Fixum Objektservice Website

Statische Astro-Website für Fixum Objektservice. Vorbereitet für Cloudflare Pages und ohne externe Laufzeit-Ressourcen: keine Google Fonts, keine CDNs, kein Tracking, keine Cookies.

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
public/          Bilder, Logos, PDFs, robots.txt
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

`public/og.png` (1200x630) wird aus Hintergrundfoto, Logo-Lockup und Textebene
zusammengesetzt:

```bash
npm run build:og
```

Das Bild muss ein PNG oder JPEG sein - Facebook, LinkedIn, WhatsApp und X
rendern kein SVG als `og:image`. Nach Änderungen an Claim, Telefonnummer oder
Hintergrundbild das Skript erneut ausführen.

## Formular aktivieren

Das Kontaktformular nutzt Formspree. Der Endpunkt wird nicht im Code
gespeichert.

1. `.env.example` als `.env` kopieren.
2. `PUBLIC_FORM_ENDPOINT=` mit dem Formspree-Endpunkt füllen.
3. `npm run build` ausführen.

Ist der Wert leer, zeigt die Website automatisch Telefon, WhatsApp und E-Mail
statt eines Formulars, das ins Leere läuft.

## Fotos austauschen

Die Bilder liegen in `public/images/`. Jede Datei existiert als PNG, WebP und
AVIF; die Komponenten liefern automatisch das beste Format aus. Wird ein PNG
ersetzt, müssen WebP und AVIF neu erzeugt werden:

```bash
node -e "const sharp=require('sharp'); const fs=require('fs'); const path=require('path'); const dirs=['public/images','public/images/categories']; Promise.all(dirs.flatMap(dir=>fs.readdirSync(dir).filter(f=>f.endsWith('.png')).flatMap(f=>{const p=path.join(dir,f); const b=p.replace(/\\.png\$/,''); return [sharp(p).webp({quality:82}).toFile(b+'.webp'), sharp(p).avif({quality:56}).toFile(b+'.avif')];}))).then(()=>console.log('converted images'))"
```

Danach `npm run build:og` ausführen, falls das Hero-Bild betroffen war.

## Referenzen ein- oder ausschalten

In `src/data/site.ts` steuert `showReferences`, ob die Vorher/Nachher-Sektion
sichtbar ist.

## Rechtstexte

AGB, Datenschutzerklärung und Widerrufsbelehrung liegen als PDF in
`public/docs/` und werden eingebettet. Zusätzlich steht auf jeder dieser Seiten
eine kurze HTML-Zusammenfassung, damit der Inhalt auch indexierbar ist. Das
Impressum ist vollständig als HTML umgesetzt.

## Cloudflare Pages

- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `PUBLIC_FORM_ENDPOINT`
