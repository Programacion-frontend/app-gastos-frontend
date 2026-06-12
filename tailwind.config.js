import colors from 'tailwindcss/colors'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        violet: colors.blue,
        gray: colors.slate,
        surface: {
          DEFAULT: '#F5F7FA',
          sidebar: '#EAEFF5',
          card:    '#F8FAFC',
        },
      },
    },
  },
  plugins: [],
}
