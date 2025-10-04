
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-gray': {
          '50': '#f7f7f8',
          '100': '#ececf0',
          '200': '#d9d9e1',
          '300': '#c0c0cd',
          '400': '#a2a2b6',
          '500': '#8888a1',
          '600': '#6f6f87',
          '700': '#5d5d71',
          '800': '#4f4f5f',
          '900': '#454552',
          '950': '#0e0e11',
        },
      }
    },
  },
  plugins: [],
};
export default config;
