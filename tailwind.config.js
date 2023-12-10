/* eslint-disable no-dupe-keys */
/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  theme: {
    extend: {
      colors: {
        "nav-links": "#737373",
        "active-links": "#163172",
        "nav-bg": "#121212",
        "skyblue":"#35beff",
        "white":{
          100:'#ececfb',
          200: '#fff',
        },
        "black":{
          400:'#000',
          100: '#121212',
          200: '#262121',
          300:'#0000008f',
          500: '#28231D',
        }
      },
      fontFamily: {
        'dm-sans': ['DM Sans', 'sans-serif'],
        'mont': ['Montserrat', 'sans-serif'] ,
        'orbitron': ['Orbitron', 'sans-serif'] ,
      },
      fontSize: {
        45: '45px',
        36: '36px',
        32: '32px',
        30: '30px',
        26: '26px',
        24: '24px',
        20: '20px',
        18: '18px',
        17: "17px",
        16: '16px',
        15: '15px',
        14: '14px',
        12: '12px',
        10: '10px',
        '9xl': '128px',
        '8xl': '96px',
        '7xl': '72px',
        '6xl': '60px',
        '5xl': '48px',
        '4xl': '36px',
        '3xl': '30px',
        '2xl': '24px',
        'xl': '20px',
        'lg': '18px',
        'md': '16px',
        'sm': '14px',
        'xs': '12px',
      },
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      borderRadius: {
        'none': '0',
        'sm': '.125rem',
        DEFAULT: '.25rem',
        'lg': '1rem',
        'xl': '1.5rem',
        'full': '9999px',
      },
      opacity: {
        '0': '0',
        '20': '0.2',
        '40': '0.4',
        '60': '0.6',
        '80': '0.8',
        '100': '1',
      },
      fontWeight: {
        light: '300',
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        bolder: '800',
        extrabold: '900'
      },
    },
  },
  plugins: [],
};
