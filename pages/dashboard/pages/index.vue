<template>
  <section class="space-y-4">
    <!-- Topbar -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <h1 class="text-xl font-semibold">Pages</h1>
        <span class="text-sm text-gray-500">({{ total }})</span>
      </div>

      <div class="flex items-center gap-2">
        <button
          class="inline-flex items-center gap-2 rounded-md border border-[#ccc] px-3 py-2 hover:bg-gray-50 cursor-pointer"
          @click="exportCsv"
          :disabled="exporting || !rows.length"
          title="Export CSV"
        >
          <svg class="h-4 w-4 text-gray-700" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 12v7a2 2 0 0 1-2 2H7c-1.1 0-2-.9-2-2v-7h2v7h10v-7h2zM11 6.83V16h2V6.83l2.59 2.58L17 8l-5-5-5 5 1.41 1.41L11 6.83z"/>
          </svg>
          <span>{{ exporting ? 'Exporting…' : 'Export CSV' }}</span>
        </button>

        <button
          @click="createBlank"
          class="inline-flex items-center gap-2 rounded-md bg-black text-white px-3 py-2 hover:opacity-90 cursor-pointer"
          title="Create page"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"/></svg>
          <span>New Page</span>
        </button>
      </div>
    </div>

    <!-- Filters row -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div class="flex items-center gap-2">
        <div class="relative">
          <input
            v-model="q"
            placeholder="Search title / slug"
            class="pl-9 bg-white pr-3 py-2 w-72 border border-[#ccc] rounded-md focus:ring-2 focus:ring-black/10 focus:outline-none"
            @keyup.enter="goFirstPageAndLoad"
          />
          <svg class="absolute left-2.5 top-2.5 h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16a6.471 6.471 0 0 0 4.23-1.57l.27.28v.79L20 21.5 21.5 20l-6-6zM9.5 14A4.5 4.5 0 1 1 14 9.5 4.505 4.505 0 0 1 9.5 14z"/>
          </svg>
        </div>

        <select v-model="status" class="bg-white px-3 py-2 w-40 border border-[#ccc] rounded-md focus:ring-2 focus:ring-black/10 focus:outline-none" @change="goFirstPageAndLoad">
          <option value="">All</option>
          <option value="DRAFT">DRAFT</option>
          <option value="PUBLISHED">PUBLISHED</option>
          <option value="ARCHIVED">ARCHIVED</option>
        </select>

        <button class="bg-white px-3 py-2 border border-[#ccc] rounded-md hover:bg-gray-50 cursor-pointer" @click="goFirstPageAndLoad">Search</button>
        <button class="bg-white px-3 py-2 border border-[#ccc] rounded-md hover:bg-gray-50 cursor-pointer" @click="resetFilters" title="Clear filters">Reset</button>
      </div>

      <div class="flex items-center gap-2">
        <select v-model="sortBy" class="border border-[#ccc] rounded-md px-2 py-2 bg-white cursor-pointer" @change="goFirstPageAndLoad">
          <option value="title">Sort by title</option>
          <option value="slug">Sort by slug</option>
          <option value="updatedAt">Sort by updated</option>
          <option value="createdAt">Sort by created</option>
        </select>

        <select v-model="sortDir" class="border border-[#ccc] rounded-md px-2 py-2 bg-white cursor-pointer" @change="goFirstPageAndLoad">
          <option value="asc">Asc</option>
          <option value="desc">Desc</option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white border border-[#ccc] rounded-md overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-[#f1f8ff] backdrop-blur-sm sticky top-0 z-10 border-b border-[#ccc] text-left text-gray-600">
          <tr>
            <th class="p-3 font-bold">Title</th>
            <th class="p-3 font-bold">Slug</th>
            <th class="p-3 font-bold">Status</th>
            <th class="p-3 font-bold">Updated</th>
            <th class="p-3 font-bold text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#ccc]">
          <tr
            v-for="r in rows"
            :key="r.id"
            class="hover:bg-gray-50 transition-colors cursor-pointer"
            @click="goBuilder(r)"
          >
            <td class="p-3 text-gray-900 font-medium">{{ r.title }}</td>
            <td class="p-3 text-gray-700">/{{ r.slug }}</td>
            <td class="p-3">
              <span
                class="px-2 py-1 text-xs rounded-md border"
                :class="statusClass(r.status)"
              >{{ r.status }}</span>
            </td>
            <td class="p-3 text-gray-700">{{ formatDate(r.updatedAt) }}</td>
            <td class="p-3">
              <div class="flex items-center justify-end gap-2">
                <NuxtLink
                  :to="`/dashboard/pages/${r.id}/builder`"
                  class="p-2 rounded-md border border-[#ccc] bg-white hover:bg-gray-100 cursor-pointer"
                  @click.stop
                >
                  Edit
                </NuxtLink>
              </div>
            </td>
          </tr>

          <tr v-if="!loading && !rows.length">
            <td colspan="5" class="p-8 text-center text-gray-500">No pages found</td>
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
  </section>
</template>

<script setup>
definePageMeta({ layout: 'dashboard', middleware: ['auth-admin-client'] })

import { ref, onMounted } from 'vue'
import { useSnackbar } from '@/services/useSnackbar'
import { listPages, createPage } from '@/services/usePagesService'

const { show } = useSnackbar()

// Filters / sorting / paging
const q = ref('')
const status = ref('')
const sortBy = ref('updatedAt') // title | slug | createdAt | updatedAt
const sortDir = ref('desc')     // asc | desc
const page = ref(1)
const pageSize = ref(20)

// Data
const rows = ref([])
const total = ref(0)
const loading = ref(false)
const exporting = ref(false)

// Helpers
const formatDate = (d) => d ? new Date(d).toLocaleString() : '—'
const statusClass = (s) => {
  if (s === 'PUBLISHED') return 'border-green-300 text-green-700 bg-green-50'
  if (s === 'DRAFT')     return 'border-amber-300 text-amber-700 bg-amber-50'
  if (s === 'ARCHIVED')  return 'border-gray-300 text-gray-700 bg-gray-50'
  return 'border-[#ccc] text-gray-700 bg-white'
}

// Load list
const load = async () => {
  loading.value = true
  try {
    const res = await listPages({
      q: q.value || undefined,
      status: status.value || undefined,
      sortBy: sortBy.value,
      sortDir: sortDir.value,
      page: page.value,
      pageSize: pageSize.value,
    })
    // Support both array and paginated shapes
    if (Array.isArray(res)) {
      rows.value = res
      total.value = res.length
    } else {
      rows.value = res.items || []
      total.value = res.total ?? rows.value.length
    }
  } catch (e) {
    show(e?.response?.data?.message || 'Failed to load pages', 'error')
  } finally {
    loading.value = false
  }
}

const goFirstPageAndLoad = () => { page.value = 1; load() }
const resetFilters = () => {
  q.value = ''
  status.value = ''
  sortBy.value = 'updatedAt'
  sortDir.value = 'desc'
  page.value = 1
  load()
}

const goBuilder = (r) => navigateTo(`/dashboard/pages/${r.id}/builder`)

const createBlank = async () => {
  try {
    const p = await createPage({
      title: 'Untitled Page',
      slug: `page-${Date.now()}`,
      status: 'DRAFT',
      blocks: []
    })
    navigateTo(`/dashboard/pages/${p.id}/builder`)
  } catch (e) {
    show(e?.response?.data?.message || 'Failed to create page', 'error')
  }
}

// CSV export (fetches all with current filters)
const exportCsv = async () => {
  if (!total.value) return
  exporting.value = true
  try {
    const all = []
    let p = 1
    const chunk = 200
    while (true) {
      const res = await listPages({
        q: q.value || undefined,
        status: status.value || undefined,
        sortBy: sortBy.value,
        sortDir: sortDir.value,
        page: p,
        pageSize: chunk,
      })
      const set = Array.isArray(res) ? res : (res.items || [])
      all.push(...set)
      if (set.length < chunk) break
      p += 1
    }

    const rowsCsv = [
      ['Title','Slug','Status','UpdatedAt','CreatedAt'],
      ...all.map(r => [
        r.title ?? '',
        r.slug ? `/${r.slug}` : '',
        r.status ?? '',
        r.updatedAt ? new Date(r.updatedAt).toISOString() : '',
        r.createdAt ? new Date(r.createdAt).toISOString() : '',
      ])
    ]

    const csv = rowsCsv.map(r =>
      r.map(cell => {
        const s = String(cell ?? '')
        return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
      }).join(',')
    ).join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pages_export_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)

    show(`Exported ${all.length} pages`, 'success')
  } catch (e) {
    show(e?.response?.data?.message || 'Export failed', 'error')
  } finally {
    exporting.value = false
  }
}

onMounted(load)
</script>
