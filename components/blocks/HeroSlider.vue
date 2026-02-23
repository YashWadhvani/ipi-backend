<!-- HeroSlider.vue -->
<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import { assetUrl } from '@/services/http'

const props = defineProps({
  slides: { type: Array, required: true },
  autoplay: { type: Boolean, default: true },
  intervalMs: { type: Number, default: 5000 },
  heightClass: { type: String, default: 'h-[70vh] md:h-[85vh]' },
  showArrows: { type: Boolean, default: true },
  showDots: { type: Boolean, default: true },
  darkOverlay: { type: Boolean, default: true }
})

// Resolve absolute URLs; stable key updates if URL changes
const resolvedSlides = computed(() =>
  (props.slides || []).map((s, idx) => {
    const abs = s?.image?.url ? assetUrl(s.image.url) : ''
    return { ...s, _src: abs, _key: `${idx}-${abs}` }
  })
)

const i = ref(0)
const hovering = ref(false)
let timer = null

const count = computed(() => resolvedSlides.value.length)
const hasSlides = computed(() => count.value > 0)

const alignClass = (align) => ({
  left: 'items-start text-left',
  center: 'items-center text-center',
  right: 'items-end text-right'
}[align] || 'items-center text-center')

const go = (idx) => { if (hasSlides.value) i.value = (idx + count.value) % count.value }
const next = () => go(i.value + 1)
const prev = () => go(i.value - 1)

const start = () => {
  stop()
  if (props.autoplay && count.value > 1) {
    timer = setInterval(() => { if (!hovering.value) next() }, props.intervalMs)
  }
}
const stop = () => { if (timer) { clearInterval(timer); timer = null } }

onMounted(start)
onBeforeUnmount(stop)
watch(() => [props.autoplay, props.intervalMs, count.value], start)

// swipe
let startX = 0
const onTouchStart = (e) => { startX = e.touches?.[0]?.clientX || 0 }
const onTouchEnd = (e) => {
  const dx = (e.changedTouches?.[0]?.clientX || 0) - startX
  if (Math.abs(dx) > 40) dx < 0 ? next() : prev()
}
</script>

<template>
  <section
    class="relative w-full overflow-hidden rounded-2xl"
    :class="heightClass"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
    @touchstart.passive="onTouchStart"
    @touchend.passive="onTouchEnd"
  >
    <div class="relative w-full h-full">
      <div
        v-for="(s, idx) in resolvedSlides"
        :key="s._key"
        class="absolute inset-0 transition-transform duration-500 ease-out will-change-transform"
        :style="{ transform: `translateX(${(idx - i) * 100}%)` }"
      >
        <!-- Background image -->
        <div class="absolute inset-0">
          <img
            v-if="s._src"
            :src="s._src"
            :alt="s.image?.alt || s.heading || 'Slide image'"
            class="w-full h-full object-cover"
            loading="eager"
            decoding="async"
          />
          <div v-else class="w-full h-full bg-gray-200" />
        </div>

        <!-- Overlay -->
        <div v-if="darkOverlay" class="absolute inset-0 bg-black/40" />

        <!-- Content -->
        <div class="relative z-10 w-full h-full">
          <div class="container mx-auto h-full px-4 flex flex-col gap-4 justify-center" :class="alignClass(s.align)">
            <h1 v-if="s.heading" class="text-3xl md:text-5xl font-bold text-white drop-shadow-sm">
              {{ s.heading }}
            </h1>
            <p v-if="s.subheading" class="text-white/90 text-lg md:text-xl max-w-3xl">
              {{ s.subheading }}
            </p>
            <div v-if="s.buttonText && s.buttonHref" class="pt-2">
              <a
                :href="s.buttonHref"
                class="inline-flex items-center gap-2 rounded-md bg-white text-black px-5 py-2 hover:opacity-90"
              >
                {{ s.buttonText }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Arrows -->
    <button
      v-if="showArrows && count > 1"
      @click="prev"
      class="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-10 h-10 grid place-items-center"
      aria-label="Previous slide"
    >
      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
    </button>
    <!-- Right arrow -->
    <button
        v-if="showArrows && count > 1"
        @click="next"
        class="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-10 h-10 grid place-items-center"
        aria-label="Next slide"
    >
    <!-- Use the same chevron path as the left arrow, but flip horizontally -->
    <svg class="w-5 h-5 transform -scale-x-100" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
    </svg>
    </button>


    <!-- Dots -->
    <div v-if="showDots && count > 1" class="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
      <button
        v-for="(s, idx) in resolvedSlides"
        :key="`dot-${idx}`"
        @click="go(idx)"
        class="w-2.5 h-2.5 rounded-full"
        :class="idx === i ? 'bg-white' : 'bg-white/50'"
        aria-label="Go to slide"
      />
    </div>
  </section>
</template>
