<template>
  <div class="space-y-4">
    <!-- Topbar -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <h1 class="text-xl font-semibold">Chapters</h1>
        <span class="text-sm text-gray-500">({{ total }})</span>
      </div>

      <div class="flex items-center gap-2">
        <!-- New City -->
        <button
          @click="openCity = true"
          class="inline-flex items-center gap-2 rounded-md border border-[#ccc] bg-white px-3 py-2 hover:bg-gray-50 cursor-pointer"
          title="Create city"
        >
          <svg class="h-4 w-4 text-gray-800" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"/>
          </svg>
          <span>New City</span>
        </button>

        <!-- New Chapter -->
        <button
          @click="openCreate = true"
          class="inline-flex items-center gap-2 rounded-md bg-black text-white px-3 py-2 hover:opacity-90 cursor-pointer"
          title="Create chapter"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"/></svg>
          <span>New Chapter</span>
        </button>
      </div>
    </div>

    <!-- Filters row -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div class="flex items-center gap-2">
        <div class="relative">
          <input
            v-model="q"
            @input="debouncedFetch"
            placeholder="Search name / code / slug"
            class="pl-9 bg-white pr-3 py-2 w-72 border border-[#ccc] rounded-md focus:ring-2 focus:ring-black/10 focus:outline-none"
          />
          <svg class="absolute left-2.5 top-2.5 h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16a6.471 6.471 0 0 0 4.23-1.57l.27.28v.79L20 21.5 21.5 20l-6-6zM9.5 14A4.5 4.5 0 1 1 14 9.5 4.505 4.505 0 0 1 9.5 14z"/>
          </svg>
        </div>
        <button class="bg-white px-3 py-2 border border-[#ccc] rounded-md hover:bg-gray-50 cursor-pointer" @click="goFirstPageAndFetch">Search</button>
        <button class="bg-white px-3 py-2 border border-[#ccc] rounded-md hover:bg-gray-50 cursor-pointer" @click="reset" title="Clear filters">Reset</button>
      </div>

      <div class="flex items-center gap-2">
        <select v-model="cityId" @change="goFirstPageAndFetch" class="border border-[#ccc] rounded-md px-2 py-2 bg-white cursor-pointer">
          <option value="">All Cities</option>
          <option v-for="c in cities" :key="c.id" :value="c.id">
            {{ c.name }}<span v-if="c.state">, {{ c.state }}</span>
          </option>
        </select>

        <select v-model="status" @change="goFirstPageAndFetch" class="border border-[#ccc] rounded-md px-2 py-2 bg-white cursor-pointer">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
          <option value="pending">Pending</option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white border border-[#ccc] rounded-md overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-[#f1f8ff] backdrop-blur-sm sticky top-0 z-10 border-b border-[#ccc] text-left text-gray-600">
          <tr>
            <th class="p-3 font-bold">Name</th>
            <th class="p-3 font-bold">Code</th>
            <th class="p-3 font-bold">City</th>
            <th class="p-3 font-bold">Status</th>
            <th class="p-3 font-bold text-right">Actions</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-[#ccc]">
          <tr
            v-for="ch in items"
            :key="ch.id"
            class="hover:bg-gray-50 transition-colors cursor-pointer"
            @click="goView(ch)"
          >
            <td class="p-3">
              <div class="text-gray-900 font-medium">{{ ch.name }}</div>
              <div class="text-xs text-gray-500">/{{ ch.slug }}</div>
            </td>
            <td class="p-3 text-gray-700">{{ ch.code }}</td>
            <td class="p-3 text-gray-700">
              {{ ch.city?.name }}<span v-if="ch.city?.state">, {{ ch.city.state }}</span>
            </td>
            <td class="p-3">
              <span class="px-2 py-1 rounded text-xs capitalize" :class="badgeClass(ch.status)">
                {{ ch.status || '—' }}
              </span>
            </td>
            <td class="p-3">
              <div class="flex items-center justify-end">
                <button
                  @click.stop="edit(ch)"
                  class="p-2 rounded-md border border-[#ccc] hover:bg-gray-100 cursor-pointer"
                >
                  Edit
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="!loading && items.length === 0">
            <td colspan="5" class="p-8 text-center text-gray-500">No chapters found</td>
          </tr>
        </tbody>
      </table>

      <!-- Loading bar -->
      <div v-if="loading" class="h-0.5 bg-gradient-to-r from-transparent via-black/30 to-transparent animate-pulse" />
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between">
      <div class="text-sm text-gray-600">Total: {{ total }}</div>
      <div class="flex items-center gap-1">
        <button class="p-2 border border-[#ccc] rounded-md hover:bg-gray-50 cursor-pointer" :disabled="page <= 1" @click="prev" title="Prev">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <span class="px-2 text-sm">Page {{ page }}</span>
        <button class="p-2 border border-[#ccc] rounded-md hover:bg-gray-50 cursor-pointer" :disabled="page * pageSize >= total" @click="next" title="Next">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="m9 6 6 6-6 6"/></svg>
        </button>
      </div>
    </div>

    <!-- Modals -->
    <ChapterForm
      v-if="openCreate || toEdit"
      :initial="toEdit"
      :cities="cities"
      @close="closeForm"
      @saved="onSaved"
    />

    <CityForm
      v-if="openCity"
      :initial="toEditCity"
      @close="openCity = false"
      @saved="onCitySaved"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { listChapters } from '@/services/chaptersServices'
import { listCities } from '@/services/citiesServices'
import ChapterForm from '@/components/ChapterForm.vue'
import CityForm from '@/components/CityForm.vue'
import { useSnackbar } from '@/services/useSnackbar'

const { show } = useSnackbar()

function debounce (fn, delay) {
  let t
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay) }
}

definePageMeta({ layout: 'dashboard', middleware: ['auth-admin-client'] })

// Filters / paging
const q = ref('')
const cityId = ref('')
const status = ref('')
const page = ref(1)
const pageSize = ref(20)

// Data
const total = ref(0)
const items = ref([])
const cities = ref([])
const loading = ref(false)

// Modals
const openCreate = ref(false)
const toEdit = ref(null)
const openCity = ref(false)
const toEditCity = ref(null) // reserved if you later open edit city from here

// UI helpers
const badgeClass = (st) => {
  switch ((st || '').toLowerCase()) {
    case 'active': return 'bg-green-100 text-green-800 border border-green-200'
    case 'inactive': return 'bg-gray-100 text-gray-700 border border-gray-200'
    case 'suspended': return 'bg-red-100 text-red-800 border border-red-200'
    case 'pending': return 'bg-yellow-100 text-yellow-800 border border-yellow-200'
    default: return 'bg-gray-100 text-gray-700 border border-gray-200'
  }
}

const fetchCities = async () => {
  try {
    const data = await listCities()
    cities.value = Array.isArray(data) ? data : []
  } catch (e) {
    show(e?.response?.data?.message || 'Failed to load cities', 'error')
    // fallback: derive from current items
    const map = new Map()
    for (const ch of items.value) {
      const c = ch.city
      if (c?.id && !map.has(c.id)) {
        map.set(c.id, { id: c.id, name: c.name, state: c.state || '' })
      }
    }
    cities.value = Array.from(map.values())
  }
}

const fetchData = async () => {
  loading.value = true
  try {
    const res = await listChapters({
      q: q.value || undefined,
      cityId: cityId.value || undefined,
      status: status.value || undefined,
      page: page.value,
      pageSize: pageSize.value
    })
    items.value = res.items || []
    total.value = res.total || 0
  } catch (e) {
    show(e?.response?.data?.message || 'Failed to load chapters', 'error')
  } finally {
    loading.value = false
  }
}

const goFirstPageAndFetch = () => { page.value = 1; fetchData() }
const debouncedFetch = debounce(goFirstPageAndFetch, 350)

const reset = () => { q.value = ''; cityId.value = ''; status.value = ''; page.value = 1; fetchData() }

const prev = () => { if (page.value > 1) { page.value--; fetchData() } }
const next = () => { if (page.value * pageSize.value < total.value) { page.value++; fetchData() } }

const edit = (ch) => { toEdit.value = ch }
const closeForm = () => { openCreate.value = false; toEdit.value = null }
const onSaved = () => { show('Chapter saved', 'success'); closeForm(); fetchData() }

const goView = (ch) => navigateTo(`/dashboard/chapters/${ch.id}`)

const onCitySaved = async (city) => {
  openCity.value = false
  try {
    if (city && city.id) {
      // update dropdown immediately
      const map = new Map((cities.value || []).map(c => [c.id, c]))
      map.set(city.id, city)
      cities.value = Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name))
      // optionally auto-select & filter chapters for that city:
      cityId.value = city.id
      page.value = 1
      show('City saved', 'success')
      await fetchData()
    } else {
      await fetchCities()
      show('City saved', 'success')
    }
  } catch (e) {
    show(e?.response?.data?.message || 'Failed to refresh cities', 'error')
  }
}

onMounted(async () => {
  await fetchData()
  await fetchCities()
})
</script>
