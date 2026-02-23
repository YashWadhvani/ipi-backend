<script setup>
const props = defineProps({ modelValue: { type: Object, required: true } })
const emit = defineEmits(['update:modelValue'])
const m = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})
</script>

<template>
  <div class="grid gap-3 md:grid-cols-2">
    <input v-model="m.props.heading" class="border px-3 py-2 rounded" placeholder="Heading" />
    <input v-model="m.props.subheading" class="border px-3 py-2 rounded" placeholder="Subheading" />
    <input v-model="m.props.bgUrl" class="border px-3 py-2 rounded md:col-span-2" placeholder="Background URL" />
    <select v-model="m.props.align" class="border px-3 py-2 rounded md:col-span-2">
      <option value="left">Left</option><option value="center">Center</option><option value="right">Right</option>
    </select>
  </div>
</template>
