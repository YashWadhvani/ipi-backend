<!-- pages/chapters/index.vue -->
<template>
    <section class="min-h-screen">
      <!-- Hero -->
      <div class="relative isolate overflow-hidden bg-gradient-to-r from-[#a70000] to-[#e60012] text-white">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight">IPI Chapters</h1>
          <p class="mt-2 text-white/90 max-w-2xl">Search, filter and explore chapters across IPI India.</p>
        </div>
        <div aria-hidden="true" class="absolute inset-y-0 right-0 -z-10 w-1/2 bg-[url('/textures/diagonal-noise.svg')] opacity-10"/>
      </div>
  
      <!-- Controls -->
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <!-- Left: Search + Filters -->
          <div class="flex flex-col sm:flex-row gap-3 w-full">
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                v-model="search"
                type="text"
                placeholder="Search by name, slug, city…"
                class="w-full rounded-md border border-[#ccc] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
  
            <div class="sm:w-48">
              <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                v-model="status"
                class="w-full rounded-md border border-[#ccc] px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="archived">Archived</option>
              </select>
            </div>
  
            <div class="sm:w-56">
              <label class="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
              <div class="flex gap-2">
                <select
                  v-model="sortBy"
                  class="w-full rounded-md border border-[#ccc] px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="name">Name</option>
                  <option value="createdAt">Created At</option>
                  <option value="updatedAt">Updated At</option>
                </select>
                <select
                  v-model="sortDir"
                  class="w-28 rounded-md border border-[#ccc] px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="desc">Desc</option>
                  <option value="asc">Asc</option>
                </select>
              </div>
            </div>
          </div>
  
          <!-- Right: Page size -->
          <div class="flex gap-2 sm:self-end">
            <label class="block text-sm font-medium text-gray-700 self-center">Rows:</label>
            <select
              v-model.number="pageSize"
              class="w-24 rounded-md border border-[#ccc] px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option :value="6">6</option>
              <option :value="12">12</option>
              <option :value="24">24</option>
            </select>
          </div>
        </div>
      </div>
  
      <!-- Content -->
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-10">
        <!-- Loading -->
        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="i in pageSize"
            :key="i"
            class="border border-[#ccc] rounded-md p-4 animate-pulse bg-white"
          >
            <div class="h-32 w-full bg-gray-200 rounded mb-3"></div>
            <div class="h-5 w-1/3 bg-gray-200 rounded mb-2"></div>
            <div class="h-4 w-1/2 bg-gray-200 rounded mb-1"></div>
            <div class="h-4 w-2/3 bg-gray-200 rounded mb-4"></div>
          </div>
        </div>
  
        <!-- Error -->
        <div v-else-if="error" class="text-red-600">
          {{ errorMessage }}
        </div>
  
        <!-- Empty -->
        <div v-else-if="chapters.length === 0" class="text-gray-600">
          No chapters found. Try adjusting your search or filters.
        </div>
  
        <!-- Grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <NuxtLink
            v-for="c in chapters"
            :key="c.id"
            :to="`/chapters/${c.id}`"
            class="group bg-white border border-[#ccc] rounded-md overflow-hidden hover:shadow-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <!-- Image -->
            <div class="aspect-[16/9] bg-gray-100 border-b border-[#eee] overflow-hidden">
              <img
                :src="chapterImage(c)"
                :alt="c.image?.alt || c.name || 'Chapter image'"
                class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
         
              />
            </div>
  
            <!-- Body -->
            <div class="p-4 flex flex-col gap-2">
              <header class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <h3 class="text-lg font-semibold leading-tight truncate group-hover:underline decoration-red-500 underline-offset-4">
                    {{ c.name || 'Untitled Chapter' }}
                  </h3>
                  <p v-if="c.slug" class="text-sm text-gray-500 truncate">{{ c.slug }}</p>
                </div>
                <span
                  :class="[
                    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize shrink-0',
                    badgeClass(c.status),
                  ]"
                >
                  {{ c.status }}
                </span>
              </header>
  
              <div class="text-sm text-gray-700 space-y-1">
                <p v-if="c.city?.name"><strong>City:</strong> {{ c.city.name }}<span v-if="c.city?.state">, {{ c.city.state }}</span></p>
                <p v-if="typeof c.membersCount === 'number'"><strong>Members:</strong> {{ c.membersCount }}</p>
                <p v-if="c.contactName"><strong>Contact:</strong> {{ c.contactName }}</p>
                <p v-if="formatAddress(c)" class="text-gray-600">
                  <strong>Address:</strong> <span class="break-words">{{ formatAddress(c) }}</span>
                </p>
              </div>
            </div>
          </NuxtLink>
        </div>
  
        <!-- Pagination -->
        <div v-if="total > 0" class="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p class="text-sm text-gray-600">
            Showing
            <span class="font-medium">{{ startItem }}</span>–
            <span class="font-medium">{{ endItem }}</span>
            of
            <span class="font-medium">{{ total }}</span>
          </p>
  
          <div class="flex items-center gap-2">
            <button
              class="px-3 py-2 rounded-md border border-[#ccc] bg-white disabled:opacity-50"
              :disabled="page === 1"
              @click="goToPage(page - 1)"
            >
              Prev
            </button>
            <span class="text-sm text-gray-700">Page {{ page }} / {{ totalPages }}</span>
            <button
              class="px-3 py-2 rounded-md border border-[#ccc] bg-white disabled:opacity-50"
              :disabled="page >= totalPages"
              @click="goToPage(page + 1)"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  // Services
  import { listChapters } from '@/services/chaptersServices'
  import { assetUrl } from '@/services/http' // to resolve backend asset path
  
  // Reactive state
  const search = ref('')
  const status = ref('') // '', 'active', 'inactive', 'archived'
  const sortBy = ref('name') // 'name' | 'createdAt' | 'updatedAt'
  const sortDir = ref('desc') // 'asc' | 'desc'
  const page = ref(1)
  const pageSize = ref(12)
  
  const loading = ref(false)
  const error = ref(null)
  const chapters = ref([])
  const total = ref(0)
  
  // Debounce search
  let searchTimer
  watch(search, () => {
    clearTimeout(searchTimer)
    searchTimer = setTimeout(() => {
      page.value = 1
      load()
    }, 300)
  })
  
  // Load on filters/sorts/page/pageSize change
  watch([status, sortBy, sortDir, page, pageSize], () => {
    load()
  })
  
  // Initial
  onMounted(() => {
    load()
  })
  
  async function load () {
    try {
      loading.value = true
      error.value = null
  
      // Backend: expecting { q, status, sortBy, sortDir, page, pageSize }
      const params = {
        q: search.value || undefined,
        status: status.value || undefined,
        sortBy: sortBy.value,
        sortDir: sortDir.value,
        page: page.value,
        pageSize: pageSize.value
      }
  
      const res = await listChapters(params)
      if (Array.isArray(res)) {
        chapters.value = res
        total.value = res.length
      } else {
        chapters.value = res.items ?? []
        total.value = Number(res.total ?? chapters.value.length)
      }
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }
  
  const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))
  const startItem = computed(() => (total.value === 0 ? 0 : (page.value - 1) * pageSize.value + 1))
  const endItem = computed(() => Math.min(total.value, page.value * pageSize.value))
  function goToPage (p) {
    page.value = Math.min(Math.max(1, p), totalPages.value)
  }
  
  const errorMessage = computed(() => {
    if (!error.value) return ''
    return error.value?.response?.data?.message || error.value.message || 'Failed to load chapters.'
  })
  
  function badgeClass (s) {
    switch ((s || '').toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800 ring-1 ring-inset ring-green-200'
      case 'inactive': return 'bg-yellow-100 text-yellow-800 ring-1 ring-inset ring-yellow-200'
      case 'archived': return 'bg-gray-200 text-gray-800 ring-1 ring-inset ring-gray-300'
      default: return 'bg-gray-100 text-gray-800 ring-1 ring-inset ring-gray-200'
    }
  }
  
  // Build absolute image URL (or placeholder)
  function chapterImage (c) {
    const url = c?.image?.url
    return url ? assetUrl(url) : ''
  }
  // function onImgError (e) {
  //   e.target.src = '/chapter-placeholder.jpg'
  // }
  
  // Nicely format address + city/state/pincode
  function formatAddress (c) {
    const a = c?.address || {}
    const parts = []
    if (a.line1) parts.push(a.line1)
    if (a.line2) parts.push(a.line2)
    if (a.area) parts.push(a.area)
    if (a.landmark) parts.push(`Landmark: ${a.landmark}`)
    const cityBits = []
    if (c?.city?.name) cityBits.push(c.city.name)
    if (c?.city?.state) cityBits.push(c.city.state)
    if (a.pincode) cityBits.push(a.pincode)
    if (cityBits.length) parts.push(cityBits.join(', '))
    return parts.join(', ')
  }
  </script>
  