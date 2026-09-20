/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        page: '#0a0a0a', panel: '#141414', selected: '#1f1f1f', border: '#262626',
        title: '#fafafa', body: '#d4d4d4', muted: '#a3a3a3', disabled: '#737373',
        correct: '#22c55e', incorrect: '#ef4444',
        'importance-high': '#f59e0b', 'importance-medium': '#a16207',
        'diagram-managed': '#60a5fa', // AWS 관리 영역 (리전 안, VPC 밖)
        'diagram-resource': '#2dd4bf', // 서브넷 안에 놓인 내 자원
      },
    },
  },
  plugins: [],
}
