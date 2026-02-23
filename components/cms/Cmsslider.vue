<template>
    <Swiper v-bind="props.options">
      <SwiperSlide v-for="(s,i) in props.slides" :key="i">
        <figure class="relative">
          <img :src="s.img" alt="" />
          <figcaption class="abs-center">
            <h2>{{ s.heading }}</h2>
            <p>{{ s.sub }}</p>
          </figcaption>
        </figure>
      </SwiperSlide>
    </Swiper>
  </template>


<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
const props = defineProps({ slides: { type: Array, default: () => [] }, options: { type: Object, default: () => ({}) } })
</script>


<style scoped>
.abs-center{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;text-shadow:0 2px 8px rgba(0,0,0,.5)}
figure,img{width:100%}
img{height:60vh;object-fit:cover}
</style>
