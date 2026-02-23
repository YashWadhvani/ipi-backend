<template>
  <div class="h-screen overflow-hidden flex bg-[#F7F7F8] text-gray-900">
    <!-- Mobile overlay -->
    <div
      v-if="mobileOpen"
      class="fixed inset-0 z-30 bg-black/40 lg:hidden"
      @click="mobileOpen = false"
    >
    </div>

    <!-- Sidebar (desktop, fixed) -->
    <aside
      class="hidden lg:flex fixed inset-y-0 left-0 z-40 transition-all duration-300 ease-in-out border-r border-black/5"
      :class="[collapsed ? 'w-20' : 'w-64']"
      :style="{ background: 'var(--ipi-red)' }"
    >
      <div class="flex h-full w-full flex-col text-white/95 overflow-y-auto">
        <!-- Brand -->
        <div class="flex items-center gap-3 p-4 border-b border-white/10">
          <NuxtLink to="/dashboard" class="flex items-center gap-2" title="IPI Admin">
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
            v-for="item in navItems"
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

        <!-- Logout at bottom -->
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
        <NuxtLink to="/dashboard" class="flex items-center gap-2" @click="mobileOpen = false">
          <img
            src="../assets/images/logo.png"
            alt="IPI"
            class="h-7 w-auto"
            style="filter: brightness(0) invert(1);"
          />
          <span class="font-semibold tracking-wide">IPI Admin</span>
        </NuxtLink>
        <button class="p-2 rounded hover:bg-white/10" @click="mobileOpen = false" aria-label="Close menu">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <nav class="space-y-1 text-white/90">
        <NuxtLink
          v-for="item in navItems"
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
      </nav>
    </aside>

    <!-- Main (full-height column; header sticky; content scrolls) -->
    <main class="flex-1 min-w-0" :style="desktopMainStyle">
      <div class="h-screen flex flex-col">
        <!-- Topbar (sticky) -->
        <header class="sticky top-0 z-20 bg-white border-b border-black/5 flex items-center justify-between px-4 h-14">
          <div class="flex items-center gap-3">
            <!-- Hamburger next to breadcrumb -->
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

            <!-- Breadcrumb -->
            <nav class="text-sm text-gray-600 flex items-center gap-1">
              <NuxtLink to="/dashboard" class="hover:underline">Dashboard</NuxtLink>
              <span>/</span>
              <template v-for="(c, i) in breadcrumbs" :key="c.path">
                <NuxtLink v-if="i < breadcrumbs.length - 1" :to="c.path" class="hover:underline">
                  {{ c.label }}
                </NuxtLink>
                <span v-else class="text-gray-900 font-medium">{{ c.label }}</span>
                <span v-if="i < breadcrumbs.length - 1">/</span>
              </template>
            </nav>
          </div>

          <div class="flex items-center gap-3">
            <!-- Notifications -->
            <button class="p-2 cursor-pointer rounded bg-gray-100 hover:bg-[var(--ipi-red)] hover:text-white
                           focus:outline-none focus:ring-2 focus:ring-[var(--ipi-red)]/30"
                    @click="show('No new notifications', 'info')"
                    aria-label="Notifications">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24"
                   fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M12 2a4 4 0 0 0-4 4v2c0 .6-.3 1.2-.8 1.6A7 7 0 0 0 4 16v2h16v-2a7 7 0 0 0-3.2-6.4c-.5-.4-.8-1-.8-1.6V6a4 4 0 0 0-4-4m0 20a3 3 0 0 0 3-3H9a3 3 0 0 0 3 3z"/>
              </svg>
            </button>

            <div class="text-sm opacity-70 truncate max-w-[40vw] md:max-w-none">
              Welcome, <span class="font-medium text-gray-800">{{ displayName }}</span>
            </div>
          </div>
        </header>

        <!-- Scrollable content area -->
        <div class="flex-1 overflow-auto p-6">
          <slot >
          </slot>
        </div>
      </div>
    </main>

    <!-- Global UI helpers -->
    <ConfirmDialog
      v-model:open="confirmLogout"
      title="Sign out?"
      message="You’ll be logged out of the IPI dashboard."
      confirmText="Log out"
      cancelText="Stay"
      @confirm="doLogout"
    />
    <Snackbar />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import Snackbar from '@/components/common/Snackbar.vue'
import { useSnackbar } from '@/services/useSnackbar'

const { show } = useSnackbar()
const auth = useAuthStore()
const route = useRoute()

// Sidebar state
const collapsed = ref(false)
const mobileOpen = ref(false)
const confirmLogout = ref(false)

// Desktop media query
const isDesktop = ref(false)
let mq
onMounted(() => {
  if (process.client) {
    const raw = localStorage.getItem('dashboard_collapsed')
    if (raw === '1') collapsed.value = true

    mq = window.matchMedia('(min-width: 1024px)')
    const set = () => { isDesktop.value = mq.matches }
    if (mq.addEventListener) mq.addEventListener('change', set)
    else mq.addListener(set) // Safari fallback
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
  if (process.client) localStorage.setItem('dashboard_collapsed', v ? '1' : '0')
})

function toggleMenu () {
  if (isDesktop.value) {
    collapsed.value = !collapsed.value
  } else {
    mobileOpen.value = !mobileOpen.value
  }
}

const doLogout = () => {
  auth.clear()
  show('Logged out', 'success')
  navigateTo('/login')
}

// ----- NAV (role-aware) -----
const baseNav = [
  { to: '/dashboard',                  label: 'Overview',      icon: 'dashboard' },
  { to: '/dashboard/chapters',         label: 'Chapters',      icon: 'layers' },
  { to: '/dashboard/events',           label: 'Events',        icon: 'calendar' },

  // Admin/Staff only
  { to: '/dashboard/announcements',    label: 'Announcements', icon: 'megaphone', adminOnly: true },
  { to: '/dashboard/members',          label: 'Members',       icon: 'users',     adminOnly: true },

  // NEW: Pages & Media (Admin/Staff)
  { to: '/dashboard/pages',            label: 'Pages',         icon: 'doc',       adminOnly: true },
  { to: '/dashboard/media',            label: 'Media Library', icon: 'image',     adminOnly: true },
]

// show Members/Pages/Media etc only for ADMIN or STAFF
const isAdminOrStaff = computed(() =>
  auth.user?.role === 'ADMIN' || auth.user?.role === 'STAFF'
)

const navItems = computed(() =>
  baseNav.filter(item => item.adminOnly ? isAdminOrStaff.value : true)
)

// Breadcrumbs
const breadcrumbs = computed(() => {
  const path = route.path.replace(/^\/+/, '')
  const parts = path.split('/').filter(Boolean)
  const sliced = parts[0] === 'dashboard' ? parts.slice(1) : parts
  let acc = '/dashboard'
  return sliced.map((seg) => {
    acc += `/${seg}`
    return { label: humanize(seg), path: acc }
  })
})
function humanize (seg) {
  return seg
    .replace(/^\[|\]$/g, '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

const displayName = computed(() => auth.user?.name || auth.user?.email || 'User')

const desktopMainStyle = computed(() => {
  if (!isDesktop.value) return { marginLeft: '0px' }
  return { marginLeft: collapsed.value ? '5rem' : '16rem' }
})

const iconPath = (name) => {
  switch (name) {
    case 'dashboard': return 'M3 12h8V4H3v8zm0 8h8v-6H3v6zm10 0h8v-8h-8v8zm0-18v8h8V2h-8z'
    case 'layers':    return 'M12 3 2 8l10 5 10-5-10-5zm-8.94 8.5L12 17l8.94-5.5L22 13l-10 5-10-5 1.06-1.5z'
    case 'calendar':  return 'M7 2v2H5a2 2 0 0 0-2 2v2h18V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7zm14 8H3v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V10z'
    case 'users':     return 'M16 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-8 0a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-3 0-8 1.5-8 4v3h16v-3c0-2.5-5-4-8-4zm8 0c-.9 0-2 .1-3 .3 2.4.8 5 2.1 5 3.7V20h6v-3c0-2.5-5-4-8-4z'
    case 'megaphone': return 'M3 10v4l8 3V7l-8 3zm10-1v6l7 3V6l-7 3zM5 17.5a2.5 2.5 0 0 0 5 0v-.7l-5-1.9v2.6z'
    // NEW icons
    case 'doc':       return 'M6 2h7l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm7 1v5h5'
    case 'image':     return 'M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm3 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm13 8l-6-6-4 4-3-3-5 5h18z'
    default:          return ''
  }
}
</script>

<style scoped>
aside .truncate { transition: opacity .15s ease; }
</style>
