<template>
  <div class="space-y-2">
    <div v-for="(it, i) in m.props.items" :key="i" class="space-y-1 border rounded p-3">
      <input v-model="it.q" class="border px-3 py-2 rounded w-full" placeholder="Question" />
      <textarea v-model="it.a" class="border px-3 py-2 rounded w-full h-24" placeholder="Answer (HTML allowed)"></textarea>
      <div class="text-right"><button @click="removeAt(i)" class="text-red-600 text-sm">Remove</button></div>
    </div>
    <button @click="add" class="border px-3 py-1 rounded">+ Add FAQ</button>
  </div>
</template>

<script setup>
    const props = defineProps({ modelValue: { type: Object, required: true } })
    const emit = defineEmits(['update:modelValue'])
    const m = computed({
    get: () => props.modelValue,
    set: (v) => emit('update:modelValue', v)
    })

    const add = () => m.value.props.items.push({ q: 'Question?', a: 'Answer.' })
    const removeAt = (i) => m.value.props.items.splice(i, 1)
</script>
