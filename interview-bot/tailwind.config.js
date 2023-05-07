// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'media', // 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'ui-sans-serif', 'system-ui'],
      },
      backgroundColor: {
        dark: '#1f1f1f',
        accent: '#007bff',
      },
      borderColor: {
        dark: '#444',
      },
      backgroundImage: {
        'gradient': 'linear-gradient(135deg, #0b132b 0%, #3a506b 100%)',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
