/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Primary Brand Colors
        brand: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
        },
        // Party Colors
        bjp: '#FF9933',
        inc: '#00BFFF',
        aap: '#0066CC',
        dmk: '#FF0000',
        tmc: '#20C997',
        jds: '#006400',
        sp: '#E53935',
        bsp: '#0000FF',
        ncp: '#004080',
        ss: '#FF6600',
        tdp: '#FFEB3B',
        ysrcp: '#1E90FF',
        jdu: '#008000',
        rjd: '#2E7D32',
        bjd: '#228B22',
        // Semantic Colors
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        info: '#3B82F6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
