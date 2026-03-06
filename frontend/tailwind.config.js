/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        // Design token palette
        bg: {
          base: '#080c14',
          surface: '#0d1424',
          card: '#111827',
          elevated: '#1a2235',
          hover: '#1e2a42',
        },
        border: {
          DEFAULT: '#1e2d45',
          subtle: '#162033',
          focus: '#3b82f6',
        },
        accent: {
          blue: '#3b82f6',
          'blue-light': '#60a5fa',
          'blue-dim': '#1d3a6b',
          purple: '#8b5cf6',
          'purple-light': '#a78bfa',
          cyan: '#06b6d4',
          green: '#10b981',
          'green-light': '#34d399',
          red: '#ef4444',
          'red-light': '#f87171',
          amber: '#f59e0b',
        },
        text: {
          primary: '#f1f5f9',
          secondary: '#94a3b8',
          muted: '#475569',
          inverse: '#0f172a',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-sidebar': 'linear-gradient(180deg, #0a1020 0%, #080c14 100%)',
        'gradient-card': 'linear-gradient(135deg, #111827 0%, #0d1424 100%)',
        'gradient-blue': 'linear-gradient(135deg, #1d4ed8 0%, #7c3aed 100%)',
        'gradient-green': 'linear-gradient(135deg, #059669 0%, #0891b2 100%)',
        'gradient-red': 'linear-gradient(135deg, #dc2626 0%, #c2410c 100%)',
        'gradient-amber': 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.15)',
        'glow-green': '0 0 20px rgba(16, 185, 129, 0.15)',
        'card': '0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.5), 0 2px 6px rgba(0,0,0,0.3)',
        'modal': '0 25px 50px rgba(0,0,0,0.7)',
        'sidebar': '1px 0 0 #1e2d45',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-in': 'slideIn 0.25s ease-out',
        'slide-up': 'slideUp 0.25s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
