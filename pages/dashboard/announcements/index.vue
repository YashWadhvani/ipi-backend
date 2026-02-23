<template>
  <div class="space-y-6">
    <!-- CREATE ANNOUNCEMENT -->
    <div class="bg-white border border-black/5 rounded-xl p-6 space-y-4">
      <h1 class="text-xl font-semibold">Create Announcement</h1>

      <div class="grid md:grid-cols-2 gap-3">
        <input
          v-model="title"
          placeholder="Title"
          class="px-3 py-2 rounded-md border border-black/10"
        />
        <select
          v-model="scope"
          class="px-3 py-2 rounded-md border border-black/10"
        >
          <option value="GLOBAL">Global</option>
          <option value="TARGETED">Targeted (by chapters)</option>
        </select>
      </div>

      <textarea
        v-model="body"
        rows="5"
        placeholder="Message…"
        class="w-full px-3 py-2 rounded-md border border-black/10"
      />

      <div v-if="scope === 'TARGETED'">
        <label class="block text-sm font-medium mb-1">Chapters</label>
        <div class="grid md:grid-cols-3 gap-2">
          <label
            v-for="c in chapters"
            :key="c.id"
            class="flex items-center gap-2 text-sm"
          >
            <input type="checkbox" :value="c.id" v-model="selected" />
            {{ c.name }}
          </label>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button
          class="px-4 py-2 rounded-md text-white bg-[var(--ipi-red)] hover:bg-[var(--ipi-red)]/90"
          :disabled="saving || !title || !body || (scope === 'TARGETED' && selected.length === 0)"
          @click="create"
        >
          {{ saving ? 'Posting…' : 'Post Announcement' }}
        </button>
      </div>
    </div>

    <!-- ANNOUNCEMENTS LIST -->
    <div class="bg-white border border-black/5 rounded-xl p-6">
      <div class="flex items-center justify-between mb-3">
        <div class="text-lg font-semibold">All Announcements</div>
        <div class="flex items-center gap-2">
          <input
            v-model="q"
            placeholder="Search title/body"
            class="px-3 py-2 rounded-md border border-black/10"
          />
          <button
            class="px-3 py-2 rounded-md border border-black/10 bg-white hover:bg-gray-50"
            @click="goFirst"
          >
            Search
          </button>
        </div>
      </div>

      <div v-if="loading" class="text-sm text-gray-500">Loading…</div>

      <div v-else>
        <div v-if="items.length" class="space-y-3">
          <div
            v-for="a in items"
            :key="a.id"
            class="border border-black/5 rounded-md p-3"
          >
            <div class="flex items-center justify-between">
              <div class="font-medium">{{ a.title }}</div>

              <div class="flex items-center gap-2">
                <span
                  class="text-xs px-2 py-0.5 rounded border"
                  :class="
                    a.scope === 'GLOBAL'
                      ? 'border-blue-200 bg-blue-50 text-blue-800'
                      : 'border-violet-200 bg-violet-50 text-violet-800'
                  "
                >
                  {{ a.scope }}
                </span>

                <label class="text-xs inline-flex items-center gap-1">
                  <input
                    type="checkbox"
                    :checked="a.isActive"
                    @change="toggleActive(a)"
                  />
                  Active
                </label>

                <!-- DELETE ICON -->
                <button
                  class="p-1.5 rounded-md hover:bg-red-50 text-red-600"
                  title="Delete"
                  @click.stop="askDelete(a)"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 6h18M8 6v12m8-12v12M5 6l1 14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-14M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <p class="text-sm text-gray-700 mt-1 line-clamp-2">
              {{ a.body }}
            </p>

            <div class="text-xs text-gray-500 mt-1">
              Reads: {{ a._count?.reads || 0 }}
              <span v-if="a.chapters?.length">
                • To: {{ a.chapters.map(x => x.chapter?.name).join(', ') }}
              </span>
            </div>
          </div>

          <!-- PAGINATION -->
          <div class="flex items-center justify-between mt-2">
            <div class="text-sm text-gray-600">Total: {{ total }}</div>
            <div class="flex items-center gap-1">
              <button
                class="p-2 border border-black/10 rounded-md hover:bg-gray-50"
                :disabled="page <= 1"
                @click="page--; load()"
              >
                ‹
              </button>
              <span class="px-2 text-sm">
                Page {{ page }} / {{ Math.ceil(total / pageSize) }}
              </span>
              <button
                class="p-2 border border-black/10 rounded-md hover:bg-gray-50"
                :disabled="page >= Math.ceil(total / pageSize)"
                @click="page++; load()"
              >
                ›
              </button>
            </div>
          </div>
        </div>

        <div
          v-else
          class="text-center text-gray-500 p-6 border border-black/5 rounded-md"
        >
          No announcements
        </div>
      </div>
    </div>

    <!-- CONFIRM DELETE DIALOG -->
    <ConfirmDialog
      v-model:open="confirmOpen"
      title="Delete announcement?"
      message="This action cannot be undone."
      confirmText="Delete"
      cancelText="Cancel"
      @confirm="confirmDelete"
    />
  </div>
</template>

  <script setup>
  definePageMeta({ layout: 'dashboard', middleware: ['auth-admin-client']}) // or your admin layout if you have one
  
  import { ref, onMounted } from 'vue'
  import { listAnnouncements, createAnnouncement, updateAnnouncement } from '@/services/announcementsServices'
  import { useSnackbar } from '@/services/useSnackbar'
  import { listChapters } from '@/services/chaptersServices' // assume you have this; if not, create it.
  import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
  import { deleteAnnouncement } from '@/services/announcementsServices'

  const { show } = useSnackbar()
  
  const title = ref('')
  const body = ref('')
  const scope = ref('GLOBAL')
  const selected = ref([])
  const saving = ref(false)

  const confirmOpen = ref(false)
  const deleting = ref(false)
  const toDelete = ref(null)

  
  const chapters = ref([])
  const q = ref('')
  const items = ref([])
  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(10)
  const loading = ref(false)
  
  async function loadChapters() {
    try {
      const r = await listChapters({ page: 1, pageSize: 200 })
      chapters.value = r.items || []
    } catch {}
  }
  
  async function create() {
    saving.value = true
    try {
      await createAnnouncement({
        title: title.value,
        body: body.value,
        scope: scope.value,
        chapterIds: scope.value === 'TARGETED' ? selected.value : undefined
      })
      title.value = ''; body.value = ''; selected.value = []; scope.value = 'GLOBAL'
      show('Announcement posted', 'success')
      await load()
    } catch (e) {
      show(e?.response?.data?.message || 'Failed to create', 'error')
    } finally {
      saving.value = false
    }
  }
  
  async function load() {
    loading.value = true
    try {
      const r = await listAnnouncements({ q: q.value, page: page.value, pageSize: pageSize.value })
      items.value = r.items || []
      total.value = r.total || 0
    } catch (e) {
      show(e?.response?.data?.message || 'Failed to load', 'error')
    } finally {
      loading.value = false
    }
  }
  
  const goFirst = () => { page.value = 1; load() }
  
    async function toggleActive(a) {
      try {
          await updateAnnouncement(a.id, { isActive: !a.isActive })
          a.isActive = !a.isActive
        } catch {
          show('Failed to update', 'error')
        }
      }

      function askDelete(a) {
      toDelete.value = a
      confirmOpen.value = true
  }

  async function confirmDelete() {
    if (!toDelete.value) return
    deleting.value = true
    try {
      await deleteAnnouncement(toDelete.value.id)
      show('Announcement deleted', 'success')
      await load()
    } catch (e) {
      show(e?.response?.data?.message || 'Failed to delete', 'error')
    } finally {
      deleting.value = false
      toDelete.value = null
    }
  }

  
  onMounted(() => { load(); loadChapters() })
  </script>
  