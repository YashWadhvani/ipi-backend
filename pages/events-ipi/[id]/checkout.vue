<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCookie } from '#imports'

import { getEvent, registerForEvent } from '@/services/eventsServices'
import { assetUrl } from '@/services/http'
import { utcToDisplay } from '@/utils/time'

definePageMeta({ layout: 'default' })

/* ----------------------------------
   ROUTE / AUTH
---------------------------------- */
const route = useRoute()
const router = useRouter()
const authToken = useCookie('at')

const isLoggedIn = computed(() => !!authToken.value)
const eventId = computed(() => String(route.params.id))

/**
 * bookingType comes from previous page:
 * ?type=member | guest
 */
const bookingType = computed(() =>
  route.query.type === 'member' && isLoggedIn.value
    ? 'member'
    : 'guest'
)

console.log('[CHECKOUT]')
console.log('Logged in:', isLoggedIn.value)
console.log('Booking type:', bookingType.value)

/* ----------------------------------
   DATA
---------------------------------- */
const ev = ref(null)
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    ev.value = await getEvent(eventId.value)
    console.log('Event:', ev.value)
  } catch (e) {
    console.error(e)
    error.value = 'Unable to load event'
  } finally {
    loading.value = false
  }
})

/* ----------------------------------
   FORM
---------------------------------- */
const qty = ref(1)
const submitting = ref(false)

const guest = ref({
  name: '',
  email: '',
  phone: ''
})

/* ----------------------------------
   TIME
---------------------------------- */
const startPretty = computed(() =>
  ev.value?.startsAt ? utcToDisplay(ev.value.startsAt) : '—'
)

/* ----------------------------------
   PRICING (BACKEND IS SOURCE OF TRUTH)
---------------------------------- */
const memberPrice = computed(() => ev.value?.costPerPerson ?? 0)
const guestPrice  = computed(() => ev.value?.guestCostPerPerson ?? 0)

const unitPrice = computed(() =>
  bookingType.value === 'member'
    ? memberPrice.value
    : guestPrice.value
)

const total = computed(() => qty.value * unitPrice.value)

/* ----------------------------------
   SEATS
---------------------------------- */
const capacity = computed(() => ev.value?.capacity ?? null)
const booked = computed(() => ev.value?.attendeesCount ?? 0)

const seatsLeft = computed(() => {
  if (capacity.value == null) return Infinity
  return Math.max(capacity.value - booked.value, 0)
})

/* ----------------------------------
   SUBMIT
---------------------------------- */
async function confirmBooking () {
  error.value = ''

  if (qty.value < 1) {
    error.value = 'Invalid quantity'
    return
  }

  if (qty.value > seatsLeft.value) {
    error.value = 'Not enough seats available'
    return
  }

  if (bookingType.value === 'guest') {
    if (!guest.value.name || !guest.value.email || !guest.value.phone) {
      error.value = 'Please fill all guest details'
      return
    }
  }

  try {
    submitting.value = true

    const payload = {
      qty: qty.value, // ✅ THIS WAS THE BUG
    }

    if (bookingType.value === 'guest') {
      payload.name = guest.value.name
      payload.email = guest.value.email
      payload.phone = guest.value.phone
    }

    await registerForEvent(ev.value.id, payload)

    router.replace(`/events-ipi/${eventId.value}/success`)
  } catch (e) {
    console.error(e)
    error.value = e?.response?.data?.message || 'Booking failed'
  } finally {
    submitting.value = false
  }
}

</script>

<template>
  <section class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto p-6 space-y-6">

      <!-- HEADER -->
      <div>
        <NuxtLink
          :to="`/events-ipi/${eventId}`"
          class="text-sm text-gray-600 hover:underline"
        >
          ← Back to event
        </NuxtLink>

        <h1 class="text-3xl font-bold mt-2">
          Checkout
        </h1>
      </div>

      <!-- LOADING -->
      <div v-if="loading" class="text-center py-10">
        Loading…
      </div>

      <!-- CONTENT -->
      <div v-else-if="ev" class="bg-white border rounded p-6 space-y-6">

        <!-- EVENT SUMMARY -->
        <div class="flex gap-4">
          <img
            :src="assetUrl(ev.banner?.url || ev.photos?.[0]?.url || '')"
            class="w-40 h-28 object-cover rounded border"
          />

          <div>
            <h2 class="text-xl font-semibold">{{ ev.name }}</h2>
            <p class="text-sm text-gray-600">{{ startPretty }}</p>
            <p class="text-sm text-gray-600 capitalize">
              {{ bookingType }} pricing
            </p>
          </div>
        </div>

        <!-- GUEST DETAILS -->
        <div v-if="bookingType === 'guest'" class="space-y-3">
          <h3 class="font-semibold">Guest Details</h3>

          <input
            v-model="guest.name"
            placeholder="Full name"
            class="w-full border rounded px-3 py-2"
          />
          <input
            v-model="guest.email"
            type="email"
            placeholder="Email"
            class="w-full border rounded px-3 py-2"
          />
          <input
            v-model="guest.phone"
            placeholder="Phone"
            class="w-full border rounded px-3 py-2"
          />
        </div>

        <!-- QUANTITY -->
        <div class="space-y-2">
          <label class="font-medium">Number of Seats</label>

          <div class="flex items-center gap-3">
            <button
              @click="qty--"
              :disabled="qty <= 1"
              class="px-3 py-1 border rounded"
            >−</button>

            <span class="w-10 text-center">{{ qty }}</span>

            <button
              @click="qty++"
              :disabled="qty >= seatsLeft"
              class="px-3 py-1 border rounded"
            >+</button>
          </div>

          <p class="text-sm text-gray-500">
            {{ seatsLeft === Infinity ? 'Unlimited seats' : `${seatsLeft} seats available` }}
          </p>
        </div>

        <!-- PRICE BREAKDOWN -->
        <div class="border-t pt-4 space-y-2">
          <div class="flex justify-between">
            <span>Price per seat</span>
            <span>₹{{ unitPrice }}</span>
          </div>

          <div class="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>₹{{ total }}</span>
          </div>
        </div>

        <!-- ERROR -->
        <p v-if="error" class="text-red-600 text-sm">
          {{ error }}
        </p>

        <!-- CONFIRM -->
        <button
          @click="confirmBooking"
          :disabled="submitting"
          class="w-full bg-black text-white py-3 rounded text-lg hover:opacity-90"
        >
          {{ submitting ? 'Processing…' : 'Confirm & Continue' }}
        </button>
      </div>
    </div>
  </section>
</template>
