<template>
    <section class="min-h-screen">
      <!-- Hero -->
      <div class="relative isolate overflow-hidden bg-gradient-to-r from-[#a70000] to-[#e60012] text-white">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-center">
            Membership Plans
          </h1>
          <p class="mt-2 text-center text-white/90">Choose a plan that fits you.</p>
        </div>
        <div aria-hidden="true" class="absolute inset-y-0 right-0 -z-10 w-1/2 bg-[url('/textures/diagonal-noise.svg')] opacity-10"/>
      </div>
  
      <!-- Pricing Grid -->
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <article
            v-for="p in plans"
            :key="p.id"
            class="bg-white border border-[#ccc] rounded-md overflow-hidden flex flex-col"
          >
            <!-- Header -->
            <header class="px-6 py-4 border-b border-[#eee]">
              <h3 class="text-xl font-semibold text-gray-900 text-center">{{ p.name }}</h3>
            </header>
  
            <!-- Price band -->
            <div class="px-6 py-8 text-center">
              <div class="inline-flex items-baseline gap-1">
                <span class="text-lg text-gray-700">₹</span>
                <span class="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-none">
                  {{ formatINR(p.price) }}
                </span>
              </div>
              <div v-if="p.subtext" class="mt-1 text-sm text-gray-500">{{ p.subtext }}</div>
            </div>
  
            <!-- Features -->
            <ul class="px-6 space-y-3 text-sm text-gray-800">
              <li class="flex items-center gap-2">
                <span class="inline-flex h-5 w-5 items-center justify-center rounded border border-[#ccc]">
                  <svg class="h-3.5 w-3.5 text-gray-800" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/>
                  </svg>
                </span>
                <span>{{ p.duration }}</span>
              </li>
              <li v-if="p.note" class="flex items-center gap-2 text-gray-600">
                <span class="inline-flex h-5 w-5 items-center justify-center rounded border border-[#ccc]">
                  <svg class="h-3.5 w-3.5 text-gray-700" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/>
                  </svg>
                </span>
                <span>{{ p.note }}</span>
              </li>
            </ul>
  
            <!-- CTA -->
            <div class="px-6 py-6 mt-auto">
              <!-- ACTIVE (accent red + pointer on hover) -->
              <button
                v-if="p.available"
                type="button"
                class="w-full rounded-md bg-[#e60012] text-white font-semibold tracking-wide px-5 py-3
                       hover:bg-[#cc0010] hover:cursor-pointer active:opacity-90 transition-colors
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e60012]/40 focus-visible:ring-offset-2"
                @click="subscribe(p)"
              >
                SUBSCRIBE
              </button>
  
              <!-- DISABLED (no pointer) -->
              <button
                v-else
                type="button"
                class="w-full rounded-md border border-[#ccc] bg-white text-gray-600 font-semibold tracking-wide px-5 py-3
                       cursor-not-allowed hover:cursor-not-allowed"
                disabled
              >
                NOT AVAILABLE
              </button>
            </div>
          </article>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  definePageMeta({ layout: 'default' })
  
  const plans = [
    { id: 'life',     name: 'Life',     price: 17700, duration: 'Lifetime',       available: true },
    { id: 'term',     name: 'Term',     price: 11918, duration: '10 Years',       available: true },
    { id: 'student',  name: 'Student',  price: 354,   duration: 'One Year',       available: false, subtext: 'Limited to students' },
    { id: 'ordinary', name: 'Ordinary', price: 1534,  duration: 'One Year',       available: true },
  ]
  
  function formatINR (n) {
    try {
      return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Number(n || 0))
    } catch {
      return String(n || 0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  }
  
  function subscribe (plan) {
    // Hook this to your real flow, e.g. navigateTo(`/subscribe?plan=${plan.id}`)
    console.log('Subscribe:', plan.id)
  }
  </script>
  