<template>
    <!-- Link version -->
    <NuxtLink
      v-if="to"
      :to="to"
      class="group bg-white border border-black/5 rounded-xl p-4 flex items-center gap-4 hover:shadow-sm transition cursor-pointer"
    >
      <img :src="photo || fallbackAvatar" alt="Member Photo"
           class="w-14 h-14 rounded-full object-cover border border-black/10" />
  
      <div class="min-w-0 flex-1">
        <div class="font-semibold truncate">{{ name || 'Unnamed Member' }}</div>
        <div class="text-sm text-gray-600 truncate">{{ company || '—' }}</div>
        <div class="mt-1 text-xs text-gray-500 space-y-1">
          <div v-if="email" class="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 8V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v1l9 5 9-5zM3 11v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6l-9 5-9-5z"/>
            </svg>
            <span class="hover:underline">{{ email }}</span>
          </div>
          <div v-if="phone" class="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.6 10.8a15.6 15.6 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24 11.3 11.3 0 0 0 3.5.56 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 7a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.3 11.3 0 0 0 .56 3.5 1 1 0 0 1-.24 1l-2.22 2.3z"/>
            </svg>
            <span class="hover:underline">{{ phone }}</span>
          </div>
        </div>
      </div>
  
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 opacity-0 group-hover:opacity-100 transition"
           viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
      </svg>
    </NuxtLink>
  
    <!-- Non-link fallback -->
    <div
      v-else
      class="group bg-white border border-black/5 rounded-xl p-4 flex items-center gap-4"
    >
      <img :src="photo || fallbackAvatar" alt="Member Photo"
           class="w-14 h-14 rounded-full object-cover border border-black/10" />
  
      <div class="min-w-0 flex-1">
        <div class="font-semibold truncate">{{ name || 'Unnamed Member' }}</div>
        <div class="text-sm text-gray-600 truncate">{{ company || '—' }}</div>
        <div class="mt-1 text-xs text-gray-500 space-y-1">
          <div v-if="email" class="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 8V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v1l9 5 9-5zM3 11v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6l-9 5-9-5z"/>
            </svg>
            <span class="hover:underline">{{ email }}</span>
          </div>
          <div v-if="phone" class="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.6 10.8a15.6 15.6 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24 11.3 11.3 0 0 0 3.5.56 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 7a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.3 11.3 0 0 0 .56 3.5 1 1 0 0 1-.24 1l-2.22 2.3z"/>
            </svg>
            <span class="hover:underline">{{ phone }}</span>
          </div>
        </div>
      </div>
  
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 opacity-0 group-hover:opacity-100 transition"
           viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
      </svg>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    to:      { type: String, default: '' },
    name:    { type: String, default: '' },
    company: { type: String, default: '' },
    email:   { type: String, default: '' },
    phone:   { type: String, default: '' },
    photo:   { type: String, default: '' },
  })
  
  const fallbackAvatar =
    'https://api.dicebear.com/8.x/initials/svg?radius=50&backgroundType=gradientLinear&size=80&seed=IPI'
  </script>
  