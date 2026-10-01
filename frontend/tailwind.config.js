/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: "#0a0b0a",
          900: "#101210",
          800: "#171917",
          700: "#22251f",
          600: "#2e322a",
        },
        lime: {
          400: "#a4f24c",
          500: "#8fe62e",
          600: "#79cc1f",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 24px rgba(164, 242, 76, 0.25)",
      },
      keyframes: {
        blink: {
          "0%, 80%, 100%": { opacity: "0.2" },
          "40%": { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        blink: "blink 1.4s infinite ease-in-out both",
        "slide-up": "slide-up 0.25s ease-out",
      },
    },
  },
  plugins: [],
};
