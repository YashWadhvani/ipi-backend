<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-semibold">Members</h1>
    </div>

    <!-- Tabs -->
    <div class="flex gap-1 bg-white border border-black/5 rounded-lg p-1 w-fit">
      <button
        class="px-4 py-2 rounded-md text-sm"
        :class="activeTab === 'global' ? 'bg-[var(--ipi-red)] text-white' : 'hover:bg-gray-100'"
        @click="switchTab('global')"
      >
        Global <span class="opacity-80">({{ counts.global }})</span>
      </button>

      <button
        class="px-4 py-2 rounded-md text-sm disabled:opacity-50"
        :class="activeTab === 'local' ? 'bg-[var(--ipi-red)] text-white' : 'hover:bg-gray-100'"
        @click="switchTab('local')"
        :disabled="!chapterId"
      >
        Local Chapter <span class="opacity-80">({{ counts.local }})</span>
      </button>
    </div>

    <!-- Search -->
    <div class="bg-white border border-black/5 rounded-lg p-3">
      <input
        v-model="search"
        placeholder="Search by name, company, email, or phone…"
        class="w-full px-3 py-2 rounded-md border border-black/10 focus:ring-2 focus:ring-[var(--ipi-red)]/30"
        @keyup.enter="goFirstPageAndFetch"
      />
    </div>

    <!-- Loading -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
      <div
        v-for="i in pageSize"
        :key="i"
        class="bg-white border border-black/5 rounded-xl p-4 animate-pulse"
      >
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-full bg-gray-200" />
          <div class="flex-1">
            <div class="h-4 bg-gray-200 rounded w-2/3 mb-2" />
            <div class="h-3 bg-gray-200 rounded w-1/2 mb-1" />
            <div class="h-3 bg-gray-200 rounded w-3/4" />
          </div>
        </div>
      </div>
    </div>

    <!-- Results -->
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4"
    >
      <MemberCard
        v-for="m in members"
        :key="m.id"
        :to="profilePath(m)"
        :name="m.name"
        :company="m.company"
        :email="m.contact?.officeEmail || ''"
        :phone="m.contact?.companyPhone || ''"
        :photo="assetUrl(m.profile?.photoUrl)"
      />
    </div>

    <!-- Empty -->
    <div v-if="!loading && members.length === 0" class="text-center text-gray-500 py-12">
      No members found.
    </div>

    <!-- Pagination -->
    <div v-if="!loading && total > pageSize" class="flex items-center justify-between">
      <div class="text-sm text-gray-600">Total: {{ total }}</div>

      <div class="flex items-center gap-1">
        <button
          class="p-2 border rounded-md"
          :disabled="page <= 1"
          @click="page--, fetchData()"
        >
          ‹
        </button>

        <span class="px-2 text-sm">
          Page {{ page }} / {{ Math.ceil(total / pageSize) }}
        </span>

        <button
          class="p-2 border rounded-md"
          :disabled="page >= Math.ceil(total / pageSize)"
          @click="page++, fetchData()"
        >
          ›
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
definePageMeta({ layout: 'member', middleware: ['member-auth'] })

import { ref, watch, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useSnackbar } from '@/services/useSnackbar'
import { listMembersGlobal, listMembersLocal } from '@/services/membersServices'
import { getMe } from '@/services/meServices'
import MemberCard from '@/components/MemberCard.vue'
import { assetUrl } from '@/services/http'

const profilePath = m => `/member/members/${m.slug || m.id}`

const auth = useAuthStore()
const { show } = useSnackbar()

// UI
const activeTab = ref('global')
const search = ref('')

// paging
const page = ref(1)
const pageSize = ref(24)
const total = ref(0)

// data
const members = ref([])
const loading = ref(false)
const chapterId = ref(null)
const counts = ref({ global: 0, local: 0 })

/* ───────── INIT ───────── */
onMounted(async () => {
  await resolveChapter()
  await fetchCounts()
  await fetchData()
})

/* ───────── CHAPTER ───────── */
async function resolveChapter () {
  const local = auth?.user?.member?.chapters || []
  const primary =
    local.find(c => c.isPrimary) ||
    (await getMe())?.member?.chapters?.find(c => c.isPrimary)

  chapterId.value = primary?.chapterId || primary?.chapter?.id || null
}

/* ───────── SEARCH ───────── */
let debounce
watch(search, () => {
  clearTimeout(debounce)
  debounce = setTimeout(() => {
    page.value = 1
    fetchCounts()
    fetchData()
  }, 300)
})

function switchTab (tab) {
  if (tab === 'local' && !chapterId.value) return
  if (activeTab.value !== tab) {
    activeTab.value = tab
    page.value = 1
    fetchData()
  }
}

/* ───────── FETCH COUNTS ───────── */
async function fetchCounts () {
  try {
    const q = search.value?.trim() || undefined

    const [g, l] = await Promise.all([
      listMembersGlobal({ q, page: 1, pageSize: 1 }),
      chapterId.value
        ? listMembersLocal({ q, chapterId: chapterId.value, page: 1, pageSize: 1 })
        : Promise.resolve({ total: 0 }),
    ])

    counts.value.global = Number(g?.total || 0)
    counts.value.local = Number(l?.total || 0)
  } catch {
    // ignore
  }
}

/* ───────── FETCH DATA ───────── */
async function fetchData () {
  loading.value = true
  try {
    const params = {
      q: search.value?.trim() || undefined,
      page: page.value,
      pageSize: pageSize.value,
    }

    const res =
      activeTab.value === 'local'
        ? await listMembersLocal({ ...params, chapterId: chapterId.value })
        : await listMembersGlobal(params)

    members.value = res?.items ?? []
    total.value = Number(res?.total ?? 0)
  } catch (err) {
    show(err?.response?.data?.message || 'Failed to load members', 'error')
    members.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// watch(members, () => {
//   console.log(
//     members.value.map(m => ({
//       id: m.id,
//       photoUrl: m.profile?.photoUrl
//     }))
//   )
// })
</script>
