<script setup>
defineProps({ props: Object })
</script>

<template>
  <section class="py-16">
    <div
      class="max-w-7xl mx-auto px-4 grid gap-8 items-center"
      :class="props.reverse ? 'md:grid-cols-2 md:flex-row-reverse' : 'md:grid-cols-2'"
    >

      <!-- Content -->
      <div>
        <h2 class="text-3xl font-bold mb-4">
          {{ props.heading }}
        </h2>

        <div
          class="prose max-w-none"
          v-html="props.html"
        />
      </div>

      <!-- Image -->
      <div>
        <img
          v-if="props.image"
          :src="props.image"
          :alt="props.imageAlt || ''"
          class="w-full rounded-lg object-cover"
        />
      </div>

    </div>
  </section>
</template>
