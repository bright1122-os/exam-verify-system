/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        anthracite: '#141413',
        parchment: {
          DEFAULT: '#f9f8f3', // Refined Claude eggshell
          dark: '#f0efe6',
        },
        stone: '#6e6e66', // Darker stone for better contrast/Claude feel
        sand: '#e8e6dc',
        terracotta: {
          DEFAULT: '#d97757',
          50: 'rgba(217, 119, 87, 0.08)',
          100: 'rgba(217, 119, 87, 0.12)',
          200: 'rgba(217, 119, 87, 0.2)',
          light: '#e09578',
          dark: '#c4623f',
        },
        sky: {
          DEFAULT: '#6a9bcc',
          50: 'rgba(106, 155, 204, 0.08)',
          100: 'rgba(106, 155, 204, 0.12)',
          200: 'rgba(106, 155, 204, 0.2)',
        },
        sage: {
          DEFAULT: '#788c5d',
          50: 'rgba(120, 140, 93, 0.08)',
          100: 'rgba(120, 140, 93, 0.12)',
          200: 'rgba(120, 140, 93, 0.2)',
        },
        error: {
          DEFAULT: '#c45c4a',
          50: 'rgba(196, 92, 74, 0.08)',
          100: 'rgba(196, 92, 74, 0.12)',
          200: 'rgba(196, 92, 74, 0.2)',
        },
        warning: {
          DEFAULT: '#d4a03c',
          50: 'rgba(212, 160, 60, 0.08)',
          100: 'rgba(212, 160, 60, 0.12)',
          200: 'rgba(212, 160, 60, 0.2)',
        },
      },
      fontFamily: {
        heading: ['Lora', 'Georgia', 'serif'], // Claude headings are serif
        body: ['Inter', 'system-ui', 'sans-serif'], // Claude body is clean sans
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '16px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(20, 20, 19, 0.06)',
        md: '0 4px 12px rgba(20, 20, 19, 0.08)',
        lg: '0 12px 32px rgba(20, 20, 19, 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.2s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'bounce-soft': 'bounceSoft 1s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'shimmer': 'shimmer 1.5s ease-in-out infinite',
        'pulse-ring': 'pulseRing 2s ease-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
