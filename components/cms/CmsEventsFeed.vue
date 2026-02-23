<template>
    <section class="events-feed">
      <div class="container">
        <header class="flex items-end justify-between">
          <h2>{{ props.title }}</h2>
          <NuxtLink v-if="props.showButton" :to="props.buttonLink" class="btn">{{ props.buttonText }}</NuxtLink>
        </header>
  
        <div v-if="pending">Loading…</div>
        <div v-else-if="error">Could not load events.</div>
        <ul v-else class="grid md:grid-cols-3 gap-6">
          <li v-for="ev in data" :key="ev.id" class="card">
            <NuxtLink :to="`/events/${ev.slug}`" class="block p-4">
              <img v-if="ev.coverUrl" :src="ev.coverUrl" class="w-full h-40 object-cover mb-3" />
              <h3 class="text-lg font-semibold">{{ ev.title }}</h3>
              <p class="text-sm opacity-80">{{ new Date(ev.startDate).toLocaleString() }}</p>
              <p v-if="ev.location" class="text-sm">{{ ev.location }}</p>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </section>
  </template>
  
<script setup>
const props = defineProps({
  title: { type: String, default: 'Upcoming Events' },
  limit: { type: Number, default: 6 },
  chapterId: { type: String, default: null },
  order: { type: String, default: 'startDate:asc' },
  showButton: { type: Boolean, default: true },
  buttonText: { type: String, default: 'View all events' },
  buttonLink: { type: String, default: '/events' },
})

const query = new URLSearchParams({
  upcoming: '1',
  limit: String(props.limit),
  ...(props.chapterId ? { chapterId: props.chapterId } : {}),
  ...(props.order ? { order: props.order } : {})
}).toString()

const { data, pending, error } = await useFetch(`/api/v1/events?${query}`, { method: 'GET' })
</script>



<style scoped>
.container{max-width:1100px;margin:0 auto;padding:0 16px}
.btn{padding:6px 12px;border:1px solid #e5e7eb;border-radius:6px}
.card{border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;background:#fff}
</style>
