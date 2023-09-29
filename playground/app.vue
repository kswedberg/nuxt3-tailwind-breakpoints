<template>
  <div
    class="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center"
    :style="randomUnsplashImage"
  >
    <h1 class="text-white font-bold text-5xl">
      nuxt tailwind breakpoints
    </h1>
    <details class="my-2 p-2 bg-white bg-opacity-75 rounded-md">
      <summary class="cursor-pointer">
        Breakpoints from <code>theme.screens</code> in tailwind.config.js:
      </summary>
      <div>
        <div class="text-sm my-2">
          * Note: for this example, the options in nuxt.config are <code>{parseRaw: true}</code>
        </div>
        <pre>{{ twConfig.theme.screens }}</pre>
      </div>
    </details>
  </div>
</template>

<script setup>
import {computed} from 'vue';
import twConfig from './tailwind.config.js';
import {useHead} from '#imports';

const randomUnsplashImage = computed(() => {
  return {
    backgroundImage: 'url(https://source.unsplash.com/random/1600x900)',
  };
});

useHead({
  title: 'Nuxt Tailwind Breakpoints',
});
</script>
