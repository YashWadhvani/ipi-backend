<script setup>
import { computed } from 'vue'
import { assetUrl } from '@/services/http'

const props = defineProps({
  image: { type: Object, default: null }, // { url, alt? }
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  body: { type: String, default: '' },
  buttonText: { type: String, default: '' },
  buttonHref: { type: String, default: '' }
})

const imgSrc = computed(() => props.image?.url ? assetUrl(props.image.url) : '')
</script>

<template>
  <section class="w-full py-12 md:py-16 bg-[#f7f7f7]">
    <div class="mx-auto px-0">
      <div class="grid gap-8 md:grid-cols-2 md:items-center">
        <!-- Left: Image -->
        <div class="w-full">
          <div class="relative w-full h-64 md:h-[420px] rounded-2xl overflow-hidden bg-gray-200">
            <img
              v-if="imgSrc"
              :src="imgSrc"
              :alt="image?.alt || title || 'About image'"
              class="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        <!-- Right: Content -->
        <div class="flex flex-col gap-4">
          <p v-if="subtitle" class="text-sm uppercase tracking-wide text-gray-500">{{ subtitle }}</p>
          <h2 class="text-2xl md:text-4xl font-bold">{{ title }}</h2>
          <p class="text-gray-700 leading-relaxed whitespace-pre-line">
            {{ body }}
          </p>

          <div v-if="buttonText && buttonHref" class="pt-2">
            <a
              :href="buttonHref"
              class="inline-flex items-center gap-2 rounded-md bg-[#e60012] text-white px-5 py-2
                     hover:bg-[#cc0010] hover:cursor-pointer transition-colors
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e60012]/40 focus-visible:ring-offset-2"
            >
              {{ buttonText }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
