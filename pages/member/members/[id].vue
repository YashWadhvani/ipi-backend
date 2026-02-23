<template>
  <div class="space-y-6">
    <!-- Back -->
    <div class="flex items-center">
      <NuxtLink
        to="/member/members"
        class="group inline-flex items-center gap-2 px-3 py-2 rounded-md border border-[#ccc] bg-white text-gray-800
              hover:bg-gray-50 active:bg-gray-100 shadow-sm"
      >
        <svg class="h-4 w-4 group-hover:-translate-x-0.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15 18 9 12l6-6" />
        </svg>
        <span class="text-sm font-medium">Back to Members</span>
      </NuxtLink>
    </div>

    <!-- Header -->
    <div v-if="mReady" class="bg-white border border-[#ccc] rounded-md p-4">
      <div class="flex items-start gap-4">
        <img
          :src="photoSrc"
          class="h-24 w-24 rounded-full object-cover border border-[#ccc]"
          alt="photo"
          @error="imgErr = true"
        />

        <div class="flex-1 min-w-0">
          <h1 class="text-xl font-semibold truncate">{{ field(m.name) }}</h1>

          <p class="text-sm text-gray-600 mt-1">
            <span v-if="m.designation">{{ m.designation }}</span>
            <span v-if="m.designation && m.company"> @ </span>
            <span>{{ field(m.company) }}</span>
          </p>

          <div class="text-xs text-gray-500 mt-1">
            <span v-if="m.city">{{ m.city }}</span>
            <span v-if="m.state">, {{ m.state }}</span>
            <span v-if="m.industry"> • {{ m.industry }}</span>
          </div>

          <p class="text-sm text-gray-800 mt-2">
            {{ field(m.profile?.headline) }}
          </p>
        </div>
      </div>
    </div>

    <div v-else-if="loading" class="text-center text-gray-500 py-12">
      Loading…
    </div>

    <div v-else class="text-center text-gray-500 py-12">
      Member not found.
    </div>

    <!-- Content -->
    <div v-if="mReady" class="grid md:grid-cols-3 gap-6">
      <!-- LEFT -->
      <div class="md:col-span-2 space-y-6">
        <!-- Bio -->
        <section class="bg-white border border-[#ccc] rounded-md p-4 space-y-3">
          <h2 class="font-semibold">Biography & Business</h2>

          <div>
            <div class="text-sm text-gray-700 mb-1">Biography</div>
            <p v-if="m.profile?.about">{{ m.profile.about }}</p>
            <p v-else class="italic text-gray-400">
              This member hasn’t added a biography yet.
            </p>
          </div>

          <div>
            <div class="text-sm text-gray-700 mb-1">Business description</div>
            <p class="whitespace-pre-wrap">
              {{ field(m.profile?.businessDescription) }}
            </p>
          </div>
        </section>

        <!-- Address -->
        <section class="bg-white border border-[#ccc] rounded-md p-4 space-y-3">
          <h2 class="font-semibold">Company Address</h2>

          <div class="grid md:grid-cols-2 gap-3 text-sm">
            <div><div class="text-gray-500">Line 1</div>{{ field(addr.line1) }}</div>
            <div><div class="text-gray-500">Line 2</div>{{ field(addr.line2) }}</div>
            <div><div class="text-gray-500">City</div>{{ field(addr.city) }}</div>
            <div><div class="text-gray-500">State</div>{{ field(addr.state) }}</div>
            <div><div class="text-gray-500">Pincode</div>{{ field(addr.pincode) }}</div>
            <div><div class="text-gray-500">Country</div>{{ field(addr.country) }}</div>
          </div>
        </section>

        <!-- Company -->
        <section class="bg-white border border-[#ccc] rounded-md p-4 space-y-3">
          <h2 class="font-semibold">Company Details</h2>

          <div class="grid md:grid-cols-2 gap-3 text-sm">
            <div><div class="text-gray-500">Industry</div>{{ field(m.industry) }}</div>
            <div><div class="text-gray-500">GST Number</div>{{ field(m.profile?.gstNumber) }}</div>
          </div>
        </section>
      </div>

      <!-- RIGHT -->
      <div class="space-y-6">
        <!-- Links -->
        <section class="bg-white border border-[#ccc] rounded-md p-4 space-y-2">
          <h2 class="font-semibold">Links</h2>

          <ul class="space-y-2 text-sm">
            <li v-for="(val, label) in links" :key="label" class="flex justify-between gap-2">
              <span class="text-gray-500">{{ label }}</span>
              <a
                v-if="val"
                :href="safeUrl(val)"
                target="_blank"
                class="text-blue-700 hover:underline truncate"
              >
                {{ val }}
              </a>
              <span v-else>—</span>
            </li>
          </ul>
        </section>

        <!-- Contact -->
        <section class="bg-white border border-[#ccc] rounded-md p-4 space-y-2">
          <h2 class="font-semibold">Contact</h2>

          <div class="text-sm space-y-1">
            <div class="flex justify-between">
              <span class="text-gray-500">Email</span>
              <span>{{ visibleEmail || '—' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Phone</span>
              <span>{{ visiblePhone || '—' }}</span>
            </div>
          </div>

          <div class="text-xs text-gray-500">
            (Shown only if the member opted to share.)
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'member', middleware: ['member-auth'] })

import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSnackbar } from '@/services/useSnackbar'
import { getMemberPublic } from '@/services/membersServices'
import { assetUrl } from '@/services/http'

const route = useRoute()
const { show } = useSnackbar()

const loading = ref(true)
const m = ref(null)
const imgErr = ref(false)

const fallback =
  'https://api.dicebear.com/8.x/initials/svg?radius=50&backgroundType=gradientLinear&size=160&seed=IPI'

const field = v =>
  v == null || String(v).trim() === '' ? 'Not shared' : v

function normalize(res) {
  return res?.member || res?.data || res
}

async function fetchMember () {
  loading.value = true
  try {
    const res = await getMemberPublic(route.params.id)
    m.value = normalize(res)

    console.log(m.value)
  } catch (e) {
    show('Failed to load profile', 'error')
    m.value = null
  } finally {
    loading.value = false
  }
}

onMounted(fetchMember)

/* ---------- Computed ---------- */
const mReady = computed(() => !!m.value)

const photoSrc = computed(() => {
  const url = m.value?.profile?.photoUrl
  if (!url || imgErr.value) return fallback
  return assetUrl(url)
})

const visibleEmail = computed(() =>
  m.value?.profile?.showEmail ? m.value?.contact?.officeEmail || '' : ''
)

const visiblePhone = computed(() =>
  m.value?.profile?.showPhone ? m.value?.contact?.companyPhone || '' : ''
)

const addr = computed(() =>
  m.value?.contact?.companyAddress || {}
)

const links = computed(() => ({
  Website: m.value?.profile?.website,
  LinkedIn: m.value?.profile?.linkedin,
  'X (Twitter)': m.value?.profile?.xHandle,
  Instagram: m.value?.profile?.instagram,
  Facebook: m.value?.profile?.facebook,
  YouTube: m.value?.profile?.youtube,
}))

const safeUrl = u =>
  /^https?:\/\//i.test(u) ? u : `https://${u}`
</script>
