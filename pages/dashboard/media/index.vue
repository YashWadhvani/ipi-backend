<template>
    <section class="p-6 space-y-4">
      <div class="flex items-center gap-2">
        <input v-model="q" placeholder="Search…" class="border px-3 py-2 rounded w-64" />
        <select v-model="kind" class="border px-3 py-2 rounded">
          <option value="">All</option>
          <option>IMAGE</option>
          <option>VIDEO</option>
          <option>FILE</option>
        </select>
        <button @click="page=1; load()" class="border px-3 py-2 rounded">Search</button>
        <label class="ml-auto inline-flex items-center gap-2 cursor-pointer">
          <span class="px-3 py-2 border rounded bg-gray-50">Upload</span>
          <input type="file" class="hidden" @change="onUpload" />
        </label>
      </div>
  
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
        <div v-for="m in data.items" :key="m.id" class="border rounded overflow-hidden">
          <img
            v-if="m.kind==='IMAGE'"
            :src="toSrc(m.url)"
            class="aspect-square object-cover w-full"
            alt=""
          />
          <div v-else class="aspect-square grid place-items-center text-xs text-gray-600">
            <div class="p-2 text-center">
              <div class="font-medium">{{ m.kind }}</div>
              <div class="truncate w-24 mx-auto">{{ m.originalName }}</div>
            </div>
          </div>
  
          <div class="p-2 text-xs">
            <div class="truncate font-medium">{{ m.title || m.originalName }}</div>
            <div class="text-gray-500 truncate">{{ m.mimeType }}</div>
          </div>
  
          <div class="p-2 flex gap-2">
            <button class="px-2 py-1 border rounded text-xs" @click="editItem = { ...m }">Edit</button>
            <button class="px-2 py-1 border rounded text-xs text-red-600" @click="remove(m)">Delete</button>
            <!-- (optional) open file in new tab without using the router -->
            <a
              class="px-2 py-1 border rounded text-xs ml-auto"
              :href="toSrc(m.url)"
              target="_blank"
              rel="noopener"
            >Open</a>
          </div>
        </div>
      </div>
  
      <div class="flex justify-center" v-if="data.total > page*pageSize">
        <button @click="page++; load()" class="px-4 py-2 border rounded">Load more</button>
      </div>
  
      <!-- Edit drawer/dialog -->
      <div v-if="editItem" class="fixed inset-0 z-50">
        <div class="absolute inset-0 bg-black/40" @click="editItem=null"></div>
        <div class="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl p-6 space-y-3">
          <h3 class="text-lg font-semibold">Edit Media</h3>
          <img
            v-if="editItem.kind==='IMAGE'"
            :src="toSrc(editItem.url)"
            class="rounded border max-h-48 object-contain"
            alt=""
          />
          <input v-model="editItem.title" placeholder="Title" class="border px-3 py-2 rounded w-full" />
          <input v-model="editItem.alt" placeholder="Alt text" class="border px-3 py-2 rounded w-full" />
          <input v-model="editItem.caption" placeholder="Caption" class="border px-3 py-2 rounded w-full" />
          <textarea v-model="editItem.description" placeholder="Description" class="border px-3 py-2 rounded w-full h-24"></textarea>
          <div class="flex gap-2">
            <button @click="saveMeta" class="px-3 py-2 rounded bg-black text-white">Save</button>
            <button @click="editItem=null" class="px-3 py-2 border rounded">Cancel</button>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  definePageMeta({ layout: 'dashboard', middleware: ['auth-admin-client'] })
  
  import { listMedia, uploadMedia, updateMedia, deleteMedia } from '@/services/useMediaService'
  import { assetUrl } from '@/services/http'
  
  const q = ref('')
  const kind = ref('')
  const page = ref(1)
  const pageSize = ref(40)
  const data = ref({ items: [], total: 0 })
  const loading = ref(false)
  const editItem = ref(null)
  
  const toSrc = (p) => assetUrl(p)
  
  const load = async () => {
    loading.value = true
    data.value = await listMedia({ q: q.value, kind: kind.value, page: page.value, pageSize: pageSize.value })
    loading.value = false
  }
  await load()
  
  const onUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    await uploadMedia(file)
    await load()
  }
  
  const saveMeta = async () => {
    await updateMedia(editItem.value.id, {
      title: editItem.value.title,
      alt: editItem.value.alt,
      caption: editItem.value.caption,
      description: editItem.value.description,
    })
    editItem.value = null
    await load()
  }
  
  const remove = async (m) => {
    if (!confirm('Delete this media?')) return
    await deleteMedia(m.id)
    await load()
  }
  </script>
  