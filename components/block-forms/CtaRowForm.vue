<script setup>
const props = defineProps({ modelValue: { type: Object, required: true } })
const emit = defineEmits(['update:modelValue'])
const m = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})

const add = () => m.value.props.items.push({ label: 'Button', link: '/' })
const removeAt = (i) => m.value.props.items.splice(i, 1)
</script>

<template>
  <div class="space-y-2">
    <div v-for="(it, i) in m.props.items" :key="i" class="grid gap-2 md:grid-cols-3 items-center">
      <input v-model="it.label" class="border px-3 py-2 rounded" placeholder="Label" />
      <input v-model="it.link" class="border px-3 py-2 rounded" placeholder="/path-or-url" />
      <button @click="removeAt(i)" class="text-red-600 text-sm">Remove</button>
    </div>
    <button @click="add" class="border px-3 py-1 rounded">+ Add CTA</button>
  </div>
</template>
