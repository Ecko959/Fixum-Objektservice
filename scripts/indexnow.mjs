/* Meldet alle URLs aus der Live-Sitemap per IndexNow an Bing, Yandex,
   Seznam, Naver und Co. (https://www.indexnow.org). Google nimmt an
   IndexNow nicht teil - dort reicht die Sitemap in der Search Console.

   Läuft automatisch nach jedem erfolgreichen Produktions-Deploy
   (.github/workflows/indexnow.yml). Lokal: node scripts/indexnow.mjs

   Der Schlüssel ist nicht geheim: Er liegt öffentlich als
   public/<SCHLÜSSEL>.txt auf der Website und beweist nur, dass die Meldung
   vom Inhaber der Domain kommt. Wird er geändert, Datei und Konstante
   gemeinsam ändern. */
const SCHLUESSEL = "37c4abcecbd84ee688ea2c036a7b4622";
const HOST = "www.fixum-objektservice.de";
const BASIS = `https://${HOST}`;

const log = (msg) => console.log(`[indexnow] ${msg}`);

async function holeText(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(15_000) });
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return res.text();
}

const locs = (xml) =>
  [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());

async function main() {
  /* Schlüsseldatei muss live erreichbar sein, sonst lehnt IndexNow ab. */
  const datei = await holeText(`${BASIS}/${SCHLUESSEL}.txt`);
  if (datei.trim() !== SCHLUESSEL)
    throw new Error("Schlüsseldatei passt nicht.");

  const index = await holeText(`${BASIS}/sitemap-index.xml`);
  const teile = locs(index);
  const urls = [];
  for (const teil of teile) urls.push(...locs(await holeText(teil)));
  const liste = [...new Set(urls)].filter((u) => u.startsWith(BASIS));
  if (!liste.length) throw new Error("Keine URLs in der Sitemap gefunden.");

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key: SCHLUESSEL,
      keyLocation: `${BASIS}/${SCHLUESSEL}.txt`,
      urlList: liste,
    }),
    signal: AbortSignal.timeout(15_000),
  });
  /* 200 = angenommen, 202 = angenommen, Schlüssel wird noch geprüft */
  if (res.status !== 200 && res.status !== 202) {
    throw new Error(
      `IndexNow antwortet HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`,
    );
  }
  log(`${liste.length} URLs gemeldet (HTTP ${res.status}).`);
}

main().catch((err) => {
  log(`Fehlgeschlagen: ${err.message}`);
  process.exitCode = 1;
});
