<template>
  <div class="space-y-6">
    <!-- Heading -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold">Dashboard Overview</h1>
    </div>

    <!-- Stat boxes grid -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatBox
        label="Total Members"
        :value="stats.members"
        icon="users"
        color="blue"
      />
      <StatBox
        label="Active Events"
        :value="stats.events"
        icon="calendar"
        color="green"
      />
      <StatBox
        label="Registrations"
        :value="stats.registrations"
        icon="ticket"
        color="indigo"
      />
      <StatBox
        label="Revenue (₹)"
        :value="formatCurrency(stats.revenue)"
        icon="currency"
        color="yellow"
      />
    </div>

    <!-- Upcoming events table preview -->
    <div class="bg-white border border-[#ccc] rounded-md overflow-hidden">
      <div class="px-4 py-3 border-b border-[#eee] font-medium">Upcoming Events</div>
      <table class="w-full text-sm">
        <thead class="bg-[#f1f8ff] border-b border-[#ccc]">
          <tr class="text-left text-gray-600">
            <th class="p-3 font-bold">Event</th>
            <th class="p-3 font-bold">Starts</th>
            <th class="p-3 font-bold">Venue</th>
            <th class="p-3 font-bold">Capacity</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#ccc]">
          <tr v-for="ev in upcoming" :key="ev.id">
            <td class="p-3">{{ ev.name }}</td>
            <td class="p-3">{{ dt(ev.startsAt) }}</td>
            <td class="p-3">{{ ev.venue || '—' }}</td>
            <td class="p-3">{{ ev.capacity ?? '—' }}</td>
          </tr>
          <tr v-if="!upcoming.length">
            <td colspan="4" class="p-6 text-center text-gray-500">No upcoming events</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'dashboard', middleware: ['auth-admin-client'] })

import { ref, onMounted } from 'vue'
import StatBox from '@/components/StatBox.vue'
import { useSnackbar } from '@/services/useSnackbar'
import { listEvents } from '@/services/eventsServices'
import { listMembers } from '@/services/membersServices'

const { show } = useSnackbar()

const stats = ref({ members: 0, events: 0, registrations: 0, revenue: 0 })
const upcoming = ref([])

const load = async () => {
  try {
    const members = await listMembers({ pageSize: 1 })
    stats.value.members = members.total

    const events = await listEvents({ upcoming: true, pageSize: 5 })
    stats.value.events = events.total
    upcoming.value = events.items || []

    // registrations & revenue would usually have dedicated APIs
    // hardcoded zero for now:
    stats.value.registrations = 0
    stats.value.revenue = 0
  } catch (e) {
    show(e?.response?.data?.message || 'Failed to load stats', 'error')
  }
}

const dt = (v) => (v ? new Date(v).toLocaleString() : '—')
const formatCurrency = (n) =>
  new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(n)

onMounted(load)

</script>
