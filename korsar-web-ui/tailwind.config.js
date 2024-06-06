import flowbite from "flowbite-react/tailwind";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", flowbite.content()],
  theme: {
    extend: {
      colors: {
        korsar: {
          'azul-noche': '#183859',
          'azul-agua': '#004C6D',
          'turquesa-viento': '#34B0AD',
          'naranja-sol': '#D9514E',
          'arena-luz': '#F9F6E7',
          'negro-90': '#43454B',
          'gris-100': '#F8F8F8',
          'gris-200': '#E7E8E9',
          'gris-300': '#D1D2D4',
        },
      },
    },
  },
  plugins: [flowbite.plugin()],
};
