<template>
  <form @submit.prevent="save" class="max-w-xl">
    <div class="bg-white border border-black/5 rounded-xl p-6 space-y-5">
      <div class="flex items-center justify-between">
        <h1 class="text-xl font-semibold">Change Password</h1>
      </div>

      <!-- Current password -->
      <div>
        <label class="block text-sm font-medium mb-1">Current password</label>
        <div class="relative">
          <input
            :type="showCur ? 'text' : 'password'"
            v-model.trim="currentPassword"
            autocomplete="current-password"
            class="w-full px-3 py-2 rounded-md border border-black/10 focus:outline-none focus:ring-2 focus:ring-[var(--ipi-red)]/30"
            placeholder="Enter current password"
          />
          <button
            type="button"
            class="absolute inset-y-0 right-2 my-auto p-1.5 rounded hover:bg-gray-100"
            @click="showCur = !showCur"
            aria-label="Toggle current password visibility"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path v-if="!showCur" stroke-linecap="round" stroke-linejoin="round" d="M2 12s3.8-7 10-7 10 7 10 7-3.8 7-10 7S2 12 2 12zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
              <path v-else stroke-linecap="round" stroke-linejoin="round" d="M3 3l18 18M10.6 10.6A3 3 0 0 0 12 15a3 3 0 0 0 2.4-4.8M9.9 4.2A11.5 11.5 0 0 1 12 5c6.2 0 10 7 10 7a17.5 17.5 0 0 1-4.3 4.9M6.1 6.1A17.7 17.7 0 0 0 2 12s3.8 7 10 7c1.2 0 2.4-.2 3.5-.6"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- New password -->
      <div>
        <label class="block text-sm font-medium mb-1">New password</label>
        <div class="relative">
          <input
            :type="showNew ? 'text' : 'password'"
            v-model.trim="newPassword"
            autocomplete="new-password"
            class="w-full px-3 py-2 rounded-md border border-black/10 focus:outline-none focus:ring-2 focus:ring-[var(--ipi-red)]/30"
            placeholder="Enter new password"
          />
          <button
            type="button"
            class="absolute inset-y-0 right-2 my-auto p-1.5 rounded hover:bg-gray-100"
            @click="showNew = !showNew"
            aria-label="Toggle new password visibility"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path v-if="!showNew" stroke-linecap="round" stroke-linejoin="round" d="M2 12s3.8-7 10-7 10 7 10 7-3.8 7-10 7S2 12 2 12zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
              <path v-else stroke-linecap="round" stroke-linejoin="round" d="M3 3l18 18M10.6 10.6A3 3 0 0 0 12 15a3 3 0 0 0 2.4-4.8M9.9 4.2A11.5 11.5 0 0 1 12 5c6.2 0 10 7 10 7a17.5 17.5 0 0 1-4.3 4.9M6.1 6.1A17.7 17.7 0 0 0 2 12s3.8 7 10 7c1.2 0 2.4-.2 3.5-.6"/>
            </svg>
          </button>
        </div>
        <p class="text-xs text-gray-500 mt-1">Must be at least 8 characters and different from your current password.</p>
      </div>

      <!-- Confirm new password -->
      <div>
        <label class="block text-sm font-medium mb-1">Confirm new password</label>
        <div class="relative">
          <input
            :type="showConfirm ? 'text' : 'password'"
            v-model.trim="confirmPassword"
            autocomplete="new-password"
            class="w-full px-3 py-2 rounded-md border border-black/10 focus:outline-none focus:ring-2 focus:ring-[var(--ipi-red)]/30"
            placeholder="Re-enter new password"
          />
          <button
            type="button"
            class="absolute cursor-pointer inset-y-0 right-2 my-auto p-1.5 rounded hover:bg-gray-100"
            @click="showConfirm = !showConfirm"
            aria-label="Toggle confirm password visibility"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path v-if="!showConfirm" stroke-linecap="round" stroke-linejoin="round" d="M2 12s3.8-7 10-7 10 7 10 7-3.8 7-10 7S2 12 2 12zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
              <path v-else stroke-linecap="round" stroke-linejoin="round" d="M3 3l18 18M10.6 10.6A3 3 0 0 0 12 15a3 3 0 0 0 2.4-4.8M9.9 4.2A11.5 11.5 0 0 1 12 5c6.2 0 10 7 10 7a17.5 17.5 0 0 1-4.3 4.9M6.1 6.1A17.7 17.7 0 0 0 2 12s3.8 7 10 7c1.2 0 2.4-.2 3.5-.6"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Errors -->
      <ul v-if="errors.length" class="text-sm text-red-600 space-y-1">
        <li v-for="e in errors" :key="e">• {{ e }}</li>
      </ul>

      <!-- Actions -->
      <div class="flex items-center gap-3">
        <button
          type="submit"
          class="px-4 py-2 rounded-md text-white bg-[var(--ipi-red)] hover:bg-[var(--ipi-red)]/90 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
          :disabled="saving || !canSubmit"
        >
          <svg v-if="saving" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" />
          </svg>
          <span>{{ saving ? 'Updating…' : 'Update Password' }}</span>
        </button>
      </div>

      <p v-if="msg" class="text-sm mt-1" :class="msgType === 'success' ? 'text-green-600' : 'text-red-600'">
        {{ msg }}
      </p>
    </div>
  </form>
</template>

<script setup>
definePageMeta({ layout: 'member', middleware: ['member-auth'] })

import { ref, computed } from 'vue'
import { changeMyPassword } from '@/services/meServices'
import { useSnackbar } from '@/services/useSnackbar'

const { show } = useSnackbar()

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const showCur = ref(false)
const showNew = ref(false)
const showConfirm = ref(false)

const saving = ref(false)
const msg = ref('')
const msgType = ref('') // 'success' | 'error'

const errors = computed(() => {
  const e = []
  if (!currentPassword.value) e.push('Enter your current password.')
  if (!newPassword.value) e.push('Enter a new password.')
  if (newPassword.value && newPassword.value.length < 8) e.push('New password must be at least 8 characters.')
  if (newPassword.value && currentPassword.value && newPassword.value === currentPassword.value) {
    e.push('New password must be different from current password.')
  }
  if (confirmPassword.value && newPassword.value !== confirmPassword.value) {
    e.push('New password and confirmation do not match.')
  }
  return e
})

const canSubmit = computed(() =>
  currentPassword.value && newPassword.value && confirmPassword.value && errors.value.length === 0
)

async function save () {
  msg.value = ''
  msgType.value = ''
  if (!canSubmit.value) return

  saving.value = true
  try {
    await changeMyPassword({
      currentPassword: currentPassword.value,
      newPassword: newPassword.value
    })
    msg.value = 'Password updated.'
    msgType.value = 'success'
    show('Password updated', 'success')
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
  } catch (e) {
    const m = e?.response?.data?.message || 'Failed to update password'
    msg.value = m
    msgType.value = 'error'
    show(m, 'error')
  } finally {
    saving.value = false
  }
}
</script>
