import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        card: "var(--card)",
        border: "var(--border)",
        heading: "var(--heading)",
        body: "var(--body)",
        muted: "var(--muted)",
        tagBg: "var(--tag-bg)",
        tagText: "var(--tag-text)",
        accent: "var(--accent)",
        header: "var(--header)",
      },
    },
  },
  plugins: [],
};
export default config;
