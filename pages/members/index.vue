<template>
    <div>
      <h1 class="text-xl font-semibold mb-4">Members</h1>
  
      <div class="mb-4 grid grid-cols-1 md:grid-cols-5 gap-3">
        <input v-model="q" placeholder="Search name/company" class="border rounded px-3 py-2" />
        <input v-model="city" placeholder="City" class="border rounded px-3 py-2" />
        <input v-model="state" placeholder="State" class="border rounded px-3 py-2" />
        <input v-model="industry" placeholder="Industry" class="border rounded px-3 py-2" />
        <select v-model="isActive" class="border rounded px-3 py-2">
          <option value="">Active?</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>
  
      <div class="flex gap-2 mb-4">
        <button class="px-3 py-2 rounded bg-black text-white" @click="refetch()">Search</button>
        <button class="px-3 py-2 rounded border" @click="reset()">Reset</button>
      </div>
  
      <div v-if="isLoading">Loading…</div>
  
      <div v-else class="bg-white rounded-xl shadow divide-y">
        <div v-for="m in data?.items || []" :key="m.id" class="p-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="font-medium">{{ m.name }}</div>
              <div class="text-sm text-gray-600">
                {{ m.company || '-' }} • {{ m.city || '-' }}, {{ m.state || '-' }} • {{ m.industry || '-' }}
              </div>
            </div>
            <div class="text-sm">
              <span :class="m.isActive ? 'text-green-600' : 'text-red-600'">
                {{ m.isActive ? 'Active' : 'Inactive' }}
              </span>
            </div>
          </div>
        </div>
      </div>
  
      <div class="mt-4 flex items-center justify-end gap-2">
        <button class="border rounded px-3 py-1" :disabled="page<=1" @click="page--, refetch()">Prev</button>
        <span class="text-sm">Page {{ page }} of {{ totalPages }}</span>
        <button class="border rounded px-3 py-1" :disabled="page>=totalPages" @click="page++, refetch()">Next</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useQuery } from '@tanstack/vue-query'
  const { $api } = useNuxtApp()
  
  const page = ref(1)
  const pageSize = ref(10)
  const q = ref('')
  const city = ref('')
  const state = ref('')
  const industry = ref('')
  const isActive = ref('')
  
  const params = computed(() => {
    const p = { page: page.value, pageSize: pageSize.value, sortBy: 'name', sortDir: 'asc' }
    if (q.value) p.q = q.value
    if (city.value) p.city = city.value
    if (state.value) p.state = state.value
    if (industry.value) p.industry = industry.value
    if (isActive.value !== '') p.isActive = isActive.value
    return p
  })
  
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['members', params],
    queryFn: async () => (await $api.get('/members', { params: params.value })).data,
    keepPreviousData: true,
    staleTime: 60000,
  })
  
  const totalPages = computed(() => Math.max(1, Math.ceil((data.value?.total || 0) / pageSize.value)))
  function reset() {
    q.value = city.value = state.value = industry.value = ''
    isActive.value = ''
    page.value = 1
    refetch()
  }
  </script>
  