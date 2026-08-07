# Fixum Objektservice Website

Statische Astro-Website für Fixum Objektservice. Die Seite ist für Cloudflare Pages vorbereitet und nutzt keine externen Ressourcen zur Laufzeit: keine Google Fonts, keine CDNs, kein Tracking, keine Cookies.

## Telefonnummer, WhatsApp und Adresse ändern

Alle Stammdaten stehen in `src/data/site.ts`. Dort werden Telefon, WhatsApp, E-Mail, Adresse, Öffnungszeiten und Einsatzgebiet einmal gepflegt. Die Website zieht diese Werte automatisch in Header, Footer, Formular, Buttons, Schema.org und Impressum.

## Formular aktivieren

Das Kontaktformular nutzt Formspree. Der Endpunkt wird nicht im Code gespeichert.

1. `.env.example` als `.env` kopieren.
2. `PUBLIC_FORM_ENDPOINT=` mit dem Formspree-Endpunkt füllen.
3. Danach `npm run build` ausführen.

Wenn der Wert leer ist, zeigt die Website automatisch Telefon, WhatsApp und E-Mail statt eines kaputten Formulars.

## Fotos austauschen

Die Bilder liegen in `public/images/`. Wenn ein PNG ersetzt wird, sollten WebP und AVIF neu erzeugt werden. Das geht nach `npm install` mit:

```bash
node -e "const sharp=require('sharp'); const fs=require('fs'); const path=require('path'); const dir='public/images'; Promise.all(fs.readdirSync(dir).filter(f=>f.endsWith('.png')).flatMap(f=>{const p=path.join(dir,f); const b=p.replace(/\\.png$/,''); return [sharp(p).webp({quality:82}).toFile(b+'.webp'), sharp(p).avif({quality:56}).toFile(b+'.avif')];})).then(()=>console.log('converted images'))"
```

## Referenzen ein- oder ausschalten

In `src/data/site.ts` steuert `showReferences`, ob die Vorher/Nachher-Sektion sichtbar ist. Aktuell ist sie aktiv, weil ein echtes Fixum-Bild eingebunden wurde.

## Rechtstexte

Die gelieferten PDFs liegen in `public/docs/` und werden auf `/datenschutz`, `/agb` und `/widerruf` eingebettet. Das Impressum ist als HTML-Seite umgesetzt.

## Lokal starten

```bash
npm install
npm run dev
```

## Build prüfen

```bash
npm run build
```

## Cloudflare Pages

Build command: `npm run build`

Output directory: `dist`

Environment variable für Formular: `PUBLIC_FORM_ENDPOINT`
