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

const rechne = (
  l: Leistung,
  e: Record<string, unknown>,
  c = config,
): Ergebnis =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (rechner[l] as any)(baueModell(c, l), e);

const spanne = (r: Ergebnis) => {
  assert.equal(r.art, "spanne", `erwartet Spanne, bekam ${JSON.stringify(r)}`);
  return r as { art: "spanne"; von: number; bis: number; zusatz?: string[] };
};
const werte = (r: Ergebnis) => {
  const s = spanne(r);
  return [s.von, s.bis];
};

/* Alle Kombinationen einer Liste von Optionen (kartesisches Produkt). */
const kombinationen = (optionen: Record<string, unknown[]>) =>
  Object.entries(optionen).reduce<Record<string, unknown>[]>(
    (alle, [k, liste]) =>
      alle.flatMap((a) => liste.map((v) => ({ ...a, [k]: v }))),
    [{}],
  );

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
    assert.equal(ergebnisText({ art: "ab", ab: 290 }), "ab 290 €"));
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
    for (const w of Object.values(inkl))
      assert.ok((w as { von: number }).von >= ab.trockenbauwandInklMaterial);
  });
  test("Umzug: 2 Zimmer im Nahbereich = Ab-Preis", () =>
    assert.equal(
      config.umzug.grundpreisNahbereich["2"].von,
      ab.umzugZweiZimmerNahbereich,
    ));
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
  test("Alle Rechner haben ihre Grundwerte", () => {
    for (const l of [
      "entruempelung",
      "umzug",
      "trockenbau",
      "montage",
      "boden",
    ] as const)
      assert.equal(rechnerBereit(config, l), true, l);
  });
});

/* ------------------------------------------------------------------ Fälle aus dem Auftrag */

describe("Testfälle aus dem Auftrag", () => {
  test("Entrümpelung 70 m² Messie, EG, Keller voll 10 m², Grundreinigung", () =>
    // 70*36 + 10*36 + 70*15 = 3930 -> 3950 | 70*60 + 10*60 + 70*25 = 6550
    assert.deepEqual(
      werte(
        rechne("entruempelung", {
          flaeche: "70",
          zustand: "messie",
          etage: "0",
          keller: true,
          kellerFlaeche: "10",
          kellerFuell: "voll",
          reinigung: "grund",
        }),
      ),
      [3950, 6550],
    ));
  test("Entrümpelung 45 m² normal, 2. OG, ohne Zusatzflächen", () =>
    // 45*15*1.2 = 810 -> 850 | 45*25*1.2 = 1350
    assert.deepEqual(
      werte(
        rechne("entruempelung", {
          flaeche: "45",
          zustand: "normal",
          etage: "2",
        }),
      ),
      [850, 1350],
    ));
  test("Umzug 2 Zimmer, 10 km, EG nach EG, ohne Montage", () =>
    assert.deepEqual(
      werte(
        rechne("umzug", {
          zimmer: "2",
          km: "10",
          etageAus: "0",
          etageEin: "0",
        }),
      ),
      [600, 850],
    ));
  test("Umzug 4 Zimmer, 5 km, 1. OG nach 2. OG, Montage, 2 schwere Stücke", () =>
    // (1000..1400)*1.3 + 4*(50..90) + 2*(60..120) = 1620..2420 -> 1650..2450
    assert.deepEqual(
      werte(
        rechne("umzug", {
          zimmer: "4",
          km: "5",
          etageAus: "1",
          etageEin: "2",
          moebel: true,
          schwer: "2",
        }),
      ),
      [1650, 2450],
    ));
  test("Trockenbau 20 m² Zwischenwand inkl. Material, Q2, 1 Türöffnung", () =>
    // 20*(45+9)+100+80 = 1260 -> 1300 | 20*(65+12)+130+150 = 1820 -> 1850
    assert.deepEqual(
      werte(
        rechne("trockenbau", {
          art: "zwischenwand",
          flaeche: "20",
          material: "fixum",
          oberflaeche: "normal",
          tueren: "1",
        }),
      ),
      [1300, 1850],
    ));
  test("Montage 3 Innentüren mit Ausbau der alten", () =>
    // 3*(120+40) = 480 -> 500 | 3*(180+70) = 750
    assert.deepEqual(
      werte(
        rechne("montage", { tueren: true, tuerAnzahl: "3", tuerAusbau: true }),
      ),
      [500, 750],
    ));
  test("Boden 40 m² Klick-Vinyl, alten Belag entfernen, 30 m Sockelleiste", () =>
    // 40*(14+4)+30*5 = 870 -> 900 | 40*(20+8)+30*8 = 1360 -> 1400
    assert.deepEqual(
      werte(
        rechne("boden", {
          flaeche: "40",
          belag: "vinyl",
          entfernen: true,
          leisten: "30",
          material: "kunde",
        }),
      ),
      [900, 1400],
    ));
});

/* ------------------------------------------------------------------ Entrümpelung */

describe("Entrümpelung", () => {
  test("Messie + Keller ergibt eine Spanne (früher: Preis auf Anfrage)", () => {
    spanne(
      rechne("entruempelung", { flaeche: 60, zustand: "messie", keller: true }),
    );
  });
  test("Jede Kombination ergibt Spanne oder ab-Preis, nie 'auf Anfrage'", () => {
    const alle = kombinationen({
      flaeche: ["5", "45", "70", "400"],
      zustand: ["normal", "stark", "messie"],
      etage: ["0", "3"],
      keller: [false, true],
      kellerFuell: ["wenig", "voll"],
      kellerFlaeche: ["", "25"],
      dachboden: [false, true],
      dachbodenZugang: ["treppe", "leiter"],
      garage: [false, true],
      garageGroesse: ["klein", "gross"],
      garageFuell: ["wenig", "voll"],
      kueche: [false, true],
      kuechenzeile: [false, true],
      einbauschraenke: ["0", "3"],
      reinigung: ["keine", "grund", "tief"],
      eilig: [false, true],
      halteverbot: [false, true],
    });
    for (const e of alle) {
      const r = rechne("entruempelung", e);
      assert.ok(r.art === "spanne" || r.art === "ab", JSON.stringify({ e, r }));
    }
  });
  test("Standardflächen: Keller 10 m², Dachboden 15 m², Füllgrad voll", () => {
    const ohne = rechne("entruempelung", {
      flaeche: 50,
      keller: true,
      dachboden: true,
    });
    const mit = rechne("entruempelung", {
      flaeche: 50,
      keller: true,
      kellerFlaeche: "10",
      kellerFuell: "voll",
      dachboden: true,
      dachbodenFlaeche: "15",
      dachbodenFuell: "voll",
    });
    assert.deepEqual(ohne, mit);
  });
  test("Messie: Keller/Dachboden mit Messie-Satz, Füllgrad egal", () => {
    const a = rechne("entruempelung", {
      flaeche: 50,
      zustand: "messie",
      keller: true,
      kellerFuell: "wenig",
    });
    const b = rechne("entruempelung", {
      flaeche: 50,
      zustand: "messie",
      keller: true,
      kellerFuell: "voll",
    });
    assert.deepEqual(a, b);
    // 50*36 + 10*36 = 2160 -> 2200 | 50*60 + 10*60 = 3600
    assert.deepEqual(werte(a), [2200, 3600]);
  });
  test("Dachboden nur über Leiter: +20 % auf den Dachboden-Anteil", () =>
    // 40*15 + 15*18*1.2 = 924 -> 950 | 40*25 + 15*30*1.2 = 1540 -> 1550
    assert.deepEqual(
      werte(
        rechne("entruempelung", {
          flaeche: 40,
          dachboden: true,
          dachbodenZugang: "leiter",
        }),
      ),
      [950, 1550],
    ));
  test("Etagenaufschlag nur auf die Wohnfläche", () =>
    // 40*15*1.1 + 10*18 = 840 -> 850 | 40*25*1.1 + 10*30 = 1400
    assert.deepEqual(
      werte(rechne("entruempelung", { flaeche: 40, etage: 1, keller: true })),
      [850, 1400],
    ));
  test("Garage groß, voll + Küchenzeile + 2 Einbauschränke", () =>
    // 50*15 + 500 + 150 + 120 = 1520 -> 1550 | 50*25 + 900 + 350 + 240 = 2740 -> 2750
    assert.deepEqual(
      werte(
        rechne("entruempelung", {
          flaeche: 50,
          garage: true,
          garageGroesse: "gross",
          garageFuell: "voll",
          kueche: true,
          kuechenzeile: true,
          einbauschraenke: "2",
        }),
      ),
      [1550, 2750],
    ));
  test("Eilauftrag +15–25 %, Halteverbotszone obendrauf", () =>
    // 60*15*1.15 + 80 = 1115 -> 1150 | 60*25*1.25 + 150 = 2025 -> 2050
    assert.deepEqual(
      werte(
        rechne("entruempelung", {
          flaeche: 60,
          eilig: true,
          halteverbot: true,
        }),
      ),
      [1150, 2050],
    ));
  test("Besondere Verschmutzung: Spanne bleibt, Hinweis kommt dazu", () => {
    const r = spanne(
      rechne("entruempelung", {
        flaeche: 60,
        zustand: "messie",
        verschmutzung: true,
      }),
    );
    assert.deepEqual(r.zusatz, ["sonderreinigung"]);
  });
  test("Unter Mindestauftrag: ab 290 €", () =>
    assert.deepEqual(rechne("entruempelung", { flaeche: 5 }), {
      art: "ab",
      ab: 290,
    }));
  test("Nie unter dem Ab-Preis pro m²", () => {
    for (const [zustand, ab] of [
      ["normal", 15],
      ["stark", 25],
      ["messie", 36],
    ] as const)
      for (const flaeche of [20, 60, 133, 400]) {
        const r = spanne(rechne("entruempelung", { flaeche, zustand }));
        assert.ok(r.von >= flaeche * ab, `${zustand} ${flaeche}`);
      }
  });
  test("Leere Fläche: unvollständig; riesige Fläche: auf Anfrage", () => {
    assert.equal(
      rechne("entruempelung", { flaeche: "" }).art,
      "unvollstaendig",
    );
    assert.equal(rechne("entruempelung", { flaeche: "5000" }).art, "anfrage");
  });
});

/* ------------------------------------------------------------------ Umzug */

describe("Umzug", () => {
  test("Grundpreise im Nahbereich", () => {
    const erwartet: Record<string, number[]> = {
      "1": [450, 650],
      "2": [600, 850],
      "3": [800, 1150],
      "4": [1000, 1400],
      "5": [1400, 2000],
    };
    for (const [z, w] of Object.entries(erwartet))
      assert.deepEqual(werte(rechne("umzug", { zimmer: z, km: "15" })), w, z);
  });
  test("km über 15: 2–3 € je km", () =>
    // 600 + 35*2 = 670 -> 700 | 850 + 35*3 = 955 -> 1000
    assert.deepEqual(
      werte(rechne("umzug", { zimmer: "2", km: "50" })),
      [700, 1000],
    ));
  test("Aufzug hebt den Etagenaufschlag auf", () =>
    assert.deepEqual(
      rechne("umzug", { zimmer: "2", km: "5", etageAus: "3", aufzugAus: true }),
      rechne("umzug", { zimmer: "2", km: "5" }),
    ));
  test("Küche, Entsorgung, Eilauftrag und Halteverbot an beiden Adressen", () =>
    // Küche 4 m: Abbau 200..450 + Aufbau 4*(100..160)
    // (600+200+400+100)*1.15 + 160 = 1655 -> 1700 | (850+450+640+250)*1.25 + 300 = 3037.5 -> 3050
    assert.deepEqual(
      werte(
        rechne("umzug", {
          zimmer: "2",
          km: "10",
          kueche: true,
          kuecheMeter: "4",
          entsorgung: true,
          eilig: true,
          halteverbot: "2",
        }),
      ),
      [1700, 3050],
    ));
  test("Küche im Umzug: Aufbau mit Etage des Einzugs, Stein-Hinweis", () => {
    // 600*1.2 = 720 | 850*1.2 = 1020 (2. OG Einzug)
    // Küche: Abbau 200..450 + 3*(100..160) = 300..480, +10 % (2 Etagen) = 330..528
    const r = spanne(
      rechne("umzug", {
        zimmer: "2",
        km: "5",
        etageEin: "2",
        kueche: true,
        kuecheMeter: "3",
        arbeitsplatte: true,
        plattenMaterial: "stein",
      }),
    );
    // 720 + 200 + 330 = 1250 | 1020 + 450 + 528 = 1998 -> 2000
    assert.deepEqual([r.von, r.bis], [1250, 2000]);
    assert.deepEqual(r.zusatz, ["stein"]);
  });
  test("Küche im Umzug ohne Länge: unvollständig", () =>
    assert.equal(
      rechne("umzug", { zimmer: "2", km: "5", kueche: true }).art,
      "unvollstaendig",
    ));
  test("Möbelmontage: Zimmerzahl änderbar", () =>
    // 600 + 1*50 = 650 | 850 + 90 = 940 -> 950
    assert.deepEqual(
      werte(
        rechne("umzug", {
          zimmer: "2",
          km: "5",
          moebel: true,
          moebelZimmer: "1",
        }),
      ),
      [650, 950],
    ));
  test("Über 100 km und 'größer als 5 Zimmer': auf Anfrage", () => {
    assert.equal(rechne("umzug", { zimmer: "2", km: "120" }).art, "anfrage");
    assert.equal(rechne("umzug", { zimmer: "99", km: "10" }).art, "anfrage");
  });
  test("Jede Kombination bis 100 km ergibt eine Spanne", () => {
    for (const e of kombinationen({
      zimmer: ["1", "3", "5"],
      km: ["0", "15", "60", "100"],
      etageAus: ["0", "5"],
      aufzugAus: [false, true],
      etageEin: ["0", "2"],
      moebel: [false, true],
      kueche: [false, true],
      kuecheMeter: ["3"],
      schwer: ["0", "3"],
      entsorgung: [false, true],
      eilig: [false, true],
      halteverbot: ["0", "1", "2"],
    }))
      spanne(rechne("umzug", e));
  });
  test("Entfernung fehlt: unvollständig", () =>
    assert.equal(
      rechne("umzug", { zimmer: "2", km: "" }).art,
      "unvollstaendig",
    ));
});

/* ------------------------------------------------------------------ Trockenbau */

describe("Trockenbau", () => {
  test("Dachschräge, glatt, Dämmung: mit Dampfbremse", () =>
    // 30*(60+14+6+7)+80 = 2690 -> 2700 | 30*(75+18+6+8)+150 = 3360 -> 3400
    assert.deepEqual(
      werte(
        rechne("trockenbau", {
          art: "dachschraege",
          flaeche: 30,
          oberflaeche: "glatt",
          daemmung: true,
        }),
      ),
      [2700, 3400],
    ));
  test("Doppelt beplankt: +9 €/m² bei Zwischenwand", () =>
    // 10*(45+9+9)+80 = 710 -> 750 | 10*(65+12+9)+150 = 1010 -> 1050
    assert.deepEqual(
      werte(
        rechne("trockenbau", {
          art: "zwischenwand",
          flaeche: 10,
          oberflaeche: "normal",
          doppelt: true,
        }),
      ),
      [750, 1050],
    ));
  test("Schallschutzwand: immer mit Material, Dämmung nicht doppelt", () => {
    const a = rechne("trockenbau", {
      art: "schallschutzwand",
      flaeche: 10,
      material: "kunde",
      daemmung: true,
    });
    const b = rechne("trockenbau", {
      art: "schallschutzwand",
      flaeche: 10,
      material: "fixum",
    });
    assert.deepEqual(a, b);
  });
  test("Jede Kombination ergibt Spanne oder ab-Preis", () => {
    for (const e of kombinationen({
      art: [
        "zwischenwand",
        "schallschutzwand",
        "deckeAbhaengen",
        "dachschraege",
        "vorsatzschale",
      ],
      flaeche: ["1", "20", "500"],
      material: ["fixum", "kunde"],
      oberflaeche: ["ohne", "normal", "glatt"],
      daemmung: [false, true],
      doppelt: [false, true],
      tueren: ["0", "2"],
    })) {
      const r = rechne("trockenbau", e);
      assert.ok(r.art === "spanne" || r.art === "ab", JSON.stringify({ e, r }));
    }
  });
  test("Inkl. Material nie unter 45 €/m² (Fläche groß genug für den Mindestauftrag)", () => {
    for (const art of [
      "zwischenwand",
      "schallschutzwand",
      "deckeAbhaengen",
      "dachschraege",
      "vorsatzschale",
    ])
      for (const flaeche of [10, 60, 400]) {
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
  test("Kleine Fläche: ab 350 €", () =>
    assert.deepEqual(
      rechne("trockenbau", {
        art: "zwischenwand",
        flaeche: 2,
        material: "kunde",
        oberflaeche: "ohne",
      }),
      { art: "ab", ab: 350 },
    ));
});

/* ------------------------------------------------------------------ Montage */

describe("Montage", () => {
  test("Nichts gewählt: unvollständig", () =>
    assert.equal(rechne("montage", {}).art, "unvollstaendig"));
  test("Möbel: 2 Stück + 1 Großschrank", () =>
    // 2*40 + 90 = 170 -> 200 | 2*90 + 180 = 360 -> 400
    assert.deepEqual(
      werte(
        rechne("montage", {
          moebel: true,
          moebelAnzahl: "2",
          grossschraenke: "1",
        }),
      ),
      [200, 400],
    ));
  test("Küche 3,6 m mit Abbau der alten", () =>
    // 3.6*100 + 200 = 560 -> 600 | 3.6*160 + 450 = 1026 -> 1050
    assert.deepEqual(
      werte(
        rechne("montage", {
          kueche: true,
          kuecheMeter: "3,6",
          kuecheAlt: true,
        }),
      ),
      [600, 1050],
    ));
  test("Alles kombiniert", () => {
    spanne(
      rechne("montage", {
        tueren: true,
        tuerAnzahl: "2",
        moebel: true,
        moebelAnzahl: "3",
        kueche: true,
        kuecheMeter: "4",
      }),
    );
  });
  test("Eine Tür: Spanne beginnt beim Mindestauftrag 150 €", () =>
    assert.deepEqual(rechne("montage", { tueren: true, tuerAnzahl: "1" }), {
      art: "spanne",
      von: 150,
      bis: 200,
    }));
  test("Küche ohne Länge: unvollständig", () =>
    assert.equal(
      rechne("montage", { kueche: true, kuecheMeter: "" }).art,
      "unvollstaendig",
    ));
});

/* ------------------------------------------------------------------ Küchenmontage */

describe("Küchenmontage: Testfälle aus dem Auftrag", () => {
  test("4 m Zeile, Bausatz, Hängeschränke gleiche Länge, Arbeitsplatte, 2 Ausschnitte, 3 Geräte, EG", () =>
    // Schränke (400+200)*1.35 = 810 | (640+320)*1.35 = 1296
    // + Platte 140..240 + Ausschnitte 120..200 + Geräte 120..240
    // = 1190 -> 1200 | 1976 -> 2000
    assert.deepEqual(
      werte(
        rechne("montage", {
          kueche: true,
          kuecheForm: "zeile",
          kuecheMeter: "4",
          lieferzustand: "bausatz",
          haengeschraenke: "gleich",
          arbeitsplatte: true,
          plattenMaterial: "holz",
          ausschnitte: "2",
          geraete: "3",
          kuecheEtage: "0",
        }),
      ),
      [1200, 2000],
    ));
  test("6 m L-Form, fertig, Hängeschränke teilweise, 2 Hochschränke, Arbeitsplatte, 2 Ausschnitte, 4 Geräte, alte Küche, 2. OG", () =>
    // 600+150+140+210+120+90+160+200 = 1670 | 960+240+260+360+200+160+320+450 = 2950
    // +10 % (2 Etagen) = 1837 -> 1850 | 3245 -> 3250
    assert.deepEqual(
      werte(
        rechne("montage", {
          kueche: true,
          kuecheForm: "l",
          kuecheMeter: "6",
          lieferzustand: "fertig",
          haengeschraenke: "halb",
          hochschraenke: "2",
          arbeitsplatte: true,
          plattenMaterial: "holz",
          ausschnitte: "2",
          geraete: "4",
          kuecheAlt: true,
          kuecheEtage: "2",
        }),
      ),
      [1850, 3250],
    ));
  test("2,4 m Pantryküche, fertig, keine Hängeschränke, ohne Arbeitsplatte, 1 Gerät", () =>
    // 240+40 = 280 | 384+80 = 464 -> Mindestpreis 450: 450 | 464 -> 500
    assert.deepEqual(
      werte(
        rechne("montage", {
          kueche: true,
          kuecheForm: "zeile",
          kuecheMeter: "2,4",
          lieferzustand: "fertig",
          haengeschraenke: "keine",
          arbeitsplatte: false,
          geraete: "1",
        }),
      ),
      [450, 500],
    ));
  test("8 m U-Form mit Insel, Bausatz, alles ausgewählt, Steinarbeitsplatte", () => {
    // Schränke (800+400+140)*1.35 = 1809 | (1280+640+260)*1.35 = 2943
    // + Insel 150..300 + Geräte 160..320 + Nische 8 m 160..280 + alte Küche 200..450
    // = 2479 -> 2500 | 4293 -> 4300; Arbeitsplatte (Stein): auf Anfrage
    const r = spanne(
      rechne("montage", {
        kueche: true,
        kuecheForm: "u",
        kochinsel: true,
        kuecheMeter: "8",
        lieferzustand: "bausatz",
        haengeschraenke: "gleich",
        hochschraenke: "2",
        arbeitsplatte: true,
        plattenMaterial: "stein",
        ausschnitte: "2",
        ecken: "2",
        geraete: "4",
        nischeMeter: "8",
        kuecheAlt: true,
        kuecheEtage: "0",
      }),
    );
    assert.deepEqual([r.von, r.bis], [2500, 4300]);
    assert.deepEqual(r.zusatz, ["stein"]);
  });
});

describe("Küchenmontage: Regeln", () => {
  const basis = { kueche: true, kuecheMeter: "4", lieferzustand: "fertig" };
  test("Eckverbindung: L-Form 1, U-Form 2 automatisch", () => {
    const mit = (form: string, ecken?: string) =>
      rechne("montage", {
        ...basis,
        arbeitsplatte: true,
        kuecheForm: form,
        ...(ecken ? { ecken } : {}),
      });
    assert.deepEqual(mit("l"), mit("zeile", "1"));
    assert.deepEqual(mit("u"), mit("zeile", "2"));
  });
  test("Bausatz: +35 % nur auf die Schränke", () => {
    // fertig: 400 + 3 Geräte 120 = 520 | 640 + 240 = 880
    // Bausatz: 540 + 120 = 660 -> 700 | 864 + 240 = 1104 -> 1150
    assert.deepEqual(
      werte(rechne("montage", { ...basis, geraete: "3" })),
      [550, 900],
    );
    assert.deepEqual(
      werte(
        rechne("montage", { ...basis, lieferzustand: "bausatz", geraete: "3" }),
      ),
      [700, 1150],
    );
  });
  test("Stein ohne Zuschnitt (Arbeitsplatte nein): kein Hinweis", () =>
    assert.equal(
      spanne(
        rechne("montage", {
          ...basis,
          arbeitsplatte: false,
          plattenMaterial: "stein",
        }),
      ).zusatz,
      undefined,
    ));
  test("Etage: +5 % je Etage, höchstens 3 Etagen", () =>
    assert.deepEqual(
      rechne("montage", { ...basis, kuecheEtage: "5" }),
      rechne("montage", { ...basis, kuecheEtage: "3" }),
    ));
  test("Mit Küche gilt der Mindestpreis 450 €, auch zusammen mit Türen", () =>
    assert.deepEqual(rechne("montage", { kueche: true, kuecheMeter: "1" }), {
      art: "ab",
      ab: 450,
    }));
  test("Längere Küche als erlaubt: auf Anfrage", () =>
    assert.equal(
      rechne("montage", { kueche: true, kuecheMeter: "40" }).art,
      "anfrage",
    ));
  test("Jede Kombination ergibt Spanne oder ab-Preis", () => {
    for (const e of kombinationen({
      kueche: [true],
      kuecheForm: ["zeile", "l", "u"],
      kochinsel: [false, true],
      kuecheMeter: ["1", "4", "12"],
      lieferzustand: ["fertig", "bausatz"],
      haengeschraenke: ["keine", "gleich", "halb"],
      hochschraenke: ["0", "2"],
      arbeitsplatte: [false, true],
      plattenMaterial: ["holz", "stein"],
      ausschnitte: ["0", "2"],
      geraete: ["0", "4"],
      nischeMeter: ["", "3"],
      kuecheAlt: [false, true],
      kuecheEtage: ["0", "3"],
      tueren: [false, true],
    })) {
      const r = rechne("montage", e);
      assert.ok(r.art === "spanne" || r.art === "ab", JSON.stringify({ e, r }));
    }
  });
});

/* ------------------------------------------------------------------ Boden */

describe("Boden", () => {
  test("Teppich mit Trittschall", () =>
    // 30*(10+2) = 360 -> 400 | 30*(16+3) = 570 -> 600
    assert.deepEqual(
      werte(
        rechne("boden", { flaeche: 30, belag: "teppich", trittschall: true }),
      ),
      [400, 600],
    ));
  test("Material über Fixum: Hinweis 'zzgl. Material'", () =>
    assert.deepEqual(
      spanne(
        rechne("boden", { flaeche: 40, belag: "laminat", material: "fixum" }),
      ).zusatz,
      ["material"],
    ));
  test("Kleine Fläche: ab 250 €", () =>
    assert.deepEqual(rechne("boden", { flaeche: 5, belag: "laminat" }), {
      art: "ab",
      ab: 250,
    }));
  test("Leisten leer zählt als 0", () =>
    assert.deepEqual(
      rechne("boden", { flaeche: 40, leisten: "" }),
      rechne("boden", { flaeche: 40 }),
    ));
});

/* ------------------------------------------------------------------ Allgemein */

describe("Nie ein einzelner Betrag", () => {
  test("Gleiche Unter- und Obergrenze wird zur Spanne", () => {
    const c = structuredClone(config);
    c.boden.verlegenProQuadratmeter.klick = { von: 20, bis: 20 };
    c.boden.mindestpreis = { wert: null };
    const r = spanne(rechne("boden", { flaeche: 50 }, c));
    assert.ok(r.bis > r.von);
  });
});

describe("Fehlender Wert in der Config", () => {
  test("ergibt bei genau dieser Auswahl 'Preis auf Anfrage'", () => {
    const c = structuredClone(config);
    c.entruempelung.halteverbotszone = { von: null, bis: null };
    assert.equal(
      rechne("entruempelung", { flaeche: 60, halteverbot: true }, c).art,
      "anfrage",
    );
    spanne(rechne("entruempelung", { flaeche: 60 }, c));
  });
  test("Rechner ohne Grundwerte wird ausgeblendet", () => {
    const c = structuredClone(config);
    c.umzug.grundpreisNahbereich = {};
    assert.equal(rechnerBereit(c, "umzug"), false);
  });
});

describe("Weitergabe an den Browser", () => {
  test("Verpacken und Entpacken ergibt dasselbe Modell", () => {
    const m = baueModell(config, "trockenbau");
    assert.deepEqual(entpacke(verpacke(m)), m);
  });
  test("Im Paket stehen keine lesbaren Preise oder Begriffe", () => {
    const paket = verpacke(baueModell(config, "entruempelung"));
    assert.ok(!/"von"|messie|normal|"bis"/.test(paket));
  });
  test("Modell enthält keine Hinweise", () => {
    for (const l of [
      "entruempelung",
      "umzug",
      "trockenbau",
      "montage",
      "boden",
    ] as const)
      assert.ok(!/hinweis/.test(JSON.stringify(baueModell(config, l))), l);
  });
});
