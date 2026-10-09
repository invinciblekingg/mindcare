/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAFBFD',
        surface: {
          DEFAULT: '#FFFFFF',
          elevated: '#F8FAFC',
          hover: '#F1F5F9',
        },
        border: {
          DEFAULT: '#E2E8F0',
          subtle: 'rgba(226, 232, 240, 0.8)',
          highlight: 'rgba(13, 148, 136, 0.3)',
        },
        foreground: {
          DEFAULT: '#0F172A',
          secondary: '#475569',
          muted: '#94A3B8',
        },
        sage: {
          DEFAULT: '#0D9488',
          hover: '#0F766E',
          dark: '#115E59',
          light: '#2DD4BF',
          tint: 'rgba(13, 148, 136, 0.08)',
          'tint-strong': 'rgba(13, 148, 136, 0.16)',
        },
        // RESERVED for urgent help actions and critical human escalations ONLY
        coral: {
          DEFAULT: '#EF4444',
          hover: '#DC2626',
          dark: '#B91C1C',
          tint: 'rgba(239, 68, 68, 0.08)',
          'tint-strong': 'rgba(239, 68, 68, 0.16)',
        },
        calm: {
          blue: '#2563EB',
          indigo: '#6366F1',
          slate: '#64748B',
          amber: '#D97706',
          purple: '#8B5CF6',
          rose: '#F43F5E',
        },
        puremed: {
          dark: '#11141A',
          charcoal: '#1E232D',
          purple: '#7C3AED',
          peach: '#FF8A65',
          coral: '#FF6B6B',
        },
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '32px',
      },
      boxShadow: {
        soft: '0 2px 10px -2px rgba(15, 23, 42, 0.04), 0 4px 16px -4px rgba(15, 23, 42, 0.03)',
        elevated: '0 10px 30px -10px rgba(15, 23, 42, 0.08), 0 4px 12px -2px rgba(15, 23, 42, 0.03)',
        glow: '0 0 25px -4px rgba(13, 148, 136, 0.25)',
        'coral-glow': '0 0 25px -4px rgba(239, 68, 68, 0.3)',
        'card-hover': '0 14px 34px -8px rgba(15, 23, 42, 0.10)',
        pill: '0 2px 8px rgba(15, 23, 42, 0.06)',
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', '"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      transitionDuration: {
        smooth: '250ms',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.03)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
        'fade-in': 'fadeIn 0.35s ease-out forwards',
      },
    },
  },
  plugins: [],
};
