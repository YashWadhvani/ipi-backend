<!-- BlockForm.vue -->
<script setup>
import { ref, watch, computed, toRaw } from 'vue'
import HeroForm from '@/components/block-forms/HeroForm.vue'
import RichForm from '@/components/block-forms/RichForm.vue'
import ImageForm from '@/components/block-forms/ImageForm.vue'
import CtaRowForm from '@/components/block-forms/CtaRowForm.vue'
import FAQForm from '@/components/block-forms/FAQForm.vue'
import HeroSliderForm from '@/components/block-forms/HeroSliderForm.vue'
import AboutTwoColForm from '@/components/block-forms/AboutTwoColForm.vue'
import PartnersCarouselForm from '@/components/block-forms/PartnersCarouselForm.vue'
import FourUpForm from '@/components/block-forms/FourUpForm.vue'
import ContentImageForm from '@/components/block-forms/ContentImageForm.vue'
const props = defineProps({ modelValue: { type: Object, required: true } })
const emit = defineEmits(['update:modelValue'])

const safeClone = (val) => {
  try {
    // strip Vue proxy first
    const raw = toRaw(val)
    // some browsers may still barf on certain shapes; try structuredClone
    return typeof structuredClone === 'function'
      ? structuredClone(raw)
      : JSON.parse(JSON.stringify(raw))
  } catch {
    // final fallback
    return JSON.parse(JSON.stringify(toRaw(val)))
  }
}

// local copy to edit without mutating prop
const local = ref(safeClone(props.modelValue))

watch(
  () => props.modelValue,
  (v) => { local.value = safeClone(v) },
  { deep: true }
)

const forms = { 
  hero: HeroForm, richtext: RichForm, image: ImageForm, ctaRow: CtaRowForm, faq: FAQForm, heroslider: HeroSliderForm,
  aboutsection: AboutTwoColForm,
  partners: PartnersCarouselForm,
  contentImage: ContentImageForm,
  fourup: FourUpForm
  
}
const Form = computed(() => forms[local.value?.type] || null)

const update = (payload) => {
    const patch = safeClone(payload)
    // Never allow type to be removed or changed by a sub-form
    if (!patch.type || patch.type !== local.value.type) {
      patch.type = local.value.type
    }
    const merged = { ...local.value, ...patch }
    local.value = merged
    emit('update:modelValue', safeClone(merged))
  }
</script>

<template>
  <div>
    <component
      v-if="Form"
      :is="Form"
      :modelValue="local"
      @update:modelValue="update"
    />
    <div v-else class="text-xs text-gray-500">No editor for this block type.</div>
  </div>
</template>
