import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

export default defineConfig({
  /* Muss identisch zu `domain` in src/data/site.ts sein - hieraus baut die
     Sitemap ihre URLs, daraus baut Base.astro die Canonicals. */
  site: "https://www.fixum-objektservice.de",
  output: "static",
  /* Verzeichnis-URLs mit abschließendem Slash - identisch zu Canonical und Sitemap. */
  build: { format: "directory", inlineStylesheets: "auto" },
  compressHTML: true,
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap({
      // Seiten ohne Suchwert gehören nicht in die Sitemap.
      filter: (page) => !/\/(danke|404)\/?$/.test(page),
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
