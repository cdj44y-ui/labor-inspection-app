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
        paper: '#e8e8e8',
        'paper-white': '#fafafa',
        primary: '#0a0a0a',
        'primary-hover': '#262626',
        /* 브랜드 v1.1: 사이트 색 노동 블루 #1B2A44 (키 이름 toss는 호환 유지), 상담 네이비 #1F4E79 */
        consult: '#1F4E79',
        'consult-hover': '#173B5C',
        toss: '#1B2A44',
        'toss-hover': '#131F33',
        navy: '#1e3a8a',
        'navy-muted': '#2d4a9e',
        accent: '#1B2A44',
        'accent-hover': '#131F33',
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
        /* 현대카드식 히어로 — 큰 제목·가독성 */
        'display-xl': ['2.75rem', { lineHeight: '1.08', letterSpacing: '-0.038em' }],
        'display-2xl': ['3.25rem', { lineHeight: '1.06', letterSpacing: '-0.04em' }],
        'display-3xl': ['3.5rem', { lineHeight: '1.04', letterSpacing: '-0.042em' }],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        'edge': '0 4px 14px 0 rgb(0 0 0 / 0.12)',
      },
    },
  },
  plugins: [],
}
