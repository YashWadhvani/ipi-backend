<template>
  <div class="flex flex-wrap gap-3 my-6">
    <NuxtLink
      v-for="(c, i) in items"
      :key="i"
      :to="c.link || '#'"
      class="px-4 py-2 rounded-lg border hover:bg-black hover:text-white transition"
    >
      {{ c.label }}
    </NuxtLink>
  </div>
</template>

<script setup>
    const props = defineProps({
    items: { type: Array, default: () => [] } // [{label, link}]
    })
</script>
