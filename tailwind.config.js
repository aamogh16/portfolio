/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#fbf7ee',
          100: '#f7f0e0',
          200: '#f1e7cf',
          300: '#e9dab7',
        },
        ink: {
          DEFAULT: '#111111',
          soft: '#1f1f1f',
          muted: '#4a4a4a',
          faint: '#7a7a7a',
        },
        terminal: {
          green: '#1f6f3a',
          amber: '#a16207',
          red: '#9a2a2a',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      maxWidth: {
        prose: '68ch',
      },
    },
  },
  plugins: [],
}
