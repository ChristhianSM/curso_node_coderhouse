module.exports = {
  content: [
    "./src/public/*.{html,js,pug,ejs}",
    "./src/public/**/*.{html,js, pug,ejs}",
    './src/views/**/*.{handlebars, html, pug,ejs}', 
    './src/views/*.{handlebars, html, pug,ejs}'
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwindcss')
  ],
}
