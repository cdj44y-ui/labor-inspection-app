/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0a0a0a',
        'ink-muted': '#171717',
        paper: '#f5f5f5',
        'paper-white': '#fafafa',
        primary: '#0a0a0a',
        'primary-hover': '#262626',
        accent: '#dc2626',
        'accent-hover': '#b91c1c',
        secondary: '#4F46E5',
        safe: '#16a34a',
        caution: '#ca8a04',
        warning: '#ea580c',
        danger: '#dc2626',
      },
      fontFamily: {
        sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['2.5rem', { lineHeight: '1.15', letterSpacing: '-0.03em' }],
        'display-md': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.035em' }],
        'display-lg': ['3.75rem', { lineHeight: '1.05', letterSpacing: '-0.04em' }],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        'edge': '0 4px 14px 0 rgb(0 0 0 / 0.12)',
      },
    },
  },
  plugins: [],
}
