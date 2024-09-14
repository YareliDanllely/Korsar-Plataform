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
          'verde-brillante': '#53AF0C',
          'amarillo-dorado': '#F9F6E7',
          'naraja-brillante': '#F9F6E7',
          'fondo-1': '#FAFAFA',
          'negro-90': '#43454B',
          'text-1': '#7B7B7D',
          'text-2': '#8A8B8F',
          'gris-100': '#F5F5F5',
          'gris-200': '#F2F2F3',
          'gris-300': '#E7E8E9',
          'gris-400':'#D1D2D4',

        },
      },
    },
  },
  plugins: [flowbite.plugin()],
};
