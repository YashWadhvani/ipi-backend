<template>
    <teleport to="body">
      <div v-if="open" class="fixed inset-0 z-50">
        <div class="absolute inset-0 bg-black/50" @click="open = false"></div>
  
        <div class="absolute inset-6 md:inset-10 bg-white rounded-xl shadow-xl flex flex-col overflow-hidden">
          <!-- Header -->
          <div class="p-4 border-b flex items-center gap-3">
            <input v-model="q" placeholder="Search media…" class="border px-3 py-2 rounded w-64" />
            <select v-model="kind" class="border px-3 py-2 rounded">
              <option value="">All</option>
              <option>IMAGE</option>
              <option>VIDEO</option>
              <option>FILE</option>
            </select>
            <button @click="() => { page=1; load(true) }" class="border px-3 py-2 rounded">Search</button>
            <div class="ml-auto flex items-center gap-3">
              <label class="inline-flex items-center gap-2 cursor-pointer">
                <span class="px-3 py-2 border rounded bg-gray-50">Upload</span>
                <input type="file" class="hidden" @change="onUpload" />
              </label>
              <button @click="open = false" class="px-3 py-2 border rounded">Close</button>
              <button @click="choose" class="px-3 py-2 rounded bg-black text-white" :disabled="!selected.length">Choose</button>
            </div>
          </div>
  
          <!-- Grid -->
          <div class="flex-1 overflow-auto p-4">
            <div v-if="!items.length && !loading" class="text-gray-500">No media found.</div>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
              <button
                v-for="m in items"
                :key="m.id"
                class="relative group border rounded overflow-hidden"
                :class="isSelected(m) ? 'ring-2 ring-black' : ''"
                @click="toggleSelect(m)"
                title="Click to select"
              >
                <img
                  v-if="m.kind === 'IMAGE'"
                  :src="toSrc(m.url)"
                  alt=""
                  class="aspect-square object-cover w-full"
                />
                <div v-else class="aspect-square grid place-items-center text-xs text-gray-600">
                  <div class="p-2 text-center">
                    <div class="font-medium">{{ m.kind }}</div>
                    <div class="truncate w-24 mx-auto">{{ m.originalName }}</div>
                  </div>
                </div>
                <div class="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate">
                  {{ m.title || m.originalName }}
                </div>
              </button>
            </div>
  
            <div class="mt-4 flex justify-center" v-if="canLoadMore">
              <button @click="loadMore" class="px-4 py-2 border rounded" :disabled="loading">
                {{ loading ? 'Loading…' : 'Load more' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </template>
  
  <script setup>
  import { listMedia, uploadMedia } from '@/services/useMediaService'
  import { assetUrl } from '@/services/http'
  
  const props = defineProps({
    modelValue: { type: Boolean, default: false },
    multiple: { type: Boolean, default: false },
  })
  const emit = defineEmits(['update:modelValue', 'select'])
  
  const open = computed({
    get: () => props.modelValue,
    set: (v) => emit('update:modelValue', v),
  })
  
  const q = ref('')
  const kind = ref('IMAGE') // default to images for image picker
  const page = ref(1)
  const pageSize = ref(30)
  const items = ref([])
  const total = ref(0)
  const loading = ref(false)
  const selected = ref([])
  
  const toSrc = (path) => assetUrl(path)
  
  const load = async (reset = false) => {
    loading.value = true
    const resp = await listMedia({ q: q.value, kind: kind.value, page: page.value, pageSize: pageSize.value })
    items.value = reset ? resp.items : [...items.value, ...resp.items]
    total.value = resp.total
    loading.value = false
  }
  
  watch(open, (v) => { if (v) { page.value = 1; load(true) } })
  
  const toggleSelect = (m) => {
    if (!props.multiple) selected.value = [m]
    else {
      const i = selected.value.findIndex((x) => x.id === m.id)
      if (i >= 0) selected.value.splice(i, 1)
      else selected.value.push(m)
    }
  }
  
  const isSelected = (m) => selected.value.some((x) => x.id === m.id)
  
  const choose = () => {
    if (!selected.value.length) return
    emit('select', props.multiple ? selected.value : selected.value[0])
    open.value = false
  }
  
  const onUpload = async (evt) => {
    const file = evt.target.files?.[0]
    if (!file) return
    const created = await uploadMedia(file)
    // put new first
    items.value.unshift(created)
  }
  
  const canLoadMore = computed(() => items.value.length < total.value)
  const loadMore = async () => {
    if (loading.value || !canLoadMore.value) return
    page.value += 1
    await load(false)
  }
  </script>
  