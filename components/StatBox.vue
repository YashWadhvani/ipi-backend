<template>
    <div
      class="bg-white border border-[#ccc] rounded-md p-4 flex items-center justify-between shadow-sm"
    >
      <div>
        <div class="text-sm text-gray-500">{{ label }}</div>
        <div class="text-2xl font-semibold text-gray-900">{{ value }}</div>
      </div>
      <div
        class="h-10 w-10 flex items-center justify-center rounded-full"
        :class="colorClass"
      >
        <svg class="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path :d="iconPath(icon)" />
        </svg>
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    label: String,
    value: [String, Number],
    icon: String,
    color: String,
  })
  
  const colorClass = computed(() => {
    switch (props.color) {
      case 'blue': return 'bg-blue-500'
      case 'green': return 'bg-green-500'
      case 'indigo': return 'bg-indigo-500'
      case 'yellow': return 'bg-yellow-500'
      case 'red': return 'bg-red-500'
      default: return 'bg-gray-400'
    }
  })
  
  const iconPath = (name) => {
    switch (name) {
      case 'users': return 'M16 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-8 0a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-3 0-8 1.5-8 4v3h16v-3c0-2.5-5-4-8-4zm8 0c-.9 0-2 .1-3 .3 2.4.8 5 2.1 5 3.7V20h6v-3c0-2.5-5-4-8-4z'
      case 'calendar': return 'M7 2v2H5a2 2 0 0 0-2 2v2h18V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7zm14 8H3v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V10z'
      case 'ticket': return 'M4 4h16v4a2 2 0 1 1 0 4v4a2 2 0 1 1 0 4H4a2 2 0 1 1 0-4v-4a2 2 0 1 1 0-4V4z'
      case 'currency': return 'M12 1v22M6 6h6a4 4 0 0 1 0 8H6m0 0h6a4 4 0 1 1 0 8H6'
      default: return ''
    }
  }
  </script>
  