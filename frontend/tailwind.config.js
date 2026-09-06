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
        kissan: {
          green: {
            DEFAULT: '#2E7D32',
            dark: '#1B5E20',
            light: '#E8F5E9',
            emerald: '#10B981',
            hover: '#256628',
          },
          yellow: {
            DEFAULT: '#F9A825',
            light: '#FFF8E1',
            dark: '#F57F17',
          },
          cream: '#FFFDF5',
          dark: {
            bg: '#0A130C',
            card: '#112217',
            border: '#1C3B28',
            surface: '#162C1E'
          },
          text: {
            dark: '#263238',
            muted: '#607D8B',
            light: '#F8FAFC',
            dim: '#94A3B8'
          }
        }
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif']
      },
      boxShadow: {
        'farm': '0 10px 30px -10px rgba(46, 125, 50, 0.15)',
        'farm-hover': '0 20px 35px -10px rgba(46, 125, 50, 0.25)',
        'glow-green': '0 0 25px rgba(46, 125, 50, 0.35)',
        'glow-yellow': '0 0 20px rgba(249, 168, 37, 0.35)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-subtle': 'pulseSubtle 3s infinite ease-in-out',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(15px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.92', transform: 'scale(1.02)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
