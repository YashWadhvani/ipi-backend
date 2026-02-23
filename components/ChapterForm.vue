<template>
  <div class="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
    <div class="bg-white w-full max-w-lg rounded-xl p-5">
      <!-- Header -->
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-lg font-semibold">{{ initial ? 'Edit Chapter' : 'New Chapter' }}</h3>
        <button @click="$emit('close')" class="text-sm">✕</button>
      </div>

      <!-- Form -->
      <form @submit.prevent="submit" class="space-y-3">
        <!-- Basic -->
        <input
          v-model="form.name"
          placeholder="Name"
          class="w-full bg-white border border-[#ccc] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10"
        />
        <input
          v-model="form.code"
          placeholder="Code (unique)"
          class="w-full bg-white border border-[#ccc] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10"
        />

        <select
          v-model="form.cityId"
          class="w-full bg-white border border-[#ccc] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10"
        >
          <option value="" disabled>Select City</option>
          <option v-for="c in cities" :key="c.id" :value="c.id">
            {{ c.name }}<span v-if="c.state">, {{ c.state }}</span>
          </option>
        </select>

        <textarea
          v-model="form.description"
          placeholder="Description"
          class="w-full bg-white border border-[#ccc] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10"
        ></textarea>

        <!-- Featured Image -->
        <div class="border border-[#ccc] rounded p-3">
          <div class="flex items-center justify-between mb-2">
            <div class="font-medium text-sm">Featured Image</div>
            <div class="flex items-center gap-2">
              <button
                type="button"
                class="px-2 py-1 text-sm border border-[#ccc] rounded bg-white hover:bg-gray-50 cursor-pointer"
                @click="pickerOpen = true"
              >
                Choose from gallery
              </button>
              <button
                v-if="image"
                type="button"
                class="px-2 py-1 text-sm border border-[#ccc] rounded bg-white hover:bg-gray-50 cursor-pointer"
                @click="clearImage"
              >
                Remove
              </button>
            </div>
          </div>

          <div v-if="image" class="flex items-center gap-3">
            <div class="w-20 h-20 bg-gray-100 rounded overflow-hidden border">
              <img
                v-if="image.url"
                :src="assetUrl(image.url)"
                :alt="image.alt || 'Featured image'"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="text-xs text-gray-600 break-all">
              <div class="font-medium">{{ image.alt || '—' }}</div>
              <div class="text-gray-500">{{ image.url }}</div>
            </div>
          </div>
          <div v-else class="text-sm text-gray-500">No image selected.</div>
        </div>

        <!-- Address -->
        <div class="border border-[#ccc] rounded p-3">
          <div class="font-medium text-sm mb-2">Address</div>
          <div class="grid grid-cols-1 gap-2">
            <input
              v-model="address.line1"
              placeholder="Line 1"
              class="w-full bg-white border border-[#ccc] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10"
            />
            <input
              v-model="address.line2"
              placeholder="Line 2 (optional)"
              class="w-full bg-white border border-[#ccc] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10"
            />
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                v-model="address.area"
                placeholder="Area"
                class="bg-white border border-[#ccc] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10"
              />
              <input
                v-model="address.landmark"
                placeholder="Landmark"
                class="bg-white border border-[#ccc] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10"
              />
              <input
                v-model="address.pincode"
                placeholder="Pincode"
                class="bg-white border border-[#ccc] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-2 justify-end">
          <button
            type="button"
            @click="$emit('close')"
            class="px-3 py-2 border border-[#ccc] rounded bg-white hover:bg-gray-50 cursor-pointer"
          >
            Cancel
          </button>
          <button class="px-3 py-2 bg-black text-white rounded hover:opacity-90 cursor-pointer">
            {{ saving ? 'Saving...' : 'Save' }}
          </button>
        </div>
        <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>
      </form>
    </div>

    <!-- Media Picker (matches your working usage) -->
    <MediaPickerModal v-model="pickerOpen" :multiple="false" @select="onPicked" />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { createChapter, updateChapter } from '@/services/chaptersServices'
import MediaPickerModal from '@/components/media/MediaPickerModal.vue'
import { assetUrl } from '@/services/http'

const props = defineProps({
  initial: Object,
  cities: { type: Array, default: () => [] }
})
const emit = defineEmits(['close', 'saved'])

const saving = ref(false)
const error = ref('')

const form = ref({ name: '', code: '', cityId: '', description: '' })

// featured image { id, alt, url }
const image = ref(null)
// address { line1, line2, area, landmark, pincode }
const address = ref({ line1: '', line2: '', area: '', landmark: '', pincode: '' })

// Media picker control (same pattern as your example)
const pickerOpen = ref(false)

// Normalize media asset to { id, url (pathname), alt }
const normalizeAsset = (asset) => {
  let url = asset?.url || ''
  if (/^https?:\/\//i.test(url)) {
    try { url = new URL(url).pathname } catch {}
  }
  if (url && !url.startsWith('/')) url = `/${url}`
  return { id: asset.id, url, alt: asset.title || asset.originalName || '' }
}

const onPicked = (asset) => {
  if (!asset) return
  image.value = normalizeAsset(asset)
  pickerOpen.value = false
}

const clearImage = () => { image.value = null }

watch(
  () => props.initial,
  (v) => {
    form.value = v
      ? { name: v.name, code: v.code, cityId: v.cityId, description: v.description || '' }
      : { name: '', code: '', cityId: '', description: '' }

    // seed image
    image.value = v?.image ? { ...v.image } : null

    // seed address
    const a = v?.address || {}
    address.value = {
      line1: a.line1 || '',
      line2: a.line2 || '',
      area: a.area || '',
      landmark: a.landmark || '',
      pincode: a.pincode || ''
    }
  },
  { immediate: true }
)

const normalizeAddress = () => {
  const a = { ...address.value }
  Object.keys(a).forEach(k => {
    if (typeof a[k] === 'string') a[k] = a[k].trim()
    if (!a[k]) delete a[k]
  })
  return Object.keys(a).length ? a : null
}

const submit = async () => {
  try {
    saving.value = true
    error.value = ''

    const addr = normalizeAddress()

    // image payload rules: set if selected, null if removed from existing, omit otherwise
    let imagePayload
    if (image.value && image.value.url) imagePayload = image.value
    else if (props.initial?.image) imagePayload = null

    const payload = {
      ...form.value,
      ...(addr !== null ? { address: addr } : { address: null }),
      ...(imagePayload !== undefined ? { image: imagePayload } : {})
    }

    if (props.initial) await updateChapter(props.initial.id, payload)
    else await createChapter(payload)

    emit('saved')
  } catch (e) {
    error.value = e?.response?.data?.message || e?.message || 'Failed'
  } finally {
    saving.value = false
  }
}
</script>
