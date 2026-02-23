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
  p.title       ||= 'About Us'
  p.subtitle    ||= 'Who we are'
  p.body        ||= 'Write your about text here…'
  p.buttonText  ||= 'Learn more'
  p.buttonHref  ||= '/'
  if (p.image === undefined) p.image = null
}
ensureDefaults()

// --- media helpers
const normalizeAsset = (asset) => {
  let url = asset?.url || ''
  if (/^https?:\/\//i.test(url)) { try { url = new URL(url).pathname } catch {} }
  if (url && !url.startsWith('/')) url = `/${url}`
  return { id: asset.id, url, alt: asset.title || asset.originalName || '' }
}

const pickerOpen = ref(false)
const openPicker = () => { pickerOpen.value = true }
const onPicked = (asset) => {
  if (!asset) return
  local.value.props.image = normalizeAsset(asset)
  emitNow()
  pickerOpen.value = false
}
const clearImage = () => { local.value.props.image = null; emitNow() }
</script>

<template>
  <div class="space-y-4">
    <!-- Image picker -->
    <div class="flex items-center gap-3">
      <div class="w-36 h-24 bg-gray-100 rounded overflow-hidden border">
        <img
          v-if="local.props?.image?.url"
          :src="assetUrl(local.props.image.url)"
          :alt="local.props.image.alt || 'About image'"
          class="w-full h-full object-cover"
        />
      </div>
      <div class="flex gap-2">
        <button type="button" @click="openPicker" class="px-3 py-2 border rounded">Choose from gallery</button>
        <button
          v-if="local.props?.image"
          type="button"
          @click="clearImage"
          class="px-3 py-2 border rounded"
        >Remove</button>
      </div>
    </div>

    <!-- Content fields -->
    <div class="grid gap-3 md:grid-cols-2">
      <input
        v-model="local.props.title"
        @input="emitNow"
        class="border px-3 py-2 rounded"
        placeholder="Title"
      />
      <input
        v-model="local.props.subtitle"
        @input="emitNow"
        class="border px-3 py-2 rounded"
        placeholder="Subtitle"
      />
      <textarea
        v-model="local.props.body"
        @input="emitNow"
        class="border px-3 py-2 rounded md:col-span-2 h-32"
        placeholder="Long text / paragraph"
      />
      <input
        v-model="local.props.buttonText"
        @input="emitNow"
        class="border px-3 py-2 rounded"
        placeholder="Button text"
      />
      <input
        v-model="local.props.buttonHref"
        @input="emitNow"
        class="border px-3 py-2 rounded"
        placeholder="Button link"
      />
    </div>

    <!-- Media picker modal -->
    <MediaPickerModal v-model="pickerOpen" :multiple="false" @select="onPicked" />
  </div>
</template>
