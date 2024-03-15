import {createApp} from 'vue';
import TailwindBreakpoints from './components/TailwindBreakpoints.vue';
import {defineNuxtPlugin, useRuntimeConfig} from '#app';


export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const twb = createApp({extends: TailwindBreakpoints}, {
    ...config.public.tailwindBreakpoints,
  });

  if (typeof document !== 'undefined' && document.createElement) {
    const mountElement = document.createElement('div');

    mountElement.id = 'tailwind-breakpoints';
    mountElement.setAttribute('data-v-inspector-ignore', 'true');

    document.body.appendChild(mountElement);
    twb.mount(mountElement);
  }
});
