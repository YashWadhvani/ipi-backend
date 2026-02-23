<script setup>
import { ref, watch } from 'vue'
import MediaPickerModal from '@/components/media/MediaPickerModal.vue'
import { assetUrl } from '@/services/http'

const props = defineProps({ modelValue: { type: Object, required: true } })
const emit = defineEmits(['update:modelValue'])

const clone = (v) => JSON.parse(JSON.stringify(v ?? {}))
const local = ref(clone(props.modelValue))
const emitNow = () => emit('update:modelValue', clone(local.value))

watch(() => props.modelValue, v => { local.value = clone(v); ensureDefaults() }, { deep: true })

/** Normalize asset to relative path + basic meta */
const normalizeAsset = (asset) => {
  if (!asset) return null
  let url = asset?.url || ''
  if (/^https?:\/\//i.test(url)) { try { url = new URL(url).pathname } catch {} }
  if (url && !url.startsWith('/')) url = `/${url}`
  return { id: asset.id, url, alt: asset.title || asset.originalName || '' }
}

/** Ensure props + each logo entry have a stable shape */
const ensureDefaults = () => {
  const p = (local.value.props ||= {})
  if (typeof p.title !== 'string')        p.title = 'Our Partners'
  if (typeof p.caption !== 'string')      p.caption = 'Trusted by leading organizations'
  if (typeof p.durationSec !== 'number')  p.durationSec = 30
  if (typeof p.pauseOnHover !== 'boolean') p.pauseOnHover = true
  if (typeof p.grayscale !== 'boolean')   p.grayscale = true
  p.logoHeightClass ||= 'h-10 md:h-12 lg:h-14'
  p.gapClass ||= 'gap-10 md:gap-16'
  if (!Array.isArray(p.logos)) p.logos = []

  // normalize each logo
  p.logos = p.logos.map((raw) => {
    const l = raw ?? {}
    // Allow legacy shapes:
    // - { url } or { logo: { url } } or { image: null }
    let image =
      l.image ??
      (l.logo ? normalizeAsset(l.logo) : null) ??
      (l.url ? normalizeAsset({ id: l.id, url: l.url, title: l.title }) : null)

    if (image && !image.url) image = null
    return {
      title: typeof l.title === 'string' ? l.title : '',
      href: typeof l.href === 'string' ? l.href : (typeof l.link === 'string' ? l.link : ''),
      image, // { id, url, alt } or null
    }
  })
}
ensureDefaults()

/** Logo ops */
const addLogo = () => {
  local.value.props.logos.push({ title: '', href: '', image: null })
  emitNow()
}
const removeLogo = (i) => { local.value.props.logos.splice(i, 1); emitNow() }
const moveUp = (i) => { if (!i) return; const a = local.value.props.logos; a.splice(i-1,0,a.splice(i,1)[0]); emitNow() }
const moveDown = (i) => { const a = local.value.props.logos; if (i>=a.length-1) return; a.splice(i+1,0,a.splice(i,1)[0]); emitNow() }

/** Media picker */
const pickerOpen = ref(false)
const activeIdx = ref(-1)
const openPickerFor = (i) => { activeIdx.value = i; pickerOpen.value = true }
const onPicked = (asset) => {
  if (activeIdx.value < 0) return
  local.value.props.logos[activeIdx.value].image = normalizeAsset(asset)
  emitNow()
  pickerOpen.value = false
  activeIdx.value = -1
}
const clearImage = (i) => { local.value.props.logos[i].image = null; emitNow() }

/** Safe asset url for preview */
const imgUrl = (logo) => {
  const u = logo?.image?.url
  return u ? assetUrl(u) : ''
}
</script>

<template>
  <div class="space-y-4">
    <!-- Options -->
    <div class="grid gap-3 md:grid-cols-3">
      <div>
        <label class="block text-xs text-gray-600 mb-1">Title</label>
        <input v-model="local.props.title" @input="emitNow" class="border rounded px-3 py-2 w-full" />
      </div>
      <div>
        <label class="block text-xs text-gray-600 mb-1">Caption</label>
        <input v-model="local.props.caption" @input="emitNow" class="border rounded px-3 py-2 w-full" />
      </div>
      <div>
        <label class="block text-xs text-gray-600 mb-1">Scroll duration (sec)</label>
        <input type="number" min="5" v-model.number="local.props.durationSec" @input="emitNow" class="border rounded px-3 py-2 w-full" />
      </div>
      <label class="inline-flex items-center gap-2">
        <input type="checkbox" v-model="local.props.pauseOnHover" @change="emitNow" />
        <span class="text-sm">Pause on hover</span>
      </label>
      <label class="inline-flex items-center gap-2">
        <input type="checkbox" v-model="local.props.grayscale" @change="emitNow" />
        <span class="text-sm">Grayscale logos</span>
      </label>
      <div class="md:col-span-3 grid md:grid-cols-2 gap-3">
        <div>
          <label class="block text-xs text-gray-600 mb-1">Logo height class</label>
          <input v-model="local.props.logoHeightClass" @input="emitNow" class="border rounded px-3 py-2 w-full" placeholder="e.g. h-10 md:h-12 lg:h-14" />
        </div>
        <div>
          <label class="block text-xs text-gray-600 mb-1">Gap class</label>
          <input v-model="local.props.gapClass" @input="emitNow" class="border rounded px-3 py-2 w-full" placeholder="e.g. gap-10 md:gap-16" />
        </div>
      </div>
    </div>

    <!-- Header -->
    <div class="flex items-center justify-between">
      <h3 class="font-semibold">Logos ({{ local.props.logos.length }})</h3>
      <button type="button" @click="addLogo" class="px-3 py-2 border rounded hover:bg-gray-50">+ Add logo</button>
    </div>

    <!-- Logos grid -->
    <div v-if="local.props.logos.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      <div v-for="(l, i) in local.props.logos" :key="i" class="border rounded p-3 bg-white space-y-3">
        <div class="flex items-start justify-between">
          <div class="text-sm text-gray-600">#{{ i + 1 }}</div>
          <div class="flex items-center gap-2">
            <button type="button" @click="moveUp(i)" class="px-2 py-1 border rounded text-xs">↑</button>
            <button type="button" @click="moveDown(i)" class="px-2 py-1 border rounded text-xs">↓</button>
            <button type="button" @click="removeLogo(i)" class="px-2 py-1 border rounded text-xs text-red-600">Delete</button>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="w-28 h-16 bg-gray-100 rounded overflow-hidden border">
            <img
              v-if="l?.image?.url"
              :src="imgUrl(l)"
              :alt="l?.image?.alt || l?.title || 'Logo'"
              class="w-full h-full object-contain"
              @error="$event.target.style.display='none'"
            />
          </div>
          <div class="flex gap-2">
            <button type="button" @click="openPickerFor(i)" class="px-3 py-1.5 border rounded">Choose from gallery</button>
            <button v-if="l?.image" type="button" @click="clearImage(i)" class="px-3 py-1.5 border rounded">Remove</button>
          </div>
        </div>

        <input v-model="l.title" @input="emitNow" class="border rounded px-3 py-2 w-full" placeholder="Title (optional)" />
        <input v-model="l.href"  @input="emitNow" class="border rounded px-3 py-2 w-full" placeholder="Link (optional)" />
      </div>
    </div>

    <p v-else class="text-sm text-gray-500">No logos yet. Click “Add logo”.</p>

    <MediaPickerModal v-model="pickerOpen" :multiple="false" @select="onPicked" />
  </div>
</template>
