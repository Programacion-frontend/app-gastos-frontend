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
        // Paleta de la app: azul profesional como primario y grises "slate".
        // Las clases violet-*/gray-* existentes pasan a renderizar esta paleta,
        // así no hay que tocar cada componente.
        violet: colors.blue,
        gray: colors.slate,
        // Superficies del modo claro (el modo oscuro sigue usando dark:bg-gray-*).
        surface: {
          DEFAULT: '#F5F7FA', // fondo principal
          sidebar: '#EAEFF5',
          card:    '#F8FAFC',
        },
      },
    },
  },
  plugins: [],
}
