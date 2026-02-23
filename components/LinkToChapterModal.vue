<template>
    <div class="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div class="bg-white w-full max-w-lg rounded-xl border border-[#ccc]">
        <div class="px-4 py-3 border-b border-[#eee] flex justify-between items-center">
          <h3 class="text-lg font-semibold">Link “{{ member.name }}” to a Chapter</h3>
          <button class="p-2 rounded hover:bg-gray-100" @click="$emit('close')">✕</button>
        </div>
  
        <div class="p-4 space-y-3">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div class="sm:col-span-2 relative">
              <input
                v-model="q"
                @input="debouncedSearch"
                placeholder="Search chapters by name/code/slug"
                class="w-full border border-[#ccc] rounded px-3 py-2 pl-9 focus:ring-2 focus:ring-black/10 focus:outline-none"
              />
              <svg class="absolute left-2.5 top-2.5 h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16a6.471 6.471 0 0 0 4.23-1.57l.27.28v.79L20 21.5 21.5 20l-6-6zM9.5 14A4.5 4.5 0 1 1 14 9.5 4.505 4.505 0 0 1 9.5 14z"/>
              </svg>
            </div>
  
            <select v-model="role" class="border border-[#ccc] rounded px-2 py-2 bg-white cursor-pointer">
              <option value="MEMBER">Member</option>
              <option value="LEADERSHIP">Leadership</option>
            </select>
          </div>
  
          <div class="max-h-64 overflow-auto border border-[#ccc] rounded">
            <button
              v-for="ch in results"
              :key="ch.id"
              class="w-full text-left px-3 py-2 hover:bg-gray-50 border-b"
              @click="choose(ch)"
            >
              <div class="font-medium text-gray-900">{{ ch.name }} ({{ ch.code }})</div>
              <div class="text-sm text-gray-600">
                {{ ch.city?.name }}<span v-if="ch.city?.state">, {{ ch.city.state }}</span>
                <span class="text-xs text-gray-500"> — /{{ ch.slug }}</span>
              </div>
            </button>
            <div v-if="!loading && results.length === 0" class="px-3 py-6 text-center text-gray-500">No matches</div>
            <div v-if="loading" class="px-3 py-6 text-center text-gray-500">Searching…</div>
          </div>
  
          <div class="flex items-center justify-end gap-2">
            <button class="px-3 py-2 border border-[#ccc] rounded hover:bg-gray-50" @click="$emit('close')">Close</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { listChapters } from '@/services/chaptersServices'
  import { addMemberToChapter } from '@/services/membersServices'
  import { useSnackbar } from '@/services/useSnackbar'
  
  const props = defineProps({ member: { type: Object, required: true } })
  const emit = defineEmits(['close', 'linked'])
  const { show } = useSnackbar()
  
  const q = ref('')
  const role = ref('MEMBER')
  const results = ref([])
  const loading = ref(false)
  
  function debounce (fn, delay) {
    let t
    return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), delay) }
  }
  const debouncedSearch = debounce(async () => {
    loading.value = true
    try {
      const res = await listChapters({ q: q.value || undefined, pageSize: 20 })
      results.value = res.items || []
    } catch (e) {
      show(e?.response?.data?.message || 'Failed to search chapters', 'error')
    } finally {
      loading.value = false
    }
  }, 300)
  
  const choose = async (ch) => {
    try {
      await addMemberToChapter(props.member.id, { chapterId: ch.id, role: role.value })
      show(`Linked to ${ch.name}`, 'success')
      emit('linked')
    } catch (e) {
      show(e?.response?.data?.message || 'Failed to link member', 'error')
    }
  }
  </script>
  