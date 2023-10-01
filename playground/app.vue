<template>
  <div
    class="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center"
    :style="randomBgImage"
  >
    <h1 class="hdg text-white text-center font-bold text-5xl">
      {{ title }}
    </h1>
    <details class="my-2 p-2 bg-white bg-opacity-75 rounded-md">
      <summary class="cursor-pointer">
        Breakpoints from <code>theme.screens</code> in tailwind.config.js:
      </summary>
      <div>
        <div class="text-sm my-2">
          * Note: for this demo, the options in nuxt.config are <code>{parseRaw: true}</code>
        </div>
        <pre>{{ twConfig.theme.screens }}</pre>
      </div>
    </details>
  </div>
</template>

<script setup>
import {ref, computed} from 'vue';
import twConfig from './tailwind.config.js';
import {useHead} from '#imports';

const img = `${Math.floor(Math.random() * 6)}.jpg`;
const randomBgImage = computed(() => {
  return {
    backgroundImage: `url(/img/${img})`,
  };
});
const title = ref('Nuxt3 Tailwind Breakpoints');

useHead({
  title: title,
});
</script>
<style lang="postcss" scoped>
.hdg {
  text-shadow: 1px 1px #000;
}

</style>
