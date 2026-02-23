<template>
  <div class="min-h-screen bg-[#F7F7F8] flex items-center justify-center p-6">
    <div class="w-full max-w-5xl bg-white border border-black/5 rounded-2xl overflow-hidden shadow-lg">
      <div class="grid md:grid-cols-2">
        <!-- Brand / Left Panel -->
        <div class="relative p-8 md:p-10 bg-gradient-to-br from-[var(--ipi-red)] to-rose-600 text-white">
          <div class="flex items-center gap-3">
            <img
            :src="logo"
              alt="IPI"
              class="h-10 w-auto drop-shadow filter brightness-0 invert"
            />
            <!-- <div class="text-xl font-semibold tracking-wide">IPI Connect</div> -->
          </div>

          <div class="mt-8 space-y-3">
            <h2 class="text-2xl md:text-3xl font-semibold leading-tight">Welcome back</h2>
            <p class="text-white/90 text-sm md:text-base">
              Sign in to access your dashboard, events, and the member network.
            </p>
          </div>

          <ul class="mt-8 space-y-2 text-sm text-white/90">
            <li class="flex items-center gap-2">
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/></svg>
              Secure member area
            </li>
            <li class="flex items-center gap-2">
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/></svg>
              Chapter updates & events
            </li>
            <li class="flex items-center gap-2">
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/></svg>
              Business networking
            </li>
          </ul>

          <!-- subtle pattern glow -->
          <div class="absolute -bottom-16 -right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        </div>

        <!-- Form / Right Panel -->
        <div class="p-8 md:p-10">
          <h1 class="text-2xl font-semibold text-gray-900 mb-6">Sign in</h1>

          <form @submit.prevent="submit" class="space-y-5">
            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                v-model="email"
                type="email"
                autocomplete="username"
                placeholder="you@example.com"
                class="w-full px-3 py-2 rounded-md border border-black/10 focus:outline-none focus:ring-2 focus:ring-[var(--ipi-red)]/30"
              />
            </div>

            <!-- Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div class="relative">
                <input
                  :type="showPw ? 'text' : 'password'"
                  v-model="password"
                  autocomplete="current-password"
                  placeholder="••••••••"
                  class="w-full px-3 py-2 rounded-md border border-black/10 focus:outline-none focus:ring-2 focus:ring-[var(--ipi-red)]/30 pr-10"
                />
                <button
                  type="button"
                  class="absolute inset-y-0 right-2 my-auto p-1.5 rounded hover:bg-gray-100"
                  @click="showPw = !showPw"
                  aria-label="Toggle password visibility"
                >
                  <svg v-if="!showPw" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2 12s3.8-7 10-7 10 7 10 7-3.8 7-10 7S2 12 2 12zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 3l18 18M10.6 10.6A3 3 0 0 0 12 15a3 3 0 0 0 2.4-4.8M9.9 4.2A11.5 11.5 0 0 1 12 5c6.2 0 10 7 10 7a17.5 17.5 0 0 1-4.3 4.9M6.1 6.1A17.7 17.7 0 0 0 2 12s3.8 7 10 7c1.2 0 2.4-.2 3.5-.6"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Row: Remember / Forgot -->
            <div class="flex items-center justify-between text-sm">
              <label class="inline-flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" v-model="remember" class="rounded border-gray-300" />
                Remember me
              </label>
              <NuxtLink to="/forgot-password" class="text-blue-700 hover:underline">Forgot password?</NuxtLink>
            </div>

            <!-- Submit -->
            <button
              :disabled="loading || !canSubmit"
              class="w-full inline-flex items-center justify-center gap-2 bg-[var(--ipi-red)] text-white rounded-md py-2.5
                     hover:bg-[var(--ipi-red)]/90 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <svg v-if="loading" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" />
              </svg>
              <span>{{ loading ? 'Signing in...' : 'Sign in' }}</span>
            </button>
          </form>

          <p v-if="error" class="text-red-600 text-sm mt-3">{{ error }}</p>
          <p class="text-xs text-gray-500 mt-6">
            By signing in you agree to our Terms & Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { login } from '@/services/authServices'
import logo from '@/assets/images/logo.png'

const email = ref('')
const password = ref('')
const error = ref(null)
const loading = ref(false)
const showPw = ref(false)
const remember = ref(true) // visual only; your token storage already handles persistence
const auth = useAuthStore()

const canSubmit = computed(() => !!email.value && !!password.value)

async function submit() {
  error.value = null
  loading.value = true
  try {
    // expected: { accessToken, refreshToken, user }
    const data = await login(email.value, password.value)

    const accessToken = data?.accessToken
    const refreshToken = data?.refreshToken ?? null
    const user = data?.user

    if (!accessToken || !user) {
      throw new Error('Invalid login response')
    }

    auth.setTokens(accessToken, refreshToken)
    auth.setUser(user)

    // Role-based redirect
    if (user.role === 'MEMBER') {
      await navigateTo('/member')
    } else {
      await navigateTo('/dashboard/chapters')
    }
  } catch (e) {
    error.value = e?.response?.data?.message || e?.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>
