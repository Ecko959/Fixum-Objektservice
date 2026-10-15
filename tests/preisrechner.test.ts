/* Unit-Tests für den Preisrechner. Ausführen: npm test
   Laufen mit dem Testrunner von Node, ohne zusätzliche Abhängigkeit. */
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  baueModell,
  entpacke,
  ergebnisText,
  leseZahl,
  rechner,
  rechnerBereit,
  verpacke,
  type Ergebnis,
  type Leistung,
} from "../src/lib/preisrechner.ts";

const config = JSON.parse(
  readFileSync(
    new URL("../src/data/preise.config.json", import.meta.url),
    "utf8",
  ),
);

const rechne = (l: Leistung, e: Record<string, unknown>, c = config) =>
  rechner[l](baueModell(c, l), e);

const spanne = (r: Ergebnis) => {
  assert.equal(r.art, "spanne", `erwartet Spanne, bekam ${JSON.stringify(r)}`);
  return r as { art: "spanne"; von: number; bis: number };
};

/** Config mit ausgefüllten Testwerten für alle Platzhalter (nur für Tests). */
const testConfig = () => {
  const c = structuredClone(config);
  const f = (o: Record<string, unknown>, k: string, von: number, bis = von) =>
    (o[k] = { von, bis });
  f(c.entruempelung, "keller", 150, 300);
  f(c.entruempelung, "dachboden", 200, 400);
  f(c.entruempelung, "garageOderSchuppen", 100, 250);
  f(c.entruempelung, "kuecheOderEinbautenDemontieren", 150, 250);
  f(c.entruempelung, "endreinigungProQuadratmeter", 3, 5);
  c.entruempelung.mindestpreis = { wert: 300 };
  f(c.umzug, "proZimmer", 300, 400);
  c.umzug.nahbereichKm = { wert: 30 };
  f(c.umzug, "proKmUeberNahbereich", 2, 3);
  f(c.umzug, "zuschlagJeEtageOhneAufzug", 40, 60);
  f(c.umzug, "moebelAbUndAufbauen", 100, 200);
  f(c.umzug, "kuecheAbUndAufbauen", 300, 500);
  f(c.umzug, "schweresEinzelstueck", 150, 250);
  f(c.umzug, "altmoebelEntsorgen", 100, 200);
  c.umzug.mindestpreis = { wert: 400 };
  f(c.trockenbau.materialVomKundenProQuadratmeter, "schallschutzwand", 40, 50);
  c.trockenbau.mindestpreis = { wert: 400 };
  f(c.montage, "innentuerMitZargeJeStueck", 120, 160);
  f(c.montage, "alteTuerAusbauenJeStueck", 30, 50);
  f(c.montage, "moebelJeStueck", 40, 80);
  f(c.montage, "altesMoebelAusbauenJeStueck", 20, 40);
  f(c.montage, "kuecheJeMeter", 150, 200);
  f(c.montage, "alteKuecheAusbauenJeMeter", 40, 60);
  c.montage.mindestpreis = { wert: 150 };
  f(c.boden, "verlegenProQuadratmeter", 18, 25);
  f(c.boden, "altenBelagEntfernenProQuadratmeter", 5, 8);
  f(c.boden, "sockelleisteProMeter", 6, 9);
  c.boden.mindestpreis = { wert: 300 };
  return c;
};

/* ------------------------------------------------------------------ */

describe("Zahleneingabe", () => {
  const faelle: Array<[unknown, number | null]> = [
    ["60", 60],
    ["60,5", 60.5],
    ["60.5", 60.5],
    ["1.200", 1200],
    ["1.200,5", 1200.5],
    [" 75 m² ", 75],
    ["30 km", 30],
    ["", null],
    ["   ", null],
    ["abc", null],
    ["-5", null],
    ["5,5,5", null],
    [undefined, null],
    [12, 12],
  ];
  for (const [ein, aus] of faelle)
    test(`${JSON.stringify(ein)} -> ${aus}`, () =>
      assert.equal(leseZahl(ein), aus));
});

describe("Ausgabe", () => {
  test("Spanne mit Tausenderpunkt", () =>
    assert.equal(
      ergebnisText({ art: "spanne", von: 1200, bis: 1700 }),
      "ca. 1.200–1.700 €",
    ));
  test("ab", () =>
    assert.equal(ergebnisText({ art: "ab", ab: 300 }), "ab 300 €"));
  test("Anfrage", () =>
    assert.equal(ergebnisText({ art: "anfrage" }), "Preis auf Anfrage"));
});

describe("Config ist in sich stimmig", () => {
  const ab = config.abPreise;
  test("Entrümpelung: Ab-Preise = Untergrenzen der Stufen", () => {
    const q = config.entruempelung.proQuadratmeterWohnflaeche;
    assert.equal(q.normal.von, ab.entruempelungNormal);
    assert.equal(q.stark.von, ab.entruempelungStark);
    assert.equal(q.messie.von, ab.entruempelungMessie);
  });
  test("Trockenbau: Ab-Preis = günstigste Wand inkl. Material", () => {
    const inkl = config.trockenbau.materialInklusiveProQuadratmeter;
    assert.equal(inkl.zwischenwand.von, ab.trockenbauwandInklMaterial);
    const minimum = Math.min(
      ...Object.values(inkl).map((w) => (w as { von: number }).von),
    );
    assert.ok(minimum >= ab.trockenbauwandInklMaterial);
  });
  test("Umzug: 2 Zimmer nicht unter dem Ab-Preis (sobald Wert gesetzt)", () => {
    const z = config.umzug.proZimmer;
    if (typeof z.von === "number")
      assert.ok(2 * z.von >= ab.umzugZweiZimmerNahbereich);
  });
  test("Jede Spanne: von <= bis", () => {
    const pruefe = (o: unknown, pfad: string) => {
      if (!o || typeof o !== "object") return;
      const r = o as Record<string, unknown>;
      if (typeof r.von === "number" && typeof r.bis === "number")
        assert.ok(r.von <= r.bis, pfad);
      for (const [k, v] of Object.entries(r)) pruefe(v, `${pfad}.${k}`);
    };
    pruefe(config, "config");
  });
});

describe("Entrümpelung", () => {
  test("60 m² normal, EG", () => {
    const r = spanne(
      rechne("entruempelung", { flaeche: "60", zustand: "normal", etage: 0 }),
    );
    assert.deepEqual([r.von, r.bis], [900, 1500]);
  });
  test("60,5 m² mit Komma", () => {
    const r = spanne(
      rechne("entruempelung", { flaeche: "60,5", zustand: "normal", etage: 0 }),
    );
    assert.deepEqual([r.von, r.bis], [950, 1550]);
  });
  test("5 m²: aufgerundet, nie unter dem Ab-Preis", () => {
    const r = spanne(
      rechne("entruempelung", { flaeche: "5", zustand: "normal" }),
    );
    assert.deepEqual([r.von, r.bis], [100, 150]);
    assert.ok(r.von >= 5 * 15);
  });
  test("Stark möbliert, 2. Etage: +14 %", () => {
    const r = spanne(
      rechne("entruempelung", { flaeche: "80", zustand: "stark", etage: 2 }),
    );
    // 80*25*1.14 = 2280 -> 2300; 80*40*1.14 = 3648 -> 3650
    assert.deepEqual([r.von, r.bis], [2300, 3650]);
  });
  test("400 m² Messie, 3. Etage oder höher", () => {
    const r = spanne(
      rechne("entruempelung", { flaeche: "400", zustand: "messie", etage: 5 }),
    );
    // Etage wird bei 3 gedeckelt: 400*36*1.21 = 17424; 400*60*1.21 = 29040
    assert.deepEqual([r.von, r.bis], [17450, 29050]);
  });
  test("Je Stufe nie unter dem Ab-Preis pro m²", () => {
    for (const [zustand, ab] of [
      ["normal", 15],
      ["stark", 25],
      ["messie", 36],
    ] as const)
      for (const flaeche of [5, 17, 60, 133, 400]) {
        const r = spanne(rechne("entruempelung", { flaeche, zustand }));
        assert.ok(r.von >= flaeche * ab, `${zustand} ${flaeche}`);
        assert.ok(r.bis > r.von);
      }
  });
  test("Keller ohne Wert in der Config: Preis auf Anfrage", () =>
    assert.equal(
      rechne("entruempelung", { flaeche: 60, zustand: "normal", keller: true })
        .art,
      "anfrage",
    ));
  test("Leere Fläche: unvollständig", () =>
    assert.equal(
      rechne("entruempelung", { flaeche: "" }).art,
      "unvollstaendig",
    ));
  test("Über der Höchstfläche: Preis auf Anfrage", () =>
    assert.equal(rechne("entruempelung", { flaeche: 5000 }).art, "anfrage"));
  test("Mit allen Zusatzwerten (Testwerte) und Mindestpreis", () => {
    const c = testConfig();
    const r = spanne(
      rechne(
        "entruempelung",
        {
          flaeche: 50,
          zustand: "normal",
          etage: 1,
          keller: true,
          reinigung: true,
        },
        c,
      ),
    );
    // 50*15*1.07 + 150 + 50*3 = 1102.5 -> 1150; 50*25*1.07 + 300 + 50*5 = 1887.5 -> 1900
    assert.deepEqual([r.von, r.bis], [1150, 1900]);
    const klein = rechne("entruempelung", { flaeche: 5, zustand: "normal" }, c);
    assert.deepEqual(klein, { art: "ab", ab: 300 });
  });
});

describe("Umzug", () => {
  test("Ohne gesetzte Werte: Preis auf Anfrage", () =>
    assert.equal(rechne("umzug", { zimmer: 2, km: 20 }).art, "anfrage"));
  test("Fehlende Entfernung: unvollständig", () =>
    assert.equal(rechne("umzug", { zimmer: 2, km: "" }).art, "unvollstaendig"));
  const c = testConfig();
  test("2 Zimmer im Nahbereich: nie unter 600 €", () => {
    const r = spanne(rechne("umzug", { zimmer: 2, km: 25 }, c));
    assert.ok(r.von >= 600);
  });
  test("3 Zimmer, 2. Etage ohne Aufzug, 50 km, Möbel, 1 Klavier", () => {
    const r = spanne(
      rechne(
        "umzug",
        {
          zimmer: 3,
          km: "50",
          etageAus: 2,
          aufzugAus: false,
          etageEin: 3,
          aufzugEin: true,
          moebel: true,
          schwer: 1,
        },
        c,
      ),
    );
    // 900+80+40+100+150 = 1270 -> 1300; 1200+120+60+200+250 = 1830 -> 1850
    assert.deepEqual([r.von, r.bis], [1300, 1850]);
  });
  test("Zu weit: Preis auf Anfrage", () =>
    assert.equal(rechne("umzug", { zimmer: 2, km: 400 }, c).art, "anfrage"));
});

describe("Trockenbau", () => {
  test("Zwischenwand 10 m² inkl. Material, ohne Spachteln", () => {
    const r = spanne(
      rechne("trockenbau", {
        art: "zwischenwand",
        flaeche: 10,
        material: "fixum",
        oberflaeche: "ohne",
      }),
    );
    // 450+80 = 530 -> 550; 650+80 = 730 -> 750
    assert.deepEqual([r.von, r.bis], [550, 750]);
  });
  test("Zwischenwand 20 m², Q2, Dämmung, 1 Tür", () => {
    const r = spanne(
      rechne("trockenbau", {
        art: "zwischenwand",
        flaeche: "20",
        material: "fixum",
        oberflaeche: "normal",
        daemmung: true,
        tueren: 1,
      }),
    );
    // 20*(45+9+6)+100+80 = 1380 -> 1400; 20*(65+12+6)+130+80 = 1870 -> 1900
    assert.deepEqual([r.von, r.bis], [1400, 1900]);
  });
  test("Dachschräge mit Dämmung bekommt Dampfbremse", () => {
    const r = spanne(
      rechne("trockenbau", {
        art: "dachschraege",
        flaeche: 30,
        material: "fixum",
        oberflaeche: "glatt",
        daemmung: true,
      }),
    );
    // 30*(60+14+6+7)+80 = 2690 -> 2700; 30*(75+18+6+8)+80 = 3290 -> 3300
    assert.deepEqual([r.von, r.bis], [2700, 3300]);
  });
  test("Schallschutzwand: Dämmung nicht doppelt", () => {
    const mit = rechne("trockenbau", {
      art: "schallschutzwand",
      flaeche: 10,
      oberflaeche: "ohne",
      daemmung: true,
    });
    const ohne = rechne("trockenbau", {
      art: "schallschutzwand",
      flaeche: 10,
      oberflaeche: "ohne",
    });
    assert.deepEqual(mit, ohne);
  });
  test("Türöffnungen nur bei Wänden", () => {
    const a = rechne("trockenbau", {
      art: "deckeAbhaengen",
      flaeche: 15,
      oberflaeche: "normal",
      tueren: 3,
    });
    const b = rechne("trockenbau", {
      art: "deckeAbhaengen",
      flaeche: 15,
      oberflaeche: "normal",
    });
    assert.deepEqual(a, b);
  });
  test("Schallschutz mit Kundenmaterial ohne Wert: Preis auf Anfrage", () =>
    assert.equal(
      rechne("trockenbau", {
        art: "schallschutzwand",
        flaeche: 10,
        material: "kunde",
      }).art,
      "anfrage",
    ));
  test("Inkl. Material nie unter 45 €/m²", () => {
    for (const art of [
      "zwischenwand",
      "schallschutzwand",
      "deckeAbhaengen",
      "dachschraege",
      "vorsatzschale",
    ])
      for (const flaeche of [1, 5, 60, 400]) {
        const r = spanne(
          rechne("trockenbau", {
            art,
            flaeche,
            material: "fixum",
            oberflaeche: "ohne",
          }),
        );
        assert.ok(r.von >= flaeche * 45, `${art} ${flaeche}`);
      }
  });
  test("Fläche über Höchstwert: Preis auf Anfrage", () =>
    assert.equal(
      rechne("trockenbau", { art: "zwischenwand", flaeche: 900 }).art,
      "anfrage",
    ));
  test("Mindestpreis greift", () =>
    assert.deepEqual(
      rechne(
        "trockenbau",
        {
          art: "zwischenwand",
          flaeche: 2,
          material: "kunde",
          oberflaeche: "ohne",
        },
        testConfig(),
      ),
      { art: "ab", ab: 400 },
    ));
});

describe("Montage", () => {
  test("Ohne Werte: Preis auf Anfrage", () =>
    assert.equal(rechne("montage", { art: "tuer", anzahl: 3 }).art, "anfrage"));
  const c = testConfig();
  test("3 Türen mit Ausbau", () => {
    const r = spanne(
      rechne("montage", { art: "tuer", anzahl: "3", ausbau: true }, c),
    );
    // 3*150 = 450; 3*210 = 630 -> 650
    assert.deepEqual([r.von, r.bis], [450, 650]);
  });
  test("Küche 3,6 m", () => {
    const r = spanne(rechne("montage", { art: "kueche", meter: "3,6" }, c));
    // 540 -> 550; 720 -> 750
    assert.deepEqual([r.von, r.bis], [550, 750]);
  });
  test("Ein Möbelstück unter Mindestpreis", () =>
    assert.deepEqual(rechne("montage", { art: "moebel", anzahl: 1 }, c), {
      art: "ab",
      ab: 150,
    }));
  test("Anzahl fehlt", () =>
    assert.equal(
      rechne("montage", { art: "moebel", anzahl: "" }, c).art,
      "unvollstaendig",
    ));
});

describe("Boden", () => {
  test("Ohne Werte: Preis auf Anfrage", () =>
    assert.equal(rechne("boden", { flaeche: 40 }).art, "anfrage"));
  const c = testConfig();
  test("40 m² mit Entfernen und 30 m Leisten", () => {
    const r = spanne(
      rechne("boden", { flaeche: 40, entfernen: true, leisten: "30" }, c),
    );
    // 40*23+30*6 = 1100; 40*33+30*9 = 1590 -> 1600
    assert.deepEqual([r.von, r.bis], [1100, 1600]);
  });
  test("Leisten leer zählt als 0", () => {
    const r = spanne(rechne("boden", { flaeche: 40, leisten: "" }, c));
    assert.deepEqual([r.von, r.bis], [750, 1000]);
  });
});

describe("Nie ein einzelner Betrag", () => {
  test("Gleiche Unter- und Obergrenze wird zur Spanne", () => {
    const c = testConfig();
    c.boden.verlegenProQuadratmeter = { von: 20, bis: 20 };
    c.boden.mindestpreis = { wert: null };
    const r = spanne(rechne("boden", { flaeche: 10 }, c));
    assert.ok(r.bis > r.von);
  });
});

describe("Weitergabe an den Browser", () => {
  test("Verpacken und Entpacken ergibt dasselbe Modell", () => {
    const m = baueModell(config, "trockenbau");
    const paket = verpacke(m);
    assert.deepEqual(entpacke(paket), m);
  });
  test("Im Paket stehen keine lesbaren Preise oder Begriffe", () => {
    const paket = verpacke(baueModell(config, "entruempelung"));
    assert.ok(!/"von"|messie|normal|15,|"bis"/.test(paket));
  });
  test("Modell enthält keine Hinweise oder Platzhalter", () => {
    const text = JSON.stringify(baueModell(config, "umzug"));
    assert.ok(!/hinweis|platzhalter|\[/.test(text));
  });
});

describe("Rechner nur mit Grundwerten anzeigen", () => {
  test("Aktuelle Config: Entrümpelung und Trockenbau an, Rest aus", () => {
    assert.equal(rechnerBereit(config, "entruempelung"), true);
    assert.equal(rechnerBereit(config, "trockenbau"), true);
    assert.equal(rechnerBereit(config, "umzug"), false);
    assert.equal(rechnerBereit(config, "montage"), false);
    assert.equal(rechnerBereit(config, "boden"), false);
  });
  test("Mit ausgefüllten Werten sind alle Rechner an", () => {
    const c = testConfig();
    for (const l of [
      "entruempelung",
      "umzug",
      "trockenbau",
      "montage",
      "boden",
    ] as const)
      assert.equal(rechnerBereit(c, l), true, l);
  });
  test("Montage: eine Art mit Wert genügt", () => {
    const c = structuredClone(config);
    c.montage.innentuerMitZargeJeStueck = { von: 100, bis: 150 };
    assert.equal(rechnerBereit(c, "montage"), true);
  });
});
