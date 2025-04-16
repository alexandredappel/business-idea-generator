/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#624CF5',
          dark: '#4B3AD1',
          light: '#8E74FF',
          gradient: 'linear-gradient(135deg, #8E74FF 0%, #624CF5 100%)',
        },
        secondary: {
          DEFAULT: '#42C9E5',
          dark: '#32B4CC',
          light: '#32D4C0',
          gradient: 'linear-gradient(135deg, #32D4C0 0%, #42C9E5 100%)',
        },
        accent: {
          DEFAULT: '#FF7A50',
          dark: '#F25F32',
          light: '#FFA477',
          gradient: 'linear-gradient(135deg, #FFA477 0%, #FF7A50 100%)',
        },
        background: {
          DEFAULT: '#F7F8FA',
          light: '#FFFFFF',
          dark: '#E5E7EB',
          gradient: 'linear-gradient(135deg, #FFFFFF 0%, #F7F8FA 100%)',
        },
        text: {
          DEFAULT: '#000000',
          light: '#2E3146',
          dark: '#000000',
          muted: '#6B7280',
        },
        dark: {
          100: '#F7F8FA',
          200: '#E5E7EB',
          300: '#D1D5DB',
        },
      },
      fontFamily: {
        sans: ['var(--font-plus-jakarta)', 'sans-serif'],
        mono: ['var(--font-roboto-mono)', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #8E74FF 0%, #624CF5 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #32D4C0 0%, #42C9E5 100%)',
        'gradient-accent': 'linear-gradient(135deg, #FFA477 0%, #FF7A50 100%)',
        'gradient-dark': 'linear-gradient(135deg, #F7F8FA 0%, #E5E7EB 100%)',
        'gradient-mixed': 'linear-gradient(135deg, #624CF5 0%, #42C9E5 50%, #FF7A50 100%)',
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'gradient-y': 'gradient-y 15s ease infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
        'loading-bar': 'loading-bar 1.5s ease-in-out infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        'gradient-y': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'center top'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'center center'
          }
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left top'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right bottom'
          }
        },
        'loading-bar': {
          '0%': {
            transform: 'translateX(-100%)'
          },
          '100%': {
            transform: 'translateX(300%)'
          }
        }
      },
    },
  },
  plugins: [],
} 