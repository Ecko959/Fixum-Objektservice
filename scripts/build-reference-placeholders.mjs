/**
 * Erzeugt Platzhalter für die Referenzbilder.
 *
 * Die Platzhalter sind bewusst als solche beschriftet - sie dürfen nie
 * versehentlich als echte Referenz online gehen. Sobald die echten Fotos
 * unter demselben Dateinamen liegen, ersetzt der Konvertierungsbefehl aus
 * der README die WebP- und AVIF-Varianten und der Platzhalter ist weg.
 *
 * Aufruf: npm run build:referenzen
 */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "public/images/referenzen");
const W = 1600;
const H = 1200;

/* Muss zu src/data/references.ts passen. */
const files = [
  ["dachgeschoss-raeumung-rueckbau", "Dachgeschoss geräumt und zurückgebaut"],
  ["dachgeschoss-trockenbau", "Dachgeschoss ausgebaut"],
  ["haushaltsaufloesung-wohnzimmer", "Haushalt vollständig aufgelöst"],
  ["wohnungsraeumung-neuvermietung", "Wohnung für die Neuvermietung geräumt"],
  ["altbau-entkernung-ausbau", "Altbau entkernt und neu ausgebaut"],
];

const escapeXml = (value) =>
  value.replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&apos;",
      })[c],
  );

await mkdir(dir, { recursive: true });

for (const [name, caption] of files) {
  const svg = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <pattern id="hatch" width="28" height="28" patternTransform="rotate(45)"
             patternUnits="userSpaceOnUse">
      <rect width="28" height="28" fill="#0E2148"/>
      <line x1="0" y1="0" x2="0" y2="28" stroke="#173465" stroke-width="12"/>
    </pattern>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#hatch)"/>
  <line x1="${W / 2}" y1="0" x2="${W / 2}" y2="${H}"
        stroke="#ffffff" stroke-opacity="0.5" stroke-width="4"/>

  <text x="${W / 2}" y="${H / 2 - 90}" fill="#FFB020" text-anchor="middle"
        font-family="DejaVu Sans, sans-serif" font-size="58" font-weight="bold">
    PLATZHALTER
  </text>
  <text x="${W / 2}" y="${H / 2 - 10}" fill="#FFFFFF" text-anchor="middle"
        font-family="DejaVu Sans, sans-serif" font-size="42">
    ${escapeXml(caption)}
  </text>
  <text x="${W / 2}" y="${H / 2 + 70}" fill="#8FB2DC" text-anchor="middle"
        font-family="DejaVu Sans, sans-serif" font-size="30">
    ${escapeXml(`${name}.png ersetzen`)}
  </text>
  <text x="${W / 2}" y="${H / 2 + 130}" fill="#8FB2DC" text-anchor="middle"
        font-family="DejaVu Sans, sans-serif" font-size="26">
    Vorher links, Nachher rechts - Seitenverhaeltnis 4:3
  </text>
</svg>
`);

  const base = path.join(dir, name);
  const png = await sharp(svg).png().toBuffer();

  await writeFile(`${base}.png`, png);
  await sharp(png).webp({ quality: 82 }).toFile(`${base}.webp`);
  await sharp(png).avif({ quality: 56 }).toFile(`${base}.avif`);
  console.log(`Platzhalter: ${name}`);
}

console.log(`\n${files.length} Platzhalter in public/images/referenzen/`);
