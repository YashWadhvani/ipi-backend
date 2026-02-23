<template>
  <div class="space-y-4">
    <!-- Content Topbar -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <h1 class="text-xl font-semibold">Events</h1>
        <span class="text-sm text-gray-500">({{ total }})</span>
      </div>

      <div class="flex items-center gap-2">
        <NuxtLink
          to="/dashboard/events/create"
          class="inline-flex items-center gap-2 rounded-md bg-black text-white px-3 py-2 hover:opacity-90 cursor-pointer"
          title="Create event"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"/></svg>
          <span>New Event</span>
        </NuxtLink>

        <button
          class="inline-flex items-center gap-2 rounded-md border border-[#ccc] px-3 py-2 hover:bg-gray-50 cursor-pointer"
          @click="exportCsv"
          :disabled="exporting"
          title="Export CSV"
        >
          <svg class="h-4 w-4 text-gray-700" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 12v7a2 2 0 0 1-2 2H7c-1.1 0-2-.9-2-2v-7h2v7h10v-7h2zM11 6.83V16h2V6.83l2.59 2.58L17 8l-5-5-5 5 1.41 1.41L11 6.83z"/>
          </svg>
          <span>{{ exporting ? 'Exporting…' : 'Export CSV' }}</span>
        </button>
      </div>
    </div>

    <!-- Filters row -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
      <div class="flex items-center gap-2">
        <div class="relative">
          <input
            v-model="q"
            placeholder="Search name / venue / description"
            class="pl-9 bg-[#fff] pr-3 py-2 w-72 border border-[#ccc] rounded-md focus:ring-2 focus:ring-black/10 focus:outline-none"
            @keyup.enter="goFirstPageAndLoad"
          />
          <svg class="absolute left-2.5 top-2.5 h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16a6.471 6.471 0 0 0 4.23-1.57l.27.28v.79L20 21.5 21.5 20l-6-6zM9.5 14A4.5 4.5 0 1 1 14 9.5 4.505 4.505 0 0 1 9.5 14z"/>
          </svg>
        </div>
        <button class="bg-[#fff] px-3 py-2 border border-[#ccc] rounded-md hover:bg-gray-50 cursor-pointer" @click="goFirstPageAndLoad">Search</button>
        <button class="bg-[#fff] px-3 py-2 border border-[#ccc] rounded-md hover:bg-gray-50 cursor-pointer" @click="resetFilters" title="Clear filters">Reset</button>
      </div>

      <div class="flex items-center gap-2 flex-wrap">
        <label class="inline-flex items-center gap-2 text-sm bg-white border border-[#ccc] rounded-md px-2 py-2">
          <input type="checkbox" v-model="upcoming" @change="goFirstPageAndLoad" />
          Upcoming only
        </label>

        <select v-model="sortBy" class="border border-[#ccc] rounded-md px-2 py-2 bg-white cursor-pointer" @change="goFirstPageAndLoad">
          <option value="startsAt">Sort by start</option>
          <option value="createdAt">Sort by created</option>
          <option value="name">Sort by name</option>
        </select>

        <select v-model="sortDir" class="border border-[#ccc] rounded-md px-2 py-2 bg-white cursor-pointer" @change="goFirstPageAndLoad">
          <option value="asc">Asc</option>
          <option value="desc">Desc</option>
        </select>

        <!-- NEW: Scope filter -->
        <select v-model="scope" class="border border-[#ccc] rounded-md px-2 py-2 bg-white cursor-pointer" @change="scopeChanged">
          <option value="">All (Global + Chapter)</option>
          <option value="GLOBAL">Global</option>
          <option value="CHAPTER">Chapter</option>
        </select>

        <!-- NEW: Chapter filter (only when scope=CHAPTER) -->
        <select
          v-if="scope === 'CHAPTER'"
          v-model="chapterId"
          class="border border-[#ccc] rounded-md px-2 py-2 bg-white cursor-pointer min-w-[240px]"
          @change="goFirstPageAndLoad"
        >
          <option value="">All chapters</option>
          <option v-for="c in chapters" :key="c.id" :value="c.id">
            {{ c.name }} <span v-if="c.city?.name">— {{ c.city.name }}</span>
          </option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white border border-[#ccc] rounded-md overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-[#f1f8ff] backdrop-blur-sm sticky top-0 z-10 border-b border-[#ccc]">
          <tr class="text-left text-gray-600">
            <th class="p-3 font-bold">Event</th>
            <th class="p-3 font-bold">Start</th>
            <th class="p-3 font-bold">Scope</th>
            <th class="p-3 font-bold">Chapter</th>
            <th class="p-3 font-bold">Venue</th>
            <th class="p-3 font-bold">Capacity</th>
            <th class="p-3 font-bold">Cost</th>
            <th class="p-3 font-bold text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#ccc]">
          <tr
            v-for="ev in items"
            :key="ev.id"
            class="hover:bg-gray-50 cursor-pointer transition-colors"
            @click="goEdit(ev)"
          >
            <td class="p-3 align-top">
              <div class="font-medium text-gray-900">{{ ev.name }}</div>
              <div class="text-xs text-gray-500">/{{ ev.slug }}</div>
            </td>
            <td class="p-3 align-top text-gray-700">{{ formatDT(ev.startsAt) }}</td>

            <!-- NEW: scope chip -->
            <td class="p-3 align-top">
              <span
                class="px-2 py-1 rounded border text-xs"
                :class="ev.scope === 'GLOBAL'
                  ? 'border-blue-200 bg-blue-50 text-blue-800'
                  : 'border-violet-200 bg-violet-50 text-violet-800'"
              >
                {{ ev.scope || '—' }}
              </span>
            </td>

            <!-- NEW: Chapter -->
            <td class="p-3 align-top text-gray-700">
              <span v-if="ev.chapter?.name">{{ ev.chapter.name }}</span>
              <span v-else class="text-gray-400">—</span>
            </td>

            <td class="p-3 align-top text-gray-700">{{ ev.venue || '—' }}</td>
            <td class="p-3 align-top text-gray-700">{{ ev.capacity ?? '—' }}</td>
            <td class="p-3 align-top">
              <span v-if="ev.costPerPerson != null" class="text-gray-900 font-medium">{{ formatCurrency(ev.costPerPerson) }}</span>
              <span v-else class="text-green-700">Free</span>
            </td>
            <td class="p-3 align-top">
              <div class="flex items-center justify-end gap-1">
                <NuxtLink
                  :to="`/dashboard/events/${ev.id}/registrations`"
                  class="p-2 rounded-md border border-[#ccc] bg-white hover:bg-gray-100 cursor-pointer"
                  title="View registrations"
                  @click.stop
                >
                  <svg class="h-4 w-4 text-gray-800" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3A3 3 0 1 0 16 11zM8 11c1.66 0 2.99-1.34 2.99-3A3 3 0 1 0 8 11zM8 13c-2.67 0-8 1.34-8 4v3h8v-3c0-1.05.81-1.82 2.05-2.35C9.24 13.23 8.62 13 8 13zm8 0c-.62 0-1.24.23-1.76.65C15.19 14.18 16 14.95 16 16v3h8v-3c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </NuxtLink>

                <button
                  class="p-2 rounded-md border border-[#ccc] hover:bg-red-50 cursor-pointer"
                  title="Delete event"
                  @click.stop="askDelete(ev)"
                  :disabled="deletingId === ev.id"
                >
                  <svg class="h-4 w-4 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z"/>
                  </svg>
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="!loading && !items.length">
            <td colspan="8" class="p-8 text-center text-gray-500">No events found</td>
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
        <button class="p-2 border border-[#ccc] rounded-md hover:bg-gray-50 cursor-pointer" :disabled="page<=1" @click="page--; load()" title="Prev">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <span class="px-2 text-sm">Page {{ page }}</span>
        <button
          class="p-2 border border-[#ccc] rounded-md hover:bg-gray-50 cursor-pointer"
          :disabled="page * pageSize >= total"
          @click="page++; load()"
          title="Next"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="m9 6 6 6-6 6"/></svg>
        </button>
      </div>
    </div>

    <!-- Confirm delete dialog -->
    <ConfirmDialog
      v-model:open="confirmOpen"
      title="Delete event?"
      :message="confirmMessage"
      confirmText="Delete"
      cancelText="Cancel"
      @confirm="doDelete"
    />
  </div>
</template>

<script setup>
definePageMeta({ layout: 'dashboard', middleware: ['auth-admin-client'] })

import { ref, onMounted, computed } from 'vue'
import { listEvents, deleteEvent } from '@/services/eventsServices'
import { listChapters } from '@/services/chaptersServices' // NEW: simple service to fetch chapters
import { useSnackbar } from '@/services/useSnackbar'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

const { show } = useSnackbar()

// Filters / sorting / paging
const q = ref('')
const upcoming = ref(false)
const sortBy = ref('startsAt')
const sortDir = ref('asc')
const scope = ref('')          // '' | 'GLOBAL' | 'CHAPTER'
const chapterId = ref('')      // only used when scope === 'CHAPTER'

// Chapters for filter
const chapters = ref([])

// Data
const items = ref([])
const total = ref(0)
const loading = ref(false)
const exporting = ref(false)

// Loaders
const load = async () => {
  loading.value = true
  try {
    const data = await listEvents({
      q: q.value || undefined,
      upcoming: upcoming.value || undefined,
      page: page.value,
      pageSize: pageSize.value,
      sortBy: sortBy.value,
      sortDir: sortDir.value,
      scope: scope.value || undefined,
      chapterId: scope.value === 'CHAPTER' ? (chapterId.value || undefined) : undefined,
    })
    items.value = data.items || []
    total.value = data.total || 0
  } catch (e) {
    show(e?.response?.data?.message || 'Failed to load events', 'error')
  } finally {
    loading.value = false
  }
}

const loadChapters = async () => {
  try {
    const r = await listChapters({ status: 'active', page: 1, pageSize: 500 })
    chapters.value = r.items || r || [] // support both shapes
  } catch {
    chapters.value = []
  }
}

const scopeChanged = () => {
  if (scope.value !== 'CHAPTER') chapterId.value = ''
  goFirstPageAndLoad()
}

const page = ref(1)
const pageSize = ref(20)
const goFirstPageAndLoad = () => { page.value = 1; load() }
const resetFilters = () => {
  q.value = ''
  upcoming.value = false
  sortBy.value = 'startsAt'
  sortDir.value = 'asc'
  scope.value = ''
  chapterId.value = ''
  page.value = 1
  load()
}

// Navigation
const goEdit = (ev) => navigateTo(`/dashboard/events/${ev.id}/edit`)

// Formatting
const formatDT = (s) => (s ? new Date(s).toLocaleString() : '—')
const formatCurrency = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

// Delete flow
const confirmOpen = ref(false)
const deletingId = ref(null)
const toDelete = ref(null)
const confirmMessage = computed(() =>
  toDelete.value ? `This will delete “${toDelete.value.name}”. You can’t undo this.` : 'Are you sure?'
)
const askDelete = (ev) => { toDelete.value = ev; confirmOpen.value = true }
const doDelete = async () => {
  if (!toDelete.value) return
  deletingId.value = toDelete.value.id
  try {
    await deleteEvent(toDelete.value.id)
    show('Event deleted', 'success')
    if (items.value.length === 1 && page.value > 1) page.value -= 1
    await load()
  } catch (e) {
    show(e?.response?.data?.message || 'Failed to delete', 'error')
  } finally {
    deletingId.value = null
    toDelete.value = null
    confirmOpen.value = false
  }
}

// CSV export (fetches all pages with current filters)
const exportCsv = async () => {
  exporting.value = true
  try {
    const all = []
    let p = 1
    const chunk = 200
    while (true) {
      const data = await listEvents({
        q: q.value || undefined,
        upcoming: upcoming.value || undefined,
        page: p,
        pageSize: chunk,
        sortBy: sortBy.value,
        sortDir: sortDir.value,
        scope: scope.value || undefined,
        chapterId: scope.value === 'CHAPTER' ? (chapterId.value || undefined) : undefined,
      })
      const set = data.items || []
      all.push(...set)
      if (set.length < chunk) break
      p += 1
    }

    const rows = [
      ['Name','Slug','Starts','Ends','Scope','Chapter','Venue','Capacity','CostPerPerson','PerBookingMax','Status'],
      ...all.map(ev => [
        ev.name ?? '',
        ev.slug ?? '',
        ev.startsAt ? new Date(ev.startsAt).toISOString() : '',
        ev.endsAt ? new Date(ev.endsAt).toISOString() : '',
        ev.scope ?? '',
        ev.chapter?.name ?? '',
        ev.venue ?? '',
        ev.capacity ?? '',
        ev.costPerPerson ?? '',
        ev.perBookingMax ?? '',
        ev.status ?? '',
      ]),
    ]

    const csv = rows.map(r =>
      r.map(cell => {
        const s = String(cell ?? '')
        return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
      }).join(',')
    ).join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `events_export_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)

    show(`Exported ${all.length} events`, 'success')
  } catch (e) {
    show(e?.response?.data?.message || 'Export failed', 'error')
  } finally {
    exporting.value = false
  }
}

onMounted(async () => {
  await Promise.all([loadChapters(), load()])
})
</script>
