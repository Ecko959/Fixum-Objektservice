/* Rechenlogik des Preisrechners.

   Enthält selbst keine Preise. Alle Werte kommen aus
   src/data/preise.config.json und werden über baueModell() auf das
   Nötigste reduziert (nur Zahlen, keine Hinweise oder Platzhalter).

   Grundsätze:
   - Ergebnis ist immer eine Spanne, nie ein einzelner Betrag.
   - Fehlt ein Wert, den die Auswahl braucht: "Preis auf Anfrage".
     Es wird nie geschätzt.
   - Gerundet wird immer nach oben, damit nie ein zu niedriger Preis
     erscheint.
   - Unter dem Mindestauftrag: "ab <Mindestauftrag>".

   Bewusst ohne Importe, damit die Tests die Datei direkt mit Node
   ausführen können (node --test). */

export type Spanne = { von: number; bis: number };
type Wert = Spanne | null;

export type Ergebnis =
  | { art: "spanne"; von: number; bis: number }
  | { art: "ab"; ab: number }
  | { art: "anfrage" }
  | { art: "unvollstaendig"; fehlt: string };

export type Leistung =
  "entruempelung" | "umzug" | "trockenbau" | "montage" | "boden";

/* ---------------------------------------------------------------- Modell */

type Roh = { von?: number | null; bis?: number | null; wert?: number | null };

const spanne = (r: Roh | undefined): Wert => {
  if (!r) return null;
  const von = r.von;
  const bis = r.bis;
  if (typeof von !== "number" || typeof bis !== "number") return null;
  if (!Number.isFinite(von) || !Number.isFinite(bis) || von < 0 || bis < von)
    return null;
  return { von, bis };
};

const zahl = (r: Roh | undefined): number | null =>
  r && typeof r.wert === "number" && Number.isFinite(r.wert) ? r.wert : null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Config = any;

/** Reduziert die Config auf die Zahlen, die der Rechner einer Leistung braucht. */
export const baueModell = (c: Config, leistung: Leistung) => {
  const runden = zahl({ wert: c?.allgemein?.rundenAufEuro }) ?? 50;
  switch (leistung) {
    case "entruempelung": {
      const e = c.entruempelung ?? {};
      const qm = e.proQuadratmeterWohnflaeche ?? {};
      return {
        runden,
        qm: {
          normal: spanne(qm.normal),
          stark: spanne(qm.stark),
          messie: spanne(qm.messie),
        },
        etageProzent: zahl(e.aufschlagJeEtageOhneAufzugProzent),
        keller: spanne(e.keller),
        dachboden: spanne(e.dachboden),
        garage: spanne(e.garageOderSchuppen),
        kueche: spanne(e.kuecheOderEinbautenDemontieren),
        reinigungQm: spanne(e.endreinigungProQuadratmeter),
        min: zahl(e.mindestpreis),
        max: zahl(e.maxWohnflaeche),
      };
    }
    case "umzug": {
      const u = c.umzug ?? {};
      return {
        runden,
        zimmer: spanne(u.proZimmer),
        nahKm: zahl(u.nahbereichKm),
        km: spanne(u.proKmUeberNahbereich),
        etage: spanne(u.zuschlagJeEtageOhneAufzug),
        moebel: spanne(u.moebelAbUndAufbauen),
        kueche: spanne(u.kuecheAbUndAufbauen),
        schwer: spanne(u.schweresEinzelstueck),
        entsorgung: spanne(u.altmoebelEntsorgen),
        min: zahl(u.mindestpreis),
        maxZimmer: zahl(u.maxZimmer),
        maxKm: zahl(u.maxKm),
      };
    }
    case "trockenbau": {
      const t = c.trockenbau ?? {};
      const inkl = t.materialInklusiveProQuadratmeter ?? {};
      const kunde = t.materialVomKundenProQuadratmeter ?? {};
      const o = t.oberflaecheProQuadratmeter ?? {};
      const arten = [
        "zwischenwand",
        "schallschutzwand",
        "deckeAbhaengen",
        "dachschraege",
        "vorsatzschale",
      ];
      return {
        runden,
        inkl: Object.fromEntries(arten.map((a) => [a, spanne(inkl[a])])),
        kunde: Object.fromEntries(arten.map((a) => [a, spanne(kunde[a])])),
        oberflaeche: {
          ohne: spanne(o.ohne),
          normal: spanne(o.normal),
          glatt: spanne(o.glatt),
        },
        daemmung: spanne(t.daemmungProQuadratmeter),
        dampfbremse: spanne(t.dampfbremseProQuadratmeter),
        tuer: spanne(t.tueroeffnungJeStueck),
        baustelle: spanne(t.baustelleneinrichtung),
        min: zahl(t.mindestpreis),
        max: zahl(t.maxFlaeche),
      };
    }
    case "montage": {
      const m = c.montage ?? {};
      return {
        runden,
        tuer: spanne(m.innentuerMitZargeJeStueck),
        tuerAusbau: spanne(m.alteTuerAusbauenJeStueck),
        moebel: spanne(m.moebelJeStueck),
        moebelAusbau: spanne(m.altesMoebelAusbauenJeStueck),
        kueche: spanne(m.kuecheJeMeter),
        kuecheAusbau: spanne(m.alteKuecheAusbauenJeMeter),
        min: zahl(m.mindestpreis),
        maxAnzahl: zahl(m.maxAnzahl),
        maxMeter: zahl(m.maxKuechenmeter),
      };
    }
    case "boden": {
      const b = c.boden ?? {};
      return {
        runden,
        verlegen: spanne(b.verlegenProQuadratmeter),
        entfernen: spanne(b.altenBelagEntfernenProQuadratmeter),
        leiste: spanne(b.sockelleisteProMeter),
        min: zahl(b.mindestpreis),
        max: zahl(b.maxFlaeche),
        maxLeisten: zahl(b.maxLeistenMeter),
      };
    }
  }
};

/** Ein Rechner wird nur angezeigt, wenn seine Grundwerte in der Config
    stehen. Sonst würde er bei jeder Eingabe nur "Preis auf Anfrage" zeigen.
    Optionale Zusätze (Keller, Mindestpreis ...) dürfen fehlen - dafür
    erscheint bei genau dieser Auswahl "Preis auf Anfrage". */
export const rechnerBereit = (c: Config, leistung: Leistung): boolean => {
  const m = baueModell(c, leistung) as Record<string, unknown> & {
    qm?: Record<string, Wert>;
    inkl?: Record<string, Wert>;
    oberflaeche?: Record<string, Wert>;
  };
  switch (leistung) {
    case "entruempelung":
      return (
        Object.values(m.qm ?? {}).every(Boolean) && m.etageProzent !== null
      );
    case "umzug":
      return Boolean(m.zimmer) && m.nahKm !== null;
    case "trockenbau":
      return (
        Boolean(m.inkl?.zwischenwand) &&
        Boolean(m.oberflaeche?.normal) &&
        Boolean(m.baustelle)
      );
    case "montage":
      return Boolean(m.tuer || m.moebel || m.kueche);
    case "boden":
      return Boolean(m.verlegen);
  }
};

export const alleLeistungen: Leistung[] = [
  "entruempelung",
  "umzug",
  "trockenbau",
  "montage",
  "boden",
];

/* ---------------------------------------------------------------- Eingaben */

/** Liest Zahlen so, wie Menschen sie tippen: "12,5", "12.5", "1.200", "60 m²". */
export const leseZahl = (eingabe: unknown): number | null => {
  if (typeof eingabe === "number")
    return Number.isFinite(eingabe) ? eingabe : null;
  if (typeof eingabe !== "string") return null;
  let t = eingabe.trim().replace(/\s|m²|qm|m2|km|m\b|€/gi, "");
  if (!t) return null;
  if (t.includes(",")) {
    t = t.replace(/\./g, "").replace(",", ".");
  } else if (/^\d{1,3}(\.\d{3})+$/.test(t)) {
    t = t.replace(/\./g, "");
  }
  if (!/^\d+(\.\d+)?$/.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
};

/* ---------------------------------------------------------------- Helfer */

class FehlenderWert extends Error {}

/** Summe aus Spannen. Ein fehlender Wert bricht die Rechnung ab ("Preis auf Anfrage"). */
const summe = () => {
  let von = 0;
  let bis = 0;
  return {
    plus(wert: Wert, menge = 1) {
      if (menge <= 0) return;
      if (!wert) throw new FehlenderWert();
      von += wert.von * menge;
      bis += wert.bis * menge;
    },
    mal(faktor: number) {
      von *= faktor;
      bis *= faktor;
    },
    get wert(): Spanne {
      return { von, bis };
    },
  };
};

const aufrunden = (n: number, schritt: number) =>
  Math.ceil(n / schritt - 1e-9) * schritt;

/** Mindestauftrag und Rundung anwenden. */
export const abschliessen = (
  roh: Spanne,
  runden: number,
  min: number | null,
): Ergebnis => {
  let { von, bis } = roh;
  if (min !== null && min > 0) {
    if (bis < min) return { art: "ab", ab: min };
    von = Math.max(von, min);
  }
  const r = runden > 0 ? runden : 50;
  von = aufrunden(von, r);
  bis = aufrunden(bis, r);
  // Nie ein einzelner Betrag: mindestens eine Rundungsstufe Abstand.
  if (bis <= von) bis = von + r;
  return { art: "spanne", von, bis };
};

const rechne = (
  modell: { runden: number; min: number | null },
  fn: (s: ReturnType<typeof summe>) => void,
): Ergebnis => {
  const s = summe();
  try {
    fn(s);
  } catch (e) {
    if (e instanceof FehlenderWert) return { art: "anfrage" };
    throw e;
  }
  return abschliessen(s.wert, modell.runden, modell.min);
};

const ja = (v: unknown) => v === true || v === "ja" || v === "on" || v === "1";
const ganz = (v: unknown) => {
  const n = leseZahl(v);
  return n === null ? 0 : Math.max(0, Math.floor(n));
};

/* ---------------------------------------------------------------- Rechner */

type Eingaben = Record<string, unknown>;
type Modell = ReturnType<typeof baueModell>;

export const rechneEntruempelung = (m: Modell, e: Eingaben): Ergebnis => {
  const mm = m as Extract<Modell, { qm: unknown }>;
  const flaeche = leseZahl(e.flaeche);
  if (flaeche === null || flaeche <= 0)
    return { art: "unvollstaendig", fehlt: "Wohnfläche" };
  if (mm.max !== null && flaeche > mm.max) return { art: "anfrage" };
  const zustand = String(e.zustand ?? "normal") as
    "normal" | "stark" | "messie";
  return rechne(mm, (s) => {
    s.plus(mm.qm[zustand] ?? null, flaeche);
    const etagen = Math.min(ganz(e.etage), 3);
    if (etagen > 0) {
      if (mm.etageProzent === null) throw new FehlenderWert();
      s.mal(1 + (etagen * mm.etageProzent) / 100);
    }
    if (ja(e.keller)) s.plus(mm.keller);
    if (ja(e.dachboden)) s.plus(mm.dachboden);
    if (ja(e.garage)) s.plus(mm.garage);
    if (ja(e.kueche)) s.plus(mm.kueche);
    if (ja(e.reinigung)) s.plus(mm.reinigungQm, flaeche);
  });
};

export const rechneUmzug = (m: Modell, e: Eingaben): Ergebnis => {
  const mm = m as Extract<Modell, { nahKm: unknown }>;
  const zimmer = leseZahl(e.zimmer);
  if (zimmer === null || zimmer < 1)
    return { art: "unvollstaendig", fehlt: "Zimmeranzahl" };
  const km = leseZahl(e.km);
  if (km === null) return { art: "unvollstaendig", fehlt: "Entfernung" };
  if (mm.maxZimmer !== null && zimmer > mm.maxZimmer) return { art: "anfrage" };
  if (mm.maxKm !== null && km > mm.maxKm) return { art: "anfrage" };
  return rechne(mm, (s) => {
    s.plus(mm.zimmer, Math.ceil(zimmer));
    const etagen =
      (ja(e.aufzugAus) ? 0 : ganz(e.etageAus)) +
      (ja(e.aufzugEin) ? 0 : ganz(e.etageEin));
    s.plus(mm.etage, etagen);
    if (mm.nahKm === null) throw new FehlenderWert();
    s.plus(mm.km, Math.max(0, Math.ceil(km - mm.nahKm)));
    if (ja(e.moebel)) s.plus(mm.moebel);
    if (ja(e.kueche)) s.plus(mm.kueche);
    s.plus(mm.schwer, ganz(e.schwer));
    if (ja(e.entsorgung)) s.plus(mm.entsorgung);
  });
};

const WAENDE_MIT_TUER = ["zwischenwand", "schallschutzwand"];

export const rechneTrockenbau = (m: Modell, e: Eingaben): Ergebnis => {
  const mm = m as Extract<Modell, { inkl: unknown }>;
  const flaeche = leseZahl(e.flaeche);
  if (flaeche === null || flaeche <= 0)
    return { art: "unvollstaendig", fehlt: "Fläche" };
  if (mm.max !== null && flaeche > mm.max) return { art: "anfrage" };
  const art = String(e.art ?? "zwischenwand");
  const tabelle = e.material === "kunde" ? mm.kunde : mm.inkl;
  const oberflaeche = String(e.oberflaeche ?? "normal") as
    "ohne" | "normal" | "glatt";
  return rechne(mm, (s) => {
    s.plus(tabelle[art] ?? null, flaeche);
    s.plus(mm.oberflaeche[oberflaeche] ?? null, flaeche);
    const daemmung = ja(e.daemmung) && art !== "schallschutzwand";
    if (daemmung) s.plus(mm.daemmung, flaeche);
    if (daemmung && art === "dachschraege") s.plus(mm.dampfbremse, flaeche);
    if (WAENDE_MIT_TUER.includes(art)) s.plus(mm.tuer, ganz(e.tueren));
    s.plus(mm.baustelle);
  });
};

export const rechneMontage = (m: Modell, e: Eingaben): Ergebnis => {
  const mm = m as Extract<Modell, { tuerAusbau: unknown }>;
  const art = String(e.art ?? "tuer");
  const ausbau = ja(e.ausbau);
  if (art === "kueche") {
    const meter = leseZahl(e.meter);
    if (meter === null || meter <= 0)
      return { art: "unvollstaendig", fehlt: "Küchenlänge" };
    if (mm.maxMeter !== null && meter > mm.maxMeter) return { art: "anfrage" };
    return rechne(mm, (s) => {
      s.plus(mm.kueche, meter);
      if (ausbau) s.plus(mm.kuecheAusbau, meter);
    });
  }
  const anzahl = leseZahl(e.anzahl);
  if (anzahl === null || anzahl < 1)
    return { art: "unvollstaendig", fehlt: "Anzahl" };
  if (mm.maxAnzahl !== null && anzahl > mm.maxAnzahl) return { art: "anfrage" };
  const n = Math.ceil(anzahl);
  return rechne(mm, (s) => {
    if (art === "moebel") {
      s.plus(mm.moebel, n);
      if (ausbau) s.plus(mm.moebelAusbau, n);
    } else {
      s.plus(mm.tuer, n);
      if (ausbau) s.plus(mm.tuerAusbau, n);
    }
  });
};

export const rechneBoden = (m: Modell, e: Eingaben): Ergebnis => {
  const mm = m as Extract<Modell, { verlegen: unknown }>;
  const flaeche = leseZahl(e.flaeche);
  if (flaeche === null || flaeche <= 0)
    return { art: "unvollstaendig", fehlt: "Fläche" };
  if (mm.max !== null && flaeche > mm.max) return { art: "anfrage" };
  const leisten = leseZahl(e.leisten) ?? 0;
  if (mm.maxLeisten !== null && leisten > mm.maxLeisten)
    return { art: "anfrage" };
  return rechne(mm, (s) => {
    s.plus(mm.verlegen, flaeche);
    if (ja(e.entfernen)) s.plus(mm.entfernen, flaeche);
    if (leisten > 0) s.plus(mm.leiste, leisten);
  });
};

export const rechner: Record<Leistung, (m: Modell, e: Eingaben) => Ergebnis> = {
  entruempelung: rechneEntruempelung,
  umzug: rechneUmzug,
  trockenbau: rechneTrockenbau,
  montage: rechneMontage,
  boden: rechneBoden,
};

/* ---------------------------------------------------------------- Ausgabe */

export const euro = (n: number) => `${Math.round(n).toLocaleString("de-DE")} €`;

export const ergebnisText = (e: Ergebnis): string => {
  switch (e.art) {
    case "spanne":
      return `ca. ${Math.round(e.von).toLocaleString("de-DE")}–${euro(e.bis)}`;
    case "ab":
      return `ab ${euro(e.ab)}`;
    case "anfrage":
      return "Preis auf Anfrage";
    case "unvollstaendig":
      return `Bitte ${e.fehlt} angeben`;
  }
};

/* ---------------------------------------------------------------- Weitergabe an den Browser */

/* Das Modell wird nicht als lesbares JSON ins HTML geschrieben, sondern
   verschlüsselt-ähnlich umcodiert. Das ist kein Schutz gegen jemanden,
   der gezielt sucht - es sorgt nur dafür, dass keine Preise als Text im
   Quelltext stehen und von Suchmaschinen gelesen werden. */
const SCHLUESSEL = "fixum-objektservice";

export const verpacke = (modell: unknown): string => {
  const text = JSON.stringify(modell);
  let out = "";
  for (let i = 0; i < text.length; i++) {
    out += String.fromCharCode(
      text.charCodeAt(i) ^ SCHLUESSEL.charCodeAt(i % SCHLUESSEL.length),
    );
  }
  const bytes = new TextEncoder().encode(out);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).split("").reverse().join("");
};

export const entpacke = (paket: string): unknown => {
  const bin = atob(paket.split("").reverse().join(""));
  const bytes = Uint8Array.from(bin, (ch) => ch.charCodeAt(0));
  const out = new TextDecoder().decode(bytes);
  let text = "";
  for (let i = 0; i < out.length; i++) {
    text += String.fromCharCode(
      out.charCodeAt(i) ^ SCHLUESSEL.charCodeAt(i % SCHLUESSEL.length),
    );
  }
  return JSON.parse(text);
};
