<script setup>
const props = defineProps({
  heading: String,
  subheading: String,
  bgUrl: { type: String, default: '' },
  align: { type: String, default: 'center' } // 'left' | 'center' | 'right'
})
const alignClass = computed(() => ({
  left: 'items-start text-left',
  center: 'items-center text-center',
  right: 'items-end text-right'
}[props.align] || 'items-center text-center'))
</script>

<template>
  <section
    class="w-full py-20 rounded-2xl bg-cover bg-center flex"
    :style="bgUrl ? { backgroundImage: `url(${bgUrl})` } : {}"
  >
    <div class="container mx-auto px-4 flex flex-col gap-3" :class="alignClass">
      <h1 class="text-3xl md:text-5xl font-bold">{{ heading }}</h1>
      <p class="text-gray-700 text-lg md:text-xl max-w-3xl">{{ subheading }}</p>
    </div>
  </section>
</template>
