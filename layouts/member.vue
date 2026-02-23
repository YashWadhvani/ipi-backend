<!-- layouts/member.vue -->
<template>
  <div class="h-screen overflow-hidden flex bg-[#F7F7F8] text-gray-900">
    <!-- Mobile overlay -->
    <div
      v-if="mobileOpen"
      class="fixed inset-0 z-30 bg-black/40 lg:hidden"
      @click="mobileOpen = false"
    />

    <!-- Sidebar (desktop, fixed) -->
    <aside
      class="hidden lg:flex fixed inset-y-0 left-0 z-40 transition-all duration-300 ease-in-out border-r border-black/5"
      :class="[collapsed ? 'w-20' : 'w-64']"
      :style="{ background: 'var(--ipi-red)' }"
    >
      <div class="flex h-full w-full flex-col text-white/95 overflow-y-auto">
        <!-- Brand -->
        <div class="flex items-center gap-3 p-4 border-b border-white/10">
          <NuxtLink to="/member" class="flex items-center gap-2" title="IPI Member">
            <img
              src="../assets/images/logo.png"
              alt="IPI"
              class="h-7 w-auto"
              style="filter: brightness(0) invert(1);"
            />
          </NuxtLink>
        </div>

        <!-- Nav -->
        <nav class="p-3 space-y-1 flex-1">
          <NuxtLink
            v-for="item in nav"
            :key="item.to"
            :to="item.to"
            class="group flex items-center gap-3 px-3 py-2 rounded text-white/90 hover:bg-white/10"
            exact-active-class="bg-white/15 text-white"
            :title="item.label"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path :d="iconPath(item.icon)" />
            </svg>
            <span v-show="!collapsed" class="truncate">{{ item.label }}</span>
          </NuxtLink>
        </nav>

        <!-- Logout -->
        <div class="p-3 border-t border-white/10">
          <button
            class="w-full cursor-pointer flex items-center justify-center gap-2 px-3 py-2 rounded-md
                   text-white bg-white/10 hover:bg-white/20
                   focus:outline-none focus:ring-2 focus:ring-white/30"
            @click="confirmLogout = true"
            title="Log out"
          >
            <svg xmlns="http://www.w3.org/2000/svg"
                 class="h-5 w-5"
                 viewBox="0 0 24 24"
                 fill="none"
                 stroke="currentColor"
                 stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 2v10"/>
              <path stroke-linecap="round" stroke-linejoin="round" d="M5.1 7.1a8 8 0 1 0 13.8 0"/>
            </svg>
            <span v-show="!collapsed" class="text-sm">Log out</span>
          </button>
        </div>
      </div>
    </aside>

    <!-- Mobile drawer -->
    <aside
      class="fixed inset-y-0 left-0 z-40 w-72 p-4 transition-transform duration-300 ease-in-out lg:hidden border-r border-black/5"
      :class="[mobileOpen ? 'translate-x-0' : '-translate-x-full']"
      :style="{ background: 'var(--ipi-red)' }"
    >
      <div class="flex items-center justify-between border-b border-white/10 pb-3 mb-3 text-white/95">
        <NuxtLink to="/member" class="flex items-center gap-2" @click="mobileOpen = false">
          <img
            src="../assets/images/logo.png"
            alt="IPI"
            class="h-7 w-auto"
            style="filter: brightness(0) invert(1);"
          />
          <span class="font-semibold tracking-wide">Member</span>
        </NuxtLink>
        <button class="p-2 rounded hover:bg-white/10" @click="mobileOpen = false" aria-label="Close menu">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <nav class="space-y-1 text-white/90">
        <NuxtLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="group flex items-center gap-3 px-3 py-2 rounded hover:bg-white/10"
          exact-active-class="bg-white/15 text-white"
          @click="mobileOpen = false"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path :d="iconPath(item.icon)" />
          </svg>
          <span class="truncate">{{ item.label }}</span>
        </NuxtLink>

        <div class="pt-3 border-t border-white/10">
          <button
            class="w-full flex items-center gap-2 px-3 py-2 rounded text-white bg-white/10 hover:bg-white/15"
            @click="confirmLogout = true"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 3h-2v10h2V3zm-1 18a8 8 0 1 0 0-16v2a6 6 0 1 1 0 12v2z"/>
            </svg>
            <span>Log out</span>
          </button>
        </div>
      </nav>
    </aside>

    <!-- Main (full-height column; header sticky; content scrolls) -->
    <main class="flex-1 min-w-0" :style="desktopMainStyle">
      <div class="h-screen flex flex-col">
        <!-- Topbar (sticky) -->
        <header class="sticky top-0 z-20 bg-white border-b border-black/5 flex items-center justify-between px-4 h-14">
          <div class="flex items-center gap-3">
            <button
              class="p-2 rounded-md cursor-pointer bg-gray-100 text-gray-800 hover:bg-[var(--ipi-red)] hover:text-white
                     focus:outline-none focus:ring-2 focus:ring-[var(--ipi-red)]/30"
              @click="toggleMenu"
              aria-label="Toggle menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg"
                   class="h-5 w-5"
                   viewBox="0 0 24 24"
                   fill="none"
                   stroke="currentColor"
                   stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>

            <div class="text-sm text-gray-600">Member Dashboard</div>
          </div>

          <div class="flex items-center gap-3">
            <div class="text-sm opacity-70 truncate max-w-[40vw] md:max-w-none">
              {{ auth.user?.email }}
            </div>
            <AnnouncementBell />

            <button
              class="text-sm px-3 py-1.5 rounded border bg-gray-100 hover:bg-gray-200"
              @click="confirmLogout = true"
            >
              Logout
            </button>
          </div>
        </header>

        <!-- Scrollable content area -->
        <div class="flex-1 overflow-auto p-6">
          <slot />
        </div>
      </div>
    </main>

    <!-- Global UI helpers -->
    <ConfirmDialog
      v-model:open="confirmLogout"
      title="Sign out?"
      message="You’ll be logged out of your member dashboard."
      confirmText="Log out"
      cancelText="Stay"
      @confirm="doLogout"
    />
    <Snackbar />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { logout as apiLogout } from '@/services/authServices'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import Snackbar from '@/components/common/Snackbar.vue'
import { useSnackbar } from '@/services/useSnackbar'
import AnnouncementBell from '@/components/AnnouncementBell.vue'

const auth = useAuthStore()
const { show } = useSnackbar()

// Sidebar state
const collapsed = ref(false)
const mobileOpen = ref(false)
const confirmLogout = ref(false)

// Desktop media query
const isDesktop = ref(false)
let mq
onMounted(() => {
  if (process.client) {
    const raw = localStorage.getItem('member_collapsed')
    if (raw === '1') collapsed.value = true

    mq = window.matchMedia('(min-width: 1024px)')
    const set = () => { isDesktop.value = mq.matches }
    if (mq.addEventListener) mq.addEventListener('change', set)
    else mq.addListener(set)
    set()
  }
})
onBeforeUnmount(() => {
  if (mq) {
    const set = () => { isDesktop.value = mq.matches }
    if (mq.removeEventListener) mq.removeEventListener('change', set)
    else mq.removeListener(set)
  }
})

watch(collapsed, (v) => {
  if (process.client) localStorage.setItem('member_collapsed', v ? '1' : '0')
})

function toggleMenu () {
  if (isDesktop.value) {
    collapsed.value = !collapsed.value
  } else {
    mobileOpen.value = !mobileOpen.value
  }
}

const doLogout = async () => {
  try { await apiLogout() } catch {}
  auth.clear()
  show('Logged out', 'success')
  navigateTo('/login')
}

// Member nav (same order/labels as your existing member area)
const nav = [
  { to: '/member',           label: 'Overview', icon: 'dashboard' },
  { to: '/member/profile',   label: 'Profile',  icon: 'profile' },
  { to: '/member/contact',   label: 'Contact',  icon: 'contact' },
  { to: '/member/security',  label: 'Security', icon: 'shield' },
  { to: '/member/members',   label: 'Members',  icon: 'users' },
  { to: '/events',           label: 'Events',   icon: 'calendar' },
]

// Dynamically shift main content to the right of the fixed sidebar (desktop only)
const desktopMainStyle = computed(() => {
  if (!isDesktop.value) return { marginLeft: '0px' }
  // 80px when collapsed (w-20), 256px when expanded (w-64)
  return { marginLeft: collapsed.value ? '5rem' : '16rem' }
})

// Inline icons to match the dashboard style
const iconPath = (name) => {
  switch (name) {
    case 'dashboard': return 'M3 12h8V4H3v8zm0 8h8v-6H3v6zm10 0h8v-8h-8v8zm0-18v8h8V2h-8z'
    case 'profile':   return 'M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-4 0-8 2-8 5v3h16v-3c0-3-4-5-8-5z'
    case 'briefcase': return 'M10 2h4a2 2 0 0 1 2 2v2h4a2 2 0 0 1 2 2v9a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V8a2 2 0 0 1 2-2h4V4a2 2 0 0 1 2-2z'
    case 'share':     return 'M18 8a3 3 0 1 0-2.82-4h-.18l-6 3a3 3 0 1 0 0 6l6 3h.18A3 3 0 1 0 18 8z'
    case 'contact':   return 'M21 8V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v1l9 5 9-5zm0 3-9 5-9-5v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6z'
    case 'shield':    return 'M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3z'
    case 'users':     return 'M16 11c1.66 0 3-1.34 3-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.67 0-8 1.34-8 4v3h10v-3c0-2.66-5.33-4-8-4zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.93 1.97 3.45v3h10v-3c0-2.66-5.33-4-8-4z'
    case 'calendar':  return 'M7 2h2v2h6V2h2v2h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2V2zm12 6H5v10h14V8zM7 10h4v4H7v-4z'
    default:          return ''
  }
}
</script>

<style scoped>
aside .truncate { transition: opacity .15s ease; }
</style>
