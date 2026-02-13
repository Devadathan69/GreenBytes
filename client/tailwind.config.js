/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#388E3C", // Deep Forest Green (Trust, Growth)
        secondary: "#795548", // Earth Brown (Soil, Foundation)
        accent: "#FBC02D", // Harvest Yellow (Yield, Optimism)
        background: "#F5F5F0", // Off-white / Beige (Clean, Paper-like)
        text: "#212121", // Almost Black (High Contrast for readability)
        'text-light': "#757575", // Grey for secondary text
        surface: "#FFFFFF", // White cards
      },
      fontFamily: {
        sans: ['Roboto', 'Noto Sans', 'sans-serif'], // Standard, clean fonts
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)', // Simple Material-like shadow
      }
    },
  },
  plugins: [],
}
