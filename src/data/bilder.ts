/**
 * Brücke zwischen den Pfad-Zeichenketten in den Datendateien und den
 * Bildern, die Astro beim Bauen verarbeitet.
 *
 * Die Leistungen, Referenzen und Ortsseiten benennen ihr Bild als
 * "/images/categories/trockenbau-innenausbau.png". astro:assets braucht
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
  "../assets/images/**/*.png",
  { eager: true },
);

/* "../assets/images/categories/x.png" -> "/images/categories/x.png" */
export const bilder: Record<string, ImageMetadata> = Object.fromEntries(
  Object.entries(dateien).map(([pfad, modul]) => [
    pfad.replace("../assets/images", "/images"),
    modul.default,
  ]),
);

/**
 * Bild zu einem Pfad. Gibt undefined zurück, wenn es das Bild nicht gibt -
 * die aufrufende Komponente zeigt dann ihren Platzhalter statt einen
 * Build-Fehler zu werfen.
 */
export const findeBild = (pfad?: string): ImageMetadata | undefined =>
  pfad ? bilder[pfad] : undefined;
