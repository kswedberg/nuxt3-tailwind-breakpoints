<template>
  <div
    class="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
    :style="randomUnsplashImage"
  >
    <h1 class="text-white font-bold text-5xl">
      nuxt tailwind breakpoints
    </h1>
  </div>
</template>

<script setup>
import {computed} from 'vue';
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
