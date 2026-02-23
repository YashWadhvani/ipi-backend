<template>
    <Teleport to="body">
      <transition name="slide-up">
        <div
          v-if="snackbar.open"
          class="fixed z-[110] bottom-6 left-1/2 -translate-x-1/2 w-[92vw] max-w-md"
        >
          <div
            class="rounded-xl px-4 py-3 shadow-lg border text-white flex items-center gap-3"
            :class="bgClass"
          >
            <span class="font-medium">{{ snackbar.message }}</span>
            <button class="ml-auto opacity-90 hover:opacity-100" @click="hide" aria-label="Dismiss">✕</button>
          </div>
        </div>
      </transition>
    </Teleport>
  </template>
  
  <script setup>
  const snackbar = useState('snackbar', () => ({ open:false, message:'', type:'info', timeout:3000, timer:null }))
  
  const hide = () => {
    if (snackbar.value.timer) clearTimeout(snackbar.value.timer)
    snackbar.value.open = false
  }
  
  const bgClass = computed(() => {
    switch (snackbar.value.type) {
      case 'success': return 'bg-emerald-600 border-emerald-700'
      case 'error':   return 'bg-rose-600 border-rose-700'
      case 'warn':    return 'bg-amber-600 border-amber-700'
      default:        return 'bg-gray-800 border-gray-900'
    }
  })
  </script>
  
  <style scoped>
  .slide-up-enter-active, .slide-up-leave-active { transition: all .18s ease; }
  .slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translate(-50%, 8px); }
  </style>
  