<!-- components/PageRenderer.vue -->
<template>
  <div class="page-renderer" :id="rootId">
    <component
      v-for="(b, i) in normalizedBlocks"
      :is="map[b.type] || Fallback"
      :key="i"
      v-bind="b.props"
    />
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useHead } from '#imports'

import Hero from '@/components/blocks/Hero.vue'
import Rich from '@/components/blocks/RichText.vue'
import Img from '@/components/blocks/ImageBlock.vue'
import CtaRow from '@/components/blocks/CtaRow.vue'
import FAQ from '@/components/blocks/FAQ.vue'
import HeroSlider from '@/components/blocks/HeroSlider.vue'  
import HomeAboutSection from '@/components/blocks/HomeAboutSection.vue'  
import PartnersCarousel from '@/components/blocks/PartnersCarousel.vue'
import FourUpSection from '@/components/blocks/FourUpSection.vue'

const props = defineProps({
  blocks: { type: Array, default: () => [] },
  css: { type: String, default: '' },
})

// ⬅️ add heroslider to the map
const map = { hero: Hero, richtext: Rich, image: Img, ctaRow: CtaRow, faq: FAQ, 
  heroslider: HeroSlider, 
  aboutsection: HomeAboutSection,
  partners: PartnersCarousel,
  fourup: FourUpSection    
}

const Fallback = { template: `<div class="text-xs text-gray-500">Unknown block</div>` }

// Normalize just in case old data used "heroSlider"
const normalizedBlocks = computed(() =>
  (props.blocks || []).map(b => (b?.type === 'heroSlider' ? { ...b, type: 'heroslider' } : b))
)

const rootId = `pr-${Math.random().toString(36).slice(2)}`

const scopedCss = computed(() => {
  const raw = props.css || ''
  if (!raw.trim()) return ''
  return raw.replace(/(^|})\s*([^@}{][^{]*)\s*{/g, (_m, brace, sel) => {
    const prefixed = sel.split(',').map(s => `#${rootId} ${s.trim()}`).join(', ')
    return `${brace} ${prefixed} {`
  })
})

useHead(() => ({
  style: scopedCss.value ? [{ children: scopedCss.value, key: `page-renderer-css-${rootId}` }] : [],
}))

watch(() => props.css, () => {
  useHead(() => ({
    style: scopedCss.value ? [{ children: scopedCss.value, key: `page-renderer-css-${rootId}` }] : [],
  }))
})
</script>
