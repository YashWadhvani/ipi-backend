<template>
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h1 class="text-xl font-semibold">Announcements</h1>
        <div class="flex items-center gap-2">
          <label class="inline-flex items-center gap-2 text-sm bg-white border border-black/10 rounded-md px-2 py-1.5">
            <input type="checkbox" v-model="unreadOnly" @change="goFirst" />
            Unread only
          </label>
          <button class="px-3 py-2 rounded-md border border-black/10 bg-white hover:bg-gray-50" @click="goFirst">Refresh</button>
        </div>
      </div>
  
      <div v-if="loading" class="bg-white border border-black/5 rounded-xl p-6 text-gray-500">Loading…</div>
  
      <div v-else>
        <div v-if="items.length" class="space-y-3">
          <div v-for="a in items" :key="a.id" class="bg-white border border-black/5 rounded-xl p-4">
            <div class="flex items-start gap-3">
              <span class="mt-1 inline-block h-2 w-2 rounded-full"
                    :class="a.isRead ? 'bg-gray-300' : 'bg-[var(--ipi-red)]'"/>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <h2 class="font-semibold text-lg truncate">{{ a.title }}</h2>
                  <span class="text-xs px-2 py-0.5 rounded border"
                        :class="a.scope==='GLOBAL' ? 'border-blue-200 bg-blue-50 text-blue-800' : 'border-violet-200 bg-violet-50 text-violet-800'">
                    {{ a.scope==='GLOBAL' ? 'Global' : 'Targeted' }}
                  </span>
                </div>
                <div class="text-xs text-gray-500">{{ new Date(a.createdAt).toLocaleString() }}</div>
                <p class="text-sm text-gray-800 mt-2 whitespace-pre-wrap">{{ a.body }}</p>
  
                <div class="mt-3 flex items-center gap-2">
                  <button v-if="!a.isRead"
                          class="text-xs px-2 py-1 rounded border hover:bg-gray-50 cursor-pointer"
                          @click="markRead(a)">
                    Mark read
                  </button>
                  <div v-if="a.chapters?.length" class="text-xs text-gray-500">
                    To: {{ a.chapters.map(c => c.chapter?.name || '—').join(', ') }}
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- pagination -->
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-600">Total: {{ total }}</div>
            <div class="flex items-center gap-1">
              <button class="p-2 border border-black/10 rounded-md hover:bg-gray-50"
                      :disabled="page<=1"
                      @click="page--; load()">
                ‹
              </button>
              <span class="px-2 text-sm">Page {{ page }} / {{ Math.ceil(total / pageSize) }}</span>
              <button class="p-2 border border-black/10 rounded-md hover:bg-gray-50"
                      :disabled="page>=Math.ceil(total/pageSize)"
                      @click="page++; load()">
                ›
              </button>
            </div>
          </div>
        </div>
  
        <div v-else class="bg-white border border-black/5 rounded-xl p-8 text-center text-gray-500">
          No announcements{{ unreadOnly ? ' (unread)' : '' }}.
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  definePageMeta({ layout: 'member', middleware: ['member-auth'] })
  
  import { ref, onMounted } from 'vue'
  import { listMyAnnouncements, markAnnouncementRead } from '@/services/announcementsServices'
  import { useSnackbar } from '@/services/useSnackbar'
  
  const { show } = useSnackbar()
  
  const items = ref([])
  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(10)
  const unreadOnly = ref(false)
  const loading = ref(false)
  
  const load = async () => {
    loading.value = true
    try {
      const r = await listMyAnnouncements({ page: page.value, pageSize: pageSize.value, unreadOnly: unreadOnly.value })
      items.value = r.items || []
      total.value = r.total || 0
    } catch (e) {
      show(e?.response?.data?.message || 'Failed to load announcements', 'error')
    } finally {
      loading.value = false
    }
  }
  
  const goFirst = () => { page.value = 1; load() }
  const markRead = async (a) => {
    try {
      await markAnnouncementRead(a.id)
      a.isRead = true
    } catch (e) {
      show('Failed to mark as read', 'error')
    }
  }
  
  onMounted(load)
  </script>
  