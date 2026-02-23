<template>
  <form
    @submit.prevent="submit"
    class="max-w-5xl mx-auto space-y-10 pb-20"
  >

    <!-- BASIC INFO -->
    <section class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h2 class="text-lg font-semibold text-gray-900 mb-6">Basic Info</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Event name
          </label>
          <input
            v-model="form.name"
            required
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
                   focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Venue
          </label>
          <input
            v-model="form.venue"
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
                   focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black"
          />
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            v-model="form.description"
            rows="3"
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
                   focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black"
          />
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Google Maps URL
          </label>
          <input
            v-model="form.mapsUrl"
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
                   focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black"
          />
        </div>
      </div>
    </section>

    <!-- EVENT SCOPE -->
    <section class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Event Scope</h2>

      <div class="flex gap-10">
        <label class="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            value="GLOBAL"
            v-model="form.scope"
            class="accent-black"
          />
          <span class="text-sm font-medium text-gray-700">
            Global Event
          </span>
        </label>

        <label class="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            value="CHAPTER"
            v-model="form.scope"
            class="accent-black"
          />
          <span class="text-sm font-medium text-gray-700">
            Chapter Event
          </span>
        </label>
      </div>
    </section>

    <!-- CHAPTER SELECT -->
    <section
      v-if="form.scope === 'CHAPTER'"
      class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
    >
      <h2 class="text-lg font-semibold text-gray-900 mb-4">
        Select Chapters
      </h2>

      <select
        multiple
        v-model="form.chapterIds"
        class="w-full h-40 rounded-md border border-gray-300 px-3 py-2 text-sm
               focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black"
      >
        <option v-for="c in chapters" :key="c.id" :value="c.id">
          {{ c.name }}
        </option>
      </select>

      <p class="text-xs text-gray-500 mt-2">
        Hold Ctrl / Cmd to select multiple chapters
      </p>
    </section>

    <!-- SCHEDULE -->
    <section class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h2 class="text-lg font-semibold text-gray-900 mb-6">Schedule</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Start date & time
          </label>
          <input
            type="datetime-local"
            v-model="startsLocal"
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
                   focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            End date & time
          </label>
          <input
            type="datetime-local"
            v-model="endsLocal"
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
                   focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black"
          />
        </div>
      </div>
    </section>

    <!-- PRICING -->
    <section class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h2 class="text-lg font-semibold text-gray-900 mb-6">
        Pricing & Capacity
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Capacity
          </label>
          <input
            type="number"
            min="1"
            v-model.number="form.capacity"
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
                   focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Price per person (₹)
          </label>
          <input
            type="number"
            min="0"
            v-model.number="form.costPerPerson"
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
                   focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black"
          />
          <p class="text-xs text-gray-500 mt-1">Set 0 for free events</p>
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Guest price per person (₹)
            </label>
            <input
              type="number"
              min="0"
              v-model.number="form.guestCostPerPerson"
              class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
                    focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black"
            />
            <p class="text-xs text-gray-500 mt-1">
              Used for walk-ins / QR registrations
            </p>
          </div>


        

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Max per booking
          </label>
          <input
            type="number"
            min="1"
            v-model.number="form.perBookingMax"
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
                   focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black"
          />
        </div>
      </div>

      <div class="mt-5">
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Internal note
        </label>
        <textarea
          rows="2"
          v-model="form.note"
          class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
                 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black"
        />
      </div>
    </section>

    <!-- SPONSORS -->
    <section class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div class="flex justify-between items-center mb-5">
        <h2 class="text-lg font-semibold text-gray-900">Sponsors</h2>
        <button
          type="button"
          @click="addSponsor"
          class="text-sm px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-100"
        >
          + Add Sponsor
        </button>
      </div>

      <div
        v-for="(s, i) in sponsors"
        :key="i"
        class="grid grid-cols-[100px,1fr,1fr,90px,40px] gap-4 items-center mb-4"
      >
        <div
          class="h-20 w-24 rounded-md border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden"
        >
          <img
            v-if="s.file || s.logoUrl"
            :src="previewImage(s)"
            class="h-full object-contain"
          />
          <span v-else class="text-xs text-gray-400">No logo</span>
        </div>

        <input
          type="file"
          accept="image/*"
          @change="e => onSponsorFile(e, i)"
          class="text-xs text-gray-600"
        />

        <input
          v-model="s.name"
          placeholder="Company name"
          class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
                 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black"
        />

        <input
          type="number"
          v-model.number="s.order"
          placeholder="Order"
          class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-center
                 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black"
        />

        <button
          type="button"
          @click="removeSponsor(i)"
          class="text-red-600 hover:text-red-800"
        >
          ✕
        </button>
      </div>
    </section>

    <!-- PHOTOS -->
    <section class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-gray-900">Event Photos</h2>
        <input
          type="file"
          multiple
          accept="image/*"
          @change="onPhotos"
          class="text-sm"
        />
      </div>

      <div
        v-for="(p, i) in photos"
        :key="i"
        class="grid grid-cols-[120px,1fr,100px,40px] gap-4 items-center mb-4"
      >
        <img
          :src="previewImage(p)"
          class="h-24 w-28 object-cover rounded-md border border-gray-200"
        />

        <input
          v-model="p.caption"
          placeholder="Caption"
          class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
                 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black"
        />

        <input
          type="number"
          v-model.number="p.order"
          class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-center
                 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black"
        />

        <button
          type="button"
          @click="removePhoto(i)"
          class="text-red-600 hover:text-red-800"
        >
          ✕
        </button>
      </div>
    </section>

    <!-- ACTION -->
    <section class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex justify-end">
      <button
        class="inline-flex items-center justify-center min-w-[160px]
               rounded-md bg-black text-white px-6 py-2 text-sm font-medium
               hover:opacity-90 transition"
      >
        {{ submitLabel }}
      </button>
    </section>

  </form>
</template>

  
  <script setup>
import { ref, watch } from 'vue'
import { assetUrl } from '@/services/http' // ✅ FIX
import {
  istToUtcIso,
  utcToInputLocal
} from '@/utils/time'


const props = defineProps({
  chapters: Array,
  submitLabel: String,
  initialData: Object
})

const emit = defineEmits(['submit'])

const form = ref({
  name: '',
  description: '',
  venue: '',
  mapsUrl: '',
  capacity: null,
  costPerPerson: null,
  guestCostPerPerson: null, // ✅ ADD THIS
  perBookingMax: 1,
  note: '',
  scope: 'GLOBAL',
  chapterIds: []
})


const startsLocal = ref('')
const endsLocal = ref('')

// ✅ These must exist if you show logos/photos
const sponsors = ref([])
const photos = ref([])

const previewImage = (item) => {
  if (!item) return ''
  if (item.file) return URL.createObjectURL(item.file)
  if (item.logoUrl) return assetUrl(item.logoUrl)
  if (item.url) return assetUrl(item.url)
  return ''
}

watch(
  () => props.initialData,
  (v) => {
    if (!v) return

    // mutate fields (don’t replace object)
    form.value.name = v.name ?? ''
    form.value.description = v.description ?? ''
    form.value.venue = v.venue ?? ''
    form.value.mapsUrl = v.mapsUrl ?? ''

    form.value.capacity = v.capacity ?? null
    form.value.costPerPerson = v.costPerPerson ?? null
    form.value.guestCostPerPerson = v.guestCostPerPerson ?? null 
    form.value.perBookingMax = v.perBookingMax ?? 1

    form.value.note = v.note ?? ''

    form.value.scope = v.scope ?? 'GLOBAL'
    form.value.chapterIds = Array.isArray(v.chapterIds) ? [...v.chapterIds] : []

    startsLocal.value = utcToInputLocal(v.startsAt)
    endsLocal.value = utcToInputLocal(v.endsAt)

    // ✅ hydrate sponsors/photos for previews
    sponsors.value = (v.sponsors || []).map(s => ({
      name: s.name ?? '',
      order: s.order ?? null,
      logoUrl: s.logoUrl ?? null,
      file: null
    }))

    photos.value = (v.photos || []).map(p => ({
      url: p.url ?? null,
      caption: p.caption ?? '',
      order: p.order ?? null,
      file: null
    }))
  },
  { immediate: true }
)

watch(() => form.value.scope, (v) => {
  if (v === 'GLOBAL') form.value.chapterIds = []
})

/* ---------------- SPONSORS ---------------- */
const addSponsor = () => sponsors.value.push({ name: '', order: null, logoUrl: null, file: null })
const onSponsorFile = (e, i) => { sponsors.value[i].file = e.target.files?.[0] || null }
const removeSponsor = (i) => sponsors.value.splice(i, 1)

/* ---------------- PHOTOS ---------------- */
const onPhotos = (e) => {
  const incoming = Array.from(e.target.files || [])
  incoming.forEach(f => {
    const exists = photos.value.some(p => p.file && p.file.name === f.name && p.file.size === f.size)
    if (!exists) photos.value.push({ file: f, url: null, caption: '', order: null })
  })
  e.target.value = ''
}


const removePhoto = (i) => photos.value.splice(i, 1)

/* ---------------- SUBMIT ---------------- */
const submit = () => {
  emit('submit', {
    form: {
      ...form.value,
      startsAt: istToUtcIso(startsLocal.value),
      endsAt: istToUtcIso(endsLocal.value),
    },
    sponsors: sponsors.value,
    photos: photos.value
  })
}
</script>
