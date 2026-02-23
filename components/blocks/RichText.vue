<script setup>
const props = defineProps({ html: { type: String, default: '' } })
</script>

<template>
  <section class="prose max-w-none">
    <!-- Admin-authored HTML -->
    <div v-html="html"></div>
  </section>
</template>
