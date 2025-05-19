/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter"],
        mona: ["Mona Sans"],
        nacelle: ["Nacelle"],
        arabic: ["Cairo"],
      },
      boxShadow: {
        "custom-soft":
          "0 0 1px rgba(0,0,0,0.2), 0 0 4px rgba(0,0,0,0.02), 0 12px 36px rgba(0,0,0,0.06)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: "hsl(var(--primary))",
        muted: "hsl(var(--muted))",
        accent: "hsl(var(--accent))",
      },
      screens: {
        xs: "475px",
      },
    },
  },
  plugins: [],
  safelist: [
    "translate-z-0",
    "backface-visible",
    "perspective-1000",
    "overflow-anchor-none",
    "scroll-stabilize",
  ],
};
