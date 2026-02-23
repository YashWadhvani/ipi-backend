<template>
  <div class="w-full space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-semibold">Create Event</h1>

      <NuxtLink
        to="/dashboard/events"
        class="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-[#ccc] hover:bg-gray-50"
      >
        ← Back
      </NuxtLink>
    </div>

    <EventForm
      :chapters="chapters"
      submitLabel="Create Event"
      @submit="create"
    />
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard',
  middleware: ['auth-admin-client']
})

import { ref, onMounted, toRaw } from 'vue'
import { navigateTo } from '#imports'
import EventForm from '@/components/events/EventForm.vue'
import { listChapters } from '@/services/chaptersServices'
import { createEvent, uploadEventAssets } from '@/services/eventsServices'
import { useSnackbar } from '@/services/useSnackbar'

const { show } = useSnackbar()
const chapters = ref([])

/* ----------------------------------------------------
   CREATE FLOW
---------------------------------------------------- */
const create = async ({ form, sponsors, photos }) => {
  try {
    /* ----------------------------------------
       1️⃣ COLLECT FILES
    ---------------------------------------- */
    const sponsorFiles = sponsors.filter(s => s.file).map(s => s.file)
    const photoFiles = photos.map(p => p.file).filter(Boolean)

    /* ----------------------------------------
       2️⃣ UPLOAD ASSETS
    ---------------------------------------- */
    const assets = await uploadEventAssets({
      sponsorLogos: sponsorFiles,
      photos: photoFiles
    })

    /* ----------------------------------------
       3️⃣ RESOLVE SPONSORS
    ---------------------------------------- */
    let sponsorFileIdx = 0
    const resolvedSponsors = sponsors.map(s => {
      const logoUrl = s.file
        ? assets.sponsorLogos?.[sponsorFileIdx++]?.url ?? null
        : s.logoUrl ?? null

      return {
        name: s.name,
        order: s.order ?? null,
        logoUrl
      }
    })

    /* ----------------------------------------
       4️⃣ RESOLVE PHOTOS
    ---------------------------------------- */
    let photoFileIdx = 0
    const resolvedPhotos = photos
      .filter(p => p.file)
      .map(p => ({
        url: assets.photos?.[photoFileIdx++]?.url,
        caption: p.caption ?? null,
        order: p.order ?? null
      }))
      .filter(p => !!p.url)

    /* ----------------------------------------
       5️⃣ BUILD FINAL PAYLOAD (🔥 IMPORTANT)
    ---------------------------------------- */
    const payload = {
      ...toRaw(form), // 🔥 removes Vue Proxy (CRITICAL FIX)
      guestCostPerPerson:
        form.guestCostPerPerson !== undefined
          ? form.guestCostPerPerson
          : null,
      sponsors: resolvedSponsors,
      photos: resolvedPhotos
    }

    console.log('FINAL EVENT PAYLOAD →', payload)

    /* ----------------------------------------
       6️⃣ CREATE EVENT
    ---------------------------------------- */
    const created = await createEvent(payload)

    console.log('CREATED EVENT →', created)

    show('Event created successfully', 'success')
    await navigateTo(`/dashboard/events/${created.id}/edit`)
  } catch (err) {
    console.error(err)
    show('Failed to create event', 'error')
  }
}

/* ----------------------------------------------------
   LOAD CHAPTERS
---------------------------------------------------- */
onMounted(async () => {
  try {
    const res = await listChapters({
      page: 1,
      pageSize: 200,
      status: 'active'
    })
    chapters.value = res.items || []
  } catch {
    chapters.value = []
  }
})
</script>
