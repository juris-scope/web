/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-navy': '#001F3F',
        'brand-orange': '#FF851B',
      },
      boxShadow: {
        'card': '0 4px 16px rgba(0,0,0,0.06)'
      }
    },
  },
  plugins: [],
}
