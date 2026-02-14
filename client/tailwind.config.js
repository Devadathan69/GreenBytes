/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        'primary-light': "var(--color-primary-light)",
        'primary-dark': "var(--color-primary-dark)",
        secondary: "#795548",
        accent: "var(--color-accent)",
        background: "var(--color-background)",
        text: "#212121",
        'text-light': "#757575",
        surface: "#FFFFFF",
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'Noto Sans', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
      }
    },
  },
  plugins: [],
}
