<template>
  <figure class="my-8">
    <img :src="url" alt="" class="rounded-lg shadow w-full object-cover" :class="widthClass" />
    <figcaption v-if="caption" class="text-sm text-gray-500 mt-2">{{ caption }}</figcaption>
  </figure>
</template>

<script setup>
    const props = defineProps({
    url: String,
    caption: { type: String, default: '' },
    width: { type: String, default: 'full' } // 'full' | 'half' | 'third'
    })
    const widthClass = computed(() => ({
    full: 'w-full',
    half: 'w-1/2',
    third: 'w-1/3'
    }[props.width] || 'w-full'))
</script>

