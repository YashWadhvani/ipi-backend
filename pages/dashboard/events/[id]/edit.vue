<template>
  <div class="w-full space-y-6">
    <!-- HEADER -->
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-semibold">Edit Event</h1>

      <NuxtLink
        to="/dashboard/events"
        class="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-[#ccc] hover:bg-gray-50"
      >
        ← Back
      </NuxtLink>
    </div>

    <!-- FORM -->
    <EventForm
      v-if="event"
      :chapters="chapters"
      :initialData="event"
      submitLabel="Update Event"
      @submit="update"
    />
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard',
  middleware: ['auth-admin-client']
})

import { ref, onMounted } from 'vue'
import { useRoute, navigateTo } from '#imports'
import EventForm from '@/components/events/EventForm.vue'
import { getEvent, updateEvent, uploadEventAssets } from '@/services/eventsServices'
import { listChapters } from '@/services/chaptersServices'
import { useSnackbar } from '@/services/useSnackbar'

const route = useRoute()
const { show } = useSnackbar()

const event = ref(null)
const chapters = ref([])

/* ----------------------------------------------------
   LOAD EVENT + NORMALIZE FOR FORM
---------------------------------------------------- */
onMounted(async () => {
  try {
    const [ev, ch] = await Promise.all([
      getEvent(route.params.id),
      listChapters({ page: 1, pageSize: 200, status: 'active' })
    ])

    console.log(ev)

    // 🔥 THIS IS THE MOST IMPORTANT PART
    event.value = {
      // basic fields
      id: ev.id,
      name: ev.name,
      description: ev.description,
      venue: ev.venue,
      mapsUrl: ev.mapsUrl,

      capacity: ev.capacity,
      costPerPerson: ev.costPerPerson,
      perBookingMax: ev.perBookingMax,
      note: ev.note,
      guestCostPerPerson: ev.guestCostPerPerson, 

      scope: ev.scope,
      startsAt: ev.startsAt,
      endsAt: ev.endsAt,

      // 🔴 REQUIRED BY EventForm
      chapterIds: ev.chapters?.map(c => c.chapterId) || [],

      // pass-through for submit
      sponsors: ev.sponsors || [],
      photos: ev.photos || []
    }

    chapters.value = ch.items || []
  } catch (e) {
    console.error(e)
    show('Failed to load event', 'error')
    navigateTo('/dashboard/events')
  }
})

/* ----------------------------------------------------
   UPDATE FLOW (MATCHES CREATE)
---------------------------------------------------- */
const update = async ({ form, sponsors, photos }) => {
  try {
    // 1️⃣ collect new files only
    const sponsorFiles = sponsors.filter(s => s.file).map(s => s.file)
    const photoFiles = photos.map(p => p.file).filter(Boolean)

    // 2️⃣ upload assets if needed
    const assets =
      sponsorFiles.length || photoFiles.length
        ? await uploadEventAssets({
            sponsorLogos: sponsorFiles,
            photos: photoFiles
          })
        : { sponsorLogos: [], photos: [] }

    // 3️⃣ resolve sponsors
    let sponsorIdx = 0
    const resolvedSponsors = sponsors.map(s => ({
      name: s.name,
      order: s.order ?? null,
      logoUrl: s.file
        ? assets.sponsorLogos?.[sponsorIdx++]?.url ?? null
        : s.logoUrl ?? null
    }))

    // 4️⃣ resolve photos (full replacement)
    let photoIdx = 0
    const resolvedPhotos = photos
      .map(p => {
        const url = p.file
          ? assets.photos?.[photoIdx++]?.url
          : p.url

        return url
          ? {
              url,
              caption: p.caption ?? null,
              order: p.order ?? null
            }
          : null
      })
      .filter(Boolean)

    // 5️⃣ update event
    await updateEvent(route.params.id, {
      ...form,
      sponsors: resolvedSponsors,
      photos: resolvedPhotos
    })

    show('Event updated successfully', 'success')
    navigateTo('/dashboard/events')
  } catch (e) {
    console.error(e)
    show(e?.response?.data?.message || 'Update failed', 'error')
  }
}
</script>
