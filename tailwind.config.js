module.exports = {
  content: [
    "./src/public/*.{html,js}",
    "./src/public/**/*.{html,js}",
    './src/views/**/*.{handlebars, html}', 
    './src/views/*.{handlebars, html}'
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwindcss')
  ],
}
