/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        ink: {
          950: "#0A0A0B",
          900: "#0F0F12",
          850: "#131316",
          800: "#16161A",
          750: "#1B1B20",
          700: "#202026",
          600: "#2A2A30",
          500: "#3A3A42",
          400: "#6A6A72",
          300: "#9A9AA0",
          200: "#C6C6CC",
          100: "#E6E6E8",
          50: "#FAFAFA",
        },
        volt: {
          DEFAULT: "#C6FF3D",
          dark: "#9FCC2A",
        },
        ember: {
          DEFAULT: "#FF6B35",
          dark: "#CC5529",
        },
      },
      fontFamily: {
        display: ['"Bebas Neue"', '"Oswald"', "system-ui", "sans-serif"],
        sans: ['"Inter"', '"Manrope"', "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
      },
      boxShadow: {
        volt: "0 0 0 1px rgba(198,255,61,0.25), 0 8px 30px -8px rgba(198,255,61,0.35)",
        card: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 8px 24px -12px rgba(0,0,0,0.6)",
      },
    },
  },
  plugins: [],
};
