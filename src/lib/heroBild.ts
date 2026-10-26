/**
 * Bildvarianten für das Hero-Bild (LCP-Element jeder Seite).
 *
 * Anders als bei <Picture> hängt die Qualität hier von der Breite ab:
 * - bis 960 px (Handy, Tablet) Qualität 60. Das Bild wird dort verkleinert
 *   angezeigt und liegt unter einem dunklen Verlauf - Kompressionsspuren
 *   sieht man nicht, die Datei ist aber halb so groß.
 * - darüber (Desktop) Qualität 82. Dort wird das Bild auf volle
 *   Bildschirmbreite gezogen; mit 60 waren Blockränder zu sehen.
 *
 * PageHero, der Hero der Startseite und der Preload in Base.astro nutzen
 * alle diese eine Funktion. So nennt der Preload exakt dieselben Dateien wie
 * das <picture>, und der Browser lädt das Bild nur einmal.
 */
import { getImage } from "astro:assets";
import { heroBreiten } from "../data/bilder";

const qualitaet = (breite: number) => (breite <= 960 ? 60 : 82);

export interface HeroQuellen {
  avif: string;
  webp: string;
  /** Größte AVIF-Variante - für href des Preloads. */
  avifGross: string;
  /** JPEG für Browser ohne AVIF und WebP. */
  jpeg: string;
  width: number;
  height: number;
}

export async function heroQuellen(bild: ImageMetadata): Promise<HeroQuellen> {
  const breiten = [...new Set(heroBreiten.map((b) => Math.min(b, bild.width)))];

  const srcset = async (format: "avif" | "webp") => {
    const teile = await Promise.all(
      breiten.map(async (breite) => {
        const { src } = await getImage({
          src: bild,
          width: breite,
          format,
          quality: qualitaet(breite),
        });
        return { src, breite };
      }),
    );
    return teile;
  };

  const [avif, webp, jpeg] = await Promise.all([
    srcset("avif"),
    srcset("webp"),
    getImage({
      src: bild,
      width: Math.min(1400, bild.width),
      format: "jpeg",
      quality: 82,
    }),
  ]);

  const liste = (teile: Array<{ src: string; breite: number }>) =>
    teile.map((t) => `${t.src} ${t.breite}w`).join(", ");

  return {
    avif: liste(avif),
    webp: liste(webp),
    avifGross: avif[avif.length - 1].src,
    jpeg: jpeg.src,
    width: bild.width,
    height: bild.height,
  };
}
