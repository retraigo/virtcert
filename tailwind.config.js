module.exports = {
    theme: {
      extend: {
        fontFamily: {
          open: ['Open Sans', 'sans-serif'],
          montserrat: ['Montserrat', 'sans-serif'],
          cursive: ['Brush Script MT', 'cursive'],
          hand: ['Bradley Hand', 'cursive']
        },
      },
    },
    variants: {
      extend: {},
    },
    plugins: [],
    purge: {
      content: [
        `./components/**/*.{vue,js,ts}`,
        `./layouts/**/*.vue`,
        `./pages/**/*.vue`,
        `./plugins/**/*.{js,ts}`,
        `./nuxt.config.js`,
        `./nuxt.config.ts`,
      ],
    },
  }
  