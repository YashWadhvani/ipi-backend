<template>
  <section class="min-h-screen">
    <!-- Hero -->
    <div class="relative isolate overflow-hidden bg-gradient-to-r from-[#a70000] to-[#e60012] text-white">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight">IPI Events</h1>
        <p class="mt-2 text-white/90 max-w-2xl">
          Search, filter and explore upcoming and past events.
        </p>
      </div>
    </div>

    <!-- Controls -->
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div class="flex flex-col sm:flex-row gap-3 w-full">
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              v-model="search"
              type="text"
              placeholder="Search by title, chapter, city…"
              class="w-full rounded-md border border-[#ccc] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div class="sm:w-48">
            <label class="block text-sm font-medium text-gray-700 mb-1">When</label>
            <select
              v-model="when"
              class="w-full rounded-md border border-[#ccc] px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">All</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>
          </div>

          <div class="sm:w-56">
            <label class="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
            <div class="flex gap-2">
              <select
                v-model="sortBy"
                class="w-full rounded-md border border-[#ccc] px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="startAt">Start date</option>
                <option value="createdAt">Created At</option>
                <option value="updatedAt">Updated At</option>
                <option value="title">Title</option>
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
      <!-- Grid -->
      <div v-if="!loading && events.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <NuxtLink
          v-for="e in events"
          :key="e.id"
          :to="`/events-ipi/${e.slug || e.id}`"
          class="group bg-white border border-[#ccc] rounded-md overflow-hidden hover:shadow-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-red-500 relative"
        >
          <!-- SOLD OUT BADGE -->
          <span
            v-if="e.isFull"
            class="absolute top-3 right-3 z-10 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full"
          >
            Sold Out
          </span>

          <!-- Image -->
          <div
            v-if="getEventImageUrl(e)"
            class="aspect-[16/9] bg-gray-100 border-b border-[#eee] overflow-hidden"
          >
            <img
              :src="getEventImageUrl(e)"
              :alt="e.name || 'Event image'"
              class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </div>

          <!-- Body -->
          <div class="p-4 flex flex-col gap-3">
            <header class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <h3 class="text-lg font-semibold truncate group-hover:underline decoration-red-500 underline-offset-4">
                  {{ e.title || e.name || 'Untitled Event' }}
                </h3>
                <p class="text-sm text-gray-500 truncate">
                  {{ eventDateLine(e) }}
                </p>
              </div>
              <span
                class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize shrink-0"
                :class="whenBadgeClass(e)"
              >
                {{ whenLabel(e) }}
              </span>
            </header>

            <div class="text-sm text-gray-700 space-y-1">
              <p v-if="eventLocation(e)">
                <strong>Location:</strong> {{ eventLocation(e) }}
              </p>
              <p v-if="e.chapter?.name">
                <strong>Chapter:</strong> {{ e.chapter.name }}
              </p>
              <p v-if="typeof e.registrationCount === 'number'">
                <strong>Registrations:</strong> {{ e.registrationCount }}
              </p>
            </div>

            <!-- CAPACITY BAR -->
            <div v-if="typeof e.capacity === 'number'" class="pt-2">
              <div class="flex justify-between text-xs text-gray-600 mb-1">
                <span>
                  {{ e.remainingQty }} / {{ e.capacity }} seats left
                </span>
                <span>
                  {{ Math.round((e.bookedQty / e.capacity) * 100) }}%
                </span>
              </div>

              <div class="w-full h-2 rounded bg-gray-200 overflow-hidden">
                <div
                  class="h-full transition-all"
                  :class="e.isFull ? 'bg-red-600' : 'bg-green-600'"
                  :style="{ width: `${Math.min((e.bookedQty / e.capacity) * 100, 100)}%` }"
                />
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

  
  <script setup>
  // Services
  import { listEvents } from '@/services/eventsServices'
  import { assetUrl } from '@/services/http'
  
  // Reactive state
  const search = ref('')
  const when = ref('upcoming')
  const sortBy = ref('startAt')
  const sortDir = ref('desc')
  const page = ref(1)
  const pageSize = ref(12)
  
  const loading = ref(false)
  const error = ref(null)
  const events = ref([])
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
  watch([when, sortBy, sortDir, page, pageSize], () => {
    load()
  })
  
  onMounted(() => {
    load()
  })
  
  async function load () {
    try {
      loading.value = true
      error.value = null
  
      const params = {
        q: search.value || undefined,
        sortBy: sortBy.value,
        sortDir: sortDir.value,
        page: page.value,
        pageSize: pageSize.value,

        // 🔥 FIX: map `when` → backend flags
        ...(when.value === 'upcoming' && { upcoming: 'true' }),
        ...(when.value === 'past' && { upcoming: 'false' }),
      }

      const res = await listEvents(params)
  
      // 🔥 THIS LOG WILL ALWAYS SHOW
      console.log('EVENT LIST API RESPONSE →', res)
  
      if (Array.isArray(res)) {
        events.value = res
        total.value = res.length
      } else {
        events.value = res.items ?? []
        total.value = Number(res.total ?? events.value.length)
      }
  
      // 🔥 CONFIRM EVENTS ARE SET
      console.log('EVENTS SET →', events.value)
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }
  
  const totalPages = computed(() =>
    Math.max(1, Math.ceil(total.value / pageSize.value))
  )
  const startItem = computed(() =>
    total.value === 0 ? 0 : (page.value - 1) * pageSize.value + 1
  )
  const endItem = computed(() =>
    Math.min(total.value, page.value * pageSize.value)
  )
  
  function goToPage (p) {
    page.value = Math.min(Math.max(1, p), totalPages.value)
  }
  
  const errorMessage = computed(() => {
    if (!error.value) return ''
    return (
      error.value?.response?.data?.message ||
      error.value.message ||
      'Failed to load events.'
    )
  })
  
  /* -----------------------------------
     IMAGE HANDLING (FIXED)
  ----------------------------------- */
  function getEventImageUrl (e) {
    if (!e) return null
  
    // 🔥 LOG ONCE PER EVENT
    if (!e.__logged) {
      console.log('CHECKING EVENT FOR IMAGE →', e)
      e.__logged = true
    }
  
    if (Array.isArray(e.photos) && e.photos.length > 0 && e.photos[0]?.url) {
      return assetUrl(e.photos[0].url)
    }
  
    return null
  }
  
  /* -----------------------------------
     HELPERS (UNCHANGED)
  ----------------------------------- */
  function firstDate (e) {
    return e?.startAt || e?.startsAt || e?.startDate || e?.start_time || e?.start || null
  }
  function lastDate (e) {
    return e?.endAt || e?.endsAt || e?.endDate || e?.end_time || e?.end || null
  }
  function eventDateLine (e) {
    const s = firstDate(e) ? new Date(firstDate(e)) : null
    const t = lastDate(e) ? new Date(lastDate(e)) : null
    if (!s && !t) return 'Date TBA'
    const dOpts = { day: '2-digit', month: 'short', year: 'numeric' }
    const timeOpts = { hour: '2-digit', minute: '2-digit' }
    if (s && t) {
      const sameDay = s.toDateString() === t.toDateString()
      if (sameDay) {
        return `${s.toLocaleDateString(undefined, dOpts)}, ${s.toLocaleTimeString(undefined, timeOpts)}–${t.toLocaleTimeString(undefined, timeOpts)}`
      }
      return `${s.toLocaleDateString(undefined, dOpts)} – ${t.toLocaleDateString(undefined, dOpts)}`
    }
    return s
      ? s.toLocaleDateString(undefined, dOpts)
      : t.toLocaleDateString(undefined, dOpts)
  }
  
  function eventLocation (e) {
    const a = e?.venue || e?.address || {}
    const parts = []
    if (a.line1) parts.push(a.line1)
    if (a.line2) parts.push(a.line2)
    if (a.area) parts.push(a.area)
    const cityBits = []
    if (a.city) cityBits.push(a.city)
    if (a.state) cityBits.push(a.state)
    if (a.pincode) cityBits.push(a.pincode)
    const cityObj = e?.city || e?.chapter?.city
    if (!a.city && cityObj?.name) {
      const extra = [cityObj.name, cityObj.state].filter(Boolean).join(', ')
      if (extra) parts.push(extra)
    } else if (cityBits.length) {
      parts.push(cityBits.join(', '))
    }
    return parts.join(', ')
  }
  
  function whenLabel (e) {
    const now = Date.now()
    const s = firstDate(e) ? new Date(firstDate(e)).getTime() : null
    const t = lastDate(e) ? new Date(lastDate(e)).getTime() : null
    if (s && t) {
      if (now < s) return 'Upcoming'
      if (now >= s && now <= t) return 'Live'
      return 'Past'
    }
    if (s) return now < s ? 'Upcoming' : 'Past'
    return '—'
  }
  
  function whenBadgeClass (e) {
    const wl = whenLabel(e).toLowerCase()
    if (wl === 'upcoming') return 'bg-amber-100 text-amber-800 ring-1 ring-inset ring-amber-200'
    if (wl === 'live') return 'bg-green-100 text-green-800 ring-1 ring-inset ring-green-200'
    if (wl === 'past') return 'bg-gray-200 text-gray-800 ring-1 ring-inset ring-gray-300'
    return 'bg-gray-100 text-gray-800 ring-1 ring-inset ring-gray-200'
  }
  </script>
  
  