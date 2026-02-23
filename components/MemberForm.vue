<template>
  <div class="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
    <div class="bg-white w-full max-w-lg rounded-xl border border-[#ccc]">
      <div class="px-4 py-3 border-b border-[#eee] flex justify-between items-center">
        <h3 class="text-lg font-semibold">Create Member</h3>
        <button class="p-2 rounded hover:bg-gray-100" @click="$emit('close')">✕</button>
      </div>

      <form @submit.prevent="submit" class="p-5 space-y-3">
        <input
          v-model.trim="form.membershipNumber"
          required
          placeholder="Membership Number"
          class="w-full border border-[#ccc] rounded px-3 py-2"
        />

        <input
          v-model.trim="form.name"
          required
          placeholder="Full name"
          class="w-full border border-[#ccc] rounded px-3 py-2 focus:ring-2 focus:ring-black/10 focus:outline-none"
        />

        <input
          v-model.trim="form.email"
          type="email"
          required
          placeholder="Email (required)"
          class="w-full border border-[#ccc] rounded px-3 py-2 focus:ring-2 focus:ring-black/10 focus:outline-none"
        />

        <div>
          <label class="block text-sm text-gray-700 mb-1">Password (for member login)</label>
          <div class="relative">
            <input
              :type="showPwd ? 'text' : 'password'"
              v-model.trim="form.password"
              required
              minlength="8"
              placeholder="Min 8 characters"
              class="w-full border border-[#ccc] rounded px-3 py-2 pr-10 focus:ring-2 focus:ring-black/10 focus:outline-none"
            />
            <button
              type="button"
              class="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-600 hover:underline"
              @click="showPwd = !showPwd"
            >
              {{ showPwd ? 'Hide' : 'Show' }}
            </button>
          </div>
          <p class="text-xs text-gray-500 mt-1">
            Use at least 8 characters. A mix of letters and numbers is recommended.
          </p>
        </div>

        <input
          v-model.trim="form.company"
          placeholder="Company"
          class="w-full border border-[#ccc] rounded px-3 py-2 focus:ring-2 focus:ring-black/10 focus:outline-none"
        />
        <input
          v-model.trim="form.designation"
          placeholder="Designation"
          class="w-full border border-[#ccc] rounded px-3 py-2 focus:ring-2 focus:ring-black/10 focus:outline-none"
        />

        <div class="flex gap-2 justify-end pt-1">
          <button type="button" @click="$emit('close')" class="px-3 py-2 border border-[#ccc] rounded hover:bg-gray-50">
            Cancel
          </button>
          <button class="px-3 py-2 bg-black text-white rounded" :disabled="saving">
            {{ saving ? 'Saving…' : 'Save' }}
          </button>
        </div>

        <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSnackbar } from '@/services/useSnackbar'

const emit = defineEmits(['close', 'saved'])
const { show } = useSnackbar()

const saving = ref(false)
const error = ref('')
const showPwd = ref(false)
const form = ref({
  name: '',
  membershipNumber: '',
  email: '',
  password: '',
  company: '',
  designation: '',
})

const submit = async () => {
  // basic client validations
  if (!form.value.email) {
    error.value = 'Email is required'
    return
  }
  if (!form.value.password || form.value.password.length < 8) {
    error.value = 'Password must be at least 8 characters'
    return
  }

  try {
    saving.value = true
    error.value = ''
    // pass all fields to parent; parent will call createMember(...)
    await emit('saved', { ...form.value })
    show('Member details submitted', 'success')
  } catch (e) {
    const msg = e?.response?.data?.message || e?.message || 'Failed'
    error.value = msg
    show(msg, 'error')
  } finally {
    saving.value = false
  }
}
</script>
