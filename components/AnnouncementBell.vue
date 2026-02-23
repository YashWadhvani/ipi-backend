<template>
    <div class="relative">
      <button
        class="relative p-2 rounded-md hover:bg-gray-100 cursor-pointer"
        @click="open = !open"
        title="Announcements"
      >
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2zm6-6V11a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2z"/>
        </svg>
        <span v-if="unreadCount>0"
              class="absolute -top-0.5 -right-0.5 text-[10px] leading-4 min-w-[16px] h-4 rounded-full bg-[var(--ipi-red)] text-white text-center px-1">
          {{ unreadCount>99 ? '99+' : unreadCount }}
        </span>
      </button>
  
      <div v-if="open" class="absolute right-0 mt-2 w-[360px] bg-white border border-black/5 rounded-lg shadow-lg z-50">
        <div class="flex items-center justify-between px-3 py-2 border-b border-black/5">
          <div class="font-medium">Announcements</div>
          <div class="flex items-center gap-1">
            <button class="text-xs px-2 py-1 rounded border hover:bg-gray-50 cursor-pointer" @click="refresh">Refresh</button>
            <NuxtLink to="/member/announcements" class="text-xs px-2 py-1 rounded border hover:bg-gray-50">View all</NuxtLink>
          </div>
        </div>
  
        <div v-if="loading" class="p-3 text-sm text-gray-500">Loading…</div>
        <div v-else-if="items.length===0" class="p-3 text-sm text-gray-500">No announcements.</div>
  
        <div v-else class="max-h-[420px] overflow-auto">
          <div v-for="a in items" :key="a.id" class="px-3 py-2 border-b last:border-b-0 border-black/5">
            <div class="flex items-start gap-2">
              <span class="mt-1 inline-block h-2 w-2 rounded-full"
                    :class="a.isRead ? 'bg-gray-300' : 'bg-[var(--ipi-red)]'"/>
              <div class="flex-1 min-w-0">
                <div class="font-medium text-sm line-clamp-2">{{ a.title }}</div>
                <div class="text-xs text-gray-500">{{ new Date(a.createdAt).toLocaleString() }}</div>
                <p class="text-sm text-gray-700 mt-1 line-clamp-3">{{ a.body }}</p>
                <div class="flex items-center gap-2 mt-2">
                  <button
                    v-if="!a.isRead"
                    class="text-xs px-2 py-1 rounded border hover:bg-gray-50 cursor-pointer"
                    @click="markRead(a)"
                  >Mark read</button>
                  <span class="text-[10px] px-1.5 py-0.5 rounded border bg-white"
                        :class="a.scope==='GLOBAL' ? 'text-blue-700 border-blue-200' : 'text-violet-700 border-violet-200'">
                    {{ a.scope==='GLOBAL' ? 'Global' : 'Targeted' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
  
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { listMyAnnouncements, markAnnouncementRead } from '@/services/announcementsServices'
  
  const open = ref(false)
  const loading = ref(false)
  const items = ref([])
  const unreadCount = ref(0)
  
  async function refresh () {
    loading.value = true
    try {
      const r = await listMyAnnouncements({ page: 1, pageSize: 6 })
      items.value = r.items || []
      unreadCount.value = (await listMyAnnouncements({ page: 1, pageSize: 1, unreadOnly: true })).total || 0
    } finally {
      loading.value = false
    }
  }
  
  async function markRead(a) {
    try {
      await markAnnouncementRead(a.id)
      a.isRead = true
      unreadCount.value = Math.max(0, unreadCount.value - 1)
    } catch {}
  }
  
  onMounted(refresh)
  </script>
  