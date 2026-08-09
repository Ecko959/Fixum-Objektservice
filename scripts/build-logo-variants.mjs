/**
 * Erzeugt beschnittene Logo-Varianten für Header und Footer.
 *
 * Die Quelldateien sind quadratische 2508er-PNGs mit viel transparentem Rand.
 * Ungetrimmt lässt sich das Logo im Header nicht sauber ausrichten - der
 * sichtbare Schriftzug säße irgendwo in der Mitte einer viel größeren Fläche.
 *
 * Aufruf: npm run build:logos
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "public/logo");

/* [Quelle, Ziel, Zielbreite] - Breite großzügig für Displays mit hoher Dichte. */
const variants = [
  ["fixum-lockup-blue", "fixum-lockup-blue-trim", 720],
  ["fixum-lockup-white", "fixum-lockup-white-trim", 720],
];

for (const [source, target, width] of variants) {
  const input = path.join(dir, `${source}.png`);
  const output = path.join(dir, `${target}.png`);

  const image = sharp(input)
    // trim() entfernt den einfarbigen bzw. transparenten Rand rundum.
    .trim({ threshold: 1 })
    .resize({ width, withoutEnlargement: true });

  const buffer = await image.png({ compressionLevel: 9 }).toBuffer();
  await sharp(buffer).toFile(output);

  const meta = await sharp(buffer).metadata();
  console.log(
    `${target}.png: ${meta.width}x${meta.height}, ${(buffer.byteLength / 1024).toFixed(1)} kB`,
  );
}
