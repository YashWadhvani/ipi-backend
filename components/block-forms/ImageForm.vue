
<template>
  <div class="grid gap-3 md:grid-cols-2">
    <div class="md:col-span-2 flex items-center gap-2">
      <input v-model="m.props.url" class="border px-3 py-2 rounded flex-1" placeholder="Image URL" />
      <button type="button" class="border px-3 py-2 rounded" @click="mediaOpen = true">Library…</button>
    </div>

    <input v-model="m.props.caption" class="border px-3 py-2 rounded md:col-span-2" placeholder="Caption" />
    <select v-model="m.props.width" class="border px-3 py-2 rounded md:col-span-2">
      <option value="full">Full</option><option value="half">Half</option><option value="third">Third</option>
    </select>

    <div class="md:col-span-2" v-if="m.props.url">
      <img :src="m.props.url" alt="" class="max-h-48 rounded border object-contain" />
    </div>
  </div>

  <MediaPickerModal v-model="mediaOpen" @select="pick" />
</template>

<script setup>
    import MediaPickerModal from '@/components/media/MediaPickerModal.vue'

    const props = defineProps({ modelValue: { type: Object, required: true } })
    const emit = defineEmits(['update:modelValue'])
    const m = computed({
    get: () => props.modelValue,
    set: (v) => emit('update:modelValue', v)
    })

    const mediaOpen = ref(false)
    const pick = (media) => {
    // single select
    if (media?.url) {
        m.value.props.url = media.url
        if (!m.value.props.caption && media.title) m.value.props.caption = media.title
  }
}
</script>

