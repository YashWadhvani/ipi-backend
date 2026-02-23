<!-- components/sb/Hero.vue -->
<script setup lang="ts">
defineProps<{ blok: { headline: string; subheadline?: string; image?: any } }>()
</script>

<template>
  <section class="py-10">
    <h1 class="text-4xl font-bold">{{ blok.headline }}</h1>
    <p v-if="blok.subheadline" class="text-gray-500 mt-2">{{ blok.subheadline }}</p>
    <img v-if="blok.image?.filename" :src="blok.image.filename" class="mt-6 rounded-xl" />
  </section>
</template>
