/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',   // Bleu clair (teinte principale)
        secondary: '#E0F2FE', // Bleu très pâle
        accent: '#2563EB',    // Bleu un peu plus foncé pour les boutons
        background: '#FFFFFF', // Fond blanc
        text: '#1E293B',       // Gris très foncé (lisible sur fond blanc)
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 10px rgba(0, 0, 0, 0.05)',
        card: '0 8px 24px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
}