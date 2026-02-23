<template>
    <Teleport to="body">
      <transition name="fade">
        <div v-if="open" class="fixed inset-0 z-[100] flex items-center justify-center">
          <div class="absolute inset-0 bg-black/40" @click="emit('update:open', false)" />
          <div
            class="relative bg-white w-[92vw] max-w-md rounded-2xl shadow-xl border border-black/10 p-5"
            role="dialog" aria-modal="true"
          >
            <h3 class="text-lg font-semibold mb-2">{{ title }}</h3>
            <p class="text-gray-600">{{ message }}</p>
            <div class="mt-5 flex justify-end gap-2">
              <button
                class="px-4 cursor-pointer py-2 rounded-lg border border-black/10 hover:bg-gray-50"
                @click="emit('update:open', false); emit('cancel')"
              >
                {{ cancelText }}
              </button>
              <button
                class="cursor-pointer px-4 py-2 rounded-lg text-white"
                :style="{ background: 'var(--ipi-red)' }"
                @click="emit('confirm'); emit('update:open', false)"
              >
                {{ confirmText }}
              </button>
            </div>
            <button
              class=" cursor-pointer absolute top-3 right-3 p-2 rounded hover:bg-gray-100"
              aria-label="Close"
              @click="emit('update:open', false)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
      </transition>
    </Teleport>
  </template>
  
  <script setup>
  const props = defineProps({
    open: { type: Boolean, default: false },
    title: { type: String, default: 'Are you sure?' },
    message: { type: String, default: 'Please confirm this action.' },
    confirmText: { type: String, default: 'Confirm' },
    cancelText: { type: String, default: 'Cancel' },
  })
  const emit = defineEmits(['update:open','confirm','cancel'])
  </script>
  
  <style scoped>
  .fade-enter-active, .fade-leave-active { transition: opacity .15s ease; }
  .fade-enter-from, .fade-leave-to { opacity: 0; }
  </style>
  