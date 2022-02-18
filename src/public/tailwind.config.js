module.exports = {
  content: [
    "../public/*.{html,js}",
    '../public/views/**/*.{hbs, html}', 
    '../public/views/*.{hbs, html}'
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwindcss')
  ],
}
