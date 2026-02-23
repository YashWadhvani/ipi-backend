<template>
  <div class="space-y-4">
    <!-- Topbar -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div>
          <h1 class="text-xl font-semibold">{{ chapter?.name || 'Chapter' }}</h1>
          <p class="text-sm text-gray-600">
            {{ chapter?.city?.name }}
            <span v-if="chapter?.city?.state">, {{ chapter.city.state }}</span>
          </p>
        </div>
        <span
          v-if="chapter?.status"
          class="px-2 py-1 rounded text-xs capitalize"
          :class="badgeClass(chapter.status)"
        >
          {{ chapter.status }}
        </span>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="openEditChapter = true"
          class="inline-flex items-center gap-2 rounded-md border border-[#ccc] bg-white px-3 py-2 hover:bg-gray-50 cursor-pointer"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 17.25V21h3.75L17.8 9.94l-3.75-3.75L3 17.25z"/>
          </svg>
          <span>Edit</span>
        </button>

        <button
          @click="openAddMember = true"
          class="inline-flex items-center gap-2 rounded-md border border-[#ccc] bg-white px-3 py-2 hover:bg-gray-50 cursor-pointer"
          title="Add new member"
        >
          <svg class="h-4 w-4 text-gray-800" viewBox="0 0 24 24" fill="currentColor"><path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"/></svg>
          <span>Add Member</span>
        </button>

        <button
          @click="openLinkMember = true"
          class="inline-flex items-center gap-2 rounded-md bg-black text-white px-3 py-2 hover:opacity-90 cursor-pointer"
          title="Link existing member"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M7 7h10v2H7V7zm0 4h10v2H7v-2zm0 4h10v2H7v-2z"/></svg>
          <span>Link Existing</span>
        </button>

        <NuxtLink
          to="/dashboard/chapters"
          class="inline-flex items-center gap-2 rounded-md border border-[#ccc] bg-white px-3 py-2 hover:bg-gray-50 cursor-pointer"
          title="Back to chapters"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="m15 18-6-6 6-6"/></svg>
          <span>Back</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Overview: Image + Address / Contacts -->
    <div class="bg-white border border-[#ccc] rounded p-4">
      <div class="flex gap-4 items-start">
        <!-- Featured Image -->
        <div class="w-40 h-28 sm:w-56 sm:h-36 bg-gray-100 rounded border overflow-hidden flex items-center justify-center">
          <template v-if="chapter?.image?.url">
            <img
              :src="assetUrl(chapter.image.url)"
              :alt="chapter?.image?.alt || chapter?.name || 'Chapter image'"
              class="w-full h-full object-cover"
            />
          </template>
          <template v-else>
            <svg class="w-10 h-10 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 16H5V5h14v14zM8 13l2.03 2.71 2.07-2.49L15 16h2l-3-4-2.9 3.5L9 12l-3 4h2l2-3z"/>
            </svg>
          </template>
        </div>

        <!-- Details -->
        <div class="grid gap-3 sm:grid-cols-2 w-full text-sm">
          <div>
            <div class="text-gray-500 mb-1">City</div>
            <div class="font-medium">
              {{ chapter?.city?.name || '—' }}<span v-if="chapter?.city?.state">, {{ chapter.city.state }}</span>
            </div>
          </div>

          <div>
            <div class="text-gray-500 mb-1">Address</div>
            <div class="font-medium whitespace-pre-line">
              {{ addressText || '—' }}
            </div>
          </div>

          <div v-if="chapter?.contactName || chapter?.contactEmail || chapter?.contactPhone">
            <div class="text-gray-500 mb-1">Contact</div>
            <div class="space-y-0.5">
              <div v-if="chapter?.contactName" class="font-medium">{{ chapter.contactName }}</div>
              <div v-if="chapter?.contactEmail" class="text-gray-700">{{ chapter.contactEmail }}</div>
              <div v-if="chapter?.contactPhone" class="text-gray-700">{{ chapter.contactPhone }}</div>
            </div>
          </div>

          <div>
            <div class="text-gray-500 mb-1">Code</div>
            <div class="font-medium">{{ chapter?.code || '—' }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- KPIs -->
    <div class="grid sm:grid-cols-3 gap-3">
      <div class="bg-white border border-[#ccc] rounded p-4">
        <div class="text-sm text-gray-500">Chairperson</div>
        <div class="text-2xl font-semibold">
          <span v-if="chair">{{ chair.member.name }}</span>
          <span v-else>—</span>
        </div>
        <div v-if="chair?.titleInChapter" class="text-xs text-gray-500 mt-1">— {{ chair.titleInChapter }}</div>
      </div>
      <div class="bg-white border border-[#ccc] rounded p-4">
        <div class="text-sm text-gray-500">Leadership</div>
        <div class="text-2xl font-semibold">{{ leadershipCount }}</div>
      </div>
      <div class="bg-white border border-[#ccc] rounded p-4">
        <div class="text-sm text-gray-500">Total Members</div>
        <div class="text-2xl font-semibold">{{ (chapter?.members?.length) ?? 0 }}</div>
      </div>
    </div>
    <!-- Members controls -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <!-- Search -->
      <div class="relative w-full sm:max-w-xs">
        <input
          v-model="memberTableSearch"
          placeholder="Search members (name, email, phone, company)"
          class="w-full border border-[#ccc] rounded px-3 py-2 pl-9 text-sm focus:ring-2 focus:ring-black/10 focus:outline-none"
        />
        <svg
          class="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16a6.471 6.471 0 0 0 4.23-1.57l.27.28v.79L20 21.5 21.5 20l-6-6z"/>
        </svg>
      </div>

      <!-- Pagination info -->
      <div class="text-sm text-gray-600">
        Showing {{ pageStart }}–{{ pageEnd }} of {{ filteredMembers.length }}
      </div>
    </div>

    <!-- Members table -->
    <div class="bg-white border border-[#ccc] rounded-md overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-[#f1f8ff] backdrop-blur-sm sticky top-0 z-10 border-b border-[#ccc] text-left text-gray-600">
          <tr>
            <th class="p-3 font-bold">Member</th>
            <th class="p-3 font-bold">Company</th>
            <th class="p-3 font-bold">Role</th>
            <th class="p-3 font-bold">Primary</th>
            <th class="p-3 font-bold text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#ccc]">
          <tr
            v-for="mc in paginatedMembers"
            :key="mc.id"
            class="hover:bg-gray-50 transition-colors"
          >
          <td class="p-3 text-gray-900 font-medium">
            <NuxtLink
              :to="`/dashboard/members/${mc.member.id}`"
              class="hover:underline text-black"
            >
              {{ mc.member.name }}
            </NuxtLink>
          </td>
            <td class="p-3 text-gray-700">{{ mc.member.company || '—' }}</td>

            <!-- Role pill + dropdown -->
            <td class="p-3">
              <div class="flex items-center gap-2">
                <span class="px-2 py-1 rounded text-xs capitalize" :class="roleBadge(roleSelections[mc.id] || mc.role || 'MEMBER')">
                  {{ roleSelections[mc.id] || mc.role || 'MEMBER' }}
                </span>
                <select
                  class="border border-[#ccc] rounded px-2 py-1 text-xs"
                  :disabled="busyId === mc.id"
                  v-model="roleSelections[mc.id]"
                  @change="changeRole(mc)"
                >
                  <option v-for="r in roleOptions" :key="r" :value="r">{{ r }}</option>
                </select>
              </div>
            </td>

            <td class="p-3 text-gray-700">{{ mc.isPrimary ? 'Yes' : 'No' }}</td>
            <td class="p-3">
              <div class="flex items-center justify-end gap-2">
                <button
                  class="p-2 rounded-md border border-[#ccc] hover:bg-red-50 cursor-pointer"
                  @click="askUnlink(mc)"
                  :disabled="busyId === mc.id"
                  title="Unlink from chapter"
                >
                  Unlink
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="chapter && chapter.members && chapter.members.length === 0">
            <td colspan="5" class="p-8 text-center text-gray-500">No members in this chapter</td>
          </tr>
          <tr v-if="!chapter">
            <td colspan="5" class="p-8 text-center text-gray-500">Loading…</td>
          </tr>
        </tbody>
      </table>
      <!-- Pagination -->
      <div
        v-if="totalPages > 1"
        class="flex items-center justify-between px-4 py-3 border-t border-[#ccc] text-sm"
      >
        <button
          class="px-3 py-1 border rounded disabled:opacity-50"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          Prev
        </button>

        <div class="text-gray-600">
          Page {{ currentPage }} of {{ totalPages }}
        </div>

        <button
          class="px-3 py-1 border rounded disabled:opacity-50"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          Next
        </button>
      </div>

      <!-- Loading bar -->
      <div v-if="loading" class="h-0.5 bg-gradient-to-r from-transparent via-black/30 to-transparent animate-pulse" />
    </div>

    <!-- Link existing member modal -->
    <div
      v-if="openLinkMember"
      class="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white w-full max-w-lg rounded-xl border border-[#ccc]">
        <div class="px-4 py-3 border-b border-[#eee] flex justify-between items-center">
          <h3 class="text-lg font-semibold">Link Existing Member</h3>
          <button class="p-2 rounded hover:bg-gray-100" @click="openLinkMember = false">✕</button>
        </div>

        <div class="p-4 space-y-3">
          <div class="relative">
            <input
              v-model="memberSearch"
              @input="debouncedMemberSearch"
              placeholder="Search member by name/company"
              class="w-full border border-[#ccc] rounded px-3 py-2 pl-9 focus:ring-2 focus:ring-black/10 focus:outline-none"
            />
            <svg class="absolute left-2.5 top-2.5 h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16a6.471 6.471 0 0 0 4.23-1.57l.27.28v.79L20 21.5 21.5 20l-6-6zM9.5 14A4.5 4.5 0 1 1 14 9.5 4.505 4.505 0 0 1 9.5 14z"/>
            </svg>
          </div>

          <div class="max-h-64 overflow-auto border border-[#ccc] rounded">
            <button
              v-for="m in memberOptions"
              :key="m.id"
              class="w-full text-left px-3 py-2 hover:bg-gray-50 border-b"
              @click="linkMember(m)"
            >
              <div class="font-medium text-gray-900">{{ m.name }}</div>
              <div class="text-sm text-gray-600">{{ m.company || '—' }}</div>
            </button>
            <div v-if="memberOptions.length === 0" class="px-3 py-6 text-center text-gray-500">No matches</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create brand-new member then auto-link to this chapter -->
    <MemberForm v-if="openAddMember" @close="openAddMember = false" @saved="onCreateMember" />
    <!-- Edit Chapter Modal -->
    <div
  v-if="openEditChapter"
  class="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
>
  <div
    class="bg-white w-full max-w-xl rounded-xl border border-[#ccc]
           max-h-[90vh] flex flex-col"
  >
    <!-- Header -->
    <div class="px-4 py-3 border-b border-[#eee] flex justify-between items-center">
      <h3 class="text-lg font-semibold">Edit Chapter</h3>
      <button
        class="p-2 rounded hover:bg-gray-100"
        @click="openEditChapter = false"
      >
        ✕
      </button>
    </div>

    <!-- ✅ Scrollable Form Body -->
    <div class="p-4 space-y-4 text-sm overflow-y-auto flex-1">

      <!-- Chapter Image -->
      <div>
        <label class="block text-gray-600 mb-1">Chapter Image</label>

        <div class="flex items-center gap-4">
          <!-- Preview -->
          <div
            class="w-36 h-24 border rounded overflow-hidden bg-gray-100 flex items-center justify-center"
          >
            <img
              v-if="imagePreview || editForm.image?.url"
              :src="imagePreview || assetUrl(editForm.image.url)"
              class="w-full h-full object-cover"
            />
            <span v-else class="text-xs text-gray-400">No image</span>
          </div>

          <!-- Controls -->
          <div class="space-y-2">
            <input
              type="file"
              accept="image/*"
              class="text-xs"
              @change="onImageSelect"
            />

            <button
              v-if="imagePreview || editForm.image?.url"
              type="button"
              class="text-xs text-red-600 underline"
              @click="removeImage"
            >
              Remove image
            </button>
          </div>
        </div>
      </div>

      <!-- Name -->
      <div>
        <label class="block text-gray-600 mb-1">Name</label>
        <input
          v-model="editForm.name"
          class="w-full border rounded px-3 py-2"
        />
      </div>

      <!-- Code -->
      <div>
        <label class="block text-gray-600 mb-1">Code</label>
        <input
          v-model="editForm.code"
          class="w-full border rounded px-3 py-2"
        />
      </div>

      <!-- Status -->
      <div>
        <label class="block text-gray-600 mb-1">Status</label>
        <select
          v-model="editForm.status"
          class="w-full border rounded px-3 py-2"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <!-- Contact Name -->
      <div>
        <label class="block text-gray-600 mb-1">Contact Name</label>
        <input
          v-model="editForm.contactName"
          class="w-full border rounded px-3 py-2"
        />
      </div>

      <!-- Contact Email -->
      <div>
        <label class="block text-gray-600 mb-1">Contact Email</label>
        <input
          v-model="editForm.contactEmail"
          class="w-full border rounded px-3 py-2"
        />
      </div>

      <!-- Contact Phone -->
      <div>
        <label class="block text-gray-600 mb-1">Contact Phone</label>
        <input
          v-model="editForm.contactPhone"
          class="w-full border rounded px-3 py-2"
        />
      </div>

      <!-- Address -->
      <div>
        <label class="block text-gray-600 mb-1">Address</label>
        <textarea
          v-model="editForm.address.line1"
          placeholder="Address line"
          class="w-full border rounded px-3 py-2"
        />
      </div>
    </div>

    <!-- ✅ Sticky Footer (Always Visible) -->
    <div
      class="px-4 py-3 border-t border-[#eee] flex justify-end gap-2
             sticky bottom-0 bg-white
             shadow-[0_-4px_12px_rgba(0,0,0,0.05)]"
    >
      <button
        class="px-4 py-2 border rounded hover:bg-gray-50"
        @click="openEditChapter = false"
      >
        Cancel
      </button>
      <button
        class="px-4 py-2 bg-black text-white rounded hover:opacity-90"
        @click="saveChapter"
      >
        Save
      </button>
    </div>
  </div>
</div>



    <!-- Confirm unlink dialog -->
    <ConfirmDialog
      v-model:open="confirmUnlinkOpen"
      title="Unlink member?"
      :message="unlinkConfirmMessage"
      confirmText="Unlink"
      cancelText="Cancel"
      @confirm="doUnlink"
    />

  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'

import { useRoute } from 'vue-router'
import { getChapter, assignRole, updateChapter } from '@/services/chaptersServices'
import {
  listMembers,
  addMemberToChapter,
  createMember,
  removeMemberFromChapter,
} from '@/services/membersServices'
import { useSnackbar } from '@/services/useSnackbar'
import MemberForm from '@/components/MemberForm.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { assetUrl, http } from '@/services/http'

const openEditChapter = ref(false)
const imageFile = ref(null)
const imagePreview = ref(null)
const memberTableSearch = ref('')
const currentPage = ref(1)
const PAGE_SIZE = 30

const filteredMembers = computed(() => {
  const q = memberTableSearch.value.trim().toLowerCase()
  if (!q) return chapter.value?.members || []

  return (chapter.value?.members || []).filter((mc) => {
    const m = mc.member || {}
    return [
      m.name,
      m.email,
      m.phone,
      m.company,
      mc.role,
    ]
      .filter(Boolean)
      .some((v) => String(v).toLowerCase().includes(q))
  })
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredMembers.value.length / PAGE_SIZE))
)

const paginatedMembers = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return filteredMembers.value.slice(start, start + PAGE_SIZE)
})

const pageStart = computed(() =>
  filteredMembers.value.length === 0
    ? 0
    : (currentPage.value - 1) * PAGE_SIZE + 1
)

const pageEnd = computed(() =>
  Math.min(currentPage.value * PAGE_SIZE, filteredMembers.value.length)
)


const editForm = ref({
  name: '',
  code: '',
  status: 'active',
  description: '',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  address: {
    line1: '',
    line2: '',
    area: '',
    landmark: '',
    pincode: '',
  },

  // ✅ REQUIRED for image editing
  image: null, // { url, alt } | null
})
function debounce (fn, delay) {
  let t
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay) }
}

const uploadChapterImage = async (file) => {
  const fd = new FormData()
  fd.append('file', file)

  const res = await http.post('/media/upload', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  return res.data.url // ← THIS is what you save in chapter.image.url
}

definePageMeta({ layout: 'dashboard', middleware: ['auth-admin-client'] })

const route = useRoute()
const id = String(route.params.id)
const { show } = useSnackbar()

// state
const chapter = ref(null)
const chair = ref(null)
const loading = ref(false)
const busyId = ref(null)

const openAddMember = ref(false)
const openLinkMember = ref(false)

const memberSearch = ref('')
const memberOptions = ref([])

// local role selections (by chapter-member link id)
const roleSelections = ref({})

// roles list for dropdown
const roleOptions = [
  'MEMBER',
  'CHAIR',
  'VICE_CHAIR',
  'TREASURER',
  'SECRETARY',
  'MEMBER_REP_1',
  'MEMBER_REP_2',
  'MEMBER_REP_3',
]

// unlink confirm
const confirmUnlinkOpen = ref(false)
const unlinkTarget = ref(null)
const unlinkConfirmMessage = computed(() =>
  unlinkTarget.value
    ? `This will unlink “${unlinkTarget.value.member?.name || 'the member'}” from this chapter.`
    : 'Are you sure?'
)

// badges
const badgeClass = (st) => {
  switch ((st || '').toLowerCase()) {
    case 'active': return 'bg-green-100 text-green-800 border border-green-200'
    case 'inactive': return 'bg-gray-100 text-gray-700 border border-gray-200'
    case 'suspended': return 'bg-red-100 text-red-800 border border-red-200'
    case 'pending': return 'bg-yellow-100 text-yellow-800 border border-yellow-200'
    default: return 'bg-gray-100 text-gray-700 border border-gray-200'
  }
}

const roleBadge = (role) => {
  const r = (role || '').toUpperCase()
  if (r === 'CHAIR') return 'bg-indigo-100 text-indigo-800 border border-indigo-200'
  if (r === 'VICE_CHAIR') return 'bg-purple-100 text-purple-800 border border-purple-200'
  if (r === 'TREASURER') return 'bg-emerald-100 text-emerald-800 border border-emerald-200'
  if (r === 'SECRETARY') return 'bg-sky-100 text-sky-800 border border-sky-200'
  if (r === 'MEMBER_REP_1' || r === 'MEMBER_REP_2' || r === 'MEMBER_REP_3')
    return 'bg-amber-100 text-amber-800 border border-amber-200'
  if (r === 'LEADERSHIP') return 'bg-blue-100 text-blue-800 border border-blue-200'
  return 'bg-gray-100 text-gray-700 border border-gray-200'
}

// derived counts
const leadershipCount = computed(() => {
  if (!chapter.value?.members) return 0
  return chapter.value.members.filter(m => (m.role || 'MEMBER') !== 'MEMBER').length
})

// formatted address
const addressText = computed(() => {
  const a = chapter.value?.address || {}
  const parts = [a.line1, a.line2, a.area, a.landmark, a.pincode].filter(Boolean)
  return parts.join(', ')
})



const onImageSelect = (e) => {
  const file = e.target.files?.[0]
  if (!file) return

  imageFile.value = file
  imagePreview.value = URL.createObjectURL(file)
}
const removeImage = () => {
  imageFile.value = null
  imagePreview.value = null
  editForm.value.image = null
}


// data loaders
const fetchChapter = async () => {
  loading.value = true
  try {
    const data = await getChapter(id)
    chapter.value = data


    editForm.value = {
      name: data.name || '',
      code: data.code || '',
      status: data.status || 'active',
      description: data.description || '',
      contactName: data.contactName || '',
      contactEmail: data.contactEmail || '',
      contactPhone: data.contactPhone || '',
      address: {
        line1: data.address?.line1 || '',
        line2: data.address?.line2 || '',
        area: data.address?.area || '',
        landmark: data.address?.landmark || '',
        pincode: data.address?.pincode || '',
      },
      image: data.image || null,
    }

    chair.value = data.chair || data.members?.find(m => m.role === 'CHAIR') || null

    // seed role selections
    const seed = {}
    for (const mc of (data.members || [])) {
      seed[mc.id] = mc.role || 'MEMBER'
    }
    roleSelections.value = seed
  } catch (e) {
    show(e?.response?.data?.message || 'Failed to load chapter', 'error')
  } finally {
    loading.value = false
  }
}

const saveChapter = async () => {
  try {
    let imagePayload

    // ----------------------------
    // IMAGE HANDLING (3 cases)
    // ----------------------------

    // 1️⃣ User selected a NEW image
    if (imageFile.value) {
      const uploadedUrl = await uploadChapterImage(imageFile.value)

      imagePayload = {
        url: uploadedUrl,
        alt: editForm.value.name || 'Chapter image',
      }
    }

    // 2️⃣ User REMOVED image explicitly
    else if (editForm.value.image === null) {
      imagePayload = null
    }

    // 3️⃣ User did NOT touch image
    else {
      imagePayload = editForm.value.image
    }

    // ----------------------------
    // ADDRESS HANDLING
    // ----------------------------
    const hasAddress = Object.values(editForm.value.address || {}).some(
      (v) => v && String(v).trim() !== ''
    )

    // ----------------------------
    // FINAL PAYLOAD
    // ----------------------------
    const payload = {
      name: editForm.value.name,
      code: editForm.value.code,
      status: editForm.value.status,
      description: editForm.value.description || null,
      contactName: editForm.value.contactName || null,
      contactEmail: editForm.value.contactEmail || null,
      contactPhone: editForm.value.contactPhone || null,
      address: hasAddress ? editForm.value.address : null,
      image: imagePayload, // ✅ aligned with backend Prisma logic
    }

    // ----------------------------
    // API CALL
    // ----------------------------
    await updateChapter(id, payload)

    openEditChapter.value = false
    imageFile.value = null
    imagePreview.value = null

    await fetchChapter()
    show('Chapter updated successfully', 'success')
  } catch (e) {
    console.log(e)
    show(e?.response?.data?.message || 'Failed to update chapter', 'error')
  }
}




const searchMembers = async () => {
  try {
    const res = await listMembers({ q: memberSearch.value || undefined, pageSize: 20 })
    memberOptions.value = res.items || []
  } catch (e) {
    show(e?.response?.data?.message || 'Failed to search members', 'error')
  }
}
const debouncedMemberSearch = debounce(searchMembers, 300)

// actions
const onCreateMember = async (payload) => {
  try {
    const m = await createMember(payload)
    await addMemberToChapter(m.id, { chapterId: id, role: 'MEMBER' })
    openAddMember.value = false
    await fetchChapter()
    show('Member created and linked', 'success')
  } catch (e) {
    show(e?.response?.data?.message || 'Failed to create/link member', 'error')
  }
}

const linkMember = async (m) => {
  try {
    await addMemberToChapter(m.id, { chapterId: id, role: 'MEMBER' })
    openLinkMember.value = false
    memberOptions.value = []
    await fetchChapter()
    show('Member linked to chapter', 'success')
  } catch (e) {
    show(e?.response?.data?.message || 'Failed to link member', 'error')
  }
}

const changeRole = async (mc) => {
  const newRole = roleSelections.value[mc.id] || 'MEMBER'
  busyId.value = mc.id
  try {
    await assignRole(id, { memberId: mc.memberId, role: newRole })
    await fetchChapter()
    show('Role updated', 'success')
  } catch (e) {
    show(e?.response?.data?.message || 'Failed to update role', 'error')
    roleSelections.value[mc.id] = mc.role || 'MEMBER'
  } finally {
    busyId.value = null
  }
}

const askUnlink = (mc) => { unlinkTarget.value = mc; confirmUnlinkOpen.value = true }

const doUnlink = async () => {
  if (!unlinkTarget.value) return
  busyId.value = unlinkTarget.value.id
  try {
    await removeMemberFromChapter(unlinkTarget.value.memberId, unlinkTarget.value.id)
    await fetchChapter()
    show('Member unlinked from chapter', 'success')
  } catch (e) {
    show(e?.response?.data?.message || 'Failed to unlink member', 'error')
  } finally {
    busyId.value = null
    unlinkTarget.value = null
    confirmUnlinkOpen.value = false
  }
}

watch(
  () => [memberTableSearch.value, chapter.value?.members?.length],
  () => {
    currentPage.value = 1
  }
)

onMounted(fetchChapter)
</script>
