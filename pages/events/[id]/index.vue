<template>
    <div class="w-full mx-auto px-4 py-6">
      <!-- LOADING -->
      <div v-if="loading" class="text-center py-20 text-gray-500">
        Loading event…
      </div>
  
      <!-- ERROR -->
      <div
        v-else-if="error"
        class="bg-red-50 border border-red-200 text-red-700 p-4 rounded"
      >
        {{ error }}
      </div>
  
      <!-- CONTENT -->
      <div v-else class="grid md:grid-cols-[1fr_380px] gap-8">
        <!-- LEFT : EVENT DETAILS -->
        <div class="space-y-6">
          <!-- HEADER -->
          <div class="space-y-2">
            <h1 class="text-3xl font-semibold">
              {{ event.name }}
            </h1>
  
            <div class="text-sm text-gray-600 flex flex-wrap gap-3">
              <span>{{ formatDate(event.startsAt) }}</span>
              <span v-if="event.endsAt">→ {{ formatDate(event.endsAt) }}</span>
              <span v-if="event.venue">• {{ event.venue }}</span>
            </div>
  
            <div
              v-if="event.chapter"
              class="inline-block text-xs bg-gray-100 px-2 py-1 rounded"
            >
              Chapter: {{ event.chapter.name }}
            </div>
          </div>
  
          <!-- DESCRIPTION -->
          <div v-if="event.description" class="prose max-w-none">
            <p>{{ event.description }}</p>
          </div>
  
          <!-- META INFO -->
          <div class="grid sm:grid-cols-3 gap-4 text-sm">
            <div v-if="event.capacity">
              <strong>Capacity:</strong> {{ event.capacity }}
            </div>
  
            <div v-if="event.perBookingMax">
              <strong>Max per booking:</strong> {{ event.perBookingMax }}
            </div>
  
            <div v-if="event.costPerPerson">
              <strong>Cost:</strong> ₹{{ event.costPerPerson }} / person
            </div>
          </div>
  
          <!-- SPONSORS -->
          <div v-if="event.sponsors?.length" class="space-y-3">
            <h3 class="font-semibold">Sponsors</h3>
  
            <div class="flex flex-wrap gap-4">
              <div
                v-for="s in event.sponsors"
                :key="s.id"
                class="border rounded p-3 flex items-center gap-3"
              >
                <img
                  v-if="s.logoUrl"
                  :src="assetUrl(s.logoUrl)"
                  class="h-10 object-contain"
                />
                <span class="text-sm font-medium">
                  {{ s.name }}
                </span>
              </div>
            </div>
          </div>
  
          <!-- NOTE -->
          <div v-if="event.note" class="text-sm text-gray-500">
            {{ event.note }}
          </div>
  
          <!-- PHOTOS (UNIFORM GRID, AFTER CONTENT) -->
          <div
            v-if="event.photos?.length"
            class="space-y-2"
          >
            <h3 class="font-semibold">Event Photos</h3>
  
            <div
              class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              <div
                v-for="p in event.photos"
                :key="p.id"
                class="w-full aspect-square overflow-hidden rounded border bg-gray-100"
              >
                <img
                  :src="assetUrl(p.url)"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
  
        <!-- RIGHT : CHECKOUT -->
        <div class="sticky top-24 h-fit">
          <div class="border rounded-lg p-4 space-y-4 bg-white">
            <h2 class="font-semibold text-lg">
              Event Registration
            </h2>
  
            <!-- MEMBER INFO -->
            <div class="text-sm text-gray-600 space-y-1">
              <div>
                <strong>Name:</strong> {{ me?.member?.name }}
              </div>
              <div>
                <strong>Email:</strong> {{ me?.user?.email }}
              </div>
              <div v-if="me?.user?.phone">
                <strong>Phone:</strong> {{ me.user.phone }}
              </div>
            </div>
  
            <hr />
  
            <!-- QTY -->
            <div class="space-y-1">
              <label class="text-sm font-medium">
                Quantity
              </label>
              <input
                v-model.number="qty"
                type="number"
                min="1"
                :max="event.perBookingMax || undefined"
                class="w-full border rounded px-3 py-2"
              />
            </div>
  
            <!-- PRICE -->
            <div class="flex justify-between text-sm">
              <span>Total</span>
              <strong v-if="event.costPerPerson">
                ₹{{ totalAmount }}
              </strong>
              <strong v-else>Free</strong>
            </div>
  
            <!-- ACTION -->
            <button
              @click="register"
              :disabled="registering"
              class="w-full px-4 py-2 bg-black text-white rounded hover:opacity-90 disabled:opacity-50"
            >
              {{ registering ? 'Registering…' : 'Confirm Registration' }}
            </button>
  
            <p class="text-xs text-gray-500">
              By registering, you agree to attend this event.
            </p>
  
            <p class="text-sm text-gray-600">
              {{ message }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  
  <script setup>
    definePageMeta({
      layout: 'member',
      middleware: ['member-auth'],
    })

  import { ref, computed, onMounted } from 'vue'
  import { useRoute } from '#app'
  import { http, assetUrl } from '@/services/http'
  import { useSnackbar } from '@/services/useSnackbar'

  const route = useRoute()
  const { show } = useSnackbar()

  const event = ref(null)
  const me = ref(null)

  const loading = ref(true)
  const error = ref(null)

  const qty = ref(1)
  const registering = ref(false)
  const message = ref('')

  /* FETCH EVENT */
  const loadEvent = async () => {
    try {
      const r = await http.get(`/events/${route.params.id}`)
      event.value = r.data
    } catch (e) {
      error.value =
        e?.response?.status === 403
          ? 'You are not allowed to view this event.'
          : 'Event not found.'
    }
  }

  /* FETCH ME */
  const fetchMe = async () => {
    const r = await http.get('/me')
    me.value = r.data
  }

  /* REGISTER */
  const totalAmount = computed(() =>
    event.value?.costPerPerson
      ? qty.value * event.value.costPerPerson
      : 0
  )

  const register = async () => {
    registering.value = true
    message.value = ''

    try {
      await http.post(`/events/${event.value.id}/register`, {
        qty: qty.value,
        asMember: true, // 👈 IMPORTANT
      })

      show('Registration successful', 'success')
      message.value = 'You are registered.'
    } catch (e) {
      message.value =
        e?.response?.data?.message ||
        'Registration failed'
    } finally {
      registering.value = false
    }
}


  const formatDate = (d) =>
    new Date(d).toLocaleString()

  onMounted(async () => {
    loading.value = true
    await Promise.all([loadEvent(), fetchMe()])
    loading.value = false
  })
</script>

  

  
  <style scoped>
  .prose p {
    white-space: pre-line;
  }
  </style>
  