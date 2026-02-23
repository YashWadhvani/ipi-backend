import Splide from '@splidejs/splide'
import '@splidejs/splide/css'

export default defineNuxtPlugin(() => {
  requestAnimationFrame(() => {
    document.querySelectorAll('[data-widget="splide"]').forEach((el) => {
      const opts = el.dataset.options ? JSON.parse(el.dataset.options) : {}
      new Splide(el, { type: 'loop', autoplay: true, ...opts }).mount()
    })
  })
})
