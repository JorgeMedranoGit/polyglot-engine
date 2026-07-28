/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ctp: {
          base: '#1e1e2e',
          mantle: '#181825',
          crust: '#11111b',
          surface0: '#313244',
          surface1: '#45475a',
          surface2: '#585b70',
          overlay0: '#6c7086',
          text: '#cdd6f4',
          subtext: '#a6adc8',
          mauve: '#cba6f7',
          pink: '#f5c2e7',
          blue: '#89b4fa',
          sapphire: '#74c7ec',
          teal: '#94e2d5',
          green: '#a6e3a1',
          yellow: '#f9e2af',
          peach: '#fab387',
          red: '#f38ba8',
          lavender: '#b4befe'
        }
      },
      fontFamily: {
        mono: ['Fira Code', 'JetBrains Mono', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      animation: {
        'scan-line': 'scan 2.5s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 1.5s ease-in-out infinite alternate',
        'typewriter': 'typing 1.5s steps(30, end)'
      },
      keyframes: {
        scan: {
          '0%': { top: '0%' },
          '50%': { top: '95%' },
          '100%': { top: '0%' }
        },
        pulseGlow: {
          '0%': { boxShadow: '0 0 8px rgba(203, 166, 247, 0.2)' },
          '100%': { boxShadow: '0 0 24px rgba(203, 166, 247, 0.6)' }
        }
      }
    },
  },
  plugins: [],
}
