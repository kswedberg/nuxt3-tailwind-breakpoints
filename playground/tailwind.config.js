/*
 ** TailwindCSS Configuration File
 **
 ** Docs: https://tailwindcss.com/docs/configuration
 ** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
 */
export default {
  theme: {
    screens: {
      xs: '320px',
      sm: '640px',
      md: '768px',
      lg: {
        raw: 'print, (min-width: 1024px)',
      },
      xl: '1280px',
      'full-hd': '1920px',
      '2k': '2048px',
      '4k': '3840px',
    },
  },
  // plugins: [],
  content: ['**/*.vue'],
};
