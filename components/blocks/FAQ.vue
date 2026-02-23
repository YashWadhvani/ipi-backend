<script setup>
const props = defineProps({
  items: { type: Array, default: () => [] } // [{q, a}]
})
</script>

<template>
  <div class="divide-y border rounded-lg">
    <details v-for="(it, i) in items" :key="i" class="p-4">
      <summary class="cursor-pointer font-medium">{{ it.q }}</summary>
      <div class="pt-2 text-gray-700" v-html="it.a"></div>
    </details>
  </div>
</template>
