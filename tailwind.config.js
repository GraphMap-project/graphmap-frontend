/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0A7075',
        secondary: '#6BA3BE',
        red_custom: '#B4182D',
      },
    },
  },
  plugins: [],
  important: '#root',
};
