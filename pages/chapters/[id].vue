<template>
  <section class="min-h-screen">
    <!-- Hero -->
    <div class="relative isolate overflow-hidden bg-gradient-to-r from-[#a70000] to-[#e60012] text-white">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div class="flex items-center gap-3">
          <NuxtLink to="/chapters" class="text-white/80 hover:underline">← Back</NuxtLink>
          <span class="text-white/50">/</span>
          <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight truncate">
            {{ chapter?.name || 'Chapter' }}
          </h1>
        </div>
        <p v-if="chapter?.slug" class="mt-1 text-white/80">/{{ chapter.slug }}</p>
        <p v-if="chapter?.city?.name" class="mt-1 text-white/90">
          {{ chapter.city.name }}<span v-if="chapter.city.state">, {{ chapter.city.state }}</span>
        </p>
      </div>
    </div>

    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <!-- Summary -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white border border-[#ccc] rounded p-4">
          <div class="text-sm text-gray-500">Status</div>
          <span
            v-if="chapter?.status"
            :class="['inline-flex mt-1 rounded-full px-2.5 py-0.5 text-xs capitalize', badgeStatusClass(chapter.status)]"
          >
            {{ chapter.status }}
          </span>
        </div>
        <div class="bg-white border border-[#ccc] rounded p-4">
          <div class="text-sm text-gray-500">Leadership</div>
          <div class="text-2xl font-semibold mt-1">{{ leadershipCount }}</div>
        </div>
        <div class="bg-white border border-[#ccc] rounded p-4">
          <div class="text-sm text-gray-500">Total Members</div>
          <div class="text-2xl font-semibold mt-1">{{ totalMembers }}</div>
        </div>
      </div>

      <!-- Leadership (3 per row) -->
      <div v-if="featuredLeadership.length" class="space-y-4">
        <h2 class="text-xl font-semibold">Leadership</h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <article
            v-for="m in featuredLeadership"
            :key="m.id"
            class="bg-white border border-[#ccc] rounded-lg p-4 flex items-center gap-4"
          >
            <!-- AVATAR (image or initials) -->
            <div
              class="h-16 w-16 rounded-full border border-[#ccc] bg-gray-200 overflow-hidden
                     flex items-center justify-center select-none"
            >
              <img
                v-if="avatarPhoto(m)"
                :src="avatarPhoto(m)"
                class="h-full w-full object-cover"
                @error="onAvatarError($event)"
              />
              <span
                v-else
                class="font-extrabold text-lg text-gray-800"
              >
                {{ avatarInitials(m) }}
              </span>
            </div>

            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <h3 class="font-semibold truncate">{{ displayMemberName(m) }}</h3>
                <span :class="['inline-flex rounded-full px-2 py-0.5 text-[11px]', badgeRoleClass(m.role)]">
                  {{ m.role }}
                </span>
              </div>
              <p class="text-xs text-gray-600 truncate">
                {{ companyOf(m) || '—' }}
              </p>
            </div>
          </article>
        </div>
      </div>

      <!-- Members -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold">Members</h2>
          <input
            v-model="memberSearch"
            placeholder="Search member"
            class="w-full sm:w-80 rounded-md border border-[#ccc] px-3 py-2"
          />
        </div>

        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="i in 9" :key="i" class="bg-white border rounded p-4 animate-pulse h-24" />
        </div>

        <div v-else-if="filteredMembers.length === 0" class="text-gray-600">
          No members found.
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <article
            v-for="mc in filteredMembers"
            :key="mc.id"
            class="bg-white border border-[#ccc] rounded-lg p-4 relative"
          >
            <div class="flex items-center gap-4">
              <!-- AVATAR -->
              <div
                class="h-[60px] w-[60px] shrink-0 rounded-full border border-[#dfdfdf] bg-[#e60012] overflow-hidden
                      flex items-center justify-center select-none"
              >
                <img
                  v-if="avatarPhoto(mc)"
                  :src="avatarPhoto(mc)"
                  class="h-full w-full object-cover"
                  @error="onAvatarError($event)"
                />
                <span
                  v-else
                  class="font-extrabold text-lg text-white"
                >
                  {{ avatarInitials(mc) }}
                </span>
              </div>

              <!-- TEXT -->
              <div class="min-w-0 flex-1">
                <h3 class="font-semibold truncate">{{ displayMemberName(mc) }}</h3>
                <p class="text-xs text-gray-600 truncate">
                  {{ companyOf(mc) || '—' }}
                </p>
              </div>
            </div>

            <!-- ROLE BADGE -->
            <span
              :class="[
                'absolute top-[10px] right-[10px] rounded-full px-2 py-0.5 text-[11px] z-[10]',
                badgeRoleClass(mc.role)
              ]"
            >
              {{ mc.role || 'MEMBER' }}
            </span>
          </article>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getChapter } from '@/services/chaptersServices'

definePageMeta({ layout: 'default' })

const route = useRoute()
const chapter = ref(null)
const loading = ref(true)
const memberSearch = ref('')

onMounted(load)
async function load () {
  loading.value = true
  try {
    chapter.value = await getChapter(String(route.params.id))
  } finally {
    loading.value = false
  }
}

/* ROLE ORDER (leadership display order) */
const ROLE_ORDER = {
  CHAIR: 0,
  VICE_CHAIR: 1,
  SECRETARY: 2,
  TREASURER: 3,
  MEMBER_REP_1: 4,
  MEMBER_REP_2: 5,
  MEMBER_REP_3: 6,
  LEADERSHIP: 7
}

const members = computed(() => chapter.value?.members || [])
const totalMembers = computed(() => members.value.length)

const leadershipMembers = computed(() =>
  members.value
    .filter(m => (m.role || 'MEMBER') !== 'MEMBER') // only leadership roles
    .sort((a, b) => (ROLE_ORDER[(a.role || '').toUpperCase()] ?? 99) - (ROLE_ORDER[(b.role || '').toUpperCase()] ?? 99))
)

const leadershipCount = computed(() => leadershipMembers.value.length)
const featuredLeadership = computed(() => leadershipMembers.value.slice(0, 6)) // show top 6

const filteredMembers = computed(() => {
  const q = memberSearch.value.trim().toLowerCase()
  if (!q) return members.value
  return members.value.filter(m => {
    const name = displayMemberName(m).toLowerCase()
    const company = (companyOf(m) || '').toLowerCase()
    return name.includes(q) || company.includes(q)
  })
})

/* Helpers */
function displayMemberName (mc) {
  const p = mc?.member?.profile
  const full = [p?.firstName, p?.lastName].filter(Boolean).join(' ').trim()
  return full || mc?.member?.name || 'Member'
}

const companyOf = (mc) => mc?.member?.company || mc?.member?.companyName || ''

function avatarPhoto (mc) {
  return mc?.member?.profile?.photoUrl || mc?.member?.photoUrl || ''
}

function avatarInitials (mc) {
  // try profile first/last, else derive from display name
  const p = mc?.member?.profile || {}
  const name = ([p.firstName, p.lastName].filter(Boolean).join(' ').trim() || mc?.member?.name || '').trim()

  if (!name) return 'NA'

  const parts = name.split(/\s+/).filter(Boolean)
  const first = parts[0]?.[0] || ''
  const second = (parts.length > 1 ? parts[1]?.[0] : parts[0]?.[1]) || ''
  const out = (first + second).toUpperCase()
  return out || 'NA'
}

function onAvatarError (e) {
  // if image fails, remove src so v-if becomes false on next render
  // easiest: just blank it
  e.target.src = ''
}

/* badges */
function badgeStatusClass (s) {
  switch ((s || 'active').toLowerCase()) {
    case 'active': return 'bg-green-100 text-green-800'
    case 'inactive': return 'bg-yellow-100 text-yellow-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

function badgeRoleClass (r) {
  const role = (r || 'MEMBER').toUpperCase()
  if (role === 'CHAIR') return 'bg-indigo-100 text-indigo-800'
  if (role === 'VICE_CHAIR') return 'bg-purple-100 text-purple-800'
  if (role === 'SECRETARY') return 'bg-sky-100 text-sky-800'
  if (role === 'TREASURER') return 'bg-amber-100 text-amber-800'
  if (role.startsWith('MEMBER_REP')) return 'bg-lime-100 text-lime-800'
  if (role === 'LEADERSHIP') return 'bg-fuchsia-100 text-fuchsia-800'
  return 'bg-gray-100 text-gray-800'
}
</script>
