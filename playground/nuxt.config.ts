

export default defineNuxtConfig({
  devServer: {
    port: 3113,
  },

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

  compatibilityDate: '2024-10-17',
});
