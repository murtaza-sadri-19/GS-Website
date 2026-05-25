/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          burgundy: '#0b2545',
          gold: '#bfa15f',
          dark: '#0b2545',
          card: '#ffffff',
          light: '#f7f8fa',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Lora', 'serif'],
      },
      boxShadow: {
        premium: '0 8px 30px rgba(0, 0, 0, 0.04)',
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      },
      backdropBlur: {
        premium: '8px',
      }
    },
  },
  plugins: [],
}
