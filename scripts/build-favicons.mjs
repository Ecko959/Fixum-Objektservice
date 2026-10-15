/* Erzeugt die Favicons mit gleichmäßigem Rand neu.

   Google zeigt das Favicon im Suchergebnis in einem kleinen runden Rahmen.
   Füllt das Logo die Fläche bis zum Rand, wirkt es dort gedrängt. Deshalb
   nimmt das Logo hier nur ANTEIL der Fläche ein und sitzt genau mittig.

   Quelle ist public/favicon/icon-512.png. Der vorhandene Rand wird vorher
   abgeschnitten (trim), deshalb verkleinert ein erneuter Lauf nichts
   weiter - das Skript lässt sich gefahrlos wiederholen.

   Aufruf: node scripts/build-favicons.mjs */
import sharp from "sharp";
import { readFileSync, writeFileSync } from "node:fs";

const ANTEIL = 0.86;
const ORDNER = "public/favicon";
const quelle = readFileSync(`${ORDNER}/icon-512.png`);

/* Nur das Logo, ohne transparenten Rand */
const logo = await sharp(quelle).trim({ threshold: 1 }).png().toBuffer();

const icon = async (groesse) => {
  const innen = Math.round(groesse * ANTEIL);
  const skaliert = await sharp(logo)
    .resize(innen, innen, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      kernel: "lanczos3",
    })
    .png()
    .toBuffer();
  return sharp({
    create: {
      width: groesse,
      height: groesse,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: skaliert, gravity: "centre" }])
    .png({ compressionLevel: 9 })
    .toBuffer();
};

const dateien = {
  "favicon-48x48.png": 48,
  "favicon-96x96.png": 96,
  "icon-192.png": 192,
  "icon-512.png": 512,
};

for (const [name, groesse] of Object.entries(dateien)) {
  writeFileSync(`${ORDNER}/${name}`, await icon(groesse));
  console.log(`${ORDNER}/${name}`);
}

/* favicon.ico mit 16, 32 und 48 px als PNG-Einträge */
const groessen = [16, 32, 48];
const bilder = await Promise.all(groessen.map(icon));
const kopf = Buffer.alloc(6 + 16 * bilder.length);
kopf.writeUInt16LE(0, 0);
kopf.writeUInt16LE(1, 2);
kopf.writeUInt16LE(bilder.length, 4);
let versatz = kopf.length;
bilder.forEach((bild, i) => {
  const o = 6 + 16 * i;
  kopf.writeUInt8(groessen[i], o);
  kopf.writeUInt8(groessen[i], o + 1);
  kopf.writeUInt8(0, o + 2);
  kopf.writeUInt8(0, o + 3);
  kopf.writeUInt16LE(1, o + 4);
  kopf.writeUInt16LE(32, o + 6);
  kopf.writeUInt32LE(bild.length, o + 8);
  kopf.writeUInt32LE(versatz, o + 12);
  versatz += bild.length;
});
writeFileSync("public/favicon.ico", Buffer.concat([kopf, ...bilder]));
console.log("public/favicon.ico");
