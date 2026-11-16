/* Holt die aktuellen Google-Bewertungen über die Places API (New) und
   schreibt sie nach src/data/reviews.json.

   Läuft automatisch vor jedem Build (npm "prebuild"). Ein täglicher
   GitHub-Workflow (.github/workflows/bewertungen-aktualisieren.yml) stößt
   über einen Vercel Deploy Hook einen neuen Build an - so ist die Seite
   höchstens einen Tag hinter dem Google-Profil.

   Ausfallsicher: Fehlt der API-Schlüssel, antwortet Google nicht oder kommt
   nichts Brauchbares zurück, bleibt die vorhandene reviews.json unverändert
   und der Build läuft normal weiter.

   Umgebungsvariablen (Vercel -> Settings -> Environment Variables):
     GOOGLE_PLACES_API_KEY  Pflicht. API-Schlüssel mit "Places API (New)".
     GOOGLE_PLACE_ID        Optional. Ohne Angabe wird der Eintrag einmal
                            über Name und Adresse gesucht.

   Hinweis: Google liefert über die API höchstens fünf Rezensionen, die
   Gesamtnote und die Anzahl stimmen aber immer. */
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const ZIEL = fileURLToPath(
  new URL("../src/data/reviews.json", import.meta.url),
);
/* Mehrere Anläufe: Das Profil ist ein Servicegebiet ohne sichtbare Adresse,
   eine Suche mit Straße findet es deshalb nicht. */
const SUCHEN = [
  "Fixum Objektservice Emden",
  "Fixum Objektservice",
  "Fixum Objektservice Ostfriesland",
];
const NAME_MUSS_ENTHALTEN = "fixum";
/* Rathaus Emden, 50 km - wie in site.ts */
const UMKREIS = {
  center: { latitude: 53.3671, longitude: 7.2061 },
  radius: 50000,
};
const API = "https://places.googleapis.com/v1";
const TIMEOUT_MS = 10_000;

const key = process.env.GOOGLE_PLACES_API_KEY?.trim();
/* Place-ID des Google-Profils "Fixum Objektservice". Das Profil ist ein
   Servicegebiet ohne Kartenpunkt und wird von der Textsuche nicht gefunden -
   deshalb fest hinterlegt (geprüft: google.com/maps/place/?q=place_id:…).
   GOOGLE_PLACE_ID in Vercel überschreibt den Wert, falls er sich ändert. */
const FIXUM_PLACE_ID = "ChIJ7x1lxJLw-I8RWrbtARBtIh8";
let placeId = process.env.GOOGLE_PLACE_ID?.trim() || FIXUM_PLACE_ID;

const log = (msg) => console.log(`[bewertungen] ${msg}`);

async function anfrage(url, init = {}, feldmaske) {
  const res = await fetch(url, {
    ...init,
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": key,
      "X-Goog-FieldMask": feldmaske,
      ...init.headers,
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${text.slice(0, 300)}`);
  }
  return res.json();
}

/** "Volker Dreesmann" -> "Volker D." - Nutzernamen ohne Leerzeichen bleiben. */
function kurzname(name = "") {
  const teile = name.trim().split(/\s+/).filter(Boolean);
  if (teile.length < 2) return name.trim();
  return `${teile[0]} ${teile[teile.length - 1][0].toUpperCase()}.`;
}

function monat(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return undefined;
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

async function main() {
  if (!key) {
    log("GOOGLE_PLACES_API_KEY fehlt - vorhandene reviews.json bleibt.");
    return;
  }

  if (!placeId) {
    for (const textQuery of SUCHEN) {
      const treffer = await anfrage(
        `${API}/places:searchText`,
        {
          method: "POST",
          body: JSON.stringify({
            textQuery,
            languageCode: "de",
            regionCode: "DE",
            locationBias: { circle: UMKREIS },
          }),
        },
        "places.id,places.displayName",
      );
      const namen = (treffer.places ?? []).map((p) => p.displayName?.text);
      log(
        `Suche "${textQuery}": ${namen.length ? namen.join(" | ") : "keine Treffer"}`,
      );
      const passend = (treffer.places ?? []).find((p) =>
        p.displayName?.text?.toLowerCase().includes(NAME_MUSS_ENTHALTEN),
      );
      if (passend) {
        placeId = passend.id;
        break;
      }
    }
    if (!placeId) throw new Error("Eintrag über die Textsuche nicht gefunden.");
    log(
      `Place-ID gefunden: ${placeId} (als GOOGLE_PLACE_ID hinterlegen spart eine Abfrage)`,
    );
  }

  const ort = await anfrage(
    `${API}/places/${encodeURIComponent(placeId)}?languageCode=de`,
    {},
    "id,rating,userRatingCount,googleMapsUri,reviews",
  );

  const bewertungen = (ort.reviews ?? [])
    .map((r) => ({
      name: kurzname(r.authorAttribution?.displayName),
      text: (r.originalText?.text ?? r.text?.text ?? "").trim(),
      sterne: r.rating,
      datum: monat(r.publishTime),
      zeit: r.publishTime,
      quelle: "Google",
      link: r.authorAttribution?.uri,
    }))
    .filter((r) => r.name && r.text)
    .sort((a, b) => String(b.zeit).localeCompare(String(a.zeit)))
    .map(({ zeit, ...rest }) => rest);

  log(
    `Antwort: id=${ort.id ?? "-"}, Note=${ort.rating ?? "-"}, Anzahl=${ort.userRatingCount ?? "-"}, Texte=${ort.reviews?.length ?? 0}, Felder=${Object.keys(ort).join(",") || "keine"}`,
  );

  let alt = {};
  try {
    alt = JSON.parse(await readFile(ZIEL, "utf8"));
  } catch {}

  if (!ort.userRatingCount) {
    throw new Error("Antwort ohne Note/Anzahl - nichts überschrieben.");
  }

  /* Google liefert Note und Anzahl, aber keine Texte: Zahlen aktualisieren,
     die vorhandenen Texte stehen lassen. */
  if (bewertungen.length === 0) {
    const daten = {
      ...alt,
      stand: new Date().toISOString().slice(0, 10),
      placeId: ort.id ?? placeId,
      note: ort.rating,
      anzahl: ort.userRatingCount,
      profilUrl: ort.googleMapsUri ?? alt.profilUrl,
    };
    await writeFile(ZIEL, `${JSON.stringify(daten, null, 2)}\n`);
    log(
      `Nur Note/Anzahl aktualisiert (${daten.note} / ${daten.anzahl}), Texte unverändert.`,
    );
    return;
  }

  /* Orte aus der bisherigen Datei übernehmen: Google liefert keinen Wohnort,
     von Hand eingetragene Orte sollen nicht verloren gehen. */
  const orte = new Map(
    (alt.bewertungen ?? [])
      .filter((r) => r.ort)
      .map((r) => [r.text.slice(0, 60), r.ort]),
  );
  for (const r of bewertungen) {
    const o = orte.get(r.text.slice(0, 60));
    if (o) r.ort = o;
  }

  const daten = {
    stand: new Date().toISOString().slice(0, 10),
    placeId: ort.id ?? placeId,
    note: ort.rating,
    anzahl: ort.userRatingCount,
    profilUrl: ort.googleMapsUri,
    bewertungen,
  };

  await writeFile(ZIEL, `${JSON.stringify(daten, null, 2)}\n`);
  log(
    `${daten.anzahl} Bewertungen, Note ${daten.note} - ${bewertungen.length} Texte geschrieben.`,
  );
}

main().catch((err) => {
  log(`Abruf fehlgeschlagen, vorhandene reviews.json bleibt: ${err.message}`);
});
