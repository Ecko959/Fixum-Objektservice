/**
 * Erzeugt public/og.png (1200x630) für Social-Previews.
 *
 * Hintergrund: Facebook, LinkedIn, WhatsApp und X rendern kein SVG als
 * og:image. Die Karte muss deshalb als PNG vorliegen. Sie wird aus dem
 * vorhandenen Bildmaterial und dem Logo-Lockup zusammengesetzt, damit die
 * Markentypografie stimmt, ohne dass eine Webfont-Datei gerendert werden muss.
 *
 * Aufruf: npm run build:og
 */

import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const WIDTH = 1200;
const HEIGHT = 630;

const escapeXml = (value) =>
  value.replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&apos;",
      })[char],
  );

const lines = {
  claim: ["Entrümpelt. Ausgebaut.", "Übergabefertig."],
  services: "Entrümpelung · Entkernung · Trockenbau · Montage",
  meta: "Emden · Ostfriesland · Festpreis nach Besichtigung",
  phone: "+49 151 / 29628025",
};

/** Hintergrundfoto, auf Kartenformat beschnitten und abgedunkelt. */
const background = await sharp(
  path.join(root, "public/images/hero-renovation.png"),
)
  .resize(WIDTH, HEIGHT, { fit: "cover", position: "centre" })
  .toBuffer();

/** Verlauf und Textebene - ein SVG über dem Foto. */
const overlay = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
  <defs>
    <linearGradient id="scrim" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stop-color="#07131A" stop-opacity="0.97"/>
      <stop offset="58%"  stop-color="#0A1730" stop-opacity="0.94"/>
      <stop offset="100%" stop-color="#0A1730" stop-opacity="0.80"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#4FA0F5"/>
      <stop offset="100%" stop-color="#1668C4"/>
    </linearGradient>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#scrim)"/>

  <!-- Akzentkante links und feiner Rahmen -->
  <rect x="0" y="0" width="10" height="${HEIGHT}" fill="url(#accent)"/>
  <rect x="46" y="46" width="${WIDTH - 92}" height="${HEIGHT - 92}"
        rx="26" fill="none" stroke="#1F7AE0" stroke-opacity="0.32" stroke-width="2"/>

  <!-- Claim als Bildaussage -->
  <text x="88" y="308" fill="#FFFFFF"
        font-family="DejaVu Sans, sans-serif" font-size="52" font-weight="bold"
        letter-spacing="-1">
    ${escapeXml(lines.claim[0])}
  </text>
  <text x="88" y="372" fill="#4FA0F5"
        font-family="DejaVu Sans, sans-serif" font-size="52" font-weight="bold"
        letter-spacing="-1">
    ${escapeXml(lines.claim[1])}
  </text>

  <text x="88" y="428" fill="#D3E3F9"
        font-family="DejaVu Sans, sans-serif" font-size="25">
    ${escapeXml(lines.services)}
  </text>

  <line x1="88" y1="466" x2="${WIDTH - 88}" y2="466"
        stroke="#FFFFFF" stroke-opacity="0.16" stroke-width="1"/>

  <!-- Kontaktzeile mit Akzentpunkt -->
  <circle cx="96" cy="516" r="7" fill="#FFB020"/>
  <text x="116" y="526" fill="#FFFFFF"
        font-family="DejaVu Sans, sans-serif" font-size="28" font-weight="bold">
    ${escapeXml(lines.phone)}
  </text>
  <text x="88" y="566" fill="#8FB2DC"
        font-family="DejaVu Sans, sans-serif" font-size="21">
    ${escapeXml(lines.meta)}
  </text>
</svg>
`);

/** Markenlockup in Originaltypografie statt nachgebautem Text. */
const logo = await sharp(path.join(root, "public/logo/fixum-lockup-white.png"))
  .resize({ width: 300 })
  .toBuffer();

const png = await sharp(background)
  .composite([
    { input: overlay, top: 0, left: 0 },
    { input: logo, top: 66, left: 86 },
  ])
  .png({ compressionLevel: 9, palette: false })
  .toBuffer();

await writeFile(path.join(root, "public/og.png"), png);

console.log(
  `og.png geschrieben: ${WIDTH}x${HEIGHT}, ${(png.byteLength / 1024).toFixed(1)} kB`,
);
