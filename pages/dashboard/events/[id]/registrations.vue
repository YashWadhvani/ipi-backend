<template>
  <div class="space-y-4">
    <!-- Topbar -->
    <div class="flex items-center justify-between">
      <div>
        <div class="text-sm text-gray-500" v-if="ev">
          {{ formatRange(ev.startsAt, ev.endsAt) }}
        </div>
        <div class="flex items-center gap-3">
          <h1 class="text-xl font-semibold">{{ ev?.name || 'Event' }} Registrations</h1>
          <span class="text-sm text-gray-500">({{ rows.length }})</span>
        </div>
        <div class="text-sm text-gray-600" v-if="ev?.venue">📍 {{ ev.venue }}</div>
      </div>

      <div class="flex items-center gap-2">
        <button
          class="inline-flex items-center gap-2 rounded-md border border-[#ccc] px-3 py-2 hover:bg-gray-50 cursor-pointer"
          @click="load"
          :disabled="loading"
          title="Refresh"
        >
          <svg class="h-4 w-4 text-gray-700" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 6V3L8 7l4 4V8c2.76 0 5 2.24 5 5a5 5 0 1 1-9.9-1H5.02A7 7 0 1 0 12 6z"/>
          </svg>
          <span>{{ loading ? 'Refreshing…' : 'Refresh' }}</span>
        </button>

        <button
          class="inline-flex items-center gap-2 rounded-md border border-[#ccc] px-3 py-2 hover:bg-gray-50 cursor-pointer"
          @click="exportCsv"
          :disabled="!rows.length"
          title="Export CSV"
        >
          <svg class="h-4 w-4 text-gray-700" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 12v7a2 2 0 0 1-2 2H7c-1.1 0-2-.9-2-2v-7h2v7h10v-7h2zM11 6.83V16h2V6.83l2.59 2.58L17 8l-5-5-5 5 1.41 1.41L11 6.83z"/>
          </svg>
          <span>Export CSV</span>
        </button>

        <NuxtLink
          to="/dashboard/events"
          class="inline-flex items-center gap-2 rounded-md bg-black text-white px-3 py-2 hover:opacity-90 cursor-pointer"
          title="Back to events"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="m15 18-6-6 6-6"/></svg>
          <span>Back</span>
        </NuxtLink>
      </div>
    </div>

    <!-- KPIs -->
    <div class="grid sm:grid-cols-3 gap-3">
      <div class="bg-white border border-[#ccc] rounded p-4">
        <div class="text-sm text-gray-500">Total Registrations (pax)</div>
        <div class="text-2xl font-semibold">{{ totalQty }}</div>
      </div>
      <div class="bg-white border border-[#ccc] rounded p-4">
        <div class="text-sm text-gray-500">Capacity</div>
        <div class="text-2xl font-semibold">
          <span v-if="ev?.capacity != null">{{ ev.capacity }}</span>
          <span v-else>—</span>
        </div>
      </div>
      <div class="bg-white border border-[#ccc] rounded p-4">
        <div class="text-sm text-gray-500">Total Amount</div>
        <div class="text-2xl font-semibold">
          <span v-if="sumAmount != null">{{ formatCurrency(sumAmount) }}</span>
          <span v-else>—</span>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white border border-[#ccc] rounded-md overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-[#f1f8ff] backdrop-blur-sm sticky top-0 z-10 border-b border-[#ccc] text-left text-gray-600">
          <tr>
            <th class="p-3 font-bold">Created</th>
            <th class="p-3 font-bold">Name</th>
            <th class="p-3 font-bold">Email</th>
            <th class="p-3 font-bold">Phone</th>
            <th class="p-3 font-bold">Qty</th>
            <th class="p-3 font-bold">Amount</th>
            <th class="p-3 font-bold">Member</th>
            <th class="p-3 font-bold">Company</th>
            <th class="p-3 font-bold">Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#ccc]">
          <tr v-for="r in rows" :key="r.id" class="hover:bg-gray-50 transition-colors">
            <td class="p-3 whitespace-nowrap text-gray-700">{{ dt(r.createdAt) }}</td>
            <td class="p-3 text-gray-900 font-medium">{{ r.name }}</td>
            <td class="p-3 text-gray-700">{{ r.email }}</td>
            <td class="p-3 text-gray-700">{{ r.phone }}</td>
            <td class="p-3 text-gray-700">{{ r.qty }}</td>
            <td class="p-3">
              <span v-if="r.amount != null" class="text-gray-900 font-medium">{{ formatCurrency(r.amount) }}</span>
              <span v-else class="text-green-700">—</span>
            </td>
            <td class="p-3 text-gray-700">{{ r.member?.name || '—' }}</td>
            <td class="p-3 text-gray-700">{{ r.member?.company || '—' }}</td>
            <td class="p-3">
              <span class="px-2 py-1 rounded text-xs" :class="badgeClass(r.status)">{{ r.status || '—' }}</span>
            </td>
          </tr>

          <tr v-if="!loading && !rows.length">
            <td colspan="9" class="p-8 text-center text-gray-500">No registrations yet.</td>
          </tr>
        </tbody>
      </table>

      <!-- Loading bar -->
      <div v-if="loading" class="h-0.5 bg-gradient-to-r from-transparent via-black/30 to-transparent animate-pulse" />
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'dashboard', middleware: ['auth-admin-client'] })

import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getEvent, getEventRegistrations } from '@/services/eventsServices'

const route = useRoute()

const ev = ref(null)
const rows = ref([])
const totalQty = ref(0)
const loading = ref(false)

const sumAmount = computed(() =>
  (rows.value || []).reduce((s, r) => s + (Number(r.amount) || 0), 0)
)

const load = async () => {
  loading.value = true
  try {
    const id = route.params.id
    ev.value = await getEvent(id)
    const r = await getEventRegistrations(ev.value.id) // { totalQty, items }
    rows.value = r.items || []
    totalQty.value = r.totalQty || 0
  } finally {
    loading.value = false
  }
}

const dt = (v) => (v ? new Date(v).toLocaleString() : '—')
const formatCurrency = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(n || 0))

const formatRange = (start, end) => {
  const s = start ? new Date(start) : null
  const e = end ? new Date(end) : null
  if (!s) return '—'
  const sStr = s.toLocaleString()
  const eStr = e ? e.toLocaleString() : null
  return eStr ? `${sStr} → ${eStr}` : sStr
}

const badgeClass = (status) => {
  switch ((status || '').toLowerCase()) {
    case 'confirmed':
      return 'bg-green-100 text-green-800 border border-green-200'
    case 'cancelled':
      return 'bg-red-100 text-red-800 border border-red-200'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border border-yellow-200'
    default:
      return 'bg-gray-100 text-gray-700 border border-gray-200'
  }
}

const exportCsv = () => {
  if (!rows.value.length) return
  const header = [
    'Created At',
    'Name',
    'Email',
    'Phone',
    'Qty',
    'Amount',
    'Status',
    'Member Name',
    'Member Company'
  ]
  const lines = rows.value.map(r => ([
    dt(r.createdAt),
    r.name ?? '',
    r.email ?? '',
    r.phone ?? '',
    r.qty ?? 0,
    r.amount ?? '',
    r.status ?? '',
    r.member?.name ?? '',
    r.member?.company ?? ''
  ]))

  const csv = [header, ...lines]
    .map(arr => arr.map(x => {
      const s = String(x ?? '')
      return /[",\n]/.test(s) ? `"${s.replace(/"/g,'""')}"` : s
    }).join(','))
    .join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${ev.value?.slug || ev.value?.id || 'event'}-registrations_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.csv`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

onMounted(load)
</script>
