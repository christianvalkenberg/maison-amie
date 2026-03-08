import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FAF6EF',
        dark: '#2C2417',
        terracotta: {
          50: '#FDF4F2',
          100: '#FCE8E4',
          200: '#F8D0C8',
          300: '#F2AFA3',
          400: '#E8846F',
          500: '#D9614A',
          600: '#C1694F',
          700: '#A0513C',
          800: '#854430',
          900: '#6E3A29',
        },
        ocher: {
          50: '#FDF9EE',
          100: '#FAF1D3',
          200: '#F4E0A7',
          300: '#EEC97A',
          400: '#E6B24E',
          500: '#D4A853',
          600: '#B88429',
          700: '#976824',
          800: '#7D5422',
          900: '#674620',
        },
        olive: {
          50: '#F3F5EE',
          100: '#E5EAD8',
          200: '#CCD4B5',
          300: '#AEB990',
          400: '#8F9F6A',
          500: '#6B7C47',
          600: '#5A6A3A',
          700: '#495535',
          800: '#3C462C',
          900: '#333B26',
        },
      },
      fontFamily: {
        heading: ['var(--font-playfair)', 'Georgia', 'serif'],
        body: ['var(--font-lato)', 'Helvetica', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};

export default config;
