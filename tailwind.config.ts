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
        ink: '#05070D',
        panel: { DEFAULT: '#0A0E18', 2: '#0E1322' },
        rule: { DEFAULT: '#1B2233', 2: '#2A3348' },
        mint: '#00D68F',
        coral: '#FF4D5E',
        gold: { DEFAULT: '#E7B44A', dim: 'rgba(231,180,74,0.35)' },
        live: '#22D3EE',
      },
      fontFamily: {
        display: ['var(--font-archivo)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-plex)', '"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono: ['var(--font-plex-mono)', '"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config
