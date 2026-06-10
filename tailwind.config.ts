import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-green': {
          DEFAULT: '#1B5E20',
          light: '#2E7D32',
          dark: '#003300',
        },
        'brand-gold': {
          DEFAULT: '#F9A825',
          light: '#FFCA28',
          dark: '#E65100',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Playfair Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
export default config
