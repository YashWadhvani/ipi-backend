<script setup>
import { ref, watch } from 'vue'
import MediaPickerModal from '@/components/media/MediaPickerModal.vue'
import { assetUrl } from '@/services/http'

const props = defineProps({ modelValue: { type: Object, required: true } })
const emit = defineEmits(['update:modelValue'])

const clone = (v) => JSON.parse(JSON.stringify(v ?? {}))
const emitNow = () => emit('update:modelValue', clone(local.value))

// local block copy ({ type, props })
const local = ref(clone(props.modelValue))
watch(() => props.modelValue, v => { local.value = clone(v) }, { deep: true })

// defaults (mirror HeroSliderForm style: work on local.value.props)
const ensureDefaults = () => {
  const p = (local.value.props ||= {})
  p.title   ||= 'Explore More'
  p.caption ||= ''
  p.bgClass ||= ''
  if (!Array.isArray(p.columns)) {
    p.columns = Array.from({ length: 4 }, (_, i) => ({
      image: null,
      alt: '',
      heading: `Title ${i + 1}`,
      buttonText: 'View',
      buttonLink: '/',
      targetBlank: false
    }))
  } else {
    // Clamp to max 4 and backfill if < 4
    p.columns = p.columns.slice(0, 4)
    while (p.columns.length < 4) {
      p.columns.push({
        image: null, alt: '', heading: `Title ${p.columns.length + 1}`,
        buttonText: 'View', buttonLink: '/', targetBlank: false
      })
    }
  }
}
ensureDefaults()

// Normalize asset from picker -> { id, url, alt }
const normalizeAsset = (asset) => {
  let url = asset?.url || ''
  if (/^https?:\/\//i.test(url)) { try { url = new URL(url).pathname } catch {} }
  if (url && !url.startsWith('/')) url = `/${url}`
  return { id: asset?.id, url, alt: asset?.title || asset?.originalName || '' }
}

// structural ops
const addCol = () => {
  const a = local.value.props.columns
  if (a.length >= 4) return
  a.push({ image: null, alt: '', heading: `Title ${a.length + 1}`, buttonText: 'View', buttonLink: '/', targetBlank: false })
  emitNow()
}
const removeCol = (i) => {
  const a = local.value.props.columns
  a.splice(i, 1)
  if (!a.length) addCol()
  emitNow()
}
const moveUp = (i) => { if (!i) return; const a = local.value.props.columns; a.splice(i-1,0,a.splice(i,1)[0]); emitNow() }
const moveDown = (i) => { const a = local.value.props.columns; if (i>=a.length-1) return; a.splice(i+1,0,a.splice(i,1)[0]); emitNow() }

// gallery picker
const pickerOpen = ref(false)
const activeIdx = ref(-1)
const openPickerFor = (i) => { activeIdx.value = i; pickerOpen.value = true }
const onPicked = (asset) => {
  if (!asset || activeIdx.value < 0) return
  local.value.props.columns[activeIdx.value].image = normalizeAsset(asset)
  emitNow()
  pickerOpen.value = false
  activeIdx.value = -1
}
const clearImage = (i) => { local.value.props.columns[i].image = null; emitNow() }

// helpers
const imgSrc = (col) => {
  // supports {url} object OR plain string path
  const src = typeof col.image === 'string' ? col.image : (col.image?.url || '')
  return src ? assetUrl(src) : ''
}
</script>

<template>
  <div class="space-y-6">
    <!-- Meta -->
    <div class="grid md:grid-cols-3 gap-3">
      <label class="block">
        <span class="block text-xs text-gray-500 mb-1">Title</span>
        <input v-model="local.props.title" @input="emitNow" class="border px-3 py-2 rounded w-full" placeholder="Section title" />
      </label>
      <label class="block">
        <span class="block text-xs text-gray-500 mb-1">Caption</span>
        <input v-model="local.props.caption" @input="emitNow" class="border px-3 py-2 rounded w-full" placeholder="Optional caption" />
      </label>
      <label class="block">
        <span class="block text-xs text-gray-500 mb-1">Background class</span>
        <input v-model="local.props.bgClass" @input="emitNow" class="border px-3 py-2 rounded w-full" placeholder="e.g. bg-gray-50" />
      </label>
    </div>

    <div class="flex items-center justify-between">
      <h4 class="font-semibold">Columns ({{ local.props.columns?.length || 0 }}/4)</h4>
      <button type="button" class="px-3 py-2 border rounded hover:bg-gray-50" @click="addCol" :disabled="(local.props.columns?.length || 0) >= 4">+ Add</button>
    </div>

    <div v-if="Array.isArray(local.props.columns) && local.props.columns.length" class="grid md:grid-cols-2 gap-5">
      <div v-for="(col, i) in local.props.columns" :key="i" class="rounded border p-4 space-y-3 bg-white">
        <div class="flex items-center justify-between">
          <strong>Item {{ i + 1 }}</strong>
          <div class="flex items-center gap-2">
            <button type="button" @click="moveUp(i)" class="text-xs border rounded px-2 py-1">↑</button>
            <button type="button" @click="moveDown(i)" class="text-xs border rounded px-2 py-1">↓</button>
            <button v-if="local.props.columns.length > 1" type="button" @click="removeCol(i)" class="text-xs text-red-600 underline">Remove</button>
          </div>
        </div>

        <!-- Image row -->
        <div class="flex items-center gap-3">
          <div class="w-28 h-16 bg-gray-100 rounded overflow-hidden border">
            <img v-if="imgSrc(col)" :src="imgSrc(col)" :alt="col.alt || col.heading || 'Image'" class="w-full h-full object-cover" />
          </div>
          <div class="flex gap-2">
            <button type="button" @click="openPickerFor(i)" class="px-3 py-1 border rounded">Choose from gallery</button>
            <button v-if="col.image" type="button" @click="clearImage(i)" class="px-3 py-1 border rounded">Remove</button>
          </div>
        </div>

        <label class="block">
          <span class="block text-xs text-gray-500 mb-1">Heading</span>
          <input v-model="col.heading" @input="emitNow" class="border px-3 py-2 rounded w-full" />
        </label>

        <div class="grid grid-cols-2 gap-3">
          <label class="block">
            <span class="block text-xs text-gray-500 mb-1">Button Text</span>
            <input v-model="col.buttonText" @input="emitNow" class="border px-3 py-2 rounded w-full" />
          </label>
          <label class="block">
            <span class="block text-xs text-gray-500 mb-1">Button Link</span>
            <input v-model="col.buttonLink" @input="emitNow" class="border px-3 py-2 rounded w-full" placeholder="https://..." />
          </label>
        </div>

        <label class="inline-flex items-center gap-2">
          <input type="checkbox" v-model="col.targetBlank" @change="emitNow" />
          <span class="text-sm text-gray-700">Open in new tab</span>
        </label>
      </div>
    </div>

    <p v-else class="text-xs text-gray-500">No items yet.</p>

    <!-- Media Picker -->
    <MediaPickerModal v-model="pickerOpen" :multiple="false" @select="onPicked" />
  </div>
</template>
