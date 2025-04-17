/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#00756d",
        background: {
          DEFAULT: "#f8fafc", // slate-50
          dark: "#0f172a", // slate-900
        },
        muted: {
          DEFAULT: "#e2e8f0", // slate-200
          dark: "#1e293b", // slate-800
        },
        "muted-foreground": {
          DEFAULT: "#475569", // slate-600
          dark: "#94a3b8", // slate-400
        },
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.7s ease-in-out both',
      },
    },
  },
  plugins: [],
};
