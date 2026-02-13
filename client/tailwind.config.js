/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2E7D32", // Nature Green
        secondary: "#81C784", // Light Green
        accent: "#F9A825", // Harvest Gold
        background: "#F1F8E9", // Light Pale Green
        text: "#1B5E20", // Dark Green Text
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
