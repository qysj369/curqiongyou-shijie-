/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'media',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /** 品牌文档：浅蓝 / 米白感 / 浅绿点缀 — 与 sky / stone / emerald 配合使用 */
        brand: {
          skySoft: '#e8f4fc',
          cream: '#faf9f6',
          mint: '#ecfdf5',
        },
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        accent: {
          orange: '#f97316',
          amber: '#f59e0b',
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          '"Noto Sans SC"',
          '"SF Pro Text"',
          '"Segoe UI"',
          'system-ui',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [
    function ({ addVariant }) {
      addVariant('motion-safe', '@media (prefers-reduced-motion: no-preference)')
    },
  ],
}
