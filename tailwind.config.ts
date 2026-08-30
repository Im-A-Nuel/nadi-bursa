import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#020617', light: '#0F172A', card: '#0E1223', muted: '#1A1E2F' },
        navy: { DEFAULT: '#0B1D3A', light: '#122B52', dark: '#060E1F' },
        cyan: { DEFAULT: '#06B6D4', light: '#22D3EE', dark: '#0891B2' },
        gold: { DEFAULT: '#C6A664', light: '#D4BB82', dark: '#A88A4A' },
        teal: { DEFAULT: '#0E8074', light: '#12A898', dark: '#0A5F56' },
        line: { pink: '#EC4899', cyan: '#06B6D4', teal: '#14B8A6' },
        surface: { DEFAULT: '#F8F9FA', dark: '#0E1223' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06)',
        glow: '0 0 24px rgba(6,182,212,0.12)',
      },
    },
  },
  plugins: [],
}
export default config
