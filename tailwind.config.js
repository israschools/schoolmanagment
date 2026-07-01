/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: { 900: "#0D1830", 800: "#11203A", 700: "#172A4A", 600: "#243a60" },
        sand: { 50: "#F7F5F0", 100: "#F1EDE3", 200: "#E6DFCF" },
        emerald: { 600: "#1C8C6B", 700: "#156A52", 100: "#DCEFE7" },
        amber: { 600: "#C99A3B", 100: "#F4E9D2" },
        slate: { 900: "#1F2430", 700: "#3A4150", 500: "#6B7280", 300: "#C7CBD1" },
        rose: { 600: "#C04A4A", 100: "#F6E0DF" },
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(13,24,48,0.04), 0 8px 24px -8px rgba(13,24,48,0.08)",
      },
      borderRadius: { xl2: "1.1rem" },
    },
  },
  plugins: [],
}

