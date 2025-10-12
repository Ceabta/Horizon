// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,css}"],
  theme: {
    extend: {
      colors: {
        popover: "var(--popover)",
        "popover-foreground": "var(--popover-foreground)",
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
