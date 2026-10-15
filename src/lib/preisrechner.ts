/* Rechenlogik des Preisrechners.

   Enthält selbst keine Preise. Alle Werte kommen aus
   src/data/preise.config.json und werden über baueModell() auf das
   Nötigste reduziert (nur Zahlen, keine Hinweise).

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

/** Hinweise, die neben dem Ergebnis stehen - nie mit Beträgen. */
export type Zusatz = "sonderreinigung" | "material";

export type Ergebnis =
  | { art: "spanne"; von: number; bis: number; zusatz?: Zusatz[] }
  | { art: "ab"; ab: number; zusatz?: Zusatz[] }
  | { art: "anfrage" }
  | { art: "unvollstaendig"; fehlt: string };

export type Leistung =
  "entruempelung" | "umzug" | "trockenbau" | "montage" | "boden";

export const alleLeistungen: Leistung[] = [
  "entruempelung",
  "umzug",
  "trockenbau",
  "montage",
  "boden",
];

/* ---------------------------------------------------------------- Modell */

type Roh = { von?: number | null; bis?: number | null; wert?: number | null };

const spanne = (r: Roh | undefined): Wert => {
  if (!r) return null;
  const { von, bis } = r;
  if (typeof von !== "number" || typeof bis !== "number") return null;
  if (!Number.isFinite(von) || !Number.isFinite(bis) || von < 0 || bis < von)
    return null;
  return { von, bis };
};

const zahl = (r: Roh | undefined): number | null =>
  r && typeof r.wert === "number" && Number.isFinite(r.wert) ? r.wert : null;

const tabelle = (o: Record<string, Roh> | undefined, schluessel: string[]) =>
  Object.fromEntries(schluessel.map((k) => [k, spanne(o?.[k])])) as Record<
    string,
    Wert
  >;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Config = any;

const modellEntruempelung = (e: Config, runden: number) => ({
  runden,
  qm: tabelle(e.proQuadratmeterWohnflaeche, ["normal", "stark", "messie"]),
  etageProzent: zahl(e.aufschlagJeEtageOhneAufzugProzent),
  zusatzQm: tabelle(e.kellerUndDachbodenProQuadratmeter, ["wenig", "voll"]),
  kellerStandard: zahl(e.standardKellerflaeche),
  dachbodenStandard: zahl(e.standardDachbodenflaeche),
  leiterProzent: zahl(e.dachbodenNurLeiterAufschlagProzent),
  garage: tabelle(e.garageOderSchuppen, [
    "kleinWenig",
    "kleinVoll",
    "grossWenig",
    "grossVoll",
  ]),
  kuechenzeile: spanne(e.kuechenzeileAbbauen),
  einbauschrank: spanne(e.einbauschrankAbbauenJeStueck),
  reinigung: tabelle(e.reinigungProQuadratmeterWohnflaeche, ["grund", "tief"]),
  eilProzent: spanne(e.eilauftragAufschlagProzent),
  halteverbot: spanne(e.halteverbotszone),
  min: zahl(e.mindestpreis),
  max: zahl(e.maxWohnflaeche),
  maxZusatz: zahl(e.maxZusatzflaeche),
});

const modellUmzug = (u: Config, runden: number) => ({
  runden,
  grund: tabelle(u.grundpreisNahbereich, ["1", "2", "3", "4", "5"]),
  nahKm: zahl(u.nahbereichKm),
  km: spanne(u.proKmUeberNahbereich),
  etageProzent: zahl(u.aufschlagJeEtageOhneAufzugProzent),
  moebelJeZimmer: spanne(u.moebelAbUndAufbauenJeZimmer),
  kueche: spanne(u.kuecheAbUndAufbauen),
  schwer: spanne(u.schweresEinzelstueck),
  entsorgung: spanne(u.altmoebelEntsorgen),
  eilProzent: spanne(u.eilauftragAufschlagProzent),
  halteverbot: spanne(u.halteverbotszoneJeAdresse),
  min: zahl(u.mindestpreis),
  maxKm: zahl(u.maxKm),
});

const ARTEN = [
  "zwischenwand",
  "schallschutzwand",
  "deckeAbhaengen",
  "dachschraege",
  "vorsatzschale",
];

const modellTrockenbau = (t: Config, runden: number) => ({
  runden,
  inkl: tabelle(t.materialInklusiveProQuadratmeter, ARTEN),
  kunde: tabelle(t.materialVomKundenProQuadratmeter, ARTEN),
  oberflaeche: tabelle(t.oberflaecheProQuadratmeter, [
    "ohne",
    "normal",
    "glatt",
  ]),
  daemmung: spanne(t.daemmungProQuadratmeter),
  dampfbremse: spanne(t.dampfbremseProQuadratmeter),
  doppelt: spanne(t.zweiteBeplankungProQuadratmeter),
  tuer: spanne(t.tueroeffnungJeStueck),
  baustelle: spanne(t.baustelleneinrichtung),
  min: zahl(t.mindestpreis),
  max: zahl(t.maxFlaeche),
});

const modellMontage = (m: Config, runden: number) => ({
  runden,
  tuer: spanne(m.innentuerMitZargeJeStueck),
  tuerAusbau: spanne(m.alteTuerAusbauenJeStueck),
  moebel: spanne(m.moebelJeStueck),
  grossschrank: spanne(m.grossschrankJeStueck),
  kueche: spanne(m.kuecheJeMeter),
  kuecheAlt: spanne(m.alteKuecheAbbauen),
  min: zahl(m.mindestpreis),
  maxAnzahl: zahl(m.maxAnzahl),
  maxMeter: zahl(m.maxKuechenmeter),
});

const modellBoden = (b: Config, runden: number) => ({
  runden,
  verlegen: tabelle(b.verlegenProQuadratmeter, ["klick", "teppich"]),
  entfernen: spanne(b.altenBelagEntfernenProQuadratmeter),
  leiste: spanne(b.sockelleisteProMeter),
  trittschall: spanne(b.trittschalldaemmungProQuadratmeter),
  min: zahl(b.mindestpreis),
  max: zahl(b.maxFlaeche),
  maxLeisten: zahl(b.maxLeistenMeter),
});

type Modelle = {
  entruempelung: ReturnType<typeof modellEntruempelung>;
  umzug: ReturnType<typeof modellUmzug>;
  trockenbau: ReturnType<typeof modellTrockenbau>;
  montage: ReturnType<typeof modellMontage>;
  boden: ReturnType<typeof modellBoden>;
};

/** Reduziert die Config auf die Zahlen, die der Rechner einer Leistung braucht. */
export const baueModell = <L extends Leistung>(
  c: Config,
  leistung: L,
): Modelle[L] => {
  const runden = zahl({ wert: c?.allgemein?.rundenAufEuro }) ?? 50;
  const bauer = {
    entruempelung: modellEntruempelung,
    umzug: modellUmzug,
    trockenbau: modellTrockenbau,
    montage: modellMontage,
    boden: modellBoden,
  }[leistung];
  return bauer(c?.[leistung] ?? {}, runden) as Modelle[L];
};

/** Ein Rechner wird nur angezeigt, wenn seine Grundwerte in der Config
    stehen. Sonst würde er bei jeder Eingabe nur "Preis auf Anfrage" zeigen. */
export const rechnerBereit = (c: Config, leistung: Leistung): boolean => {
  switch (leistung) {
    case "entruempelung": {
      const m = baueModell(c, "entruempelung");
      return Object.values(m.qm).every(Boolean) && m.etageProzent !== null;
    }
    case "umzug": {
      const m = baueModell(c, "umzug");
      return Object.values(m.grund).some(Boolean) && m.nahKm !== null;
    }
    case "trockenbau": {
      const m = baueModell(c, "trockenbau");
      return Boolean(
        m.inkl.zwischenwand && m.oberflaeche.normal && m.baustelle,
      );
    }
    case "montage": {
      const m = baueModell(c, "montage");
      return Boolean(m.tuer || m.moebel || m.kueche);
    }
    case "boden": {
      const m = baueModell(c, "boden");
      return Boolean(m.verlegen.klick || m.verlegen.teppich);
    }
  }
};

/* ---------------------------------------------------------------- Eingaben */

/** Liest Zahlen so, wie Menschen sie tippen: "12,5", "12.5", "1.200", "60 m²". */
export const leseZahl = (eingabe: unknown): number | null => {
  if (typeof eingabe === "number")
    return Number.isFinite(eingabe) && eingabe >= 0 ? eingabe : null;
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

const ja = (v: unknown) => v === true || v === "ja" || v === "on" || v === "1";
const ganz = (v: unknown, standard = 0) => {
  const n = leseZahl(v);
  return n === null ? standard : Math.max(0, Math.floor(n));
};

/* ---------------------------------------------------------------- Helfer */

class FehlenderWert extends Error {}
class Unvollstaendig extends Error {
  /* Kein "constructor(public fehlt)": Node führt die Tests ohne
     TypeScript-Compiler aus und kennt diese Kurzschreibweise nicht. */
  fehlt: string;
  constructor(fehlt: string) {
    super(fehlt);
    this.fehlt = fehlt;
  }
}

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
    /** Teilsumme separat ausrechnen, z. B. um nur sie aufzuschlagen. */
    get wert(): Spanne {
      return { von, bis };
    },
    setze(w: Spanne) {
      von = w.von;
      bis = w.bis;
    },
  };
};

/** Prozentaufschlag; als Spanne (Eilauftrag) oder fester Wert (Etage). */
const aufschlag = (w: Spanne, prozent: Spanne): Spanne => ({
  von: w.von * (1 + prozent.von / 100),
  bis: w.bis * (1 + prozent.bis / 100),
});

const plus = (a: Spanne, b: Spanne): Spanne => ({
  von: a.von + b.von,
  bis: a.bis + b.bis,
});

const brauche = <T>(wert: T | null | undefined): T => {
  if (wert === null || wert === undefined) throw new FehlenderWert();
  return wert;
};

const aufrunden = (n: number, schritt: number) =>
  Math.ceil(n / schritt - 1e-9) * schritt;

/** Mindestauftrag und Rundung anwenden. */
export const abschliessen = (
  roh: Spanne,
  runden: number,
  min: number | null,
  zusatz: Zusatz[] = [],
): Ergebnis => {
  const extra = zusatz.length ? { zusatz } : {};
  let { von, bis } = roh;
  if (min !== null && min > 0) {
    if (bis < min) return { art: "ab", ab: min, ...extra };
    von = Math.max(von, min);
  }
  const r = runden > 0 ? runden : 50;
  von = aufrunden(von, r);
  bis = aufrunden(bis, r);
  // Nie ein einzelner Betrag: mindestens eine Rundungsstufe Abstand.
  if (bis <= von) bis = von + r;
  return { art: "spanne", von, bis, ...extra };
};

const rechne = (
  modell: { runden: number; min: number | null },
  fn: () => { roh: Spanne; zusatz?: Zusatz[] },
): Ergebnis => {
  try {
    const { roh, zusatz } = fn();
    return abschliessen(roh, modell.runden, modell.min, zusatz);
  } catch (e) {
    if (e instanceof FehlenderWert) return { art: "anfrage" };
    if (e instanceof Unvollstaendig)
      return { art: "unvollstaendig", fehlt: e.fehlt };
    throw e;
  }
};

class AufAnfrage extends Error {}
const rechneMitGrenzen = (
  modell: { runden: number; min: number | null },
  fn: () => { roh: Spanne; zusatz?: Zusatz[] },
): Ergebnis => {
  try {
    return rechne(modell, fn);
  } catch (e) {
    if (e instanceof AufAnfrage) return { art: "anfrage" };
    throw e;
  }
};

const grenze = (wert: number, max: number | null) => {
  if (max !== null && wert > max) throw new AufAnfrage();
};

type Eingaben = Record<string, unknown>;

/* ---------------------------------------------------------------- Entrümpelung */

export const rechneEntruempelung = (
  m: Modelle["entruempelung"],
  e: Eingaben,
): Ergebnis =>
  rechneMitGrenzen(m, () => {
    const flaeche = leseZahl(e.flaeche);
    if (flaeche === null || flaeche <= 0)
      throw new Unvollstaendig("Wohnfläche");
    grenze(flaeche, m.max);
    const zustand = String(e.zustand ?? "normal");
    const messie = zustand === "messie";

    // Wohnfläche, mit Etagenaufschlag
    const wohnung = summe();
    wohnung.plus(brauche(m.qm[zustand]), flaeche);
    const etagen = Math.min(ganz(e.etage), 3);
    if (etagen > 0) {
      const p = brauche(m.etageProzent) * etagen;
      wohnung.setze(aufschlag(wohnung.wert, { von: p, bis: p }));
    }

    const rest = summe();

    // Keller und Dachboden: eigener Satz, bei Messie der Messie-Satz
    const zusatzSatz = (fuellgrad: unknown) =>
      messie
        ? brauche(m.qm.messie)
        : brauche(m.zusatzQm[fuellgrad === "wenig" ? "wenig" : "voll"]);

    if (ja(e.keller)) {
      const qm = leseZahl(e.kellerFlaeche) || brauche(m.kellerStandard);
      grenze(qm, m.maxZusatz);
      rest.plus(zusatzSatz(e.kellerFuell), qm);
    }
    if (ja(e.dachboden)) {
      const qm = leseZahl(e.dachbodenFlaeche) || brauche(m.dachbodenStandard);
      grenze(qm, m.maxZusatz);
      const boden = summe();
      boden.plus(zusatzSatz(e.dachbodenFuell), qm);
      if (e.dachbodenZugang === "leiter") {
        const p = brauche(m.leiterProzent);
        boden.setze(aufschlag(boden.wert, { von: p, bis: p }));
      }
      rest.plus(boden.wert);
    }
    if (ja(e.garage)) {
      const groesse = e.garageGroesse === "gross" ? "gross" : "klein";
      const fuell = e.garageFuell === "wenig" ? "Wenig" : "Voll";
      rest.plus(brauche(m.garage[`${groesse}${fuell}`]));
    }
    if (ja(e.kueche)) {
      if (ja(e.kuechenzeile)) rest.plus(m.kuechenzeile);
      rest.plus(m.einbauschrank, ganz(e.einbauschraenke));
    }
    const reinigung = String(e.reinigung ?? "keine");
    if (reinigung === "grund" || reinigung === "tief")
      rest.plus(brauche(m.reinigung[reinigung]), flaeche);

    let gesamt = plus(wohnung.wert, rest.wert);
    if (ja(e.eilig)) gesamt = aufschlag(gesamt, brauche(m.eilProzent));
    if (ja(e.halteverbot)) gesamt = plus(gesamt, brauche(m.halteverbot));

    return {
      roh: gesamt,
      zusatz: ja(e.verschmutzung) ? ["sonderreinigung"] : [],
    };
  });

/* ---------------------------------------------------------------- Umzug */

export const rechneUmzug = (m: Modelle["umzug"], e: Eingaben): Ergebnis =>
  rechneMitGrenzen(m, () => {
    const zimmer = String(e.zimmer ?? "");
    if (!zimmer) throw new Unvollstaendig("Zimmeranzahl");
    if (!(zimmer in m.grund)) throw new AufAnfrage();
    const km = leseZahl(e.km);
    if (km === null) throw new Unvollstaendig("Entfernung");
    grenze(km, m.maxKm);

    // Grundpreis mit Etagenaufschlag (Auszug und Einzug getrennt gezählt)
    let grund = brauche(m.grund[zimmer]);
    const etagen =
      (ja(e.aufzugAus) ? 0 : ganz(e.etageAus)) +
      (ja(e.aufzugEin) ? 0 : ganz(e.etageEin));
    if (etagen > 0) {
      const p = brauche(m.etageProzent) * etagen;
      grund = aufschlag(grund, { von: p, bis: p });
    }

    const rest = summe();
    const ueber = Math.max(0, Math.ceil(km - brauche(m.nahKm)));
    rest.plus(m.km, ueber);
    if (ja(e.moebel)) {
      const standard = Math.min(Number(zimmer), 5);
      rest.plus(m.moebelJeZimmer, ganz(e.moebelZimmer, standard) || standard);
    }
    if (ja(e.kueche)) rest.plus(m.kueche);
    rest.plus(m.schwer, ganz(e.schwer));
    if (ja(e.entsorgung)) rest.plus(m.entsorgung);

    let gesamt = plus(grund, rest.wert);
    if (ja(e.eilig)) gesamt = aufschlag(gesamt, brauche(m.eilProzent));
    const zonen = Math.min(ganz(e.halteverbot), 2);
    if (zonen > 0) {
      const h = brauche(m.halteverbot);
      gesamt = plus(gesamt, { von: h.von * zonen, bis: h.bis * zonen });
    }
    return { roh: gesamt };
  });

/* ---------------------------------------------------------------- Trockenbau */

const MIT_TUER = ["zwischenwand", "schallschutzwand"];
const MIT_DOPPELT = ["zwischenwand", "vorsatzschale"];

export const rechneTrockenbau = (
  m: Modelle["trockenbau"],
  e: Eingaben,
): Ergebnis =>
  rechneMitGrenzen(m, () => {
    const flaeche = leseZahl(e.flaeche);
    if (flaeche === null || flaeche <= 0) throw new Unvollstaendig("Fläche");
    grenze(flaeche, m.max);
    const art = String(e.art ?? "zwischenwand");
    // Schallschutzwand gibt es nur mit Material über Fixum.
    const kunde = e.material === "kunde" && art !== "schallschutzwand";
    const s = summe();
    s.plus(brauche((kunde ? m.kunde : m.inkl)[art]), flaeche);
    s.plus(brauche(m.oberflaeche[String(e.oberflaeche ?? "normal")]), flaeche);
    const daemmung = ja(e.daemmung) && art !== "schallschutzwand";
    if (daemmung) s.plus(m.daemmung, flaeche);
    if (daemmung && art === "dachschraege") s.plus(m.dampfbremse, flaeche);
    if (ja(e.doppelt) && MIT_DOPPELT.includes(art)) s.plus(m.doppelt, flaeche);
    if (MIT_TUER.includes(art)) s.plus(m.tuer, ganz(e.tueren));
    s.plus(m.baustelle);
    return { roh: s.wert };
  });

/* ---------------------------------------------------------------- Montage */

export const rechneMontage = (m: Modelle["montage"], e: Eingaben): Ergebnis =>
  rechneMitGrenzen(m, () => {
    const tueren = ja(e.tueren);
    const moebel = ja(e.moebel);
    const kueche = ja(e.kueche);
    if (!tueren && !moebel && !kueche)
      throw new Unvollstaendig("Türen, Möbel oder Küche");
    const s = summe();
    if (tueren) {
      const n = ganz(e.tuerAnzahl, 1) || 1;
      grenze(n, m.maxAnzahl);
      s.plus(m.tuer, n);
      if (ja(e.tuerAusbau)) s.plus(m.tuerAusbau, n);
    }
    if (moebel) {
      const n = ganz(e.moebelAnzahl);
      const gross = ganz(e.grossschraenke);
      grenze(n + gross, m.maxAnzahl);
      if (n + gross === 0) throw new Unvollstaendig("Anzahl der Möbelstücke");
      s.plus(m.moebel, n);
      s.plus(m.grossschrank, gross);
    }
    if (kueche) {
      const meter = leseZahl(e.kuecheMeter);
      if (meter === null || meter <= 0) throw new Unvollstaendig("Küchenlänge");
      grenze(meter, m.maxMeter);
      s.plus(m.kueche, meter);
      if (ja(e.kuecheAlt)) s.plus(m.kuecheAlt);
    }
    return { roh: s.wert };
  });

/* ---------------------------------------------------------------- Boden */

export const rechneBoden = (m: Modelle["boden"], e: Eingaben): Ergebnis =>
  rechneMitGrenzen(m, () => {
    const flaeche = leseZahl(e.flaeche);
    if (flaeche === null || flaeche <= 0) throw new Unvollstaendig("Fläche");
    grenze(flaeche, m.max);
    const leisten = leseZahl(e.leisten) ?? 0;
    grenze(leisten, m.maxLeisten);
    const belag = e.belag === "teppich" ? "teppich" : "klick";
    const s = summe();
    s.plus(brauche(m.verlegen[belag]), flaeche);
    if (ja(e.entfernen)) s.plus(m.entfernen, flaeche);
    if (ja(e.trittschall)) s.plus(m.trittschall, flaeche);
    if (leisten > 0) s.plus(m.leiste, leisten);
    return {
      roh: s.wert,
      zusatz: e.material === "fixum" ? ["material"] : [],
    };
  });

export const rechner: {
  [L in Leistung]: (m: Modelle[L], e: Eingaben) => Ergebnis;
} = {
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

export const zusatzText: Record<Zusatz, string> = {
  sonderreinigung:
    "Bei besonderer Verschmutzung kommt eine Sonderreinigung hinzu - Preis auf Anfrage, ggf. durch einen Fachbetrieb.",
  material: "zzgl. Material nach Auswahl",
};

/* ---------------------------------------------------------------- Weitergabe an den Browser */

/* Das Modell wird nicht als lesbares JSON ins HTML geschrieben, sondern
   umcodiert. Das ist kein Schutz gegen jemanden, der gezielt sucht - es
   sorgt nur dafür, dass keine Preise als Text im Quelltext stehen und von
   Suchmaschinen gelesen werden. */
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
