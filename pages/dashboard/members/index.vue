<template>
  <div class="space-y-4">
    <!-- Topbar -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <h1 class="text-xl font-semibold">Members</h1>
        <span class="text-sm text-gray-500">({{ total }})</span>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="openAdd = true"
          class="inline-flex items-center gap-2 rounded-md bg-black text-white px-3 py-2 hover:opacity-90 cursor-pointer"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z" />
          </svg>
          <span>New Member</span>
        </button>

        <button
          @click="exportCsv"
          :disabled="exporting || !items.length"
          class="inline-flex items-center gap-2 rounded-md border border-[#ccc] px-3 py-2 hover:bg-gray-50"
        >
          <span>{{ exporting ? 'Exporting…' : 'Export CSV' }}</span>
        </button>

        <button
          @click="openBulk = true"
          class="inline-flex items-center gap-2 rounded-md border border-[#ccc] px-3 py-2 hover:bg-gray-50"
        >
          <span>Bulk Upload</span>
        </button>
      </div>
    </div>

    <!-- Bulk Upload Modal -->
    <div v-if="openBulk" class="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div class="bg-white rounded-md shadow-xl w-[560px] max-w-[95vw]">
        <div class="p-4 border-b flex justify-between items-center">
          <h3 class="font-semibold text-lg">Bulk Upload Members</h3>
          <button @click="closeBulk">✕</button>
        </div>

        <div class="p-4 space-y-4">
          <input
            ref="bulkFile"
            type="file"
            accept=".xlsx,.csv"
            class="w-full border border-[#ccc] rounded-md p-2"
          />

          <div class="grid grid-cols-2 gap-2 text-sm">
            <label><input type="checkbox" v-model="bulkOptions.updateIfExists" /> Update if exists</label>
            <label><input type="checkbox" v-model="bulkOptions.skipDuplicates" /> Skip duplicates</label>
            <label><input type="checkbox" v-model="bulkOptions.setChapterPrimary" /> Set chapter primary</label>
            <label><input type="checkbox" v-model="bulkOptions.ensureChapterExists" /> Auto-create chapter</label>
            <label class="col-span-2 font-medium">
              <input type="checkbox" v-model="dryRun" /> Dry run (validate only)
            </label>
          </div>

          <div class="flex justify-between items-center">
            <button
              class="px-3 py-2 border border-[#ccc] rounded-md"
              @click="downloadBulkTemplate"
            >
              Download template
            </button>

            <button
              class="px-4 py-2 bg-black text-white rounded-md"
              :disabled="uploading"
              @click="submitBulk"
            >
              {{ uploading ? 'Processing…' : 'Upload' }}
            </button>
          </div>

          <div v-if="bulkResult" class="border rounded-md p-3 text-sm">
            <div class="font-semibold mb-2">Result</div>
            <div>Total: {{ bulkResult.count }}</div>
            <div>Created: {{ bulkCounts.created }}</div>
            <div>Updated: {{ bulkCounts.updated }}</div>
            <div>Skipped: {{ bulkCounts.skipped }}</div>
            <div>Errors: {{ bulkCounts.error }}</div>

            <button
              v-if="bulkErrors.length"
              class="underline mt-2"
              @click="downloadErrorReport"
            >
              Download error report
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Search & Filters -->
    <div class="bg-white border border-[#ccc] rounded-md p-3">
      <div class="flex flex-col md:flex-row gap-3">
        <!-- Live Search -->
        <input
          v-model="search"
          placeholder="Search name, email, company, city…"
          class="flex-1 border border-[#ccc] rounded-md px-3 py-2 text-sm"
        />

        <!-- Chapter Filter -->
        <select
          v-model="chapterFilter"
          class="border border-[#ccc] rounded-md px-3 py-2 text-sm bg-white md:w-[240px]"
        >
          <option value="">All Chapters</option>
          <option v-for="c in chapterOptions" :key="c" :value="c">
            {{ c }}
          </option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white border border-[#ccc] rounded-md overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-[#f1f8ff] border-b border-[#ccc] text-left">
          <tr>
            <th class="p-3">Member</th>
            <th class="p-3">Email</th>
            <!-- <th class="p-3">Phone</th> -->
            <th class="p-3">Company</th>
            <th class="p-3">City</th>
            <th class="p-3">Chapter</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="m in filteredItems" :key="m.id"
            class="hover:bg-gray-50 cursor-pointer"
            @click="goMember(m)"
          >
            <td class="p-3">
              <div class="font-medium">{{ m.name }}</div>
              <div class="text-xs text-gray-500">/{{ m.slug }}</div>
            </td>

            <!-- ✅ COMPANY EMAIL -->
            <td class="p-3">
              {{ m.contact?.officeEmail || '—' }}
            </td>

            <!-- ✅ COMPANY PHONE -->
            <!-- <td class="p-3" @click.stop>
              {{ m.contact?.companyPhone || '—' }}
            </td> -->

            <td class="p-3">{{ m.company || '—' }}</td>
            <td class="p-3">{{ m.city || '—' }}</td>
            <td class="p-3">{{ chapterLabel(m) }}</td>
          </tr>

          <tr v-if="!loading && !items.length">
            <td colspan="6" class="p-6 text-center text-gray-500">
              No members found
            </td>
          </tr>
        </tbody>
      </table>


    </div>

          <!-- Pagination -->
      <div class="flex justify-between items-center text-sm">
        <div>
          Page {{ page }} of {{ totalPages }}
        </div>

        <div class="flex items-center gap-3">
          <select
            v-model="pageSize"
            class="border border-[#ccc] rounded-md px-2 py-1 text-sm"
          >
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>

          <button
            @click="page--"
            :disabled="page === 1"
            class="px-3 py-1 border rounded disabled:opacity-40"
          >
            Prev
          </button>

          <button
            @click="page++"
            :disabled="page === totalPages"
            class="px-3 py-1 border rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

    <!-- Modals -->
    <MemberForm v-if="openAdd" @close="openAdd = false" @saved="onCreateMember" />
    <LinkToChapterModal
      v-if="linkingFor"
      :member="linkingFor"
      @close="linkingFor = null"
      @linked="onLinked"
    />
  </div>
</template>

<script setup>
definePageMeta({ layout: 'dashboard', middleware: ['auth-admin-client'] })

import { ref, computed, onMounted, watch } from 'vue'
import { listMembers, createMember } from '@/services/membersServices'
import { importMembers } from '@/services/membersImportService'
import { useSnackbar } from '@/services/useSnackbar'
import MemberForm from '@/components/MemberForm.vue'
import LinkToChapterModal from '@/components/LinkToChapterModal.vue'

const { show } = useSnackbar()

const items = ref([])
const total = ref(0)
const loading = ref(false)
const exporting = ref(false)

const openAdd = ref(false)
const openBulk = ref(false)
const linkingFor = ref(null)

const bulkFile = ref(null)
const uploading = ref(false)
const bulkResult = ref(null)
const dryRun = ref(true)

/* 🔍 SEARCH & FILTER */
const search = ref('')
const chapterFilter = ref('')

/* 📄 PAGINATION */
const page = ref(1)
const pageSize = ref(20)

const bulkOptions = ref({
  updateIfExists: true,
  skipDuplicates: true,
  setChapterPrimary: true,
  ensureChapterExists: true,
})

/* ---------------- BULK COMPUTEDS ---------------- */
const bulkCounts = computed(() => {
  const c = { created: 0, updated: 0, skipped: 0, error: 0 }
  bulkResult.value?.results?.forEach(r => c[r.status]++)
  return c
})

const bulkErrors = computed(() =>
  bulkResult.value?.results?.filter(r => r.status === 'error') || []
)

/* ---------------- LOAD ---------------- */
const load = async () => {
  loading.value = true

  const res = await listMembers({
    page: page.value,
    pageSize: pageSize.value,
    q: search.value || undefined,
    chapterId: chapterFilter.value || undefined,
    sortBy: 'name',
    sortDir: 'asc',
  })

  items.value = res.items
  total.value = res.total

  loading.value = false
}


/* ---------------- PAGINATION ---------------- */
const totalPages = computed(() =>
  Math.max(1, Math.ceil(total.value / pageSize.value))
)

watch([page, pageSize], () => {
  load()
})

/* 🔎 SEARCH + FILTER LOGIC (ADDED) */
const normalize = v => (v ?? '').toLowerCase().trim()

const filteredItems = computed(() => {
  const q = normalize(search.value)
  const ch = normalize(chapterFilter.value)

  return items.value.filter(m => {
    if (ch && normalize(chapterLabel(m)) !== ch) return false
    if (!q) return true

    const haystack = [
      m.name,
      m.slug,
      m.company,
      m.city,
      m.contact?.officeEmail,
      chapterLabel(m)
    ].map(normalize).join(' ')

    return haystack.includes(q)
  })
})

const chapterOptions = computed(() => {
  const set = new Set()
  items.value.forEach(m => {
    const c = chapterLabel(m)
    if (c !== '—') set.add(c)
  })
  return [...set].sort()
})

/* 🔁 RESET PAGE ON SEARCH / FILTER */
watch([search, chapterFilter], () => {
  page.value = 1
  load()
})


/* ---------------- BULK HELPERS ---------------- */
const downloadErrorLogTxt = (title, errors = []) => {
  const lines = [
    title,
    `Generated at: ${new Date().toISOString()}`,
    '',
    ...errors.map(e => `Row ${e.index}: ${e.reason}`)
  ]

  const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = 'members_import_errors.txt'
  a.click()

  URL.revokeObjectURL(url)
}

const submitBulk = async () => {
  if (!bulkFile.value?.files?.length) return
  uploading.value = true

  try {
    const res = await importMembers(bulkFile.value.files[0], {
      mode: dryRun.value ? 'dry-run' : 'import',
      ...bulkOptions.value,
    })

    bulkResult.value = res

    if (res?.results?.some(r => r.status === 'error')) {
      downloadErrorLogTxt(
        'Member Bulk Import Errors',
        res.results.filter(r => r.status === 'error')
      )
    }

    if (!dryRun.value) load()
  } catch (err) {
    show('Bulk import failed. Error log downloaded.', 'error')

    downloadErrorLogTxt('Bulk Import Failed', [
      { index: '-', reason: err?.message || 'Unknown error' }
    ])
  } finally {
    uploading.value = false
  }
}

const closeBulk = () => {
  openBulk.value = false
  bulkResult.value = null
  dryRun.value = true
}

const downloadBulkTemplate = () => {
  const a = document.createElement('a')
  a.href = '/templates/Members_Master.xlsx'
  a.download = 'Members_Master.xlsx'
  a.click()
}

const downloadErrorReport = () => {
  const rows = [['row', 'error']]
  bulkErrors.value.forEach(r => rows.push([r.index, r.reason]))
  const csv = rows.map(r => r.join(',')).join('\n')
  const blob = new Blob([csv])
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'members_errors.csv'
  a.click()
}

/* ---------------- HELPERS ---------------- */
const chapterLabel = (m) =>
  m.chapters?.find(c => c.isPrimary)?.chapter?.name ||
  m.chapters?.[0]?.chapter?.name ||
  '—'

const goMember = (m) => navigateTo(`/dashboard/members/${m.id}`)

const onCreateMember = async (p) => {
  await createMember(p)
  openAdd.value = false
  load()
}

const onLinked = () => {
  linkingFor.value = null
  load()
}

onMounted(load)
</script>
