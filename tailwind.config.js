/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        charcoal: {
          deep: '#181818',
          DEFAULT: '#242424',
          text: '#202020',
        },
        cream: {
          soft: '#F7F7F5',
          light: '#E9E9E7',
        },
        grey: {
          medium: '#A3A3A3',
        },
        champagne: '#B08D57',
        whatsapp: '#25D366',
      },
      fontFamily: {
        heading: ['Sora', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '6px',
        lg: '10px',
      },
      maxWidth: {
        content: '1280px',
      },
    },
  },
  plugins: [],
}
