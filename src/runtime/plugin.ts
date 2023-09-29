import {createApp} from 'vue';
import TailwindBreakpoints from './components/TailwindBreakpoints.vue';
import {defineNuxtPlugin, useRuntimeConfig} from '#app';


export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  console.log('Plugin injected by nuxt-tailwind-breakpoints!');
  console.log('from plugin.ts: config.public', config.public.tailwindBreakpoints);

  const twb = createApp({extends: TailwindBreakpoints}, {
    ...config.public.tailwindBreakpoints,
  });

  if (typeof document !== 'undefined' && document.createElement) {
    const mountElement = document.createElement('div');

    console.log('made it!!', twb);
    document.body.appendChild(mountElement);
    twb.mount(mountElement);
  } else {
    console.log('No Document!');
  }


  // twb.mount('#twb');

});
