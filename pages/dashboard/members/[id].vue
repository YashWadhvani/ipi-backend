<template>
  <div class="space-y-4">
    <!-- Topbar -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div>
          <h1 class="text-xl font-semibold">{{ m?.name || 'Member' }}</h1>
          <p class="text-sm text-gray-600">
            <span v-if="m?.company">{{ m.company }}</span>
            <span v-if="m?.company && (m?.city || m?.state)"> • </span>
            <span v-if="m?.city">{{ m.city }}</span>
            <span v-if="m?.state">, {{ m.state }}</span>
          </p>
        </div>
        <span
          v-if="m"
          class="px-2 py-1 rounded text-xs"
          :class="m.isActive ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-gray-100 text-gray-700 border border-gray-200'"
        >
          {{ m.isActive ? 'Active' : 'Inactive' }}
        </span>
      </div>

      <div class="flex items-center gap-2">
        <button
          class="inline-flex items-center gap-2 rounded-md border border-[#ccc] bg-white px-3 py-2 hover:bg-gray-50 cursor-pointer"
          @click="resetPasswordOpen = true"
          title="Set / Reset Password"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17a2 2 0 1 0 .001-3.999A2 2 0 0 0 12 17zm6-7h-1V7a5 5 0 1 0-10 0v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2zm-7 0H9V7a3 3 0 1 1 6 0v3h-2z"/></svg>
          <span>Password</span>
        </button>

        <NuxtLink
          to="/dashboard/members"
          class="inline-flex items-center gap-2 rounded-md border border-[#ccc] bg-white px-3 py-2 hover:bg-gray-50 cursor-pointer"
          title="Back to members"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="m15 18-6-6 6-6"/></svg>
          <span>Back</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Tabs -->
    <div class="bg-white border border-[#ccc] rounded-md">
      <div class="flex items-center gap-2 px-3 py-2 border-b border-[#eee]">
        <button
          v-for="t in tabs"
          :key="t.key"
          class="px-3 py-2 rounded-md text-sm"
          :class="tab===t.key ? 'bg-black text-white' : 'hover:bg-gray-50'"
          @click="tab=t.key"
        >{{ t.label }}</button>
      </div>

      <div class="p-4">
        <!-- CONTACT INFO (editable) -->
        <!-- CONTACT INFO -->
          <div v-if="tab==='contact'" class="space-y-4">

          <!-- MEMBER CORE -->
          <div class="grid sm:grid-cols-3 gap-3">
            <div class="bg-white border rounded p-4">
              <label class="text-sm text-gray-500">Name</label>
              <input v-model="edit.member.name" class="mt-1 w-full border rounded px-3 py-2" />
            </div>

            <div class="bg-white border rounded p-4">
              <label class="text-sm text-gray-500">City</label>
              <input v-model="edit.member.city" class="mt-1 w-full border rounded px-3 py-2" />
            </div>

            <div class="bg-white border rounded p-4">
              <label class="text-sm text-gray-500">State</label>
              <input v-model="edit.member.state" class="mt-1 w-full border rounded px-3 py-2" />
            </div>
          </div>

          <!-- LOGIN / AUTH -->
          <div class="grid sm:grid-cols-2 gap-3">
            <div class="bg-white border rounded p-4">
              <label class="text-sm text-gray-500">Office Email (Login)</label>
              <input v-model="edit.auth.email" type="email" class="mt-1 w-full border rounded px-3 py-2" />
            </div>

            <div class="bg-white border rounded p-4">
              <label class="text-sm text-gray-500">Login Phone</label>
              <input v-model="edit.auth.phone" class="mt-1 w-full border rounded px-3 py-2" />
            </div>
          </div>

          <!-- MEMBER CONTACT -->
          <div class="grid sm:grid-cols-2 gap-3">
            <div class="bg-white border rounded p-4">
              <label class="text-sm text-gray-500">Personal Email</label>
              <input v-model="edit.contact.personalEmail" class="mt-1 w-full border rounded px-3 py-2" />
            </div>

            <div class="bg-white border rounded p-4">
              <label class="text-sm text-gray-500">Company Phone</label>
              <input v-model="edit.contact.companyPhone" class="mt-1 w-full border rounded px-3 py-2" />
            </div>

            <div class="bg-white border rounded p-4">
              <label class="text-sm text-gray-500">Residence Phone</label>
              <input v-model="edit.contact.residencePhone" class="mt-1 w-full border rounded px-3 py-2" />
            </div>

            <div class="bg-white border rounded p-4">
              <label class="text-sm text-gray-500">Active</label>
              <select v-model="edit.member.isActive" class="mt-1 w-full border rounded px-3 py-2">
                <option :value="true">Active</option>
                <option :value="false">Inactive</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end">
            <button class="px-4 py-2 bg-black text-white rounded" @click="saveContact">
              Save Contact
            </button>
          </div>
          </div>


        <!-- BUSINESS / PROFILE (editable) -->
        <!-- BUSINESS -->
        <div v-else-if="tab==='business'" class="space-y-4">

        <div class="grid sm:grid-cols-3 gap-3">
          <div class="bg-white border rounded p-4">
            <label>Company</label>
            <input v-model="edit.business.company" class="mt-1 w-full border rounded px-3 py-2" />
          </div>

          <div class="bg-white border rounded p-4">
            <label>Designation</label>
            <input v-model="edit.business.designation" class="mt-1 w-full border rounded px-3 py-2" />
          </div>

          <div class="bg-white border rounded p-4">
            <label>Industry</label>
            <input v-model="edit.business.industry" class="mt-1 w-full border rounded px-3 py-2" />
          </div>
        </div>

        <div class="grid sm:grid-cols-2 gap-3">
          <div class="bg-white border rounded p-4">
            <label>Headline</label>
            <input v-model="edit.profile.headline" class="mt-1 w-full border rounded px-3 py-2" />
          </div>

          <div class="bg-white border rounded p-4">
            <label>GST Number</label>
            <input v-model="edit.profile.gstNumber" class="mt-1 w-full border rounded px-3 py-2" />
          </div>
        </div>

        <div class="bg-white border rounded p-4">
          <label>Business Description</label>
          <textarea v-model="edit.profile.businessDescription" rows="3" class="mt-1 w-full border rounded px-3 py-2" />
        </div>

        <!-- COMPANY ADDRESS -->
        <div class="bg-white border rounded p-4">
          <label class="block mb-2">Company Address</label>
          <div class="grid sm:grid-cols-2 gap-3">
            <input v-model="edit.contact.companyAddress.line1" placeholder="Line 1" class="border rounded px-3 py-2" />
            <input v-model="edit.contact.companyAddress.line2" placeholder="Line 2" class="border rounded px-3 py-2" />
            <input v-model="edit.contact.companyAddress.city" placeholder="City" class="border rounded px-3 py-2" />
            <input v-model="edit.contact.companyAddress.state" placeholder="State" class="border rounded px-3 py-2" />
            <input v-model="edit.contact.companyAddress.pincode" placeholder="Pincode" class="border rounded px-3 py-2" />
            <input v-model="edit.contact.companyAddress.country" placeholder="Country" class="border rounded px-3 py-2" />
          </div>
        </div>

        <div class="flex justify-end">
          <button class="px-4 py-2 bg-black text-white rounded" @click="saveBusiness">
            Save Business
          </button>
        </div>
        </div>


      <!-- SOCIALS -->
      <div v-else-if="tab==='socials'" class="grid sm:grid-cols-2 gap-3">
        <div class="bg-white border rounded p-4">
          <label>Website</label>
          <input v-model="edit.profile.website" class="mt-1 w-full border rounded px-3 py-2" />
        </div>

        <div class="bg-white border rounded p-4">
          <label>LinkedIn</label>
          <input v-model="edit.profile.linkedin" class="mt-1 w-full border rounded px-3 py-2" />
        </div>

        <div class="bg-white border rounded p-4">
          <label>X (Twitter)</label>
          <input v-model="edit.profile.xHandle" class="mt-1 w-full border rounded px-3 py-2" />
        </div>

        <div class="bg-white border rounded p-4">
          <label>Instagram</label>
          <input v-model="edit.profile.instagram" class="mt-1 w-full border rounded px-3 py-2" />
        </div>

        <div class="bg-white border rounded p-4">
          <label>Facebook</label>
          <input v-model="edit.profile.facebook" class="mt-1 w-full border rounded px-3 py-2" />
        </div>

        <div class="bg-white border rounded p-4">
          <label>YouTube</label>
          <input v-model="edit.profile.youtube" class="mt-1 w-full border rounded px-3 py-2" />
        </div>

        <div class="col-span-full flex justify-end">
          <button class="px-4 py-2 bg-black text-white rounded" @click="saveSocials">
            Save Socials
          </button>
        </div>
      </div>


        <!-- EVENT REGISTRATIONS -->
        <div v-else-if="tab==='registrations'">
          <div class="bg-white border border-[#ccc] rounded-md overflow-hidden">
            <table class="w-full text-sm">
              <thead class="bg-[#f1f8ff] border-b border-[#ccc] text-left text-gray-600">
                <tr>
                  <th class="p-3 font-bold">Created</th>
                  <th class="p-3 font-bold">Event</th>
                  <th class="p-3 font-bold">Qty</th>
                  <!-- <th class="p-3 font-bold">Amount</th> -->
                  <th class="p-3 font-bold">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#ccc]">
                <tr v-for="r in (m?.registrations || [])" :key="r.id">
                  <td class="p-3 whitespace-nowrap">{{ dt(r.createdAt) }}</td>
                  <td class="p-3">
                    <NuxtLink :to="`/dashboard/events/${r.event?.id || r.eventId}/edit`" class="text-blue-600 hover:underline">
                      {{ r.event?.name || 'Event' }}
                    </NuxtLink>
                  </td>
                  <td class="p-3">{{ r.qty }}</td>
                  <!-- <td class="p-3">
                    <span v-if="r.amount != null">₹ {{ r.amount }}</span>
                    <span v-else>—</span>
                  </td> -->
                  <td class="p-3">
                    <span class="px-2 py-1 rounded text-xs" :class="statusBadge(r.status)">{{ r.status }}</span>
                  </td>
                </tr>
                <tr v-if="!m || (m.registrations || []).length === 0">
                  <td colspan="5" class="p-8 text-center text-gray-500">No event registrations</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- CHAPTERS (read-only) -->
        <div v-else-if="tab==='chapters'">
          <div class="bg-white border border-[#ccc] rounded-md overflow-hidden">
            <table class="w-full text-sm">
              <thead class="bg-[#f1f8ff] border-b border-[#ccc] text-left text-gray-600">
                <tr>
                  <th class="p-3 font-bold">Chapter</th>
                  <th class="p-3 font-bold">Role</th>
                  <th class="p-3 font-bold">Primary</th>
                  <th class="p-3 font-bold">City</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#ccc]">
                <tr v-for="mc in (m?.chapters || [])" :key="mc.id">
                  <td class="p-3">
                    <NuxtLink :to="`/dashboard/chapters/${mc.chapter?.id || mc.chapterId}`" class="text-blue-600 hover:underline">
                      {{ mc.chapter?.name || mc.chapterName || '—' }}
                    </NuxtLink>
                  </td>
                  <td class="p-3">
                    <span class="px-2 py-1 rounded text-xs capitalize" :class="roleBadge(mc.role)">
                      {{ mc.role }}
                    </span>
                  </td>
                  <td class="p-3">{{ mc.isPrimary ? 'Yes' : 'No' }}</td>
                  <td class="p-3">
                    {{ mc.chapter?.city?.name || '—' }}
                    <span v-if="mc.chapter?.city?.state">, {{ mc.chapter.city.state }}</span>
                  </td>
                </tr>
                <tr v-if="!m || (m.chapters || []).length === 0">
                  <td colspan="4" class="p-8 text-center text-gray-500">No chapter links</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-else class="text-sm text-gray-500">Select a tab</div>
      </div>
    </div>

    <!-- Loading bar -->
    <div v-if="loading" class="h-0.5 bg-gradient-to-r from-transparent via-black/30 to-transparent animate-pulse" />

    <!-- Reset Password Modal -->
    <div v-if="resetPasswordOpen" class="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div class="bg-white w-full max-w-md rounded-xl border border-[#ccc]">
        <div class="px-4 py-3 border-b border-[#eee] flex justify-between items-center">
          <h3 class="text-lg font-semibold">Set New Password</h3>
          <button class="p-2 rounded hover:bg-gray-100" @click="resetPasswordOpen=false">✕</button>
        </div>

        <div class="p-4 space-y-3">
          <input
            v-model="passwordForm.password"
            type="password"
            placeholder="New password"
            class="w-full border rounded px-3 py-2"
          />
          <input
            v-model="passwordForm.confirm"
            type="password"
            placeholder="Confirm password"
            class="w-full border rounded px-3 py-2"
          />
          <div class="flex justify-end gap-2 mt-2">
            <button class="px-3 py-2 border border-[#ccc] rounded hover:bg-gray-50" @click="resetPasswordOpen=false">Cancel</button>
            <button
              class="px-3 py-2 bg-black text-white rounded hover:opacity-90"
              :disabled="saving.password"
              @click="savePassword"
            >
              <span v-if="saving.password">Saving…</span>
              <span v-else>Save Password</span>
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getMember, updateMember, changeMemberPassword } from '@/services/membersServices'
import { useSnackbar } from '@/services/useSnackbar'

definePageMeta({ layout: 'dashboard', middleware: ['auth-admin-client'] })

const route = useRoute()
const id = String(route.params.id)
const { show } = useSnackbar()

const statusBadge = (status) => {
  switch ((status || '').toLowerCase()) {
    case 'paid':
    case 'success':
      return 'bg-green-100 text-green-800 border border-green-200'

    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border border-yellow-200'

    case 'failed':
    case 'cancelled':
      return 'bg-red-100 text-red-800 border border-red-200'

    default:
      return 'bg-gray-100 text-gray-700 border border-gray-200'
  }
}

const roleBadge = (role) => {
  switch ((role || '').toUpperCase()) {
    case 'CHAIR':
      return 'bg-indigo-100 text-indigo-800 border border-indigo-200'
    case 'LEADERSHIP':
      return 'bg-blue-100 text-blue-800 border border-blue-200'
    case 'MEMBER':
      return 'bg-gray-100 text-gray-700 border border-gray-200'
    default:
      return 'bg-gray-100 text-gray-700 border border-gray-200'
  }
}


/* ---------------- STATE ---------------- */

const m = ref(null)
const loading = ref(false)

const tab = ref('contact')
const tabs = [
  { key: 'contact', label: 'Contact Info' },
  { key: 'business', label: 'Business' },
  { key: 'socials', label: 'Socials' },
  { key: 'registrations', label: 'Event Registrations' },
  { key: 'chapters', label: 'Chapters' },
]

const saving = ref({
  contact: false,
  business: false,
  socials: false,
  password: false,
})

const resetPasswordOpen = ref(false)
const passwordForm = ref({ password: '', confirm: '' })

/* ---------------- EDIT BUFFER ---------------- */

const edit = ref({
  member: {
    name: '',
    city: '',
    state: '',
    isActive: true,
  },

  auth: {
    email: '',
    phone: '',
  },

  contact: {
    officeEmail: '',
    personalEmail: '',
    companyPhone: '',
    residencePhone: '',
    companyAddress: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
    },
    residenceAddress: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
    },
  },

  business: {
    company: '',
    designation: '',
    industry: '',
  },

  profile: {
    headline: '',
    about: '',
    businessDescription: '',
    gstNumber: '',
    website: '',
    linkedin: '',
    xHandle: '',
    instagram: '',
    facebook: '',
    youtube: '',
  },
})


const dt = (value) => {
  if (!value) return '—'
  const d = new Date(value)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}


/* ---------------- HYDRATE ---------------- */

const hydrateEditors = () => {
  const x = m.value
  if (!x) return

  edit.value.member = {
    name: x.name ?? '',
    city: x.city ?? '',
    state: x.state ?? '',
    isActive: !!x.isActive,
  }

  edit.value.auth = {
    email: x.user?.email ?? '',
    phone: x.user?.phone ?? '',
  }

  edit.value.contact = {
    officeEmail: x.contact?.officeEmail ?? '',
    personalEmail: x.contact?.personalEmail ?? '',
    companyPhone: x.contact?.companyPhone ?? '',
    residencePhone: x.contact?.residencePhone ?? '',
    companyAddress: x.contact?.companyAddress ?? {
      line1: '', line2: '', city: '', state: '', pincode: '', country: 'India',
    },
    residenceAddress: x.contact?.residenceAddress ?? {
      line1: '', line2: '', city: '', state: '', pincode: '', country: 'India',
    },
  }

  edit.value.business = {
    company: x.company ?? '',
    designation: x.designation ?? '',
    industry: x.industry ?? '',
  }

  edit.value.profile = {
    headline: x.profile?.headline ?? '',
    about: x.profile?.about ?? '',
    businessDescription: x.profile?.businessDescription ?? '',
    gstNumber: x.profile?.gstNumber ?? '',
    website: x.profile?.website ?? '',
    linkedin: x.profile?.linkedin ?? '',
    xHandle: x.profile?.xHandle ?? '',
    instagram: x.profile?.instagram ?? '',
    facebook: x.profile?.facebook ?? '',
    youtube: x.profile?.youtube ?? '',
  }
}

/* ---------------- LOAD ---------------- */

const load = async () => {
  loading.value = true
  try {
    m.value = await getMember(id, {
      include: 'user,contact,profile,chapters.chapter.city,registrations.event',
    })
    hydrateEditors()
  } catch (e) {
    show('Failed to load member', 'error')
  } finally {
    loading.value = false
  }
}

/* ---------------- SAVE CONTACT ---------------- */

const saveContact = async () => {
  saving.value.contact = true
  try {
    await updateMember(id, {
      ...edit.value.member,

      user: {
        email: edit.value.auth.email,
        phone: edit.value.auth.phone,
      },

      // 🔥 ALWAYS send FULL contact object (fixes personalEmail)
      contact: {
        officeEmail: edit.value.contact.officeEmail,
        personalEmail: edit.value.contact.personalEmail,
        companyPhone: edit.value.contact.companyPhone,
        residencePhone: edit.value.contact.residencePhone,
        companyAddress: edit.value.contact.companyAddress,
        residenceAddress: edit.value.contact.residenceAddress,
      },
    })

    await load()
    show('Contact updated', 'success')
  } catch {
    show('Failed to update contact', 'error')
  } finally {
    saving.value.contact = false
  }
}

/* ---------------- SAVE BUSINESS ---------------- */

const saveBusiness = async () => {
  saving.value.business = true
  try {
    await updateMember(id, {
      company: edit.value.business.company,
      designation: edit.value.business.designation,
      industry: edit.value.business.industry,

      profile: {
        headline: edit.value.profile.headline,
        about: edit.value.profile.about,
        businessDescription: edit.value.profile.businessDescription,
        gstNumber: edit.value.profile.gstNumber,
      },

      contact: {
        companyAddress: edit.value.contact.companyAddress,
      },
    })

    await load()
    show('Business details updated', 'success')
  } catch {
    show('Failed to update business', 'error')
  } finally {
    saving.value.business = false
  }
}

/* ---------------- SAVE SOCIALS ---------------- */

const saveSocials = async () => {
  saving.value.socials = true
  try {
    await updateMember(id, {
      profile: {
        website: edit.value.profile.website,
        linkedin: edit.value.profile.linkedin,
        xHandle: edit.value.profile.xHandle,
        instagram: edit.value.profile.instagram,
        facebook: edit.value.profile.facebook,
        youtube: edit.value.profile.youtube,
      },
    })

    await load()
    show('Social links updated', 'success')
  } catch {
    show('Failed to update socials', 'error')
  } finally {
    saving.value.socials = false
  }
}

/* ---------------- PASSWORD ---------------- */

const savePassword = async () => {
  if (!passwordForm.value.password || passwordForm.value.password !== passwordForm.value.confirm) {
    show('Passwords do not match', 'error')
    return
  }

  saving.value.password = true
  try {
    await changeMemberPassword(id, { password: passwordForm.value.password })
    resetPasswordOpen.value = false
    passwordForm.value = { password: '', confirm: '' }
    show('Password updated', 'success')
  } catch {
    show('Failed to set password', 'error')
  } finally {
    saving.value.password = false
  }
}

onMounted(load)
</script>
