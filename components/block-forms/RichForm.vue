<script setup>
const props = defineProps({ modelValue: { type: Object, required: true } })
const emit = defineEmits(['update:modelValue'])
const m = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})
</script>

<template>
  <div>
    <textarea v-model="m.props.html" class="border px-3 py-2 rounded w-full h-40" placeholder="<p>HTML…</p>"></textarea>
  </div>
</template>
