/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#183735',
        teal: '#123F3D',
        gold: '#DEA667',
        cream: '#F7F5EF',
        mist: '#DCEBE7',
        sand: '#F5E5CF',
        muted: '#5E6F6C',
        line: '#E4E7E3',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['DM Sans', 'ui-sans-serif', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 18px 50px rgba(18, 63, 61, 0.08)',
      },
    },
  },
  plugins: [],
}
