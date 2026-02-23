<template>
  <div class="space-y-6">
    <!-- Header / Avatar + Summary -->
    <div class="bg-white border border-[#ccc] rounded-md p-4">
      <div class="flex items-start gap-4">

        <div class="relative">
          <img
            :src="displayPhotoUrl"
            class="h-24 w-24 rounded-full object-cover border border-[#ccc]"
          />
          <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFile" />
        </div>

        <div class="flex-1 min-w-0">
          <h1 class="text-xl font-semibold truncate">
            {{ member.salutation ? member.salutation + ' ' : '' }}
            {{ me?.member?.name || 'Your Profile' }}
          </h1>
          <p class="text-sm text-gray-600 mt-1">
            <span v-if="me?.member?.designation">{{ me.member.designation }}</span>
            <span v-if="me?.member?.designation && me?.member?.company"> @ </span>
            <span v-if="me?.member?.company">{{ me.member.company }}</span>
          </p>
        </div>
      </div>
    </div>

    <div class="grid md:grid-cols-3 gap-6">
      <!-- LEFT COLUMN -->
      <div class="md:col-span-2 space-y-6">

        <!-- Basic -->
        <form @submit.prevent="saveMember" class="bg-white border border-[#ccc] rounded-md p-4 space-y-3">
          <div class="flex items-center justify-between">
            <h2 class="font-semibold">Basic</h2>
            <span class="text-xs text-gray-500">Your core details</span>
          </div>

          <!-- Salutation + Name -->
          <div class="grid md:grid-cols-2 gap-3">
            <div>
              <label class="block text-sm text-gray-700 mb-1">Salutation</label>
              <select
                v-model="member.salutation"
                class="w-full border border-[#ccc] rounded-md px-3 py-2 focus:ring-2 focus:ring-black/10 focus:outline-none"
              >
                <option value="">—</option>
                <option value="Mr">Mr</option>
                <option value="Mrs">Mrs</option>
                <option value="Ms">Ms</option>
                <option value="Dr">Dr</option>
              </select>
            </div>

            <div>
              <label class="block text-sm text-gray-700 mb-1">Full name</label>
              <input
                v-model="member.name"
                class="w-full border border-[#ccc] rounded-md px-3 py-2 focus:ring-2 focus:ring-black/10 focus:outline-none"
                placeholder="Full name"
              />
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-3">
            <div>
              <label class="block text-sm text-gray-700 mb-1">Headline (optional)</label>
              <input
                v-model="profile.headline"
                class="w-full border border-[#ccc] rounded-md px-3 py-2 focus:ring-2 focus:ring-black/10 focus:outline-none"
                placeholder="Headline"
              />
            </div>

            <div>
              <label class="block text-sm text-gray-700 mb-1">Membership Category</label>
              <input
                :value="member.membershipCategory"
                disabled
                class="w-full border border-[#ccc] rounded-md px-3 py-2 bg-gray-100 text-gray-600"
                placeholder="Admin only"
              />
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-3">
            <div>
              <label class="block text-sm text-gray-700 mb-1">Company</label>
              <input v-model="member.company" class="w-full border border-[#ccc] rounded-md px-3 py-2 focus:ring-2 focus:ring-black/10 focus:outline-none" />
            </div>
            <div>
              <label class="block text-sm text-gray-700 mb-1">Designation</label>
              <input v-model="member.designation" class="w-full border border-[#ccc] rounded-md px-3 py-2 focus:ring-2 focus:ring-black/10 focus:outline-none" />
            </div>
          </div>

          <div class="grid md:grid-cols-3 gap-3">
            <div>
              <label class="block text-sm text-gray-700 mb-1">City</label>
              <input v-model="member.city" class="w-full border border-[#ccc] rounded-md px-3 py-2 focus:ring-2 focus:ring-black/10 focus:outline-none" />
            </div>
            <div>
              <label class="block text-sm text-gray-700 mb-1">State</label>
              <input v-model="member.state" class="w-full border border-[#ccc] rounded-md px-3 py-2 focus:ring-2 focus:ring-black/10 focus:outline-none" />
            </div>
            <div>
              <label class="block text-sm text-gray-700 mb-1">Industry</label>
              <input v-model="member.industry" class="w-full border border-[#ccc] rounded-md px-3 py-2 focus:ring-2 focus:ring-black/10 focus:outline-none" />
            </div>
          </div>

          <div class="pt-1">
            <button class="px-3 py-2 bg-black text-white rounded-md" :disabled="savingMember">
              {{ savingMember ? 'Saving…' : 'Save Basic' }}
            </button>
          </div>
        </form>

        <!-- Biography & Business -->
        <form @submit.prevent="saveProfile" class="bg-white border border-[#ccc] rounded-md p-4 space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="font-semibold">Biography & Business</h2>
            <span class="text-xs text-gray-500">Tell us about yourself and your business</span>
          </div>

          <textarea v-model="profile.about" rows="5"
            class="w-full border border-[#ccc] rounded-md px-3 py-2 focus:ring-2 focus:ring-black/10 focus:outline-none"
            placeholder="Short bio" />

          <textarea v-model="profile.businessDescription" rows="6"
            class="w-full border border-[#ccc] rounded-md px-3 py-2 focus:ring-2 focus:ring-black/10 focus:outline-none"
            placeholder="Describe your business" />

          <!-- Company Address -->
          <div>
            <h3 class="font-medium mt-2 mb-2">Company Address & GST</h3>
            <div class="grid md:grid-cols-2 gap-3">
              <input v-model="address.line1" class="border border-[#ccc] rounded-md px-3 py-2 focus:ring-2 focus:ring-black/10 focus:outline-none" placeholder="Address Line 1"/>
              <input v-model="address.line2" class="border border-[#ccc] rounded-md px-3 py-2 focus:ring-2 focus:ring-black/10 focus:outline-none" placeholder="Address Line 2"/>
              <input v-model="address.city" class="border border-[#ccc] rounded-md px-3 py-2 focus:ring-2 focus:ring-black/10 focus:outline-none" placeholder="City"/>
              <input v-model="address.state" class="border border-[#ccc] rounded-md px-3 py-2 focus:ring-2 focus:ring-black/10 focus:outline-none" placeholder="State"/>
              <input v-model="address.pincode" class="border border-[#ccc] rounded-md px-3 py-2 focus:ring-2 focus:ring-black/10 focus:outline-none" placeholder="Pincode"/>
              <input v-model="address.country" class="border border-[#ccc] rounded-md px-3 py-2 focus:ring-2 focus:ring-black/10 focus:outline-none" placeholder="Country"/>
            </div>

            <div class="mt-3">
              <input v-model="profile.gstNumber"
                class="w-full border border-[#ccc] rounded-md px-3 py-2 focus:ring-2 focus:ring-black/10 focus:outline-none"
                placeholder="GST Number" />
            </div>
          </div>

          <!-- Residential Address -->
          <div>
            <h3 class="font-medium mt-2 mb-2">Residential Address</h3>
            <div class="grid md:grid-cols-2 gap-3">
              <input v-model="residence.line1" class="border border-[#ccc] rounded-md px-3 py-2 focus:ring-2 focus:ring-black/10 focus:outline-none" placeholder="Address Line 1"/>
              <input v-model="residence.line2" class="border border-[#ccc] rounded-md px-3 py-2 focus:ring-2 focus:ring-black/10 focus:outline-none" placeholder="Address Line 2"/>
              <input v-model="residence.city" class="border border-[#ccc] rounded-md px-3 py-2 focus:ring-2 focus:ring-black/10 focus:outline-none" placeholder="City"/>
              <input v-model="residence.state" class="border border-[#ccc] rounded-md px-3 py-2 focus:ring-2 focus:ring-black/10 focus:outline-none" placeholder="State"/>
              <input v-model="residence.pincode" class="border border-[#ccc] rounded-md px-3 py-2 focus:ring-2 focus:ring-black/10 focus:outline-none" placeholder="Pincode"/>
              <input v-model="residence.country" class="border border-[#ccc] rounded-md px-3 py-2 focus:ring-2 focus:ring-black/10 focus:outline-none" placeholder="Country"/>
            </div>
          </div>

          <div class="pt-1">
            <button class="px-3 py-2 bg-black text-white rounded-md" :disabled="savingProfile">
              {{ savingProfile ? 'Saving…' : 'Save Profile' }}
            </button>
          </div>
        </form>
      </div>

      <!-- RIGHT COLUMN -->
      <div class="space-y-6">
        <!-- Photo card -->
        <div class="bg-white border border-[#ccc] rounded-md p-4">
          <h2 class="font-semibold mb-3">Profile Picture</h2>
          <div class="flex items-center gap-3">
            <img :src="displayPhotoUrl" class="h-16 w-16 rounded-full object-cover border border-[#ccc]" />
            <input type="file" accept="image/*" @change="onFile"
              class="block w-full text-sm text-gray-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-black file:text-white file:cursor-pointer" />
          </div>

          <button class="mt-3 px-3 py-2 bg-black text-white rounded-md disabled:opacity-60"
            :disabled="!file || uploading" @click="upload">
            {{ uploading ? 'Uploading…' : 'Upload' }}
          </button>
        </div>

        <!-- Socials -->
        <form @submit.prevent="saveSocial" class="bg-white border border-[#ccc] rounded-md p-4 space-y-3">
          <div class="flex items-center justify-between">
            <h2 class="font-semibold">Social Links</h2>
            <span class="text-xs text-gray-500">Add only what you use</span>
          </div>

          <input v-model="profile.website" class="w-full border border-[#ccc] rounded-md px-3 py-2 focus:ring-2 focus:ring-black/10 focus:outline-none" placeholder="Website" />
          <input v-model="profile.linkedin" class="w-full border border-[#ccc] rounded-md px-3 py-2 focus:ring-2 focus:ring-black/10 focus:outline-none" placeholder="LinkedIn" />
          <input v-model="profile.xHandle" class="w-full border border-[#ccc] rounded-md px-3 py-2 focus:ring-2 focus:ring-black/10 focus:outline-none" placeholder="X handle" />
          <input v-model="profile.instagram" class="w-full border border-[#ccc] rounded-md px-3 py-2 focus:ring-2 focus:ring-black/10 focus:outline-none" placeholder="Instagram" />
          <input v-model="profile.facebook" class="w-full border border-[#ccc] rounded-md px-3 py-2 focus:ring-2 focus:ring-black/10 focus:outline-none" placeholder="Facebook" />
          <input v-model="profile.youtube" class="w-full border border-[#ccc] rounded-md px-3 py-2 focus:ring-2 focus:ring-black/10 focus:outline-none" placeholder="YouTube" />

          <div class="pt-1">
            <button class="px-3 py-2 bg-black text-white rounded-md" :disabled="savingSocial">
              {{ savingSocial ? 'Saving…' : 'Save Socials' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'member' })

import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import { useRuntimeConfig } from '#imports'
import { useSnackbar } from '@/services/useSnackbar'

import {
  getMe,
  updateMeMember,
  updateMeProfile,
  updateMeContact,
  uploadMyPhoto,
} from '@/services/meServices'

/* ───────────────── CONFIG ───────────────── */

const { show } = useSnackbar()
const cfg = useRuntimeConfig()

const filesBase = computed(() =>
  (cfg.public.apiBase || '').replace(/\/api\/v1\/?$/, '')
)

/* ───────────────── STATE ───────────────── */

const me = ref(null)

const member = ref({
  salutation: '',
  name: '',
  company: '',
  designation: '',
  city: '',
  state: '',
  industry: '',
  membershipCategory: '', // READ-ONLY
})

const profile = ref({
  headline: '',
  about: '',
  businessDescription: '',
  website: '',
  linkedin: '',
  xHandle: '',
  instagram: '',
  facebook: '',
  youtube: '',
  gstNumber: '',
})

const companyAddress = ref({
  line1: '', line2: '', city: '', state: '', pincode: '', country: '',
})

const residenceAddress = ref({
  line1: '', line2: '', city: '', state: '', pincode: '', country: '',
})

const address = companyAddress
const residence = residenceAddress

/* ───────────────── UI FLAGS ───────────────── */

const savingMember = ref(false)
const savingProfile = ref(false)
const savingSocial = ref(false)
const savingAddress = ref(false)

/* ───────────────── PHOTO ───────────────── */

const file = ref(null)
const preview = ref('')
const uploading = ref(false)
const cacheKey = ref(Date.now())
let lastObjectUrl = ''

const displayPhotoUrl = computed(() => {
  if (preview.value) return preview.value
  const url = me.value?.member?.profile?.photoUrl
  if (!url) return ''
  const final = url.startsWith('http') ? url : `${filesBase.value}${url}`
  return `${final}${final.includes('?') ? '&' : '?'}v=${cacheKey.value}`
})

const setPreviewFromFile = (f) => {
  if (!f) return
  if (lastObjectUrl) URL.revokeObjectURL(lastObjectUrl)
  lastObjectUrl = URL.createObjectURL(f)
  preview.value = lastObjectUrl
}

onBeforeUnmount(() => {
  if (lastObjectUrl) URL.revokeObjectURL(lastObjectUrl)
})

/* ───────────────── LOAD ───────────────── */

const load = async () => {
  try {
    me.value = await getMe()
    const m = me.value.member || {}
    const p = m.profile || {}
    const c = m.contact || {}

    member.value = {
      salutation: m.salutation || '',
      name: m.name || '',
      company: m.company || '',
      designation: m.designation || '',
      city: m.city || '',
      state: m.state || '',
      industry: m.industry || '',
      membershipCategory: m.membershipCategory || '',
    }

    profile.value = {
      headline: p.headline || '',
      about: p.about || '',
      businessDescription: p.businessDescription || '',
      website: p.website || '',
      linkedin: p.linkedin || '',
      xHandle: p.xHandle || '',
      instagram: p.instagram || '',
      facebook: p.facebook || '',
      youtube: p.youtube || '',
      gstNumber: p.gstNumber || '',
    }

    companyAddress.value = c.companyAddress || {
      line1:'', line2:'', city:'', state:'', pincode:'', country:''
    }

    residenceAddress.value = c.residenceAddress || {
      line1:'', line2:'', city:'', state:'', pincode:'', country:''
    }

    cacheKey.value = Date.now()
  } catch (e) {
    show(e?.response?.data?.message || 'Failed to load profile', 'error')
  }
}

/* ───────────────── SAVE HANDLERS ───────────────── */

const saveMember = async () => {
  savingMember.value = true
  try {
    await updateMeMember({
      salutation: member.value.salutation,
      name: member.value.name,
      company: member.value.company,
      designation: member.value.designation,
      city: member.value.city,
      state: member.value.state,
      industry: member.value.industry,
      // membershipCategory intentionally omitted (admin-only)
    })
    await load()
    show('Basic details updated', 'success')
  } catch (e) {
    show(e?.response?.data?.message || 'Failed to save basic details', 'error')
  } finally {
    savingMember.value = false
  }
}

const saveProfile = async () => {
  savingProfile.value = true
  try {
    await updateMeProfile({
      headline: profile.value.headline,
      about: profile.value.about,
      businessDescription: profile.value.businessDescription,
      gstNumber: profile.value.gstNumber,
    })
    await load()
    show('Profile updated', 'success')
  } catch (e) {
    show(e?.response?.data?.message || 'Failed to save profile', 'error')
  } finally {
    savingProfile.value = false
  }
}

const saveAddresses = async () => {
  savingAddress.value = true
  try {
    await updateMeContact({
      companyAddress: companyAddress.value,
      residenceAddress: residenceAddress.value,
    })
    await load()
    show('Addresses updated', 'success')
  } catch (e) {
    show(e?.response?.data?.message || 'Failed to save addresses', 'error')
  } finally {
    savingAddress.value = false
  }
}

const saveSocial = async () => {
  savingSocial.value = true
  try {
    const payload = {}
    ;['website','linkedin','xHandle','instagram','facebook','youtube'].forEach(k => {
      if (profile.value[k]?.trim()) payload[k] = profile.value[k].trim()
    })

    if (!Object.keys(payload).length) {
      show('Nothing to update', 'info')
      savingSocial.value = false
      return
    }

    await updateMeProfile(payload)
    await load()
    show('Social links updated', 'success')
  } catch (e) {
    show(e?.response?.data?.message || 'Failed to save socials', 'error')
  } finally {
    savingSocial.value = false
  }
}

/* ───────────────── PHOTO ───────────────── */

const onFile = (e) => {
  const f = e.target.files?.[0] || null
  file.value = f
  if (f) setPreviewFromFile(f)
  e.target.value = ''
}

const upload = async () => {
  if (!file.value) return
  uploading.value = true
  try {
    await uploadMyPhoto(file.value)
    if (lastObjectUrl) { URL.revokeObjectURL(lastObjectUrl); lastObjectUrl = '' }
    preview.value = ''
    file.value = null
    cacheKey.value = Date.now()
    show('Profile photo updated', 'success')
    await load()
  } catch (e) {
    show(e?.response?.data?.message || 'Failed to upload photo', 'error')
  } finally {
    uploading.value = false
  }
}

/* ───────────────── INIT ───────────────── */

onMounted(load)
</script>
