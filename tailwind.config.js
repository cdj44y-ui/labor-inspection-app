/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0F172A',
        'primary-hover': '#1E293B',
        secondary: '#4F46E5',
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
