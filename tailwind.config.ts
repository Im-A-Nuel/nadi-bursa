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
        navy: { DEFAULT: '#0B1D3A', light: '#122B52', dark: '#060E1F' },
        gold: { DEFAULT: '#C6A664', light: '#D4BB82', dark: '#A88A4A' },
        teal: { DEFAULT: '#0E8074', light: '#12A898', dark: '#0A5F56' },
        surface: { DEFAULT: '#F8F9FA', dark: '#111827' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config
