<script setup>
import { computed } from 'vue'

const props = defineProps({ modelValue: Object })
const emit = defineEmits(['update:modelValue'])

// ✅ SAME PATTERN AS HeroForm
const m = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})
</script>

<template>
  <div class="space-y-4">

    <!-- Heading -->
    <input
      v-model="m.props.heading"
      class="border px-3 py-2 rounded w-full"
      placeholder="Heading"
    />

    <!-- Rich Text -->
    <textarea
      v-model="m.props.html"
      class="border px-3 py-2 rounded w-full h-32"
      placeholder="HTML / Rich text"
    />

    <!-- Image -->
    <div class="space-y-2">
      <input
        v-model="m.props.image"
        class="border px-3 py-2 rounded w-full"
        placeholder="Image URL"
      />

      <input
        v-model="m.props.imageAlt"
        class="border px-3 py-2 rounded w-full"
        placeholder="Image alt text"
      />

      <img
        v-if="m.props.image"
        :src="m.props.image"
        class="h-32 object-cover rounded border"
      />
    </div>

    <!-- Reverse toggle -->
    <label class="flex items-center gap-2 text-sm">
      <input type="checkbox" v-model="m.props.reverse" />
      Image on left
    </label>

  </div>
</template>
