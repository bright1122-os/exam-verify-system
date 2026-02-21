/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        clay: {
          DEFAULT: '#CC7D63',
          dark: '#B0664F',
          light: '#DE9680',
        },
        parchment: {
          DEFAULT: '#F5F2E9',
          dark: '#EAE6DA',
        },
        charcoal: {
          DEFAULT: '#292826',
          light: '#4A4844',
        },
        sage: {
          DEFAULT: '#7A8F7C',
          light: '#A2B8A4',
        },
        rust: {
          DEFAULT: '#B85C4F',
        },
        branding: {
          black: '#292826',
          white: '#FBFAF7',
          gray: '#EAE6DA',
          darkGray: '#8A8780',
          emerald: '#7A8F7C', // Muted Sage for Verified
          crimson: '#B85C4F', // Soft Rust for Denied
          blue: '#6C849C',    // Muted Slate for Pending
        }
      },
      fontFamily: {
        heading: ['Newsreader', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2.5rem',
      },
      boxShadow: {
        'soft': '0 20px 40px -15px rgba(41, 40, 38, 0.05)',
        'float': '0 30px 60px -20px rgba(41, 40, 38, 0.1)',
        // Keeping brutalist keys but overriding them so we don't break existing components immediately, 
        // though we will migrate them.
        'brutal': '0 20px 40px -15px rgba(41, 40, 38, 0.05)',
        'brutal-sm': '0 10px 20px -10px rgba(41, 40, 38, 0.05)',
        'brutal-lg': '0 30px 60px -20px rgba(41, 40, 38, 0.1)',
      },
      transitionTimingFunction: {
        'organic': 'cubic-bezier(0.25, 1, 0.35, 1)',
      }
    },
  },
  plugins: [],
}
