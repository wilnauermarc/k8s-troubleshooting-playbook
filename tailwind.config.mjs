/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        deck: {
          bg: '#070b14',
          panel: '#0d1526',
          border: '#1a2744',
          muted: '#8b9bb8',
          text: '#e8eef9',
          cyan: '#2dd4bf',
          amber: '#fbbf24',
          rose: '#fb7185',
          blue: '#60a5fa',
          violet: '#a78bfa',
        },
      },
      fontFamily: {
        display: ['"Sora"', 'system-ui', 'sans-serif'],
        sans: ['"Source Sans 3"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 40px rgba(45, 212, 191, 0.15)',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease-out both',
        'fade-in': 'fadeIn 0.4s ease-out both',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
