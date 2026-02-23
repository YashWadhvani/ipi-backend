<script setup>
import { computed } from 'vue'
import { assetUrl } from '@/services/http'

const props = defineProps({
  title: String,
  caption: String,
  bgClass: { type: String, default: '' },
  columns: { type: Array, default: () => [] }
})

// normalize to exactly 4 items & resolve image URLs
const normalized = computed(() => {
  const src = Array.isArray(props.columns) ? props.columns.slice(0, 4) : []
  while (src.length < 4) {
    src.push({ image: null, alt: '', heading: `Title ${src.length + 1}`, buttonText: '', buttonLink: '', targetBlank: false })
  }
  return src.map((c, idx) => {
    const raw = typeof c.image === 'string' ? c.image : (c.image?.url || '')
    const resolved = raw ? assetUrl(raw) : ''
    return { ...c, _src: resolved, _key: `${idx}-${resolved}` }
  })
})
</script>

<template>
  <section :class="['py-10 md:py-14', bgClass]">
    <div class="max-w-6xl mx-auto px-4">
      <header v-if="title || caption" class="text-center mb-8 md:mb-10">
        <h2 v-if="title" class="text-2xl md:text-3xl font-semibold tracking-tight">{{ title }}</h2>
        <p v-if="caption" class="text-sm md:text-base text-gray-500 mt-2">{{ caption }}</p>
      </header>

      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <article
          v-for="(col, i) in normalized"
          :key="col._key"
          class="group rounded-xl border border-[#e5e7eb] bg-white/60 backdrop-blur-sm p-4 hover:shadow-md transition"
        >
          <div class="aspect-[4/3] mb-4 overflow-hidden rounded-lg bg-gray-50">
            <img
              v-if="col._src"
              :src="col._src"
              :alt="col.alt || col.heading || 'Image'"
              class="w-full h-full object-cover group-hover:scale-[1.02] transition"
              loading="lazy"
              decoding="async"
            />
          </div>

          <h3 class="text-lg font-semibold leading-snug">
            {{ col.heading || 'Title' }}
          </h3>

          <div class="mt-4">
            <a
              v-if="col.buttonLink && col.buttonText"
              :href="col.buttonLink"
              :target="col.targetBlank ? '_blank' : undefined"
              rel="noopener"
              class="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-100"
            >
              <span>{{ col.buttonText }}</span>
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path d="M7 17L17 7M17 7H9M17 7v8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </a>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
