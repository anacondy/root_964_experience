/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'acid-green': '#d4ff00',
        'deep-black': '#080808',
        'off-black': '#111111',
        'alert-red': '#ff2a2a',
      },
      fontFamily: {
        'poster': ['Archivo Black', 'sans-serif'],
        'jp': ['Noto Sans JP', 'sans-serif'],
        'mono': ['Space Mono', 'monospace'],
      },
      animation: {
        'spin-slow': 'spin 10s linear infinite',
        'pulse-red': 'pulse-red 0.5s infinite',
        'ripple': 'ripple-panic 1.5s cubic-bezier(0, 0.2, 0.8, 1) infinite',
      },
      keyframes: {
        'pulse-red': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'ripple-panic': {
          '0%': { transform: 'scale(1)', opacity: '0.8' },
          '100%': { transform: 'scale(3)', opacity: '0' },
        },
      },
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        // Aspect ratio based breakpoints for mobile
        'tall': { 'raw': '(min-aspect-ratio: 9/16)' },
        'xtall': { 'raw': '(min-aspect-ratio: 9/20)' },
      },
    },
  },
  plugins: [],
}
