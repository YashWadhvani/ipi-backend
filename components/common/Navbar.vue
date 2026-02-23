<template>
  <header class="w-full border-b border-gray-200 relative z-[100]">
    <!-- Topbar (visible only on lg+) -->
    <div class="hidden lg:flex justify-between items-center text-sm px-6 py-2 bg-[#e60012] text-white">
      <div class="flex items-center gap-6">
        <a href="mailto:indianplasticsinstitute@ipiindia.org" class="flex items-center gap-2 hover:opacity-90">
          <!-- mail icon -->
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5L4 8V6l8 5 8-5Z"/></svg>
          <span>indianplasticsinstitute@ipiindia.org</span>
        </a>
        <a href="tel:+912266950347" class="flex items-center gap-2 hover:opacity-90">
          <!-- phone icon -->
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24 11.36 11.36 0 0 0 3.56.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.4 21 3 13.6 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.22.2 2.43.57 3.56a1 1 0 0 1-.24 1.01l-2.2 2.22Z"/></svg>
          <span>+91 2266950347 / 2266962601</span>
        </a>
      </div>

      <div class="flex items-center gap-4 text-white/90">
        <a href="#" class="hover:opacity-90" aria-label="Facebook">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M13 22v-9h3l1-4h-4V7a1 1 0 0 1 1-1h3V2h-3a5 5 0 0 0-5 5v2H6v4h3v9h4Z"/></svg>
        </a>
        <a href="#" class="hover:opacity-90" aria-label="Twitter">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M22 5.8c-.7.3-1.5.6-2.3.7.8-.5 1.4-1.2 1.7-2.1-.8.5-1.7.9-2.6 1.1A3.9 3.9 0 0 0 12 8.7a11 11 0 0 1-8-4.1 4 4 0 0 0 1.2 5.3c-.6 0-1.2-.2-1.7-.5v.1c0 1.9 1.3 3.6 3.2 4-.6.2-1.2.2-1.8.1.5 1.6 2 2.7 3.8 2.8A7.8 7.8 0 0 1 2 18.1 11 11 0 0 0 7.9 20c7.5 0 11.7-6.3 11.7-11.7v-.5c.8-.5 1.5-1.2 2-2Z"/></svg>
        </a>
        <a href="#" class="hover:opacity-90" aria-label="Instagram">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2.2a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6Zm5.6-.9a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8Z"/></svg>
        </a>

        <!-- Divider -->
        <span class="inline-block h-4 w-px bg-white/30"></span>

        <!-- Login / Hello -->
        <NuxtLink
          v-if="!isLoggedIn"
          to="/login"
          class="hover:underline"
        >
          Login
        </NuxtLink>
        <button
          v-else
          type="button"
          class="hover:underline"
          @click="goToDashboard"
          title="Go to dashboard"
        >
          Hello, {{ displayName }}
        </button>
      </div>
    </div>

    <!-- Navbar -->
    <nav class="flex items-center justify-between px-6 py-4 bg-white">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-2">
        <img src="../../assets/images/logo.png" alt="IPI Logo" class="h-10 w-auto" />
      </NuxtLink>

      <!-- Desktop links -->
      <ul class="hidden md:flex items-center gap-6 text-sm font-medium">
        <li><NuxtLink to="/" class="hover:text-red-700">HOME</NuxtLink></li>

        <!-- ABOUT dropdown -->
        <li class="group relative">
          <button class="hover:text-red-700">ABOUT</button>
          <div class="absolute left-0 hidden group-hover:block bg-white shadow-md py-2 border border-[#eee] rounded-md">
            <NuxtLink to="/about" class="block px-4 py-2 hover:bg-gray-100">About IPI</NuxtLink>
            <NuxtLink to="/history" class="block px-4 py-2 hover:bg-gray-100">History</NuxtLink>
          </div>
        </li>

        <!-- MANAGEMENT dropdown -->
        <!-- <li class="group relative">
          <button class="hover:text-red-700">MANAGEMENT</button>
          <div class="absolute left-0 hidden group-hover:block bg-white shadow-md py-2 border border-[#eee] rounded-md">
            <NuxtLink to="/management/council" class="block px-4 py-2 hover:bg-gray-100">Council</NuxtLink>
            <NuxtLink to="/management/committees" class="block px-4 py-2 hover:bg-gray-100">Committees</NuxtLink>
          </div>
        </li> -->

        <!-- Direct links -->
        <li><NuxtLink to="/chapters" class="hover:text-red-700">IPI CHAPTERS</NuxtLink></li>
        <li><NuxtLink to="/events-ipi" class="hover:text-red-700">EVENTS</NuxtLink></li>
        <li><NuxtLink to="/contact" class="hover:text-red-700">CONTACT US</NuxtLink></li>
      </ul>

      <!-- Right: actions (desktop) -->
      <div class="hidden md:flex items-center gap-3">
        <button class="rounded-full bg-gray-600 text-white h-10 w-10 flex items-center justify-center hover:opacity-90" title="Network">
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h6v6H4V4Zm0 10h6v6H4v-6Zm10-10h6v6h-6V4Zm6 10v6h-6v-6h6Z"/></svg>
        </button>
        <NuxtLink to="/pricing" class="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800">
          MEMBERSHIPS
        </NuxtLink>
      </div>

      <!-- Mobile: hamburger -->
      <button
        class="md:hidden inline-flex h-10 w-10 items-center justify-center rounded hover:bg-gray-100"
        :aria-expanded="mobileOpen.toString()"
        aria-label="Open menu"
        @click="mobileOpen = true"
      >
        <svg class="h-6 w-6 text-gray-800" viewBox="0 0 24 24" fill="currentColor"><path d="M3 6h18v2H3V6Zm0 5h18v2H3v-2Zm0 5h18v2H3v-2Z"/></svg>
      </button>
    </nav>

    <!-- Mobile overlay + right drawer -->
    <div
      class="fixed inset-0 z-[110] md:hidden"
      :class="mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'"
      aria-hidden="!mobileOpen"
    >
      <!-- Backdrop -->
      <div
        class="absolute inset-0 bg-black/40 transition-opacity duration-300"
        :class="mobileOpen ? 'opacity-100' : 'opacity-0'"
        @click="mobileOpen = false"
      />
      <!-- Drawer -->
      <aside
        class="absolute right-0 top-0 h-full w-full max-w-[85vw] sm:max-w-[420px] bg-[#e60012] text-white
               transform transition-transform duration-300 overscroll-contain"
        :class="mobileOpen ? 'translate-x-0' : 'translate-x-full'"
        role="dialog"
        aria-modal="true"
      >
        <div class="flex items-center justify-between px-6 py-4">
          <NuxtLink to="/" class="flex items-center gap-2" @click="mobileOpen=false">
            <img src="../../assets/images/logo.png" alt="IPI Logo" class="h-10 w-auto" />
          </NuxtLink>
          <!-- Close (X) -->
          <button
            class="inline-flex h-10 w-10 items-center justify-center rounded hover:bg-white/10"
            aria-label="Close menu"
            @click="mobileOpen=false"
          >
            <svg class="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="m18.3 5.7-1.4-1.4L12 9.17 7.1 4.3 5.7 5.7 10.6 10.6 5.7 15.5l1.4 1.4L12 12l4.9 4.9 1.4-1.4-4.9-4.9 4.9-4.9Z"/>
            </svg>
          </button>
        </div>

        <nav class="px-6 pt-2 pb-8 overflow-y-auto h-[calc(100%-64px)]">
          <ul class="space-y-4 text-lg font-semibold">
            <li><NuxtLink to="/" class="block py-2 hover:underline" @click="mobileOpen=false">HOME</NuxtLink></li>

            <!-- ABOUT (collapsible) -->
            <li>
              <details class="group">
                <summary class="cursor-pointer py-2 hover:underline">ABOUT</summary>
                <ul class="ml-4 mt-1 space-y-2 text-base font-normal">
                  <li><NuxtLink to="/about" class="block hover:underline" @click="mobileOpen=false">About IPI</NuxtLink></li>
                  <li><NuxtLink to="/history" class="block hover:underline" @click="mobileOpen=false">History</NuxtLink></li>
                </ul>
              </details>
            </li>

            <!-- MANAGEMENT (collapsible) -->
            <!-- <li>
              <details class="group">
                <summary class="cursor-pointer py-2 hover:underline">MANAGEMENT</summary>
                <ul class="ml-4 mt-1 space-y-2 text-base font-normal">
                  <li><NuxtLink to="/management/council" class="block hover:underline" @click="mobileOpen=false">Council</NuxtLink></li>
                  <li><NuxtLink to="/management/committees" class="block hover:underline" @click="mobileOpen=false">Committees</NuxtLink></li>
                </ul>
              </details>
            </li> -->

            <!-- Direct links -->
            <li><NuxtLink to="/chapters" class="block py-2 hover:underline" @click="mobileOpen=false">IPI CHAPTERS</NuxtLink></li>
            <li><NuxtLink to="/events-ipi" class="block py-2 hover:underline" @click="mobileOpen=false">EVENTS</NuxtLink></li>
            <li><NuxtLink to="/contact" class="block py-2 hover:underline" @click="mobileOpen=false">CONTACT US</NuxtLink></li>
          </ul>

          <div class="mt-8 border-t border-white/20 pt-6">
            <NuxtLink
              to="/pricing"
              class="inline-flex items-center gap-2 rounded bg-white text-[#e60012] px-4 py-2 font-semibold hover:bg-white/90"
              @click="mobileOpen=false"
            >
              MEMBERSHIPS
            </NuxtLink>
          </div>
        </nav>
      </aside>
    </div>
  </header>
</template>

<script setup>
const mobileOpen = ref(false)

/**
 * Auth display (very light integration):
 * - Uses global state `currentUser` if your app sets it.
 * - Fallback: tries to read localStorage('ipi:user') once on mount.
 */
const currentUser = useState('currentUser', () => null)

onMounted(() => {
  if (!currentUser.value) {
    try {
      const raw = localStorage.getItem('ipi:user')
      if (raw) currentUser.value = JSON.parse(raw)
    } catch {}
  }
})

const isLoggedIn = computed(() => !!currentUser.value)
const displayName = computed(() =>
  currentUser.value?.firstName ||
  currentUser.value?.name ||
  (currentUser.value?.email ? currentUser.value.email.split('@')[0] : 'Member')
)

const goToDashboard = () => navigateTo('/dashboard')
</script>
