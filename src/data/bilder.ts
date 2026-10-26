/**
 * Brücke zwischen den Pfad-Zeichenketten in den Datendateien und den
 * Bildern, die Astro beim Bauen verarbeitet.
 *
 * Die Seiten und Datendateien benennen ihr Bild als Pfad, etwa
 * "/images/referenzen/dachzimmer.webp" (siehe src/data/referenzen.ts).
 * astro:assets braucht
 * dagegen ein importiertes Modul, damit es Größe, Format und Hash kennt.
 * Diese Datei importiert einmal alles unter src/assets/images und macht die
 * alten Pfade weiter benutzbar - so mussten die 16 Seiten und die
 * Datendateien nicht angefasst werden.
 *
 * Warum überhaupt astro:assets: Vorher lagen PNG, WebP und AVIF fertig in
 * public/ und wurden alle drei mit ausgeliefert - rund 40 MB PNG, die
 * praktisch kein Browser abruft. Jetzt entstehen die Formate beim Bauen,
 * bekommen einen Inhalts-Hash und damit eine dauerhafte Cache-Regel.
 */
const dateien = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/images/**/*.{png,jpg,jpeg,webp}",
  { eager: true },
);

/* "../assets/images/referenzen/x.webp" -> "/images/referenzen/x.webp" */
export const bilder: Record<string, ImageMetadata> = Object.fromEntries(
  Object.entries(dateien).map(([pfad, modul]) => [
    pfad.replace("../assets/images", "/images"),
    modul.default,
  ]),
);

/* Breiten und Qualität aller ausgelieferten Fotos. Die Originale sind
   1400 px breit - größer zu rechnen brächte nur Bytes, keine Schärfe.
   Base.astro lädt das Hero-Bild mit genau diesen Werten vor; weichen sie
   von denen in PageHero ab, holt der Browser das Bild zweimal. */
export const bildBreiten = [480, 960, 1400];
export const bildQualitaet = 82;
/* Hero-Bilder liegen unter einem dunklen Verlauf (60 bis 95 % Deckkraft).
   Dort fällt die niedrigere Qualität nicht auf, spart aber gut die Hälfte
   der Bytes am LCP-Element. */
export const heroQualitaet = 60;

/**
 * Bild zu einem Pfad. Gibt undefined zurück, wenn es das Bild nicht gibt -
 * die aufrufende Komponente zeigt dann ihren Platzhalter statt einen
 * Build-Fehler zu werfen.
 */
export const findeBild = (pfad?: string): ImageMetadata | undefined =>
  pfad ? bilder[pfad] : undefined;
