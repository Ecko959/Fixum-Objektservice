/* Tests für Einsatzgebiet und Weiterleitungen. Ausführen: npm test */
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import {
  emden,
  gebiet,
  luftlinieKm,
  ortSeiten,
  radiusText,
} from "../src/data/orte.ts";

type Regel = { source: string; destination: string; statusCode: number };
const { redirects } = JSON.parse(readFileSync("vercel.json", "utf8")) as {
  redirects: Regel[];
};

/* "/" -> src/pages/index.astro, "/leer/" -> src/pages/leer.astro oder
   src/pages/leer/index.astro */
const seiteExistiert = (pfad: string) => {
  const name = pfad.replace(/^\/|\/$/g, "");
  if (!name) return existsSync("src/pages/index.astro");
  return (
    existsSync(`src/pages/${name}.astro`) ||
    existsSync(`src/pages/${name}/index.astro`)
  );
};

describe("Einsatzgebiet", () => {
  test("alle Orte liegen innerhalb von ca. 50 km Luftlinie um Emden", () => {
    for (const g of gebiet) {
      for (const o of g.orte) {
        assert.ok(luftlinieKm(emden, o) <= 50, `${o.name} liegt außerhalb`);
      }
    }
  });

  test("Ortsseiten nennen keine Kilometer (außer dem Radius) und kein Parkett", () => {
    for (const o of ortSeiten) {
      /* Erlaubt ist nur der Einsatzradius "bis ca. 50 km um Emden". */
      const text = JSON.stringify(o).replaceAll(radiusText, "");
      assert.doesNotMatch(text, /\d\s?km/, `${o.slug}: Kilometerangabe`);
      assert.doesNotMatch(text, /parkett/i, `${o.slug}: Parkett`);
    }
  });

  test("jede Ortsseite hat eine Datei, 3-4 Fragen und Fahrzeit statt km", () => {
    for (const o of ortSeiten) {
      assert.ok(seiteExistiert(`/${o.slug}/`), o.slug);
      assert.ok(o.faq.length >= 3 && o.faq.length <= 4, `${o.slug}: FAQ`);
      assert.match(o.fahrzeit, /^ca\. \d+ Minuten$/);
    }
  });
});

describe("Weiterleitungen (vercel.json)", () => {
  test("alle Regeln sind 301", () => {
    for (const r of redirects) assert.equal(r.statusCode, 301, r.source);
  });

  test("jede alte Adresse gibt es mit und ohne Slash", () => {
    const quellen = new Set(redirects.map((r) => r.source));
    for (const r of redirects) {
      const gegenstueck = r.source.endsWith("/")
        ? r.source.slice(0, -1)
        : `${r.source}/`;
      assert.ok(quellen.has(gegenstueck), `fehlt: ${gegenstueck}`);
    }
  });

  test("keine Ketten: kein Ziel ist selbst eine alte Adresse", () => {
    const quellen = new Set(redirects.map((r) => r.source));
    for (const r of redirects) {
      assert.ok(!quellen.has(r.destination), `Kette über ${r.destination}`);
      assert.ok(
        !quellen.has(r.destination.replace(/\/$/, "")),
        `Kette über ${r.destination}`,
      );
    }
  });

  test("jedes Ziel ist eine bestehende Seite mit Slash am Ende", () => {
    for (const r of redirects) {
      assert.ok(r.destination.endsWith("/"), r.destination);
      assert.ok(seiteExistiert(r.destination), `Ziel fehlt: ${r.destination}`);
    }
  });

  test("keine alte Adresse wird noch als Seite gebaut", () => {
    for (const r of redirects) {
      assert.ok(!seiteExistiert(r.source), `Seite existiert noch: ${r.source}`);
    }
  });

  test("die vier von Google gemeldeten 404-Adressen leiten passend weiter", () => {
    const ziel = (quelle: string) =>
      redirects.find((r) => r.source === quelle)?.destination;
    assert.equal(ziel("/hausmeisterservice-emden/"), "/hausmeisterservice/");
    assert.equal(ziel("/trockenbau-emden/"), "/trockenbau/");
    assert.equal(ziel("/bodenverlegung-emden/"), "/bodenverlegung/");
    assert.equal(ziel("/rueckbau-trockenbau-emden/"), "/rueckbau-trockenbau/");
  });
});
