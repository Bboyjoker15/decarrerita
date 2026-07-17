/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        crossroads: {
          bg: '#E0E5EC',
          peach: '#F3A85B',
          orange: '#EA8559',
          coral: '#E36852',
          red: '#DE4B43',
          text: '#4A5568',
          'text-secondary': '#718096',
        },
      },
      boxShadow: {
        'neu': '6px 6px 14px #c8ccd6, -6px -6px 14px #d8dce6',
        'neu-sm': '3px 3px 8px #c8ccd6, -3px -3px 8px #d8dce6',
        'neu-lg': '10px 10px 20px #c8ccd6, -10px -10px 20px #d8dce6',
        'neu-xl': '14px 14px 28px #c8ccd6, -14px -14px 28px #d8dce6',
        'neu-inset': 'inset 4px 4px 10px #c8ccd6, inset -4px -4px 10px #d8dce6',
        'neu-inset-sm': 'inset 2px 2px 6px #c8ccd6, inset -2px -2px 6px #d8dce6',
        'neu-inset-lg': 'inset 6px 6px 14px #c8ccd6, inset -6px -6px 14px #d8dce6',
        'neu-extruded': '6px 6px 16px #B8BCC2, -6px -6px 16px #CFD4DC',
        'neu-pressed': 'inset 4px 4px 8px #B8BCC2, inset -4px -4px 8px #CFD4DC',
        'neu-pressed-lg': 'inset 6px 6px 14px #B8BCC2, inset -6px -6px 14px #CFD4DC',
        'card': '0 2px 12px rgba(74, 85, 104, 0.07), 0 1px 3px rgba(74, 85, 104, 0.04)',
        'card-hover': '0 4px 20px rgba(74, 85, 104, 0.10), 0 2px 6px rgba(74, 85, 104, 0.06)',
        'modal': '0 20px 60px rgba(74, 85, 104, 0.15)',
      },
    },
  },
  plugins: [
    require('lightswind/plugin'),],
};
