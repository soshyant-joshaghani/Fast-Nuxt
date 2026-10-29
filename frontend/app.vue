<template>
  <div>
    <NuxtPwaManifest />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Fast-Nuxt',
  htmlAttrs: { lang: 'en', class: 'dark' },
});
</script>
