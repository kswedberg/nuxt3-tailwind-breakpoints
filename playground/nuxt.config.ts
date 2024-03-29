export default defineNuxtConfig({
  modules: ['../src/module'],
  css: ['@/assets/css/main.css'],
  tailwindBreakpoints: {
    // colorScheme: 'dark',
    // enabled: false,
    parseRaw: true,
  },
  devtools: {enabled: true},
  postcss: {
    plugins: {
      'tailwindcss/nesting': {},
      tailwindcss: {},
    },
  },
});
