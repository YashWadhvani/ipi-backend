<template>
  <form @submit.prevent="save" class="max-w-3xl">
    <div class="bg-white border border-black/5 rounded-xl p-6 space-y-6">
      <!-- Header -->
      <div class="flex items-start justify-between gap-4">
        <div>
          <h1 class="text-xl font-semibold">Contact & Privacy</h1>
          <p class="text-sm text-gray-500">
            Update office + residence contact details and manage what shows on your profile.
          </p>
        </div>
        <!-- <span class="text-xs text-gray-500">
          Logged in as <span class="font-medium">{{ me?.user?.email || '—' }}</span>
        </span> -->
      </div>

      <!-- Email (login) -->
      <div>
        <label class="block text-sm font-medium mb-1">Email (login)</label>
        <input
          :value="me?.user?.email || '—'"
          disabled
          class="w-full px-3 py-2 rounded-md border border-black/10 bg-gray-50 text-gray-700"
        />
        <p class="text-xs text-gray-500 mt-1">Your login email can’t be changed here.</p>
      </div>

      <!-- CONTACT: Emails -->
      <div class="grid sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">Office Email</label>
          <input
            v-model.trim="contact.officeEmail"
            type="email"
            placeholder="e.g. office@company.com"
            class="w-full px-3 py-2 rounded-md border border-black/10
                   focus:outline-none focus:ring-2 focus:ring-[var(--ipi-red)]/30"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Personal Email</label>
          <input
            v-model.trim="contact.personalEmail"
            type="email"
            placeholder="e.g. me@gmail.com"
            class="w-full px-3 py-2 rounded-md border border-black/10
                   focus:outline-none focus:ring-2 focus:ring-[var(--ipi-red)]/30"
          />
        </div>
      </div>

      <!-- CONTACT: Phones -->
      <div class="grid sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">Company Phone</label>
          <input
            v-model.trim="contact.companyPhone"
            type="tel"
            inputmode="tel"
            placeholder="e.g. +91 98765 43210"
            class="w-full px-3 py-2 rounded-md border border-black/10
                   focus:outline-none focus:ring-2 focus:ring-[var(--ipi-red)]/30"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Residence Phone</label>
          <input
            v-model.trim="contact.residencePhone"
            type="tel"
            inputmode="tel"
            placeholder="e.g. +91 98765 43210"
            class="w-full px-3 py-2 rounded-md border border-black/10
                   focus:outline-none focus:ring-2 focus:ring-[var(--ipi-red)]/30"
          />
        </div>
      </div>

      <!-- PRIVACY SWITCHES -->
      <div class="grid sm:grid-cols-2 gap-3 pt-2">
        <label class="flex items-center gap-3 cursor-pointer select-none">
          <input type="checkbox" v-model="privacy.showEmail" class="sr-only peer" />
          <span class="relative inline-block h-5 w-9 rounded-full bg-gray-300 transition peer-checked:bg-[var(--ipi-red)]">
            <span class="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
          </span>
          <span class="text-sm">Show email on profile</span>
        </label>

        <label class="flex items-center gap-3 cursor-pointer select-none">
          <input type="checkbox" v-model="privacy.showPhone" class="sr-only peer" />
          <span class="relative inline-block h-5 w-9 rounded-full bg-gray-300 transition peer-checked:bg-[var(--ipi-red)]">
            <span class="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
          </span>
          <span class="text-sm">Show phone on profile</span>
        </label>
      </div>

      <!-- COMPANY ADDRESS -->
      <div class="pt-2">
        <div class="flex items-center justify-between">
          <h2 class="text-sm font-semibold">Company Address</h2>
          <button
            type="button"
            class="text-xs text-gray-500 hover:underline"
            @click="copyCompanyToResidence"
          >
            Copy to residence
          </button>
        </div>

        <div class="mt-3 grid sm:grid-cols-2 gap-3">
          <input v-model.trim="contact.companyAddress.line1" class="w-full px-3 py-2 rounded-md border border-black/10" placeholder="Line 1" />
          <input v-model.trim="contact.companyAddress.line2" class="w-full px-3 py-2 rounded-md border border-black/10" placeholder="Line 2" />
          <input v-model.trim="contact.companyAddress.city" class="w-full px-3 py-2 rounded-md border border-black/10" placeholder="City" />
          <input v-model.trim="contact.companyAddress.state" class="w-full px-3 py-2 rounded-md border border-black/10" placeholder="State" />
          <input v-model.trim="contact.companyAddress.pincode" class="w-full px-3 py-2 rounded-md border border-black/10" placeholder="Pincode" />
          <input v-model.trim="contact.companyAddress.country" class="w-full px-3 py-2 rounded-md border border-black/10" placeholder="Country" />
        </div>
      </div>

      <!-- RESIDENCE ADDRESS -->
      <div class="pt-2">
        <div class="flex items-center justify-between">
          <h2 class="text-sm font-semibold">Residence Address</h2>
          <button
            type="button"
            class="text-xs text-gray-500 hover:underline"
            @click="clearResidence"
          >
            Clear residence address
          </button>
        </div>

        <div class="mt-3 grid sm:grid-cols-2 gap-3">
          <input v-model.trim="contact.residenceAddress.line1" class="w-full px-3 py-2 rounded-md border border-black/10" placeholder="Line 1" />
          <input v-model.trim="contact.residenceAddress.line2" class="w-full px-3 py-2 rounded-md border border-black/10" placeholder="Line 2" />
          <input v-model.trim="contact.residenceAddress.city" class="w-full px-3 py-2 rounded-md border border-black/10" placeholder="City" />
          <input v-model.trim="contact.residenceAddress.state" class="w-full px-3 py-2 rounded-md border border-black/10" placeholder="State" />
          <input v-model.trim="contact.residenceAddress.pincode" class="w-full px-3 py-2 rounded-md border border-black/10" placeholder="Pincode" />
          <input v-model.trim="contact.residenceAddress.country" class="w-full px-3 py-2 rounded-md border border-black/10" placeholder="Country" />
        </div>
      </div>

      <!-- Errors -->
      <ul v-if="errors.length" class="text-sm text-red-600 space-y-1">
        <li v-for="e in errors" :key="e">• {{ e }}</li>
      </ul>

      <!-- Actions -->
      <div class="flex items-center gap-2 pt-2">
        <button
          type="submit"
          class="px-4 py-2 rounded-md text-white bg-[var(--ipi-red)] hover:bg-[var(--ipi-red)]/90
                 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
          :disabled="saving || !canSubmit"
        >
          <svg
            v-if="saving"
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8
                 M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8"
            />
          </svg>
          <span>{{ saving ? 'Saving…' : 'Save changes' }}</span>
        </button>

        <button
          type="button"
          class="px-4 py-2 rounded-md border border-black/10 bg-white hover:bg-gray-50"
          :disabled="saving || !dirty"
          @click="reset"
        >
          Reset
        </button>
      </div>

      <p
        v-if="msg"
        class="text-sm mt-1"
        :class="msgType === 'success' ? 'text-green-600' : 'text-red-600'"
      >
        {{ msg }}
      </p>
    </div>
  </form>
</template>

<script setup>
definePageMeta({ layout: 'member', middleware: ['member-auth'] })

import { ref, computed, onMounted } from 'vue'
import { getMe, updateMeContact, updateMePrivacy } from '@/services/meServices'
import { useSnackbar } from '@/services/useSnackbar'

const { show } = useSnackbar()

const me = ref(null)

const saving = ref(false)
const msg = ref('')
const msgType = ref('')

const emptyAddr = () => ({
  line1: '',
  line2: '',
  city: '',
  state: '',
  pincode: '',
  country: '',
})

/**
 * IMPORTANT:
 * - /me/contact updates MemberContact (office/personal email, phones, addresses)
 * - /me/privacy updates MemberProfile (showEmail/showPhone)
 */
const contact = ref({
  officeEmail: '',
  personalEmail: '',
  companyPhone: '',
  residencePhone: '',
  companyAddress: emptyAddr(),
  residenceAddress: emptyAddr(),
})

const privacy = ref({
  showEmail: false,
  showPhone: false,
})

const original = ref({
  contact: JSON.parse(JSON.stringify(contact.value)),
  privacy: { ...privacy.value },
})

const load = async () => {
  me.value = await getMe()

  const c = me.value?.member?.contact || {}
  const p = me.value?.member?.profile || {}

  contact.value = {
    officeEmail: c.officeEmail || '',
    personalEmail: c.personalEmail || '',
    companyPhone: c.companyPhone || '',
    residencePhone: c.residencePhone || '',
    companyAddress: { ...emptyAddr(), ...(c.companyAddress || {}) },
    residenceAddress: { ...emptyAddr(), ...(c.residenceAddress || {}) },
  }

  privacy.value = {
    showEmail: !!p.showEmail,
    showPhone: !!p.showPhone,
  }

  original.value = {
    contact: JSON.parse(JSON.stringify(contact.value)),
    privacy: { ...privacy.value },
  }

  msg.value = ''
  msgType.value = ''
}

const reset = () => {
  contact.value = JSON.parse(JSON.stringify(original.value.contact))
  privacy.value = { ...original.value.privacy }
  msg.value = ''
  msgType.value = ''
}

const clearResidence = () => {
  contact.value.residenceAddress = emptyAddr()
}

const copyCompanyToResidence = () => {
  contact.value.residenceAddress = { ...contact.value.companyAddress }
}

/* ───────── VALIDATION ───────── */

const phoneRegex = /^\+?[0-9 ()-]{6,20}$/
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const errors = computed(() => {
  const e = []

  const cp = contact.value.companyPhone?.trim()
  const rp = contact.value.residencePhone?.trim()
  if (cp && !phoneRegex.test(cp)) e.push('Company phone is invalid.')
  if (rp && !phoneRegex.test(rp)) e.push('Residence phone is invalid.')

  const oe = contact.value.officeEmail?.trim()
  const pe = contact.value.personalEmail?.trim()
  if (oe && !emailRegex.test(oe)) e.push('Office email is invalid.')
  if (pe && !emailRegex.test(pe)) e.push('Personal email is invalid.')

  return e
})

const dirty = computed(() => {
  const a = JSON.stringify(contact.value) !== JSON.stringify(original.value.contact)
  const b =
    privacy.value.showEmail !== original.value.privacy.showEmail ||
    privacy.value.showPhone !== original.value.privacy.showPhone
  return a || b
})

const canSubmit = computed(() => dirty.value && errors.value.length === 0)

/* ───────── SAVE ───────── */

const toNullIfEmpty = (v) => {
  const s = String(v ?? '').trim()
  return s ? s : null
}

const addrToNullIfEmpty = (addr) => {
  const a = { ...addr }
  const hasAny = Object.values(a).some(v => String(v ?? '').trim())
  return hasAny ? a : null
}

const save = async () => {
  if (!canSubmit.value) return

  saving.value = true
  msg.value = ''
  msgType.value = ''

  try {
    // 1) Save contact details
    await updateMeContact({
      officeEmail: toNullIfEmpty(contact.value.officeEmail),
      personalEmail: toNullIfEmpty(contact.value.personalEmail),
      companyPhone: toNullIfEmpty(contact.value.companyPhone),
      residencePhone: toNullIfEmpty(contact.value.residencePhone),
      companyAddress: addrToNullIfEmpty(contact.value.companyAddress),
      residenceAddress: addrToNullIfEmpty(contact.value.residenceAddress),
    })

    // 2) Save privacy flags
    await updateMePrivacy({
      showEmail: privacy.value.showEmail,
      showPhone: privacy.value.showPhone,
    })

    await load()

    msg.value = 'Contact & privacy settings updated.'
    msgType.value = 'success'
    show('Contact & privacy updated', 'success')
  } catch (e) {
    const m =
      e?.response?.data?.message ||
      'Failed to update contact & privacy settings'

    msg.value = m
    msgType.value = 'error'
    show(m, 'error')
  } finally {
    saving.value = false
  }
}

onMounted(load)
</script>
