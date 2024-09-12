/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#d92500',
        primary_dark: '#a6260c',
        secondary: '#ff8e39',
        secondary_dark: '#ad5f24',
      },
    },
  },
  plugins: [],
}
