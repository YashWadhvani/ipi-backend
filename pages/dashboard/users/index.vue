<template>
    <div class="space-y-4">
      <!-- Topbar -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <h1 class="text-xl font-semibold">Users</h1>
          <span class="text-sm text-gray-500">({{ total }})</span>
        </div>
  
        <div class="flex items-center gap-2">
          <button
            @click="openInvite = true"
            class="inline-flex items-center gap-2 rounded-md bg-black text-white px-3 py-2 hover:opacity-90 cursor-pointer"
            title="Invite / Create user"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"/>
            </svg>
            <span>New User</span>
          </button>
  
          <button
            class="inline-flex items-center gap-2 rounded-md border border-[#ccc] px-3 py-2 hover:bg-gray-50 cursor-pointer"
            @click="exportCsv"
            :disabled="exporting || !items.length"
            title="Export CSV"
          >
            <svg class="h-4 w-4 text-gray-700" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 12v7a2 2 0 0 1-2 2H7c-1.1 0-2-.9-2-2v-7h2v7h10v-7h2zM11 6.83V16h2V6.83l2.59 2.58L17 8l-5-5-5 5 1.41 1.41L11 6.83z"/>
            </svg>
            <span>{{ exporting ? 'Exporting…' : 'Export CSV' }}</span>
          </button>
        </div>
      </div>
  
      <!-- Filters row -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div class="flex items-center gap-2">
          <div class="relative">
            <input
              v-model="q"
              placeholder="Search name / email / phone"
              class="pl-9 bg-white pr-3 py-2 w-72 border border-[#ccc] rounded-md focus:ring-2 focus:ring-black/10 focus:outline-none"
              @keyup.enter="goFirstPageAndLoad"
            />
            <svg class="absolute left-2.5 top-2.5 h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16a6.471 6.471 0 0 0 4.23-1.57l.27.28v.79L20 21.5 21.5 20l-6-6zM9.5 14A4.5 4.5 0 1 1 14 9.5 4.505 4.505 0 0 1 9.5 14z"/>
            </svg>
          </div>
  
          <select v-model="role" class="border border-[#ccc] rounded-md px-2 py-2 bg-white cursor-pointer">
            <option value="">All roles</option>
            <option value="ADMIN">Admin</option>
            <option value="STAFF">Staff</option>
            <option value="MEMBER">Member</option>
          </select>
  
          <select v-model="status" class="border border-[#ccc] rounded-md px-2 py-2 bg-white cursor-pointer">
            <option value="">All status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
  
          <button class="bg-white px-3 py-2 border border-[#ccc] rounded-md hover:bg-gray-50 cursor-pointer" @click="goFirstPageAndLoad">Search</button>
          <button class="bg-white px-3 py-2 border border-[#ccc] rounded-md hover:bg-gray-50 cursor-pointer" @click="resetFilters" title="Clear filters">Reset</button>
        </div>
  
        <div class="flex items-center gap-2">
          <select v-model="sortBy" class="border border-[#ccc] rounded-md px-2 py-2 bg-white cursor-pointer" @change="goFirstPageAndLoad">
            <option value="createdAt">Sort by created</option>
            <option value="name">Sort by name</option>
            <option value="email">Sort by email</option>
          </select>
          <select v-model="sortDir" class="border border-[#ccc] rounded-md px-2 py-2 bg-white cursor-pointer" @change="goFirstPageAndLoad">
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>
        </div>
      </div>
  
      <!-- Table -->
      <div class="bg-white border border-[#ccc] rounded-md overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-[#f1f8ff] backdrop-blur-sm sticky top-0 z-10 border-b border-[#ccc] text-left text-gray-600">
            <tr>
              <th class="p-3 font-bold">User</th>
              <th class="p-3 font-bold">Email</th>
              <th class="p-3 font-bold">Phone</th>
              <th class="p-3 font-bold">Role</th>
              <th class="p-3 font-bold">Status</th>
              <th class="p-3 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#ccc]">
            <tr v-for="u in items" :key="u.id" class="hover:bg-gray-50 transition-colors">
              <td class="p-3">
                <div class="text-gray-900 font-medium">{{ u.name || '—' }}</div>
                <div class="text-xs text-gray-500">{{ shortId(u.id) }}</div>
              </td>
              <td class="p-3 text-gray-700">{{ u.email }}</td>
              <td class="p-3 text-gray-700">{{ u.phone || '—' }}</td>
              <td class="p-3">
                <select
                  class="border border-[#ccc] rounded-md px-2 py-1 bg-white cursor-pointer"
                  :disabled="busyId===u.id"
                  v-model="u.role"
                  @change="changeRole(u)"
                >
                  <option value="ADMIN">Admin</option>
                  <option value="STAFF">Staff</option>
                  <option value="MEMBER">Member</option>
                </select>
              </td>
              <td class="p-3">
                <span
                  class="px-2 py-1 rounded text-xs capitalize"
                  :class="u.status === 'active'
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-gray-100 text-gray-700 border border-gray-200'"
                >
                  {{ u.status }}
                </span>
              </td>
              <td class="p-3">
                <div class="flex items-center justify-end gap-2">
                  <button
                    class="p-2 rounded-md border border-[#ccc] bg-white hover:bg-gray-100 cursor-pointer"
                    :disabled="busyId===u.id"
                    @click="toggleStatus(u)"
                    :title="u.status==='active' ? 'Deactivate' : 'Activate'"
                  >
                    {{ u.status === 'active' ? 'Deactivate' : 'Activate' }}
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!loading && !items.length">
              <td colspan="6" class="p-8 text-center text-gray-500">No users found</td>
            </tr>
          </tbody>
        </table>
  
        <!-- Loading bar -->
        <div v-if="loading" class="h-0.5 bg-gradient-to-r from-transparent via-black/30 to-transparent animate-pulse" />
      </div>
  
      <!-- Pagination -->
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-600">Total: {{ total }}</div>
        <div class="flex items-center gap-1">
          <button class="p-2 border border-[#ccc] rounded-md hover:bg-gray-50 cursor-pointer" :disabled="page<=1" @click="page--; load()" title="Prev">
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <span class="px-2 text-sm">Page {{ page }}</span>
          <button
            class="p-2 border border-[#ccc] rounded-md hover:bg-gray-50 cursor-pointer"
            :disabled="page * pageSize >= total"
            @click="page++; load()"
            title="Next"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="m9 6 6 6-6 6"/></svg>
          </button>
        </div>
      </div>
  
      <!-- Invite/Create modal -->
      <div v-if="openInvite" class="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
        <div class="w-full max-w-md bg-white border border-[#ccc] rounded-lg shadow-lg">
          <div class="px-4 py-3 border-b border-[#eee] flex items-center justify-between">
            <h3 class="text-lg font-semibold">New User</h3>
            <button class="p-2 rounded hover:bg-gray-100" @click="openInvite=false" title="Close">✕</button>
          </div>
          <form class="p-4 space-y-3" @submit.prevent="create">
            <div>
              <label class="block text-sm text-gray-700 mb-1">Name</label>
              <input v-model.trim="form.name" class="w-full border border-[#ccc] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10"/>
            </div>
            <div>
              <label class="block text-sm text-gray-700 mb-1">Email</label>
              <input v-model.trim="form.email" required type="email" class="w-full border border-[#ccc] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10"/>
            </div>
            <div>
              <label class="block text-sm text-gray-700 mb-1">Password</label>
              <input v-model="form.password" required type="password" minlength="6" class="w-full border border-[#ccc] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10"/>
            </div>
            <div>
              <label class="block text-sm text-gray-700 mb-1">Role</label>
              <select v-model="form.role" class="w-full border border-[#ccc] rounded-md px-3 py-2 bg-white">
                <option value="MEMBER">Member</option>
                <option value="STAFF">Staff</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
  
            <div class="flex items-center justify-end gap-2 pt-2">
              <button type="button" class="px-3 py-2 border border-[#ccc] rounded-md hover:bg-gray-50" @click="openInvite=false">Cancel</button>
              <button type="submit" class="px-3 py-2 bg-black text-white rounded-md" :disabled="creating">
                {{ creating ? 'Creating…' : 'Create' }}
              </button>
            </div>
          </form>
        </div>
      </div>
  
      <!-- Confirm deactivate -->
      <ConfirmDialog
        v-model:open="confirmOpen"
        title="Change user status?"
        :message="confirmMessage"
        confirmText="Yes"
        cancelText="Cancel"
        @confirm="doToggleStatus"
      />
    </div>
  </template>
  
  <script setup>
  definePageMeta({ layout: 'dashboard', middleware: ['auth-admin-client'] })
  
  import { ref, computed, onMounted } from 'vue'
  import { useSnackbar } from '@/services/useSnackbar'
  import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
  
  // ---- services you should already have or wire up similarly ----
  import { listUsers, createUser, updateUserRole, setUserStatus } from '@/services/usersServices'
  
  const { show } = useSnackbar()
  
  // filters / sorting / paging
  const q = ref('')
  const role = ref('')
  const status = ref('')
  const sortBy = ref('createdAt') // createdAt | name | email
  const sortDir = ref('desc')     // asc | desc
  const page = ref(1)
  const pageSize = ref(20)
  
  // data
  const items = ref([])
  const total = ref(0)
  const loading = ref(false)
  const exporting = ref(false)
  const busyId = ref(null)
  
  // modals
  const openInvite = ref(false)
  const creating = ref(false)
  const form = ref({ name: '', email: '', password: '', role: 'MEMBER' })
  
  // confirm (activate/deactivate)
  const confirmOpen = ref(false)
  const targetUser = ref(null)
  const confirmMessage = computed(() => {
    if (!targetUser.value) return 'Are you sure?'
    const to = targetUser.value.status === 'active' ? 'inactive' : 'active'
    return `Set ${targetUser.value.email} to "${to}"?`
  })
  
  // helpers
  const shortId = (id) => (id ? `…${id.slice(-6)}` : '')
  
  // loaders
  const load = async () => {
    loading.value = true
    try {
      const res = await listUsers({
        q: q.value || undefined,
        role: role.value || undefined,
        status: status.value || undefined,
        sortBy: sortBy.value,
        sortDir: sortDir.value,
        page: page.value,
        pageSize: pageSize.value,
      })
      items.value = res.items || []
      total.value = res.total || 0
    } catch (e) {
      show(e?.response?.data?.message || 'Failed to load users', 'error')
    } finally {
      loading.value = false
    }
  }
  
  const goFirstPageAndLoad = () => { page.value = 1; load() }
  
  const resetFilters = () => {
    q.value = ''
    role.value = ''
    status.value = ''
    sortBy.value = 'createdAt'
    sortDir.value = 'desc'
    page.value = 1
    load()
  }
  
  // actions
  const changeRole = async (u) => {
    busyId.value = u.id
    try {
      await updateUserRole(u.id, u.role)
      show('Role updated', 'success')
    } catch (e) {
      show(e?.response?.data?.message || 'Failed to update role', 'error')
      // best effort reload to restore original
      await load()
    } finally {
      busyId.value = null
    }
  }
  
  const toggleStatus = (u) => {
    targetUser.value = u
    confirmOpen.value = true
  }
  const doToggleStatus = async () => {
    if (!targetUser.value) return
    busyId.value = targetUser.value.id
    try {
      const to = targetUser.value.status === 'active' ? 'inactive' : 'active'
      await setUserStatus(targetUser.value.id, to)
      show('Status updated', 'success')
      await load()
    } catch (e) {
      show(e?.response?.data?.message || 'Failed to update status', 'error')
    } finally {
      busyId.value = null
      targetUser.value = null
    }
  }
  
  // create/invite
  const create = async () => {
    if (!form.value.email || !form.value.password) return
    creating.value = true
    try {
      await createUser({
        name: form.value.name || null,
        email: form.value.email.trim(),
        password: form.value.password,
        role: form.value.role || 'MEMBER',
      })
      openInvite.value = false
      form.value = { name: '', email: '', password: '', role: 'MEMBER' }
      show('User created', 'success')
      await load()
    } catch (e) {
      show(e?.response?.data?.message || 'Failed to create user', 'error')
    } finally {
      creating.value = false
    }
  }
  
  // CSV export (fetch all with current filters)
  const exportCsv = async () => {
    if (!total.value) return
    exporting.value = true
    try {
      const all = []
      let p = 1
      const chunk = 200
      while (true) {
        const res = await listUsers({
          q: q.value || undefined,
          role: role.value || undefined,
          status: status.value || undefined,
          sortBy: sortBy.value,
          sortDir: sortDir.value,
          page: p,
          pageSize: chunk,
        })
        const set = res.items || []
        all.push(...set)
        if (set.length < chunk) break
        p += 1
      }
  
      const rows = [
        ['Name', 'Email', 'Phone', 'Role', 'Status', 'CreatedAt'],
        ...all.map(u => [
          u.name ?? '',
          u.email ?? '',
          u.phone ?? '',
          u.role ?? '',
          u.status ?? '',
          u.createdAt ? new Date(u.createdAt).toISOString() : '',
        ]),
      ]
  
      const csv = rows.map(r =>
        r.map(cell => {
          const s = String(cell ?? '')
          return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
        }).join(',')
      ).join('\n')
  
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `users_export_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.csv`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
  
      show(`Exported ${all.length} users`, 'success')
    } catch (e) {
      show(e?.response?.data?.message || 'Export failed', 'error')
    } finally {
      exporting.value = false
    }
  }
  
  onMounted(load)
  </script>
  