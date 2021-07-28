const { guessProductionMode } = require("@ngneat/tailwind");

process.env.TAILWIND_MODE = guessProductionMode() ? 'build' : 'watch';

module.exports = {
    prefix: '',
    mode: 'jit',
    purge: {
      content: [
        './src/**/*.{html,ts,css,scss,sass,less,styl}',
      ]
    },
    darkMode: false, // or 'media' or 'class'
    theme: {
      extend: {
        colors:{
          blue: '#264653',
          green: '#2a9d8f',
          primary: '#e9c46a',
          secondary: '#f4a261',
          tertiary: '#e76f51',
        }
      },
    },
    variants: {
      extend: {},
    },
    plugins: [],
};
