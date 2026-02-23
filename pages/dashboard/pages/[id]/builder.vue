<template>
  <section v-if="page" class="space-y-4">
    <!-- Topbar -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <h1 class="text-xl font-semibold truncate">Edit Page</h1>
        <span
          class="px-2 py-1 text-xs rounded-md border"
          :class="statusClass(page.status)"
          >{{ page.status || 'DRAFT' }}</span>
        <span v-if="page.updatedAt" class="text-xs text-gray-500">
          • Updated {{ formatDate(page.updatedAt) }}
        </span>
      </div>

      <div class="flex items-center gap-2">
        <button
          class="inline-flex items-center gap-2 rounded-md border border-[#ccc] px-3 py-2 hover:bg-gray-50 cursor-pointer"
          @click="save"
          :disabled="saving"
          title="Save"
        >
          <svg v-if="saving" class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" opacity=".25"/>
            <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" stroke-width="4"/>
          </svg>
          <span>{{ saving ? 'Saving…' : 'Save' }}</span>
        </button>

        <NuxtLink
          to="/dashboard/pages"
          class="inline-flex items-center gap-2 rounded-md bg-black text-white px-3 py-2 hover:opacity-90 cursor-pointer"
          title="Back to list"
        >
          Back
        </NuxtLink>
      </div>
    </div>

    <!-- Title / Slug / Status -->
    <div class="bg-white border border-[#ccc] rounded-md p-4">
      <div class="flex flex-col md:flex-row md:items-center md:gap-3 gap-2">
        <input v-model="page.title" placeholder="Title"
               class="bg-white border border-[#ccc] px-3 py-2 rounded-md w-full md:w-80 focus:ring-2 focus:ring-black/10 focus:outline-none" />
        <span class="hidden md:inline text-gray-400">/</span>
        <input v-model="page.slug" placeholder="slug"
               class="bg-white border border-[#ccc] px-3 py-2 rounded-md w-full md:w-72 focus:ring-2 focus:ring-black/10 focus:outline-none" />
        <select v-model="page.status"
                class="bg-white border border-[#ccc] px-3 py-2 rounded-md w-full md:w-44 focus:ring-2 focus:ring-black/10 focus:outline-none">
          <option>DRAFT</option>
          <option>PUBLISHED</option>
          <option>ARCHIVED</option>
        </select>
      </div>
    </div>

    <!-- SEO & CSS -->
    <details class="bg-white border border-[#ccc] rounded-md p-4">
      <summary class="cursor-pointer font-medium">SEO & CSS</summary>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
        <input v-model="page.seo.title" placeholder="SEO Title"
               class="bg-white border border-[#ccc] px-3 py-2 rounded-md focus:ring-2 focus:ring-black/10 focus:outline-none" />
        <input v-model="page.seo.description" placeholder="Meta description"
               class="bg-white border border-[#ccc] px-3 py-2 rounded-md focus:ring-2 focus:ring-black/10 focus:outline-none" />
      </div>
      <textarea v-model="page.css" placeholder="/* Optional page CSS */"
                class="bg-white border border-[#ccc] px-3 py-2 rounded-md mt-3 w-full h-32 focus:ring-2 focus:ring-black/10 focus:outline-none"></textarea>
    </details>

    <!-- Blocks toolbar -->
    <div class="bg-white border border-[#ccc] rounded-md p-3">
      <div class="flex flex-wrap gap-2">
        <button v-for="b in blockButtons" :key="b.key"
                class="bg-white px-3 py-1 border border-[#ccc] rounded-md hover:bg-gray-50 cursor-pointer text-sm"
                @click="addBlock(b.key)">
          + {{ b.label }}
        </button>
      </div>
    </div>

    <!-- Blocks list -->
    <ClientOnly>
      <div class="bg-white border border-[#ccc] rounded-md p-3">
        <draggable :list="page.blocks" item-key="uid" handle=".drag" class="space-y-3">
          <template #item="{ element, index }">
            <div class="border border-[#ccc] rounded-md p-3 bg-white">
              <div class="flex items-center justify-between mb-2">
                <div class="font-medium">#{{ index + 1 }} — {{ element.type }}</div>
                <div class="flex items-center gap-2">
                  <button
                    class="p-1.5 rounded-md border border-[#ccc] bg-white hover:bg-gray-100 cursor-pointer drag"
                    title="Drag to reorder"
                  >↕</button>
                  <button
                    class="p-1.5 rounded-md border border-[#ccc] bg-white hover:bg-gray-100 cursor-pointer"
                    @click="removeBlock(index)"
                    title="Delete block"
                  >Delete</button>
                </div>
              </div>
              <BlockForm v-model="page.blocks[index]" />
            </div>
          </template>
        </draggable>
      </div>
    </ClientOnly>

    <!-- Thin saving bar -->
    <div v-if="saving" class="h-0.5 bg-gradient-to-r from-transparent via-black/30 to-transparent animate-pulse" />
  </section>

  <div v-else class="p-6 text-gray-500">Loading…</div>
</template>

<script setup>
definePageMeta({ layout: 'dashboard', middleware: ['auth-admin-client'] })

import draggable from 'vuedraggable'
import BlockForm from '@/components/BlockForm.vue'
import { getPage, updatePage } from '@/services/usePagesService'
import { useSnackbar } from '@/services/useSnackbar'

const { show } = useSnackbar()
const route = useRoute()
const page = ref(null)
const saving = ref(false)

const formatDate = (d) => d ? new Date(d).toLocaleString() : '—'
const statusClass = (s) => {
  if (s === 'PUBLISHED') return 'border-green-300 text-green-700 bg-green-50'
  if (s === 'DRAFT')     return 'border-amber-300 text-amber-700 bg-amber-50'
  if (s === 'ARCHIVED')  return 'border-gray-300 text-gray-700 bg-gray-50'
  return 'border-[#ccc] text-gray-700 bg-white'
}

const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
const deepClone = (v) => JSON.parse(JSON.stringify(v))

const normalizeBlocks = (blocks) => {
  const arr = Array.isArray(blocks) ? blocks : []
  return arr.map(b => ({ uid: uid(), ...b }))
}

const ensureSeo = (obj) => {
  if (!obj.seo || typeof obj.seo !== 'object') obj.seo = {}
  if (obj.seo.title === undefined) obj.seo.title = ''
  if (obj.seo.description === undefined) obj.seo.description = ''
}

const load = async () => {
  const data = await getPage(route.params.id)
  if (!data) return
  if (!data.css) data.css = ''
  ensureSeo(data)
  if (!Array.isArray(data.blocks)) data.blocks = []
  data.blocks = normalizeBlocks(data.blocks)
  page.value = data
}
await load()

const blockDefaults = {
  hero:     { heading: 'Heading', subheading: '', bgUrl: '', align: 'center' },
  richtext: { html: '<p>Start writing…</p>' },
  image:    { url: '', caption: '', width: 'full' },
  ctaRow:   { items: [{ label: 'Learn more', link: '/' }] },
  faq:      { items: [{ q: 'Question?', a: 'Answer.' }] },
  contentImage: {
      heading: 'Section heading',
      html: '<p>Your content goes here</p>',
      image: null,       // uploaded image URL
      imageAlt: '',
      reverse: false     // image right by default
    },

  heroslider: {
    autoplay: true,
    intervalMs: 5000,
    heightClass: 'h-[70vh] md:h-[85vh]',
    showArrows: true,
    showDots: true,
    darkOverlay: true,
    slides: [
      {
        image: null,
        heading: 'Welcome',
        subheading: 'Add your subheading here',
        buttonText: 'Learn more',
        buttonHref: '/',
        align: 'center'
      }
    ]
  },
  partners: {
    title: 'Our Partners',
    caption: 'Trusted by leading organizations',
    durationSec: 30,
    pauseOnHover: true,
    grayscale: true,
    logoHeightClass: 'h-10 md:h-12 lg:h-14',
    gapClass: 'gap-10 md:gap-16',
    logos: []
  },
  fourup: {
    heading: 'We partner with the best',
    caption: 'Trusted by brands you know',
    columns: 4,
    theme: 'light',
    items: [
      { title: 'Card One',   text: 'Short description', image: '', href: '' },
      { title: 'Card Two',   text: 'Short description', image: '', href: '' },
      { title: 'Card Three', text: 'Short description', image: '', href: '' },
      { title: 'Card Four',  text: 'Short description', image: '', href: '' },
    ],
  },
}



const blockButtons = [
  { key: 'hero',       label: 'Hero' },
  { key: 'richtext',   label: 'Rich Text' },
  { key: 'image',      label: 'Image' },
  { key: 'ctaRow',     label: 'CTA Row' },
  { key: 'faq',        label: 'FAQ' },
  { key: 'heroslider', label: 'Hero Slider' },
  { key: 'aboutsection', label: 'About Two Col Section' },
  { key: 'partners',   label: 'Partners' },
  { key: 'fourup',     label: 'FourUp' },
  { key: 'contentImage', label: 'Content + Image' }
]

const addBlock = (type) => {
  page.value.blocks.push({
    uid: uid(),
    type,
    props: deepClone(blockDefaults[type] || {})
  })
}

const removeBlock = (index) => {
  page.value.blocks.splice(index, 1)
}

const save = async () => {
  try {
    saving.value = true

    // normalize + clone to avoid reactive/Proxy issues
    const payload = {
      title: String(page.value?.title || ''),
      slug: String(page.value?.slug || ''),
      status: page.value?.status || 'DRAFT',
      css: page.value?.css || null,
      seo: page.value?.seo ? deepClone(page.value.seo) : {},
      blocks: (page.value?.blocks || []).map(b => ({
        type: String(b?.type || '').trim(),
        props: b?.props ? deepClone(b.props) : {},
      })),
    }

    // Debug (optional)
    // console.log('📤 SENDING PAYLOAD:\n', JSON.stringify(payload, null, 2))

    await updatePage(page.value.id, payload)
    show('Saved successfully', 'success', 2000)
  } catch (err) {
    console.error('Save error:', err)
    const msg = err?.response?.data?.message || err?.message || 'Save failed'
    show(msg, 'error', 3500)
  } finally {
    saving.value = false
  }
}
</script>
