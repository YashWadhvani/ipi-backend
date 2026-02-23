<script setup>
import { computed, ref } from 'vue'
import { assetUrl } from '@/services/http'

const props = defineProps({
  title: { type: String, default: '' },
  caption: { type: String, default: '' },
  logos: { type: Array, default: () => [] }, // [{ image:{url,alt}, link? }]
  durationSec: { type: Number, default: 30 }, // total loop duration
  pauseOnHover: { type: Boolean, default: true },
  grayscale: { type: Boolean, default: true },
  logoHeightClass: { type: String, default: 'h-14 md:h-16 lg:h-20' },
  gapClass: { type: String, default: 'gap-10 md:gap-16' },
})

const resolved = computed(() =>
  (props.logos || [])
    .filter(l => l?.image?.url)
    .map((l, idx) => ({
      _key: `logo-${idx}-${l.image.url}`,
      src: assetUrl(l.image.url),
      alt: l.image.alt || 'Partner logo',
      link: l.link || ''
    }))
)

const shouldAnimate = computed(() => resolved.value.length > 3)
const trackStyle = computed(() => ({ '--duration': `${Math.max(6, props.durationSec)}s` }))

const hovering = ref(false)
const pauseOnHover = computed(() => props.pauseOnHover && hovering.value)
</script>

<template>
  <section class="w-full py-12 md:py-16">
    <div class="container mx-auto px-4">
      <div class="text-center max-w-3xl mx-auto mb-8 md:mb-10">
        <p v-if="caption" class="text-sm uppercase tracking-wide text-gray-500">{{ caption }}</p>
        <h2 v-if="title" class="text-2xl md:text-4xl font-bold mt-1">{{ title }}</h2>
      </div>

      <!-- When enough logos: seamless marquee -->
      <div
        v-if="shouldAnimate"
        class="group relative overflow-hidden"
        @mouseenter="hovering = true"
        @mouseleave="hovering = false"
      >
        <div class="marquee flex" :style="trackStyle" :class="pauseOnHover ? 'paused' : ''">
          <!-- sequence A -->
          <ul class="flex items-center" :class="gapClass" aria-label="partners logos">
            <li v-for="item in resolved" :key="`a-${item._key}`" class="shrink-0">
              <component :is="item.link ? 'a' : 'div'" :href="item.link || undefined" target="_blank" rel="noopener" class="block">
                <img
                  :src="item.src"
                  :alt="item.alt"
                  class="w-auto object-contain"
                  :class="[logoHeightClass, grayscale ? 'grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition' : 'opacity-100']"
                  loading="lazy"
                  decoding="async"
                />
              </component>
            </li>
          </ul>

          <!-- sequence B (duplicate for seamless loop) -->
          <ul class="flex items-center" :class="gapClass" aria-hidden="true">
            <li v-for="item in resolved" :key="`b-${item._key}`" class="shrink-0">
              <component :is="item.link ? 'a' : 'div'" :href="item.link || undefined" target="_blank" rel="noopener" class="block">
                <img
                  :src="item.src"
                  :alt="item.alt"
                  class="w-auto object-contain"
                  :class="[logoHeightClass, grayscale ? 'grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition' : 'opacity-100']"
                  loading="lazy"
                  decoding="async"
                />
              </component>
            </li>
          </ul>
        </div>
      </div>

      <!-- Otherwise: centered static row -->
      <div v-else class="flex flex-wrap justify-center items-center" :class="gapClass">
        <div v-for="item in resolved" :key="item._key" class="shrink-0">
          <component :is="item.link ? 'a' : 'div'" :href="item.link || undefined" target="_blank" rel="noopener" class="block">
            <img
              :src="item.src"
              :alt="item.alt"
              class="w-auto object-contain"
              :class="[logoHeightClass, grayscale ? 'grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition' : 'opacity-100']"
              loading="lazy"
              decoding="async"
            />
          </component>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.marquee {
  width: max-content;
  animation: marquee var(--duration, 30s) linear infinite;
}
.paused { animation-play-state: paused; }

@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
</style>
