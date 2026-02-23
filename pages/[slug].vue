<template>
  <div v-if="pending" class="w-full mx-auto px-4 py-8 text-gray-500">
    Loading…
  </div>

  <div v-else-if="data" class="w-full page-custom mx-auto px-4 py-4">
    <PageRenderer :blocks="data.blocks || []" :css="data.css || ''" />
  </div>

  <div v-else class="container mx-auto px-4 py-8 text-red-600">
    Page not found.
  </div>
</template>


<script setup>
import PageRenderer from '@/components/PageRenderer.vue'
import { getPageBySlug } from '@/services/usePagesService'

const route = useRoute()

const slug = computed(() => String(route.params.slug || 'home'))

const { data, pending, error } = await useAsyncData(
  `page:${slug.value}`,
  () => getPageBySlug(slug.value),
  {
    watch: [slug],
    server: true,
    lazy: false
  }
)


useHead(() => ({
  title: data.value?.meta?.title || data.value?.title || 'Page',
  meta: [{ name: 'description', content: data.value?.meta?.description || '' }]
}))

if (error.value) {
  // Visible in dev tools, not in UI
  console.error('getPageBySlug failed:', error.value)
}
</script>
