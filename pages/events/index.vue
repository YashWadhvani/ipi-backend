<template>
  <div class="space-y-4">
    <!-- TOP BAR -->
    <div class="flex flex-wrap items-center gap-2">
      <button
        v-if="canCreateEvent"
        @click="goCreate"
        class="inline-flex items-center gap-2 rounded-md bg-black text-white px-3 py-2 hover:opacity-90 cursor-pointer"
      >
        + Create Event
      </button>

      <input
        v-model="q"
        placeholder="Search events…"
        class="bg-white px-3 py-2 w-64 border border-[#ccc] rounded-md"
      />

      <select
        v-model="scopeFilter"
        class="bg-white px-3 py-2 border border-[#ccc] rounded-md text-sm cursor-pointer"
      >
        <option value="ALL">All Events</option>
        <option value="GLOBAL">Global Events</option>
        <option value="CHAPTER">Chapter Events</option>
      </select>

      <label
        class="inline-flex items-center gap-2 text-sm bg-white border border-[#ccc] rounded-md px-2 py-2 cursor-pointer"
      >
        <input type="checkbox" v-model="upcoming" />
        Upcoming only
      </label>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="i in 6" :key="i" class="bg-white border rounded p-4 animate-pulse h-56" />
    </div>

    <!-- EVENTS GRID -->
    <div v-else-if="items.length" class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="ev in items"
        :key="ev.id"
        class="bg-white border border-[#ccc] rounded-md p-4 flex flex-col gap-3"
      >
        <!-- TITLE -->
        <div class="flex items-start justify-between gap-2">
          <div class="font-semibold text-lg line-clamp-2">
            {{ ev.name }}
          </div>

          <div class="flex flex-col items-end gap-1">
            <span
              class="text-[11px] px-2 py-0.5 rounded-full"
              :class="ev.scope === 'GLOBAL'
                ? 'bg-purple-100 text-purple-700'
                : 'bg-blue-100 text-blue-700'"
            >
              {{ ev.scope }}
            </span>

            <span
              v-if="isRegistered(ev)"
              class="text-[11px] px-2 py-0.5 rounded-full bg-green-100 text-green-700"
            >
              Registered
            </span>
          </div>
        </div>

        <!-- DATE -->
        <div class="text-sm text-gray-600">
          {{ formatRange(ev.startsAt, ev.endsAt) }}
        </div>

        <!-- VENUE -->
        <div v-if="ev.venue" class="text-sm text-gray-700">
          📍 {{ ev.venue }}
        </div>

        <!-- COST -->
        <div class="text-sm">
          <span class="font-medium">Cost:</span>
          <span v-if="ev.costPerPerson">₹{{ ev.costPerPerson }} / person</span>
          <span v-else class="text-green-700 font-medium">Free</span>
        </div>

        <!-- CHAPTER -->
        <div v-if="ev.scope === 'CHAPTER' && ev.chapter?.name" class="text-sm text-gray-700">
          🏷 Chapter: <span class="font-medium">{{ ev.chapter.name }}</span>
        </div>

        <!-- CAPACITY -->
        <div v-if="ev.capacity" class="space-y-1">
          <div class="flex justify-between text-xs text-gray-600">
            <span>{{ bookedCount(ev) }} / {{ ev.capacity }} booked</span>
            <span v-if="isFull(ev)" class="text-red-600 font-medium">Sold Out</span>
          </div>

          <div class="h-2 w-full bg-gray-200 rounded">
            <div
              class="h-2 rounded transition-all"
              :class="capacityColor(ev)"
              :style="{ width: capacityPercent(ev) + '%' }"
            />
          </div>
        </div>

        <!-- DESCRIPTION -->
        <div v-if="ev.description" class="text-sm text-gray-700 line-clamp-2">
          {{ ev.description }}
        </div>

        <!-- ACTIONS -->
        <div class="flex gap-2 mt-auto pt-2">
          <button
            @click="goView(ev.id)"
            :disabled="isRegistered(ev)"
            class="flex-1 rounded px-3 py-2 text-sm"
            :class="isRegistered(ev)
              ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
              : 'bg-black text-white hover:opacity-90'"
          >
            {{ isRegistered(ev) ? 'Registered' : 'Register' }}
          </button>

          <button
            v-if="canManageEvent(ev)"
            @click="goEdit(ev.id)"
            class="border rounded px-2 py-1 hover:bg-gray-50"
          >
            ✏️
          </button>

          <button
            v-if="canManageEvent(ev)"
            @click="goRegistrations(ev.id)"
            class="border rounded px-2 py-1 hover:bg-gray-50"
          >
            📋
          </button>

          <button
            v-if="canManageEvent(ev)"
            @click="askDelete(ev)"
            class="border rounded px-2 py-1 hover:bg-red-50 text-red-600"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>

    <!-- EMPTY -->
    <div v-else class="bg-white border rounded p-6 text-center text-gray-500">
      No events found.
    </div>

    <!-- PAGINATION -->
    <div v-if="total > pageSize" class="flex justify-center gap-2 pt-4">
      <button @click="prevPage" :disabled="page === 1" class="px-3 py-1 border rounded">
        ←
      </button>

      <button
        v-for="p in visiblePages"
        :key="p"
        @click="goPage(p)"
        class="px-3 py-1 border rounded"
        :class="p === page ? 'bg-black text-white' : ''"
      >
        {{ p }}
      </button>

      <button
        @click="nextPage"
        :disabled="page * pageSize >= total"
        class="px-3 py-1 border rounded"
      >
        →
      </button>
    </div>

    <ConfirmDialog
      v-model="confirmOpen"
      title="Delete Event"
      :message="`Delete “${eventToDelete?.name}”?`"
      confirmText="Delete"
      cancelText="Cancel"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
definePageMeta({ layout: 'member', middleware: ['member-auth'] })

import { ref, computed, watch, onMounted, onActivated } from 'vue'
import { navigateTo } from '#app'
import { listEvents, deleteEvent } from '@/services/eventsServices'
import { http } from '@/services/http'
import { useSnackbar } from '@/services/useSnackbar'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

const { show } = useSnackbar()

const q = ref('')
const upcoming = ref(true)
const scopeFilter = ref('ALL')
const page = ref(1)
const pageSize = ref(9)
const total = ref(0)
const items = ref([])
const loading = ref(false)
const me = ref(null)

/* AUTH */
const myLeadershipChapters = computed(() =>
  (me.value?.member?.chapters || []).filter(c => c.role && c.role !== 'MEMBER')
)

const canCreateEvent = computed(() =>
  myLeadershipChapters.value.length ||
  ['ADMIN', 'STAFF'].includes(me.value?.user?.role)
)

const canManageEvent = (ev) => {
  if (['ADMIN', 'STAFF'].includes(me.value?.user?.role)) return true
  return ev.scope === 'CHAPTER' &&
    myLeadershipChapters.value.some(c => c.chapter.id === ev.chapterId)
}

/* NAV */
const goView = (id) => navigateTo(`/events/${id}`)
const goEdit = (id) => navigateTo(`/events/create?edit=${id}`)
const goRegistrations = (id) => navigateTo(`/events/${id}/registrations`)
const goCreate = () => navigateTo('/events/create')

/* DATA */
const load = async () => {
  loading.value = true
  try {
    const r = await listEvents({
      q: q.value || undefined,
      upcoming: upcoming.value,
      page: page.value,
      pageSize: pageSize.value
    })

    let data = r.items || []

    if (scopeFilter.value !== 'ALL') {
      data = data.filter(ev => ev.scope === scopeFilter.value)
    }

    items.value = data.map(ev => ({
      ...ev,
      _bookedCount: ev.bookedCount ?? 0,
      _isRegistered: ev.isRegistered === true
    }))

    total.value = r.total || 0
  } finally {
    loading.value = false
  }
}

const fetchMe = async () => {
  const r = await http.get('/me')
  me.value = r.data
}

/* AUTO REFRESH */
onActivated(load)

/* WATCHERS */
let t
watch([q, upcoming, scopeFilter], () => {
  clearTimeout(t)
  t = setTimeout(() => {
    page.value = 1
    load()
  }, 300)
})

/* HELPERS */
const isRegistered = (ev) => ev._isRegistered === true
const bookedCount = (ev) => ev._bookedCount || 0

const capacityPercent = (ev) =>
  ev.capacity ? Math.min(100, Math.round((bookedCount(ev) / ev.capacity) * 100)) : 0

const isFull = (ev) => ev.capacity && bookedCount(ev) >= ev.capacity

const capacityColor = (ev) =>
  isFull(ev) ? 'bg-red-600'
  : capacityPercent(ev) >= 75 ? 'bg-orange-500'
  : 'bg-green-600'

/* DELETE */
const confirmOpen = ref(false)
const eventToDelete = ref(null)

const askDelete = (ev) => {
  eventToDelete.value = ev
  confirmOpen.value = true
}

const confirmDelete = async () => {
  try {
    await deleteEvent(eventToDelete.value.id)
    show('Event deleted', 'success')
    load()
  } catch (e) {
    show(e?.response?.data?.message || 'Delete failed', 'error')
  } finally {
    confirmOpen.value = false
    eventToDelete.value = null
  }
}

/* PAGINATION */
const totalPages = computed(() => Math.ceil(total.value / pageSize.value))
const visiblePages = computed(() => {
  const start = Math.max(1, page.value - 2)
  const end = Math.min(totalPages.value, page.value + 2)
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

const goPage = (p) => { page.value = p; load() }
const nextPage = () => { page.value++; load() }
const prevPage = () => { page.value--; load() }

const formatRange = (s, e) =>
  e ? `${new Date(s).toLocaleString()} → ${new Date(e).toLocaleString()}`
    : new Date(s).toLocaleString()

onMounted(async () => {
  await fetchMe()
  await load()
})
</script>
