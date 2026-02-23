<script setup>
import { ref, computed, onMounted, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCookie } from '#imports'

import { getEvent } from '@/services/eventsServices'
import { assetUrl, authHeaders } from '@/services/http'
import { utcToDisplay } from '@/utils/time'

definePageMeta({ layout: 'default' })

/* ----------------------------------
   ROUTE
---------------------------------- */
const route = useRoute()
const router = useRouter()
const idOrSlug = computed(() => String(route.params.id))

/* ----------------------------------
   AUTH
---------------------------------- */
const authToken = useCookie('at')
const isLoggedIn = computed(() => !!authToken.value)

// HARD LOG — who is on the page
console.log('[EVENT PAGE]')
console.log('Logged in:', isLoggedIn.value)
console.log('Auth headers:', authHeaders())

/* ----------------------------------
   DATA
---------------------------------- */
const ev = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    ev.value = await getEvent(idOrSlug.value)
    console.log('Event loaded:', ev.value)
  } catch (e) {
    console.error('Failed to load event', e)
  } finally {
    loading.value = false
  }
})

/* ----------------------------------
   TIME (LOCKED IST DISPLAY)
---------------------------------- */
const startUtc = computed(() => ev.value?.startsAt || null)
const endUtc   = computed(() => ev.value?.endsAt || null)

const startPretty = computed(() =>
  startUtc.value ? utcToDisplay(startUtc.value) : '—'
)
const endPretty = computed(() =>
  endUtc.value ? utcToDisplay(endUtc.value) : '—'
)

const dateLine = computed(() => {
  if (!startUtc.value) return 'Date TBA'
  if (endUtc.value) {
    return `${utcToDisplay(startUtc.value, 'dd LLL yyyy, hh:mm a')} – ${utcToDisplay(endUtc.value, 'hh:mm a')}`
  }
  return utcToDisplay(startUtc.value)
})

/* ----------------------------------
   STATUS
---------------------------------- */
const whenLabel = computed(() => {
  if (!startUtc.value) return '—'
  const now = Date.now()
  const s = new Date(startUtc.value).getTime()
  const e = endUtc.value ? new Date(endUtc.value).getTime() : null

  if (now < s) return 'Upcoming'
  if (e && now <= e) return 'Live'
  return 'Past'
})

const whenBadgeClass = computed(() => {
  if (whenLabel.value === 'Upcoming') return 'bg-amber-100 text-amber-800'
  if (whenLabel.value === 'Live') return 'bg-green-100 text-green-800'
  if (whenLabel.value === 'Past') return 'bg-gray-200 text-gray-800'
  return 'bg-gray-100 text-gray-800'
})

/* ----------------------------------
   CAPACITY
---------------------------------- */
const capacity = computed(() => ev.value?.capacity ?? null)
const booked = computed(() => ev.value?.attendeesCount ?? 0)

const seatsLeft = computed(() => {
  if (capacity.value == null) return null
  return Math.max(capacity.value - booked.value, 0)
})

/* ----------------------------------
   PRICING (BACKEND AUTHORITY)
---------------------------------- */
const memberPrice = computed(() => ev.value?.costPerPerson ?? null)
const guestPrice  = computed(() => ev.value?.guestCostPerPerson ?? null)

const displayPrice = computed(() => {
  if (isLoggedIn.value) {
    if (memberPrice.value === 0) return 'Free (Members)'
    if (memberPrice.value != null) return `₹${memberPrice.value} (Member)`
  } else {
    if (guestPrice.value === 0) return 'Free (Guests)'
    if (guestPrice.value != null) return `₹${guestPrice.value} (Guest)`
  }
  return '—'
})

/* ----------------------------------
   REGISTRATION RULES
---------------------------------- */
const backendRegOpen = computed(() => {
  const e = ev.value || {}
  if (typeof e.registrationOpen === 'boolean') return e.registrationOpen
  if (typeof e.allowRegistration === 'boolean') return e.allowRegistration
  return true
})

const canRegister = computed(() => {
  if (!backendRegOpen.value) return false
  if (whenLabel.value === 'Past') return false
  if (seatsLeft.value === 0) return false
  return true
})

/* ----------------------------------
   ASSETS
---------------------------------- */
const bannerUrl = computed(() => {
  const url =
    ev.value?.banner?.url ||
    ev.value?.image?.url ||
    ev.value?.photos?.[0]?.url ||
    ''
  return url ? assetUrl(url) : '/event-placeholder.jpg'
})

const photos = computed(() =>
  Array.isArray(ev.value?.photos) ? ev.value.photos : []
)

const sponsors = computed(() =>
  Array.isArray(ev.value?.sponsors) ? ev.value.sponsors : []
)

/* 🔥 FIXED: sponsors with logos only */
const sponsorsWithLogo = computed(() =>
  sponsors.value
    .filter(s => !!s.logoUrl)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
)

watchEffect(() => {
  if (sponsors.value.length) {
    console.log('Sponsors payload:', sponsors.value)
  }
})

const hasDescription = computed(() =>
  !!String(ev.value?.description || '').trim()
)

/* ----------------------------------
   REGISTER → CHECKOUT
---------------------------------- */
function goToCheckout () {
  router.push({
    path: `/events-ipi/${idOrSlug.value}/checkout`,
    query: {
      type: isLoggedIn.value ? 'member' : 'guest'
    }
  })
}

</script>

<template>
  <section class="min-h-screen">

    <!-- HERO -->
    <div class="bg-gradient-to-r from-[#a70000] to-[#e60012] text-white py-8 px-6">
      <NuxtLink to="/events" class="text-white/80 hover:underline">← Back</NuxtLink>
      <h1 class="text-3xl font-extrabold mt-2">
        {{ ev?.name || 'Event' }}
      </h1>
      <p class="mt-1 text-white/90">{{ dateLine }}</p>
    </div>

    <!-- CONTENT -->
    <div class="max-w-7xl mx-auto p-6 space-y-6">

      <!-- OVERVIEW -->
      <div class="bg-white border rounded p-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <img
          :src="bannerUrl"
          class="rounded border object-cover aspect-video bg-gray-100"
        />

        <div class="space-y-3">
          <span :class="['inline-block px-3 py-1 rounded-full text-sm font-medium', whenBadgeClass]">
            {{ whenLabel }}
          </span>

          <p><strong>Starts:</strong> {{ startPretty }}</p>
          <p><strong>Ends:</strong> {{ endPretty }}</p>

          <p v-if="capacity !== null">
            <strong>Seats:</strong> {{ seatsLeft }} left of {{ capacity }}
          </p>

          <p>
            <strong>Price:</strong> {{ displayPrice }}
          </p>
          <button
            v-if="canRegister"
            @click="goToCheckout"
            class="mt-4 px-5 py-2 bg-black text-white rounded hover:opacity-90"
            >
            {{ isLoggedIn ? 'Register (Member)' : 'Register as Guest' }}
          </button>


          <p v-else class="text-sm text-gray-600">
            Registration not available.
          </p>
        </div>
      </div>

      <!-- DESCRIPTION -->
      <div v-if="hasDescription" class="bg-white border rounded p-4">
        <h2 class="text-xl font-semibold mb-2">About the Event</h2>
        <div class="prose max-w-none" v-html="ev.description"></div>
      </div>

      <!-- PHOTOS -->
      <div v-if="photos.length" class="bg-white border rounded p-4">
        <h2 class="text-xl font-semibold mb-3">Photos</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <img
            v-for="p in photos"
            :key="p.id || p.url"
            :src="assetUrl(p.url)"
            class="rounded border object-cover aspect-[4/3]"
          />
        </div>
      </div>

      <!-- SPONSORS -->
      <div v-if="sponsorsWithLogo.length" class="bg-white border rounded p-4">
        <h2 class="text-xl font-semibold mb-3">Sponsors</h2>
        <div class="flex flex-wrap gap-6 items-center">
          <img
            v-for="s in sponsorsWithLogo"
            :key="s.id"
            :src="assetUrl(s.logoUrl)"
            :alt="s.name"
            class="h-10 object-contain"
          />
        </div>
      </div>

    </div>
  </section>
</template>
