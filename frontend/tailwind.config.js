/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.indigo,
        gray: colors.slate,
        success: colors.emerald,
        warning: colors.amber,
        danger: colors.rose,
        info: colors.sky,
      }
    },
  },
  plugins: [],
}
