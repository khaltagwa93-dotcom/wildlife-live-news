import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        wildlife: {
          green: "#2d6a4f",
          earth: "#bc6c25",
          sky: "#0077b6",
          coral: "#e76f51",
          gold: "#e9c46a",
        },
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bar-change": "barChange 0.5s ease-in-out",
      },
      keyframes: {
        barChange: {
          "0%": { transform: "scaleY(1)" },
          "50%": { transform: "scaleY(1.2)" },
          "100%": { transform: "scaleY(1)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
