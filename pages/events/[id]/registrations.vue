<template>
  <div class="space-y-6">
    <!-- HEADER -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-semibold">
          Registrations
        </h1>
        <p class="text-sm text-gray-500" v-if="event">
          {{ event.name }}
        </p>
      </div>

      <button
        class="border rounded px-3 py-2 hover:bg-gray-50"
        @click="goBack"
      >
        ← Back to Event
      </button>
    </div>

    <!-- STATS -->
    <div v-if="!loading && rows.length" class="flex gap-6 text-sm">
      <div>
        <span class="text-gray-500">Total Registrations</span><br />
        <span class="font-semibold">{{ rows.length }}</span>
      </div>
      <div>
        <span class="text-gray-500">Total Quantity</span><br />
        <span class="font-semibold">{{ totalQty }}</span>
      </div>
      <div>
        <span class="text-gray-500">Total Amount</span><br />
        <span class="font-semibold">₹ {{ totalAmount }}</span>
      </div>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="space-y-2">
      <div v-for="i in 5" :key="i" class="h-12 bg-gray-100 rounded animate-pulse" />
    </div>

    <!-- TABLE -->
    <div v-else-if="rows.length" class="overflow-auto border rounded-md">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 text-left">
          <tr>
            <th class="p-3">Name</th>
            <th class="p-3">Email</th>
            <th class="p-3">Phone</th>
            <th class="p-3 text-right">Qty</th>
            <th class="p-3 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="r in rows"
            :key="r.id"
            class="border-t"
          >
            <td class="p-3">{{ r.name }}</td>
            <td class="p-3">{{ r.email }}</td>
            <td class="p-3">{{ r.phone || '—' }}</td>
            <td class="p-3 text-right">{{ r.qty || 1 }}</td>
            <td class="p-3 text-right">₹ {{ r.amount || 0 }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- EMPTY -->
    <div
      v-else
      class="bg-white border rounded p-6 text-center text-gray-500"
    >
      No registrations found for this event.
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'member',
  middleware: ['member-auth', 'event-leadership']
})

import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { navigateTo } from '#app'
import { http } from '@/services/http'
import { useSnackbar } from '@/services/useSnackbar'

const route = useRoute()
const { show } = useSnackbar()

const event = ref(null)
const rows = ref([])
const loading = ref(false)

/* ---------------- COMPUTED ---------------- */

const totalQty = computed(() =>
  rows.value.reduce((s, r) => s + (r.qty || 1), 0)
)

const totalAmount = computed(() =>
  rows.value.reduce((s, r) => s + (Number(r.amount) || 0), 0)
)

/* ---------------- NAV ---------------- */

const goBack = () => {
  navigateTo(`/events/${route.params.id}`)
}

/* ---------------- LOAD ---------------- */

const load = async () => {
  loading.value = true
  try {
    // Event details
    const evRes = await http.get(`/events/${route.params.id}`)
    event.value = evRes.data

    // Registrations
    const regRes = await http.get(
      `/events/${route.params.id}/registrations`
    )

    rows.value = regRes.data?.items || []
  } catch (e) {
    show('Failed to load registrations', 'error')
    navigateTo('/events')
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>
