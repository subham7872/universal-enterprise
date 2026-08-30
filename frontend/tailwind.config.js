/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './lib/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#003366',
          dark: '#001f3f',
          gold: '#f2cc4d',
          accent: '#0A84FF',
        }
      }
    },
  },
  plugins: [],
};
