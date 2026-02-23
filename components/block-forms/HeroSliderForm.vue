<!-- HeroSliderForn.vue -->
<script setup>
import { ref, watch } from 'vue'
import MediaPickerModal from '@/components/media/MediaPickerModal.vue'
import { assetUrl } from '@/services/http'

const props = defineProps({ modelValue: { type: Object, required: true } })
const emit = defineEmits(['update:modelValue'])

// --- helpers
const clone = (v) => JSON.parse(JSON.stringify(v ?? {}))
const emitNow = () => emit('update:modelValue', clone(local.value))

// --- local copy (so inputs don’t mutate the prop directly)
const local = ref(clone(props.modelValue))
watch(() => props.modelValue, v => { local.value = clone(v) }, { deep: true })

// --- defaults
const ensureDefaults = () => {
  const p = (local.value.props ||= {})
  if (typeof p.autoplay !== 'boolean') p.autoplay = true
  p.intervalMs ||= 5000
  p.heightClass ||= 'h-[70vh] md:h-[85vh]'
  if (typeof p.showArrows !== 'boolean') p.showArrows = true
  if (typeof p.showDots !== 'boolean') p.showDots = true
  if (typeof p.darkOverlay !== 'boolean') p.darkOverlay = true
  p.slides ||= [
    { image: null, heading: 'Welcome', subheading: 'Add your subheading here', buttonText: 'Learn more', buttonHref: '/', align: 'center' }
  ]
}
ensureDefaults()

// --- image helpers
const normalizeAsset = (asset) => {
  let url = asset?.url || ''
  if (/^https?:\/\//i.test(url)) { try { url = new URL(url).pathname } catch {} }
  if (url && !url.startsWith('/')) url = `/${url}`
  return { id: asset.id, url, alt: asset.title || asset.originalName || '' }
}

// --- structural ops (ALWAYS emit after)
const addSlide = () => { local.value.props.slides.push({ image: null, heading: '', subheading: '', buttonText: '', buttonHref: '', align: 'center' }); emitNow() }
const removeSlide = (i) => { local.value.props.slides.splice(i, 1); emitNow() }
const moveUp = (i) => { if (!i) return; const a = local.value.props.slides; a.splice(i-1,0,a.splice(i,1)[0]); emitNow() }
const moveDown = (i) => { const a = local.value.props.slides; if (i>=a.length-1) return; a.splice(i+1,0,a.splice(i,1)[0]); emitNow() }

const pickerOpen = ref(false)
const activeSlideIdx = ref(-1)
const openPickerFor = (i) => { activeSlideIdx.value = i; pickerOpen.value = true }
const onPicked = (asset) => {
  if (!asset || activeSlideIdx.value < 0) return
  local.value.props.slides[activeSlideIdx.value].image = normalizeAsset(asset)
  emitNow()
  pickerOpen.value = false
  activeSlideIdx.value = -1
}
const clearImage = (i) => { local.value.props.slides[i].image = null; emitNow() }
</script>

<template>
  <div class="space-y-4">
    <!-- Slider Options -->
    <div class="grid gap-3 md:grid-cols-3">
      <label class="flex items-center gap-2">
        <input type="checkbox" v-model="local.props.autoplay" @change="emitNow" />
        <span class="text-sm">Autoplay</span>
      </label>
      <div>
        <label class="block text-xs text-gray-500 mb-1">Interval (ms)</label>
        <input v-model.number="local.props.intervalMs" @input="emitNow" type="number" class="border px-3 py-2 rounded w-full" />
      </div>
      <div>
        <label class="block text-xs text-gray-500 mb-1">Height Class</label>
        <input v-model="local.props.heightClass" @input="emitNow" class="border px-3 py-2 rounded w-full" placeholder="e.g. h-[70vh] md:h-[85vh]" />
      </div>
      <label class="flex items-center gap-2">
        <input type="checkbox" v-model="local.props.showArrows" @change="emitNow" />
        <span class="text-sm">Show Arrows</span>
      </label>
      <label class="flex items-center gap-2">
        <input type="checkbox" v-model="local.props.showDots" @change="emitNow" />
        <span class="text-sm">Show Dots</span>
      </label>
      <label class="flex items-center gap-2">
        <input type="checkbox" v-model="local.props.darkOverlay" @change="emitNow" />
        <span class="text-sm">Dark Overlay</span>
      </label>
    </div>

    <!-- Slides -->
    <div class="flex items-center justify-between">
      <h3 class="font-semibold">Slides ({{ local.props.slides?.length || 0 }})</h3>
      <button type="button" @click="addSlide" class="px-3 py-2 border rounded hover:bg-gray-50">+ Add Slide</button>
    </div>

    <div v-if="Array.isArray(local.props.slides) && local.props.slides.length" class="space-y-6">
      <div v-for="(s, i) in local.props.slides" :key="i" class="rounded border border-[#ddd] p-4">
        <div class="flex items-center justify-between mb-3">
          <div class="text-sm text-gray-600">Slide {{ i + 1 }}</div>
          <div class="flex items-center gap-2">
            <button type="button" @click="moveUp(i)" class="px-2 py-1 border rounded text-xs">↑</button>
            <button type="button" @click="moveDown(i)" class="px-2 py-1 border rounded text-xs">↓</button>
            <button type="button" @click="removeSlide(i)" class="px-2 py-1 border rounded text-xs text-red-600">Delete</button>
          </div>
        </div>

        <!-- Image picker row -->
        <div class="flex items-center gap-3 mb-3">
          <div class="w-28 h-16 bg-gray-100 rounded overflow-hidden border">
            <img
              v-if="s.image?.url"
              :src="assetUrl(s.image.url)"
              :alt="s.image.alt || 'Slide image'"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="flex gap-2">
            <button type="button" @click="openPickerFor(i)" class="px-3 py-1 border rounded">Choose from gallery</button>
            <button v-if="s.image" type="button" @click="clearImage(i)" class="px-3 py-1 border rounded">Remove</button>
          </div>
        </div>

        <div class="grid gap-3 md:grid-cols-2">
          <input v-model="s.heading" @input="emitNow" class="border px-3 py-2 rounded" placeholder="Heading" />
          <input v-model="s.subheading" @input="emitNow" class="border px-3 py-2 rounded" placeholder="Subheading" />
          <div class="grid gap-3 md:grid-cols-2 md:col-span-2">
            <input v-model="s.buttonText" @input="emitNow" class="border px-3 py-2 rounded" placeholder="Button text" />
            <input v-model="s.buttonHref" @input="emitNow" class="border px-3 py-2 rounded" placeholder="Button link" />
          </div>
          <div class="md:col-span-2">
            <label class="block text-xs text-gray-500 mb-1">Align</label>
            <select v-model="s.align" @change="emitNow" class="border px-3 py-2 rounded">
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <p v-else class="text-xs text-gray-500">No slides yet. Click “Add Slide”.</p>

    <MediaPickerModal v-model="pickerOpen" :multiple="false" @select="onPicked" />
  </div>
</template>
