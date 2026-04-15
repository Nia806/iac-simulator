module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'iac-dark': {
          50: '#f8f9fa',
          100: '#e2e8f0',
          200: '#cbd5e0',
          300: '#a0aec0',
          400: '#718096',
          500: '#4a5568',
          600: '#2d3748',
          700: '#1a202c',
          800: '#111318',
          900: '#0a0c10'
        }
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'monospace'],
        'sans': ['Space Grotesk', 'sans-serif']
      }
    }
  },
  plugins: []
}
