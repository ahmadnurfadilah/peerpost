const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}", 
    "./components/**/*.{js,ts,jsx,tsx,mdx}", 
    "./app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      container: {
        center: true,
      },
      colors: {
        dark: "#222222",
        lime: "#DEECA3",
        primary: {
          50: "#d9f3ff",
          100: "#badce7",
          200: "#9ac2d0",
          300: "#78a8b8",
          400: "#5e93a6",
          500: "#438094",
          600: "#377183",
          700: "#285d6d",
          800: "#1b4a58",
          900: "#073541",
        },
        danger: colors.red,
        success: colors.green,
        warning: colors.amber,
      },
      animation: {
        updown: "updown 3s ease-in-out infinite",
      },
      keyframes: {
        updown: {
          "0%, 100%": { transform: "translateY(-10px)" },
          "50%": { transform: "translateY(10px)" },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
],
};
