import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

export default defineConfig({
  /* Muss identisch zu `domain` in src/data/site.ts sein - hieraus baut die
     Sitemap ihre URLs, daraus baut Base.astro die Canonicals. */
  site: "https://www.fixum-objektservice.de",
  output: "static",
  /* Canonical, Sitemap und interne Links enden alle auf einen Slash. Ohne
     diese Zeile liefert der Hoster je nach Konfiguration auch die Fassung
     ohne Slash aus - dann zeigt das Canonical auf eine Weiterleitung. */
  trailingSlash: "always",
  /* Verzeichnis-URLs mit abschließendem Slash - identisch zu Canonical und Sitemap. */
  build: { format: "directory", inlineStylesheets: "auto" },
  compressHTML: true,
  /* Die Leistungsseiten hießen bis zum Umbau /leistung-emden/. Der Ort steht
     jetzt auf den eigenen Stadtseiten, die Leistung selbst ist ortsneutral.
     Astro legt hierfür bei `output: "static"` Weiterleitungsseiten per
     Meta-Refresh an - das fängt alte Links und Lesezeichen ab.

     Eine echte 301 am Server ist trotzdem besser, weil Google Meta-Refresh
     nur als schwaches Signal wertet. Die Regeln dafür stehen in CONTENT.md
     und müssen einmal beim Hoster eingetragen werden. */
  redirects: Object.fromEntries(
    [
      "entruempelung",
      "entkernung",
      "trockenbau",
      "bodenverlegung",
      "umzug",
      "haushaltsaufloesung",
      "wohnungsraeumung",
      "kernsanierung",
      "renovierung",
      "hausmeisterservice",
      "kuechenmontage",
      "winterdienst",
      "rueckbau-trockenbau",
    ].map((slug) => [`/${slug}-emden/`, `/${slug}/`]),
  ),
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap({
      /* Seiten ohne Suchwert gehören nicht in die Sitemap - und die alten
         -emden-Adressen erst recht nicht: Eine Sitemap, die auf
         Weiterleitungen zeigt, hält die veraltete URL künstlich am Leben. */
      filter: (page) => !/\/(danke|404)\/?$/.test(page) && !/-emden\/?$/.test(page),
      changefreq: "monthly",
      lastmod: new Date(),
      serialize(item) {
        const path = new URL(item.url).pathname;

        // Startseite und Leistungsübersicht sind die Einstiegspunkte,
        // Rechtstexte tragen am wenigsten zur Suche bei.
        if (path === "/")
          return { ...item, priority: 1.0, changefreq: "weekly" };
        if (path === "/leistungen/") return { ...item, priority: 0.9 };
        if (/^\/(impressum|datenschutz|agb|widerruf)\//.test(path)) {
          return { ...item, priority: 0.3, changefreq: "yearly" };
        }
        if (/^\/(kontakt|ueber-uns|fuer-)/.test(path)) {
          return { ...item, priority: 0.7 };
        }
        return { ...item, priority: 0.8 };
      },
    }),
  ],
});
