 

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode:'class',
  theme: {
    
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins:  [require('@tailwindcss/typography'), require('tailwindcss-textshadow'),  require('daisyui'),    require('@tailwindcss/line-clamp'), require('tailwindcss-border-gradients')()
],
  daisyui: {
    
    themes: false,
    
  },

}
