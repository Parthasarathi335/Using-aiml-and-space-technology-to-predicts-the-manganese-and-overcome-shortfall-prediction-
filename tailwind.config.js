/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          bg: '#F4F1EA',
          primary: '#24352B',
          secondary: '#536B58',
          accent: '#B56B32',
          surface: '#FFFFFF',
          text: '#20241F',
          muted: '#687066',
          border: '#D9D5CA',
          map: '#D7D0BF',
        },
        gis: {
          bg: '#F4F1EA',
          card: '#FFFFFF',
          border: '#D9D5CA',
          accent: '#B56B32',
        }
      }
    },
  },
  plugins: [],
}
