/* Google-Bewertungen für Startseite, Kontaktseite und Hero-Badge.

   Die Daten in reviews.json schreibt scripts/fetch-reviews.mjs vor jedem
   Build neu (siehe README, Abschnitt "Google-Bewertungen"). Von Hand nur
   anfassen, wenn der automatische Abruf nicht eingerichtet ist - und dann
   ausschließlich echte Bewertungen wörtlich übernehmen.

   Bewusst ohne Review- oder AggregateRating-Markup: Google wertet
   Bewertungen, die ein Unternehmen auf der eigenen Seite über sich selbst
   zeigt, nicht als Rich Result und kann sie als Verstoß einstufen. */
import daten from "./reviews.json";
import { site } from "./site";

export interface Bewertung {
  name: string;
  text: string;
  ort?: string;
  sterne?: number;
  datum?: string;
  quelle?: string;
  link?: string;
}

interface Bewertungsdaten {
  stand?: string;
  placeId?: string;
  note?: number;
  anzahl?: number;
  profilUrl?: string;
  bewertungen?: Bewertung[];
}

const d = daten as Bewertungsdaten;

export const bewertungen: Bewertung[] = (d.bewertungen ?? [])
  .filter((r) => r?.name?.trim() && r?.text?.trim())
  /* Abgeschnittene Sätze ("..., ") sauber auslaufen lassen, ohne den
     Wortlaut zu verändern. */
  .map((r) => ({ ...r, text: r.text.trim().replace(/[,;:]$/, " …") }));

export const note = d.note ?? 0;
export const anzahl = d.anzahl ?? bewertungen.length;

/** "5,0" */
export const noteText = note.toLocaleString("de-DE", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

/** Zeigt Badge und Sektion nur, wenn wirklich etwas da ist. */
export const hatBewertungen = anzahl > 0 && note > 0;

export const profilUrl = d.profilUrl || site.googleProfile;

/** Direktlink "Rezension schreiben". Von Hand gesetzter Link hat Vorrang,
    sonst wird er aus der Place-ID gebaut, die der Abruf mitliefert. */
export const bewertenUrl =
  site.googleReviewUrl ||
  (d.placeId
    ? `https://search.google.com/local/writereview?placeid=${encodeURIComponent(d.placeId)}`
    : "");

/** "2026-09" -> "September 2026" */
export const monatText = (datum?: string) => {
  if (!datum) return "";
  const [jahr, mon] = datum.split("-");
  if (!jahr || !mon) return datum;
  return new Date(Number(jahr), Number(mon) - 1, 1).toLocaleDateString(
    "de-DE",
    { month: "long", year: "numeric" },
  );
};
