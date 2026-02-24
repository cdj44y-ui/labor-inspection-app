/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E3A5F',
        'primary-hover': '#2D4A6F',
        secondary: '#4A90D9',
        safe: '#22C55E',
        caution: '#EAB308',
        warning: '#F97316',
        danger: '#EF4444',
      },
      fontFamily: {
        sans: ['Pretendard', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
