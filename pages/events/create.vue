<template>
    <div class="max-w-4xl mx-auto space-y-4">
      <!-- HEADER -->
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-xl font-semibold">
          {{ isEditMode ? 'Edit Chapter Event' : 'Create Chapter Event' }}
        </h1>
  
        <NuxtLink to="/events" class="text-sm text-blue-700">
          Back to events
        </NuxtLink>
      </div>
  
      <!-- GUARD -->
      <div
        v-if="!myLeadershipChapters.length && !loadingMe"
        class="bg-red-50 border border-red-200 text-red-700 rounded p-4 text-sm"
      >
        You are not part of any chapter leadership. You cannot create events.
      </div>
  
      <form
        v-else
        @submit.prevent="save"
        class="bg-white border rounded p-4 space-y-6"
      >
        <!-- BASICS -->
        <section class="space-y-3">
          <h2 class="font-semibold">Basics</h2>
  
          <input
            v-model="f.name"
            placeholder="Event name"
            class="border rounded px-3 py-2 w-full"
            required
          />
  
          <textarea
            v-model="f.description"
            placeholder="Description"
            class="border rounded px-3 py-2 w-full"
            rows="4"
          />
  
          <div class="grid md:grid-cols-2 gap-3">
            <input
              v-model="f.venue"
              placeholder="Venue"
              class="border rounded px-3 py-2 w-full"
            />
            <input
              v-model="f.mapsUrl"
              placeholder="Google Maps URL"
              class="border rounded px-3 py-2 w-full"
            />
          </div>
  
          <div class="grid md:grid-cols-2 gap-3">
            <div>
              <label class="text-sm text-gray-600">Starts At</label>
              <input
                v-model="startsLocal"
                type="datetime-local"
                class="border rounded px-3 py-2 w-full"
                required
              />
            </div>
  
            <div>
              <label class="text-sm text-gray-600">Ends At</label>
              <input
                v-model="endsLocal"
                type="datetime-local"
                class="border rounded px-3 py-2 w-full"
              />
            </div>
          </div>
  
          <div class="grid md:grid-cols-3 gap-3">
            <input
              v-model.number="f.capacity"
              type="number"
              placeholder="Capacity"
              class="border rounded px-3 py-2 w-full"
            />
            <input
              v-model.number="f.costPerPerson"
              type="number"
              placeholder="Cost per person"
              class="border rounded px-3 py-2 w-full"
            />
            <input
              v-model.number="f.perBookingMax"
              type="number"
              min="1"
              placeholder="Max per booking"
              class="border rounded px-3 py-2 w-full"
            />
          </div>
  
          <textarea
            v-model="f.note"
            placeholder="Additional note"
            class="border rounded px-3 py-2 w-full"
            rows="3"
          />
        </section>
  
        <!-- CHAPTER -->
        <section class="space-y-2">
          <h2 class="font-semibold">Chapter</h2>
  
          <select
            v-model="f.chapterId"
            :disabled="isEditMode"
            class="border rounded px-3 py-2 w-full"
            required
          >
            <option disabled value="">Select chapter</option>
            <option
              v-for="c in myLeadershipChapters"
              :key="c.id"
              :value="c.chapter.id"
            >
              {{ c.chapter.name }} ({{ c.role }})
            </option>
          </select>
  
          <p v-if="isEditMode" class="text-xs text-gray-500">
            Chapter cannot be changed once the event is created.
          </p>
        </section>
  
        <!-- PHOTOS -->
        <section class="space-y-3">
          <div class="flex items-center justify-between">
            <h2 class="font-semibold">Photos / Banners</h2>
  
            <label
              v-if="photoPreviews.length < 5"
              class="text-sm px-3 py-2 border rounded cursor-pointer"
            >
              Select photos
              <input
                type="file"
                class="hidden"
                multiple
                accept="image/*"
                @change="onPhotos"
              />
            </label>
          </div>
  
          <!-- PREVIEW GRID -->
          <div class="grid grid-cols-3 md:grid-cols-5 gap-3">
            <div
              v-for="(p, i) in photoPreviews"
              :key="i"
              class="relative border rounded overflow-hidden group"
            >
              <img
                :src="p.url"
                class="h-24 w-full object-cover"
              />
  
              <!-- REMOVE -->
              <button
                type="button"
                class="absolute top-1 right-1 bg-black/70 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100"
                @click="removePhoto(i)"
              >
                ✕
              </button>
            </div>
          </div>
  
          <p class="text-xs text-gray-500">
            Max 5 photos · Max size 2MB each
          </p>
        </section>
  
        <!-- ACTION -->
        <div class="flex items-center gap-3">
          <button
            type="submit"
            :disabled="saving"
            class="px-4 py-2 bg-black text-white rounded"
          >
            {{
              saving
                ? (isEditMode ? 'Updating...' : 'Creating...')
                : (isEditMode ? 'Update Event' : 'Create Event')
            }}
          </button>
  
          <span class="text-sm text-gray-600">{{ msg }}</span>
        </div>
      </form>
    </div>
  </template>
  
  
  <script setup>
  definePageMeta({ layout: 'member', middleware: ['member-auth'] })
  
    import { ref, computed, onMounted } from 'vue'
    import { useRoute } from 'vue-router'
    import { createEvent, uploadEventAssets } from '@/services/eventsServices'
    import { http, assetUrl } from '@/services/http'
    import { useSnackbar } from '@/services/useSnackbar'


  /* ----------------------------------
     ROUTE / MODE
  ---------------------------------- */
  const route = useRoute()
  const editEventId = computed(() => route.query.edit || null)
  const isEditMode = computed(() => !!editEventId.value)
  
  /* ----------------------------------
     STATE
  ---------------------------------- */
  const { show } = useSnackbar()
  
  const me = ref(null)
  const loadingMe = ref(true)
  
  const f = ref({
    name: '',
    description: '',
    venue: '',
    mapsUrl: '',
    capacity: null,
    costPerPerson: null,
    perBookingMax: 1,
    note: '',
    chapterId: ''
  })
  
  const startsLocal = ref('')
  const endsLocal = ref('')
  
  const existingPhotos = ref([]) // urls from backend
  const newPhotos = ref([])      // File objects
  const photoPreviews = ref([])  // { url, file?, existing? }
  
  const saving = ref(false)
  const msg = ref('')
  
  /* ----------------------------------
     CONSTANTS
  ---------------------------------- */
  const MAX_PHOTOS = 5
  const MAX_SIZE = 2 * 1024 * 1024 // 2MB
  
  const toIso = (v) => (v ? new Date(v).toISOString() : null)
  
  /* ----------------------------------
     LOAD EVENT (EDIT MODE)
  ---------------------------------- */
  const loadEventForEdit = async () => {
    if (!editEventId.value) return
  
    try {
      const r = await http.get(`/events/${editEventId.value}`)
      const ev = r.data
  
      f.value = {
        name: ev.name || '',
        description: ev.description || '',
        venue: ev.venue || '',
        mapsUrl: ev.mapsUrl || '',
        capacity: ev.capacity,
        costPerPerson: ev.costPerPerson,
        perBookingMax: ev.perBookingMax || 1,
        note: ev.note || '',
        chapterId: ev.chapterId
      }
  
      startsLocal.value = ev.startsAt
        ? new Date(ev.startsAt).toISOString().slice(0, 16)
        : ''
  
      endsLocal.value = ev.endsAt
        ? new Date(ev.endsAt).toISOString().slice(0, 16)
        : ''
  
        existingPhotos.value = (ev.photos || []).map(p => assetUrl(p.url))

        photoPreviews.value = existingPhotos.value.map(url => ({
            url,
            existing: true
        }))

    } catch {
      show('Failed to load event for editing', 'error')
    }
  }
  
  /* ----------------------------------
     LEADERSHIP CHAPTERS
  ---------------------------------- */
  const myLeadershipChapters = computed(() => {
    const chapters = me.value?.member?.chapters || []
    return Array.isArray(chapters)
      ? chapters.filter(c => c.role && c.role !== 'MEMBER')
      : []
  })
  
  /* ----------------------------------
     PHOTO HANDLING
  ---------------------------------- */
  const onPhotos = (e) => {
    const files = Array.from(e.target.files || [])
  
    for (const file of files) {
      if (photoPreviews.value.length >= MAX_PHOTOS) {
        show(`Maximum ${MAX_PHOTOS} photos allowed`, 'error')
        break
      }
  
      if (file.size > MAX_SIZE) {
        show(`${file.name} exceeds 2MB limit`, 'error')
        continue
      }
  
      const url = URL.createObjectURL(file)
      newPhotos.value.push(file)
      photoPreviews.value.push({ url, file })
    }
  
    e.target.value = ''
  }
  
  const removePhoto = (index) => {
    const p = photoPreviews.value[index]
  
    if (p.file) {
      newPhotos.value = newPhotos.value.filter(f => f !== p.file)
    } else {
      existingPhotos.value = existingPhotos.value.filter(url => url !== p.url)
    }
  
    photoPreviews.value.splice(index, 1)
  }
  
  /* ----------------------------------
     AUTH
  ---------------------------------- */
  const fetchMe = async () => {
    if (!process.client) return
    try {
      const r = await http.get('/me')
      me.value = r.data
    } catch {
      me.value = null
    } finally {
      loadingMe.value = false
    }
  }
  
  /* ----------------------------------
     SAVE (CREATE / UPDATE)
  ---------------------------------- */
  const save = async () => {
    if (!f.value.chapterId) {
      msg.value = 'Please select a chapter'
      return
    }
  
    saving.value = true
    msg.value = ''
  
    try {
        const payload = {
                name: f.value.name,
                description: f.value.description,
                venue: f.value.venue,
                mapsUrl: f.value.mapsUrl,
                capacity: f.value.capacity,
                costPerPerson: f.value.costPerPerson,
                perBookingMax: f.value.perBookingMax,
                note: f.value.note,
                scope: 'CHAPTER',
                startsAt: toIso(startsLocal.value),
                endsAt: toIso(endsLocal.value) || undefined
            }

            // Only include chapterId when creating
            if (!isEditMode.value) {
                payload.chapterId = f.value.chapterId
            }

  
      let eventId
  
      if (isEditMode.value) {
        await http.patch(`/events/${editEventId.value}`, payload)
        eventId = editEventId.value
        show('Event updated successfully', 'success')
      } else {
        const created = await createEvent(payload)
        eventId = created.id
        show('Event created successfully', 'success')
      }
  
      if (newPhotos.value.length) {
        await uploadEventAssets(eventId, newPhotos.value)
      }
  
      await navigateTo('/events')
    } catch (e) {
      msg.value = e?.response?.data?.message || 'Failed to save event'
    } finally {
      saving.value = false
    }
  }
  
  /* ----------------------------------
     MOUNT
  ---------------------------------- */
  onMounted(async () => {
    await fetchMe()
    if (isEditMode.value) {
      await loadEventForEdit()
    }
  })
  </script>
  

  <style scoped>
  
  </style>
  