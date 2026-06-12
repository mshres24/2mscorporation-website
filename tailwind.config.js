/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#1d4f91',
          'navy-dark': '#143a6b',
          slate: '#4a4a4a',
          gold: '#f5a623',
          'gold-dark': '#d18a12',
        },
        ink: '#081830',
        'ink-light': '#0c2347',
        cream: '#f5f1e6',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}