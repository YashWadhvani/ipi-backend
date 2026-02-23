<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div class="w-full max-w-md bg-white border border-[#ccc] rounded-lg shadow-lg">
        <div class="px-4 py-3 border-b border-[#eee] flex items-center justify-between">
          <h3 class="text-lg font-semibold">{{ initial ? 'Edit City' : 'New City' }}</h3>
          <button class="p-2 rounded hover:bg-gray-100" @click="$emit('close')" title="Close">✕</button>
        </div>
  
        <form @submit.prevent="submit" class="p-4 space-y-3">
          <div>
            <label class="block text-sm text-gray-700 mb-1">City Name</label>
            <input v-model.trim="name" required class="w-full border border-[#ccc] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10" />
          </div>
  
          <div>
            <label class="block text-sm text-gray-700 mb-1">State (optional)</label>
            <input v-model.trim="state" class="w-full border border-[#ccc] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10" />
          </div>
  
          <div>
            <label class="block text-sm text-gray-700 mb-1">Country</label>
            <input v-model.trim="country" class="w-full border border-[#ccc] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10" />
          </div>
  
          <div class="flex items-center justify-between pt-2">
            <button
              v-if="initial"
              type="button"
              class="px-3 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50"
              :disabled="loading"
              @click="askDelete"
              title="Delete city"
            >
              Delete
            </button>
  
            <div class="ml-auto flex items-center gap-2">
              <button type="button" class="px-3 py-2 border border-[#ccc] rounded-md hover:bg-gray-50" @click="$emit('close')">Cancel</button>
              <button type="submit" class="px-3 py-2 bg-black text-white rounded-md" :disabled="loading">
                {{ loading ? (initial ? 'Saving…' : 'Creating…') : (initial ? 'Save' : 'Create') }}
              </button>
            </div>
          </div>
        </form>
      </div>
  
      <!-- confirm delete -->
      <div v-if="confirmOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div class="bg-white border border-[#ccc] rounded-md p-4 w-full max-w-sm">
          <div class="text-sm text-gray-700 mb-4">
            Delete city “{{ initial?.name }}”?
            <div class="mt-2 text-xs text-gray-500">
              If the city has chapters, deletion is blocked unless forced. Use “Force delete” to cascade and delete chapters.
            </div>
          </div>
          <div class="flex items-center justify-end gap-2">
            <button class="px-3 py-2 border border-[#ccc] rounded-md" @click="confirmOpen=false">Cancel</button>
            <button class="px-3 py-2 border rounded-md hover:bg-gray-50" :disabled="loading" @click="doDelete(false)">Delete</button>
            <button class="px-3 py-2 bg-red-600 text-white rounded-md hover:opacity-90" :disabled="loading" @click="doDelete(true)">Force delete</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watchEffect } from 'vue'
  import { createCity, updateCity, deleteCity } from '@/services/citiesServices'
  import { useSnackbar } from '@/services/useSnackbar'
  
  const { show } = useSnackbar()
  
  const props = defineProps({
    initial: { type: Object, default: null }
  })
  const emit = defineEmits(['close', 'saved'])
  
  const name = ref('')
  const state = ref('')
  const country = ref('India')
  const loading = ref(false)
  const confirmOpen = ref(false)
  
  watchEffect(() => {
    if (props.initial) {
      name.value = props.initial.name || ''
      state.value = props.initial.state || ''
      country.value = props.initial.country || 'India'
    } else {
      name.value = ''
      state.value = ''
      country.value = 'India'
    }
  })
  
  const submit = async () => {
    if (!name.value.trim()) return
    loading.value = true
    try {
      const payload = { name: name.value.trim(), state: state.value.trim() || null, country: country.value.trim() || 'India' }
      const city = props.initial
        ? await updateCity(props.initial.id, payload)
        : await createCity(payload)
  
      show(props.initial ? 'City updated' : 'City created', 'success')
      emit('saved', city) // return the created/updated city up to parent
    } catch (e) {
      show(e?.response?.data?.message || 'Failed to save city', 'error')
    } finally {
      loading.value = false
    }
  }
  
  const askDelete = () => { confirmOpen.value = true }
  
  const doDelete = async (force) => {
    if (!props.initial?.id) return
    loading.value = true
    try {
      await deleteCity(props.initial.id, { force })
      show(force ? 'City force-deleted' : 'City deleted', 'success')
      emit('saved') // parent will refetch cities
    } catch (e) {
      show(e?.response?.data?.message || 'Failed to delete city', 'error')
    } finally {
      loading.value = false
      confirmOpen.value = false
    }
  }
  </script>
  