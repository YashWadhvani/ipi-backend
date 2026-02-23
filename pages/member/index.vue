<template>
  <div class="space-y-6">
    <!-- Header: Avatar + Name + Completion -->
    <div class="flex flex-col lg:flex-row items-start lg:items-center gap-4">
      <!-- Avatar -->
      <div class="relative">
        <img
          :src="photoSrc"
          class="h-20 w-20 rounded-full object-cover border"
          @error="imgError = true"
        />
        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFile" />
        <!-- <button
          class="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs px-2 py-1 rounded bg-black text-white cursor-pointer"
          @click="() => fileInput?.click()"
        >
          Change
        </button> -->

      </div>

      <!-- Name/Company -->
      <div>
        <h1 class="text-2xl font-semibold">{{ me?.member?.name || 'Member' }}</h1>
        <p class="text-gray-600">
          {{ me?.member?.designation }}
          <span v-if="me?.member?.company"> @ {{ me.member.company }}</span>
        </p>
        <div class="mt-1 text-sm" v-if="chapterPrimaryName">
          <span class="px-2 py-1 rounded border border-[#ccc] bg-purple-50 text-purple-800">
            Chapter: {{ chapterPrimaryName }}
          </span>
          <span v-if="otherChaptersCount > 0" class="text-xs text-gray-500 ml-2">
            + {{ otherChaptersCount }} more
          </span>
        </div>
      </div>

      <!-- Completion ring -->
      <div class="ml-auto">
        <div class="bg-white border border-[#ccc] rounded p-3 flex items-center gap-4">
          <svg width="96" height="96" viewBox="0 0 100 100">
            <circle cx="50" cy="50" :r="R" stroke="#eee" stroke-width="10" fill="none" />
            <circle
              cx="50"
              cy="50"
              :r="R"
              stroke="currentColor"
              stroke-width="10"
              fill="none"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="circumference - (circumference * completion.percent / 100)"
              stroke-linecap="round"
              transform="rotate(-90 50 50)"
            />
            <text x="50" y="55" text-anchor="middle" font-size="18" class="fill-current">
              {{ Math.round(completion.percent) }}%
            </text>
          </svg>
          <div>
            <div class="font-semibold">Profile completion</div>
            <div class="text-sm text-gray-600">
              {{ completion.filled }} / {{ completion.total }} fields
            </div>
          </div>
        </div>
        <div v-if="completion.missing.length" class="mt-2 text-xs text-gray-600">
          <span class="font-medium">Pending:</span>
          <span>{{ completion.missing.join(', ') }}</span>
        </div>
      </div>
    </div>

    <!-- Cards grid -->
    <div class="grid lg:grid-cols-2 gap-4">
      <!-- Basic (Company) -->
      <section class="bg-white border border-[#ccc] rounded-md">
        <div class="flex items-center justify-between px-4 py-3 border-b border-[#eee]">
          <h2 class="font-semibold">Basic</h2>
          <button
            class="p-2 rounded-md hover:bg-gray-100 cursor-pointer"
            @click="editing.basic = !editing.basic"
            title="Edit basic"
          >
            ✎
          </button>
        </div>
        <div class="p-4 space-y-3">
          <div class="text-sm text-gray-500">Company</div>
          <div v-if="!editing.basic" class="text-gray-800">{{ basic.company || '—' }}</div>
          <div v-else class="space-y-3">
            <input v-model="basic.company" class="border border-[#ccc] rounded px-3 py-2 w-full" placeholder="Company name" />
            <div class="flex items-center justify-end gap-2">
              <button class="px-3 py-2 border border-[#ccc] rounded hover:bg-gray-50 cursor-pointer" @click="cancelBasic">Cancel</button>
              <button class="px-3 py-2 bg-black text-white rounded cursor-pointer" :disabled="saving.basic" @click="saveBasic">
                {{ saving.basic ? 'Saving…' : 'Save' }}
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Contact & Privacy -->
      <section class="bg-white border border-[#ccc] rounded-md">
        <div class="flex items-center justify-between px-4 py-3 border-b border-[#eee]">
          <h2 class="font-semibold">Contact & Privacy</h2>
          <button
            class="p-2 rounded-md hover:bg-gray-100 cursor-pointer"
            @click="editing.contact = !editing.contact"
            title="Edit contact"
          >
            ✎
          </button>
        </div>
        <div class="p-4 space-y-3">
          <div>
            <div class="text-sm text-gray-500 mb-1">Email (login)</div>
            <div class="text-gray-800">{{ me?.user?.email || '—' }}</div>
          </div>

          <template v-if="!editing.contact">
            <div>
              <div class="text-sm text-gray-500 mb-1">Phone</div>
              <div class="text-gray-800">{{ contact.phone || '—' }}</div>
            </div>
            <div class="text-sm text-gray-600">
              <span>Show email: {{ contact.showEmail ? 'Yes' : 'No' }}</span> •
              <span>Show phone: {{ contact.showPhone ? 'Yes' : 'No' }}</span>
            </div>
          </template>

          <template v-else>
            <div>
              <label class="text-sm block mb-1">Phone</label>
              <input v-model="contact.phone" class="border border-[#ccc] rounded px-3 py-2 w-full" placeholder="Phone number" />
            </div>
            <div class="flex items-center gap-4">
              <!-- <label class="flex items-center gap-2">
                <input type="checkbox" v-model="contact.showEmail" />
                Show email on profile
              </label>
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="contact.showPhone" />
                Show phone on profile
              </label> -->
            </div>
            <div class="flex items-center justify-end gap-2">
              <button class="px-3 py-2 border border-[#ccc] rounded hover:bg-gray-50 cursor-pointer" @click="cancelContact">Cancel</button>
              <button class="px-3 py-2 bg-black text-white rounded cursor-pointer" :disabled="saving.contact" @click="saveContact">
                {{ saving.contact ? 'Saving…' : 'Save' }}
              </button>
            </div>
          </template>
        </div>
      </section>

      <!-- Biography & Business -->
      <section class="bg-white border border-[#ccc] rounded-md">
        <div class="flex items-center justify-between px-4 py-3 border-b border-[#eee]">
          <h2 class="font-semibold">Biography & Business</h2>
          <button
            class="p-2 rounded-md hover:bg-gray-100 cursor-pointer"
            @click="editing.profile = !editing.profile"
            title="Edit biography & business"
          >
            ✎
          </button>
        </div>
        <div class="p-4 space-y-3">
          <template v-if="!editing.profile">
            <div>
              <div class="text-sm text-gray-500 mb-1">Biography</div>
              <div class="text-gray-800 whitespace-pre-wrap">{{ form.about || '—' }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-500 mb-1">Business Description</div>
              <div class="text-gray-800 whitespace-pre-wrap">{{ form.businessDescription || '—' }}</div>
            </div>
          </template>

          <template v-else>
            <label class="text-sm block mb-1">Biography</label>
            <textarea v-model="editable.profile.about" rows="4" class="w-full border border-[#ccc] rounded px-3 py-2" placeholder="Write your bio…"></textarea>

            <label class="text-sm block mb-1 mt-2">Business Description</label>
            <textarea v-model="editable.profile.businessDescription" rows="5" class="w-full border border-[#ccc] rounded px-3 py-2" placeholder="What does your business do?"></textarea>

            <div class="flex items-center justify-end gap-2 pt-2">
              <button class="px-3 py-2 border border-[#ccc] rounded hover:bg-gray-50 cursor-pointer" @click="cancelProfile">Cancel</button>
              <button class="px-3 py-2 bg-black text-white rounded cursor-pointer" :disabled="saving.profile" @click="saveProfile">
                {{ saving.profile ? 'Saving…' : 'Save' }}
              </button>
            </div>
          </template>
        </div>
      </section>

      <!-- Address + GST -->
      <section class="bg-white border border-[#ccc] rounded-md">
        <div class="flex items-center justify-between px-4 py-3 border-b border-[#eee]">
          <h2 class="font-semibold">Company Address & GST</h2>
          <button
            class="p-2 rounded-md hover:bg-gray-100 cursor-pointer"
            @click="editing.address = !editing.address"
            title="Edit address & GST"
          >
            ✎
          </button>
        </div>
        <div class="p-4 space-y-3">
          <template v-if="!editing.address">
            <div class="text-sm text-gray-500 mb-1">GST Number</div>
            <div class="text-gray-800">{{ form.gstNumber || '—' }}</div>

            <div class="text-sm text-gray-500 mb-1 mt-4">Address</div>
            <div class="text-gray-800 whitespace-pre-line">
              {{ previewAddress || '—' }}
            </div>
          </template>

          <template v-else>
            <div class="grid grid-cols-2 gap-3">
              <input v-model="editable.address.line1" class="border border-[#ccc] rounded px-3 py-2 w-full" placeholder="Address Line 1" />
              <input v-model="editable.address.line2" class="border border-[#ccc] rounded px-3 py-2 w-full" placeholder="Address Line 2" />
              <input v-model="editable.address.city" class="border border-[#ccc] rounded px-3 py-2 w-full" placeholder="City" />
              <input v-model="editable.address.state" class="border border-[#ccc] rounded px-3 py-2 w-full" placeholder="State" />
              <input v-model="editable.address.pincode" class="border border-[#ccc] rounded px-3 py-2 w-full" placeholder="Pincode" />
              <input v-model="editable.address.country" class="border border-[#ccc] rounded px-3 py-2 w-full" placeholder="Country" />
            </div>
            <input v-model="editable.form.gstNumber" class="border border-[#ccc] rounded px-3 py-2 w-full" placeholder="GST Number" />
            <div class="flex items-center justify-end gap-2 pt-2">
              <button class="px-3 py-2 border border-[#ccc] rounded hover:bg-gray-50 cursor-pointer" @click="cancelAddress">Cancel</button>
              <button class="px-3 py-2 bg-black text-white rounded cursor-pointer" :disabled="saving.address" @click="saveAddress">
                {{ saving.address ? 'Saving…' : 'Save' }}
              </button>
            </div>
          </template>
        </div>
      </section>

      <!-- Social Links -->
      <section class="bg-white border border-[#ccc] rounded-md lg:col-span-2">
        <div class="flex items-center justify-between px-4 py-3 border-b border-[#eee]">
          <h2 class="font-semibold">Social Links</h2>
          <button
            class="p-2 rounded-md hover:bg-gray-100 cursor-pointer"
            @click="editing.social = !editing.social"
            title="Edit socials"
          >
            ✎
          </button>
        </div>
        <div class="p-4 space-y-3">
          <template v-if="!editing.social">
            <div class="grid md:grid-cols-3 gap-3 text-sm">
              <div><span class="text-gray-500">Website:</span> <span class="text-gray-900">{{ form.website || '—' }}</span></div>
              <div><span class="text-gray-500">LinkedIn:</span> <span class="text-gray-900">{{ form.linkedin || '—' }}</span></div>
              <div><span class="text-gray-500">Instagram:</span> <span class="text-gray-900">{{ form.instagram || '—' }}</span></div>
              <div><span class="text-gray-500">Facebook:</span> <span class="text-gray-900">{{ form.facebook || '—' }}</span></div>
              <div><span class="text-gray-500">YouTube:</span> <span class="text-gray-900">{{ form.youtube || '—' }}</span></div>
              <div><span class="text-gray-500">X (Twitter):</span> <span class="text-gray-900">{{ form.xHandle || '—' }}</span></div>
            </div>

          </template>
          <template v-else>
            <input v-model="editable.form.website" class="border border-[#ccc] rounded px-3 py-2 w-full" placeholder="Website URL" />
            <input v-model="editable.form.linkedin" class="border border-[#ccc] rounded px-3 py-2 w-full" placeholder="LinkedIn URL" />
            <input v-model="editable.form.instagram" class="border border-[#ccc] rounded px-3 py-2 w-full" placeholder="Instagram URL" />
            <input v-model="editable.form.facebook" class="border border-[#ccc] rounded px-3 py-2 w-full" placeholder="Facebook URL" />
            <input v-model="editable.form.youtube" class="border border-[#ccc] rounded px-3 py-2 w-full" placeholder="YouTube URL" />
            <input v-model="editable.form.xHandle" class="border border-[#ccc] rounded px-3 py-2 w-full" placeholder="X / Twitter profile" />

            <div class="flex items-center justify-end gap-2 pt-2">
              <button class="px-3 py-2 border border-[#ccc] rounded hover:bg-gray-50 cursor-pointer" @click="cancelSocial">Cancel</button>
              <button class="px-3 py-2 bg-black text-white rounded cursor-pointer" :disabled="saving.social" @click="saveSocial">
                {{ saving.social ? 'Saving…' : 'Save' }}
              </button>
            </div>
          </template>
        </div>
      </section>
    </div>

    <!-- Events -->
    <div class="grid lg:grid-cols-2 gap-4">
      <!-- Upcoming Events -->
      <section class="bg-white border border-[#ccc] rounded-md">
        <div class="flex items-center justify-between px-4 py-3 border-b border-[#eee]">
          <h2 class="font-semibold">Upcoming Events</h2>
          <button class="p-2 rounded-md hover:bg-gray-100 cursor-pointer" @click="refreshUpcoming" title="Refresh">⟳</button>
        </div>
        <div class="p-4 space-y-2">
          <div v-if="loadingUpcoming" class="text-sm text-gray-500">Loading…</div>
          <div v-else-if="!upcoming.length" class="text-sm text-gray-500">No upcoming events.</div>
          <div v-for="ev in upcoming" :key="ev.id" class="border border-[#eee] rounded p-3 flex items-center justify-between">
            <div>
              <div class="font-medium">{{ ev.name }}</div>
              <div class="text-xs text-gray-500">{{ dt(ev.startsAt) }}</div>
              <div class="text-xs text-gray-600" v-if="ev.venue">📍 {{ ev.venue }}</div>
            </div>
            <NuxtLink
              :to="`/events/${ev.slug}`"
              class="px-3 py-1.5 border border-[#ccc] rounded hover:bg-gray-50 cursor-pointer"
              title="View / Register"
            >
              View / Register
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- Events Attended -->
      <section class="bg-white border border-[#ccc] rounded-md">
        <div class="flex items-center justify-between px-4 py-3 border-b border-[#eee]">
          <h2 class="font-semibold">Events Attended</h2>
          <button class="p-2 rounded-md hover:bg-gray-100 cursor-pointer" @click="refreshAttended" title="Refresh">⟳</button>
        </div>
        <div class="p-4 space-y-2">
          <div v-if="loadingAttended" class="text-sm text-gray-500">Loading…</div>
          <div v-else-if="!attended.length" class="text-sm text-gray-500">No registrations yet.</div>
          <div v-for="r in attended" :key="r.id" class="border border-[#eee] rounded p-3">
            <div class="font-medium">{{ r.event?.name || 'Event' }}</div>
            <div class="text-xs text-gray-500">{{ dt(r.createdAt) }} • Qty: {{ r.qty }}</div>
            <div class="text-xs text-gray-600" v-if="r.amount != null">Amount: ₹ {{ r.amount }}</div>
            <NuxtLink
              :to="`/dashboard/events/${r.event?.id || r.eventId}/edit`"
              class="inline-block mt-2 text-xs text-blue-700 hover:underline"
            >
              View in Admin
            </NuxtLink>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'member', middleware: ['member-auth'] })

import { ref, computed, onMounted } from 'vue'
import { useRuntimeConfig } from '#imports'
import { useSnackbar } from '@/services/useSnackbar'

import {
  getMe,
  getMyRegistrations,
  getMyUpcomingEvents,
  updateMeMember,
  updateMeProfile,
  updateMeContact,
  uploadMyPhoto,
} from '@/services/meServices'

/* ───────────────── BASIC SETUP ───────────────── */

const { show } = useSnackbar()
const cfg = useRuntimeConfig()

const filesBase = computed(() =>
  (cfg.public.apiBase || '').replace(/\/api\/v1\/?$/, '')
)

const me = ref(null)
const imgError = ref(false)

/* ───────────────── UI STATE ───────────────── */

const basic = ref({ company: '' })

const form = ref({
  about: '',
  businessDescription: '',
  gstNumber: '',
  website: '',
  linkedin: '',
  instagram: '',
  facebook: '',
  youtube: '',
  xHandle: '',
})

const address = ref({
  line1: '',
  line2: '',
  city: '',
  state: '',
  pincode: '',
  country: '',
})

const contact = ref({
  phone: '',
  showEmail: false,
  showPhone: false,
})

const memberChapters = ref([])

const editable = ref({
  profile: { about: '', businessDescription: '' },
  address: { ...address.value },
  form: {
    gstNumber: '',
    website: '',
    linkedin: '',
    instagram: '',
    facebook: '',
    youtube: '',
    xHandle: '',
  },
})

const editing = ref({
  basic: false,
  contact: false,
  profile: false,
  address: false,
  social: false,
})

const saving = ref({
  basic: false,
  profile: false,
  address: false,
  social: false,
  contact: false,
})

/* ───────────────── PHOTO ───────────────── */

const fileInput = ref(null)
const file = ref(null)
const preview = ref('')
const uploading = ref(false)

const photoSrc = computed(() => {
  if (preview.value) return preview.value
  const url = me.value?.member?.profile?.photoUrl
  if (imgError.value || !url) return '/avatar-placeholder.png'
  return url.startsWith('http') ? url : `${filesBase.value}${url}`
})

/* ───────────────── COMPLETION RING ───────────────── */

const R = 45
const circumference = 2 * Math.PI * R

const completion = computed(() => {
  const p = me.value?.member?.profile || {}
  const addr = me.value?.member?.contact?.companyAddress || {}

  const checks = {
    'Profile photo': !!p.photoUrl,
    Biography: !!p.about?.trim(),
    'Business description': !!p.businessDescription?.trim(),
    'Address line1': !!addr.line1,
    City: !!addr.city,
    State: !!addr.state,
    Pincode: !!addr.pincode,
    Country: !!addr.country,
    'GST number': !!p.gstNumber,
    Website: !!p.website,
    LinkedIn: !!p.linkedin,
    Instagram: !!p.instagram,
    Facebook: !!p.facebook,
    YouTube: !!p.youtube,
    'X (Twitter)': !!p.xHandle,
  }

  const entries = Object.entries(checks)
  const filled = entries.filter(([, ok]) => ok).length
  const total = entries.length

  return {
    filled,
    total,
    percent: total ? (filled / total) * 100 : 0,
    missing: entries.filter(([, ok]) => !ok).map(([k]) => k),
  }
})

/* ───────────────── EVENTS ───────────────── */

const upcoming = ref([])
const attended = ref([])
const loadingUpcoming = ref(false)
const loadingAttended = ref(false)

const dt = (v) => (v ? new Date(v).toLocaleString() : '—')

/* ───────────────── CHAPTER HELPERS ───────────────── */

const chapterPrimaryName = computed(() => {
  const list = memberChapters.value || []
  if (!list.length) return ''
  const primary = list.find(c => c.isPrimary) || list[0]
  return primary?.chapter?.name || ''
})

const otherChaptersCount = computed(() =>
  Math.max(0, (memberChapters.value || []).length - 1)
)

const previewAddress = computed(() =>
  Object.values(address.value).filter(Boolean).join('\n')
)

/* ───────────────── LOAD DATA ───────────────── */

const load = async () => {
  imgError.value = false

  me.value = await getMe()
  const m = me.value.member
  const p = m.profile || {}
  const c = m.contact || {}

  basic.value.company = m.company || ''

  // PROFILE
  form.value.about = p.about || ''
  form.value.businessDescription = p.businessDescription || ''
  form.value.gstNumber = p.gstNumber || ''
  form.value.website = p.website || ''
  form.value.linkedin = p.linkedin || ''
  form.value.instagram = p.instagram || ''
  form.value.facebook = p.facebook || ''
  form.value.youtube = p.youtube || ''
  form.value.xHandle = p.xHandle || ''

  // CONTACT (single source of truth)
  address.value = c.companyAddress || {
    line1: '', line2: '', city: '', state: '', pincode: '', country: ''
  }

  contact.value.phone = c.companyPhone || ''
  contact.value.showEmail = !!p.showEmail
  contact.value.showPhone = !!p.showPhone

  memberChapters.value = m.chapters || []

  // SEED EDITABLE BUFFERS
  editable.value.profile = {
    about: form.value.about,
    businessDescription: form.value.businessDescription,
  }

  editable.value.address = { ...address.value }

  editable.value.form = {
    gstNumber: form.value.gstNumber,
    website: form.value.website,
    linkedin: form.value.linkedin,
    instagram: form.value.instagram,
    facebook: form.value.facebook,
    youtube: form.value.youtube,
    xHandle: form.value.xHandle,
  }
}

/* ───────────────── EVENTS LOADERS ───────────────── */

const refreshUpcoming = async () => {
  loadingUpcoming.value = true
  try {
    upcoming.value = await getMyUpcomingEvents()
  } catch {
    show('Failed to load upcoming events', 'error')
  } finally {
    loadingUpcoming.value = false
  }
}

const refreshAttended = async () => {
  loadingAttended.value = true
  try {
    const res = await getMyRegistrations()
    attended.value = (res.items || []).slice(0, 10)
  } catch {
    show('Failed to load registrations', 'error')
  } finally {
    loadingAttended.value = false
  }
}

/* ───────────────── SAVE HANDLERS ───────────────── */

const saveBasic = async () => {
  saving.value.basic = true
  try {
    await updateMeMember({ company: basic.value.company })
    await load()
    show('Basic info updated', 'success')
    editing.value.basic = false
  } catch {
    show('Failed to save basic info', 'error')
  } finally {
    saving.value.basic = false
  }
}

const saveContact = async () => {
  saving.value.contact = true
  try {
    await updateMeContact({
      companyPhone: contact.value.phone,
    })

    await updateMeProfile({
      showEmail: contact.value.showEmail,
      showPhone: contact.value.showPhone,
    })

    await load()
    show('Contact updated', 'success')
    editing.value.contact = false
  } catch {
    show('Failed to save contact', 'error')
  } finally {
    saving.value.contact = false
  }
}


const saveProfile = async () => {
  saving.value.profile = true
  try {
    await updateMeProfile(editable.value.profile)
    await load()
    show('Profile updated', 'success')
    editing.value.profile = false
  } catch {
    show('Failed to save profile', 'error')
  } finally {
    saving.value.profile = false
  }
}

const saveAddress = async () => {
  saving.value.address = true
  try {
    await updateMeContact({
      companyAddress: editable.value.address,
    })
    await updateMeProfile({
      gstNumber: editable.value.form.gstNumber,
    })
    await load()
    show('Address & GST updated', 'success')
    editing.value.address = false
  } catch {
    show('Failed to save address', 'error')
  } finally {
    saving.value.address = false
  }
}

const saveSocial = async () => {
  saving.value.social = true
  try {
    const payload = {}
    ;['website','linkedin','instagram','facebook','youtube','xHandle'].forEach(k => {
      if (editable.value.form[k]?.trim()) payload[k] = editable.value.form[k].trim()
    })

    if (!Object.keys(payload).length) {
      show('Nothing to update', 'info')
      saving.value.social = false
      return
    }

    await updateMeProfile(payload)
    await load()
    show('Social links updated', 'success')
    editing.value.social = false
  } catch {
    show('Failed to save socials', 'error')
  } finally {
    saving.value.social = false
  }
}

/* ───────────────── PHOTO ───────────────── */

const onFile = (e) => {
  imgError.value = false
  file.value = e.target.files?.[0]
  if (!file.value) return

  const reader = new FileReader()
  reader.onload = () => (preview.value = reader.result)
  reader.readAsDataURL(file.value)
}

const upload = async () => {
  if (!file.value) return
  uploading.value = true
  try {
    await uploadMyPhoto(file.value)
    file.value = null
    preview.value = ''
    await load()
    show('Photo updated', 'success')
  } catch {
    show('Failed to upload photo', 'error')
  } finally {
    uploading.value = false
  }
}

/* ───────────────── INIT ───────────────── */

onMounted(async () => {
  await load()
  await Promise.all([refreshUpcoming(), refreshAttended()])
})
</script>
