import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/content/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#18181b",
        paper: "#f6f6f3",
        moss: "#2f5d50",
        flame: "#b7634a",
        plum: "#635872",
        citron: "#b8aa58",
      },
      boxShadow: {
        soft: "0 18px 44px rgba(24, 24, 27, 0.08)",
      },
    },
  },
  plugins: [typography],
};

export default config;
