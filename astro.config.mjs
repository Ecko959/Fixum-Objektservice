import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

import react from "@astrojs/react";

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
  /* Hier steht bewusst kein `redirects`. Astro erzeugt daraus bei
     `output: "static"` nur Seiten mit Meta-Refresh, und die wertet Google
     als schwaches Signal statt als Umzug. Die alten /leistung-emden/-Adressen
     leiten deshalb per echter 301 weiter - die Regeln stehen in
     public/_redirects und werden von Cloudflare Pages ausgeführt. */
  integrations: [tailwind({ applyBaseStyles: false }), sitemap({
    /* Die Sitemap ist eine Empfehlung an Google, welche Seiten es
       indexieren soll - nicht das Verzeichnis aller Seiten. Draußen
       bleiben deshalb drei Gruppen:

       1. Seiten ohne Suchwert: Danke-Seite und 404.
       2. Rechtstexte. Sie sollen erreichbar und indexierbar bleiben -
          ein Ausschluss hier ist kein noindex -, aber sie konkurrieren
          um kein Stichwort und verdünnen sonst nur das Signal.
       3. Die alten -emden-Adressen. Die entstehen im Build gar nicht
          mehr, seit die Weiterleitung über public/_redirects läuft; die
          Prüfung bleibt stehen, damit eine versehentlich wieder
          eingeführte Altadresse nicht unbemerkt hineinrutscht. Eine
          Sitemap, die auf Weiterleitungen zeigt, hält die veraltete URL
          künstlich am Leben und erzeugt in der Search Console genau den
          Hinweis "Seite mit Weiterleitung". */
    filter: (page) =>
      !/\/(danke|404)\/?$/.test(page) &&
      !/\/(impressum|datenschutz|agb|widerruf)\/?$/.test(page) &&
      !/-emden\/?$/.test(page),
    changefreq: "monthly",
    lastmod: new Date(),
    serialize(item) {
      const path = new URL(item.url).pathname;

      // Startseite und Leistungsübersicht sind die Einstiegspunkte.
      // Die Rechtstexte stehen hier nicht mehr - sie sind schon durch
      // den filter draußen.
      if (path === "/")
        return { ...item, priority: 1.0, changefreq: "weekly" };
      if (path === "/leistungen/") return { ...item, priority: 0.9 };
      if (/^\/(kontakt|ueber-uns|fuer-)/.test(path)) {
        return { ...item, priority: 0.7 };
      }
      return { ...item, priority: 0.8 };
    },
  }), react()],
});