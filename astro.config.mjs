import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://fixum-objektservice.de",
  output: "static",
  integrations: [tailwind({ applyBaseStyles: false }), sitemap()],
});
