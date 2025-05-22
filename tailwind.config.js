/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
	   "./src/**/*.{html,js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],







// Ajoute une animation personnalisée "fade-in" avec effet de zoom léger.
// Utilisable dans Tailwind via la classe `animate-fade-in`.

extend: {
  animation: {
    'fade-in': 'fadeIn 0.3s ease-out',
  },
  keyframes: {
    fadeIn: {
      '0%': { opacity: 0, transform: 'scale(0.95)' },
      '100%': { opacity: 1, transform: 'scale(1)' },
    },
  },
}



}

