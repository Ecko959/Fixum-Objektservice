/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,ts}"],
  theme: {
    extend: {
      colors: {
        blue: "#1668C4",
        "blue-bright": "#1F7AE0",
        "blue-light": "#4FA0F5",
        navy: "#132A5C",
        "navy-deep": "#0A1730",
        "navy-mid": "#0E2148",
        mist: "#EAF2FC",
        line: "#DCE5F2",
        ink: "#101B31",
        muted: "#5C6A85",
        amber: "#FFB020",
      },
      fontFamily: {
        display: ["Manrope", "sans-serif"],
        body: ["Manrope", "sans-serif"],
        utility: ["Barlow Condensed", "sans-serif"],
        script: ["Kaushan Script", "cursive"],
      },
    },
  },
};
