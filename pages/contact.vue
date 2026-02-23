<!-- pages/contact.vue -->
<template>
    <section class="min-h-screen">
      <!-- Hero -->
      <div class="relative isolate overflow-hidden bg-gradient-to-r from-[#a70000] to-[#e60012] text-white">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-center">
            Contact Us
          </h1>
          <p class="mt-2 text-center text-white/90">We’d love to hear from you.</p>
        </div>
        <div aria-hidden="true" class="absolute inset-y-0 right-0 -z-10 w-1/2 bg-[url('/textures/diagonal-noise.svg')] opacity-10"/>
      </div>
  
      <!-- Content -->
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <!-- Left: Contact details -->
          <aside class="lg:col-span-2 space-y-4">
            <div class="bg-white border border-[#ccc] rounded-md p-5">
              <h2 class="text-lg font-semibold text-gray-900">Talk To Us</h2>
              <div class="mt-4 space-y-4 text-sm">
                <div class="flex items-start gap-3">
                  <svg class="h-5 w-5 text-gray-700 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 13q-1.65 0-2.825-1.175Q8 10.65 8 9q0-1.65 1.175-2.825Q10.35 5 12 5t2.825 1.175Q16 7.35 16 9q0 1.65-1.175 2.825Q13.65 13 12 13Zm0 2q2.075 0 3.537.713Q17 16.425 17 17.5V19H7v-1.5q0-1.075 1.463-1.787Q9.925 15 12 15Z"/>
                  </svg>
                  <div>
                    <div class="text-gray-600">Email</div>
                    <a
                      :href="`mailto:${email}`"
                      class="text-gray-900 hover:underline break-all"
                    >{{ email }}</a>
                  </div>
                </div>
  
                <div class="flex items-start gap-3">
                  <svg class="h-5 w-5 text-gray-700 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1V20a1 1 0 01-1 1C10.07 21 3 13.93 3 5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.24.2 2.45.57 3.57a1 1 0 01-.24 1.02l-2.2 2.2z"/>
                  </svg>
                  <div>
                    <div class="text-gray-600">Phone</div>
                    <a
                      :href="`tel:${phoneDialable}`"
                      class="text-gray-900 hover:underline"
                    >{{ phoneDisplay }}</a>
                  </div>
                </div>
  
                <div class="flex items-start gap-3">
                  <svg class="h-5 w-5 text-gray-700 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
                  </svg>
                  <div>
                    <div class="text-gray-600">Address</div>
                    <address class="not-italic text-gray-900">
                      30, Sarvodaya Industrial Estate, 1st Floor,<br/>
                      Near Paper Box Factory, Off Mahakali Caves Road,<br/>
                      Andheri (East), Mumbai, Maharashtra 400 093, India
                    </address>
                    <div class="mt-2">
                      <a
                        :href="mapHref"
                        target="_blank"
                        class="inline-flex items-center gap-2 text-sm text-[#e60012] hover:underline"
                      >
                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 119.5 9 2.5 2.5 0 0112 11.5z"/></svg>
                        Open in Maps
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- Optional: quick links -->
            <div class="bg-white border border-[#ccc] rounded-md p-5">
              <h3 class="text-base font-semibold text-gray-900">Quick Links</h3>
              <ul class="mt-3 space-y-2 text-sm">
                <li><NuxtLink to="/chapters" class="text-[#e60012] hover:underline">Explore Chapters</NuxtLink></li>
                <li><NuxtLink to="/events" class="text-[#e60012] hover:underline">Upcoming Events</NuxtLink></li>
                <li><NuxtLink to="/pricing" class="text-[#e60012] hover:underline">Membership Plans</NuxtLink></li>
              </ul>
            </div>
          </aside>
  
          <!-- Right: Contact form -->
          <main class="lg:col-span-3">
            <div class="bg-white border border-[#ccc] rounded-md p-6">
              <h2 class="text-lg font-semibold text-gray-900">Send us a message</h2>
              <form @submit.prevent="submit" class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="sm:col-span-1">
                  <label class="block text-sm text-gray-600 mb-1">Name</label>
                  <input
                    v-model.trim="form.name"
                    type="text"
                    required
                    class="w-full rounded-md border border-[#ccc] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#e60012]/30"
                    placeholder="Your name"
                  />
                </div>
                <div class="sm:col-span-1">
                  <label class="block text-sm text-gray-600 mb-1">Email</label>
                  <input
                    v-model.trim="form.email"
                    type="email"
                    required
                    class="w-full rounded-md border border-[#ccc] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#e60012]/30"
                    placeholder="you@example.com"
                  />
                </div>
                <div class="sm:col-span-2">
                  <label class="block text-sm text-gray-600 mb-1">Subject (optional)</label>
                  <input
                    v-model.trim="form.subject"
                    type="text"
                    class="w-full rounded-md border border-[#ccc] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#e60012]/30"
                    placeholder="How can we help?"
                  />
                </div>
                <div class="sm:col-span-2">
                  <label class="block text-sm text-gray-600 mb-1">Message</label>
                  <textarea
                    v-model.trim="form.message"
                    rows="6"
                    required
                    class="w-full rounded-md border border-[#ccc] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#e60012]/30"
                    placeholder="Write your message..."
                  />
                </div>
  
                <div class="sm:col-span-2 flex items-center justify-between">
                  <p class="text-sm text-gray-500">
                    Prefer email? <a :href="`mailto:${email}`" class="text-[#e60012] hover:underline">{{ email }}</a>
                  </p>
                  <button
                    :disabled="submitting || !isValid"
                    class="inline-flex items-center gap-2 rounded-md bg-[#e60012] text-white px-5 py-2.5
                           hover:bg-[#cc0010] hover:cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e60012]/40 focus-visible:ring-offset-2"
                  >
                    <svg v-if="submitting" class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" opacity=".25"/>
                      <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" stroke-width="4"/>
                    </svg>
                    <span>{{ submitting ? 'Sending…' : 'Send Message' }}</span>
                  </button>
                </div>
  
                <p v-if="success" class="sm:col-span-2 text-green-700 text-sm">
                  Opening your email app to send the message…
                </p>
                <p v-if="error" class="sm:col-span-2 text-red-700 text-sm">
                  {{ error }}
                </p>
              </form>
            </div>
          </main>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  definePageMeta({ layout: 'default' })
  
  // Sourced from IPI India "Contact Us" page
  const email = 'indianplasticsinstitute@ipiindia.org'
  const phoneDisplay = '+91 2266950347 / 2266962601'
  const phoneDialable = '+912266950347' // first number for tel: link
  const address = '30, Sarvodaya Industrial Estate 1st Floor, Near Paper Box Factory, Off Mahakali Caves Road, Andheri (East) Mumbai, Maharashtra 400 093, India'
  
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
  
  // Simple form -> opens user’s email client via mailto:
  const form = reactive({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const submitting = ref(false)
  const success = ref(false)
  const error = ref('')
  
  const isValid = computed(() => {
    if (!form.name || !form.email || !form.message) return false
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
  })
  
  const submit = async () => {
    error.value = ''
    success.value = false
    if (!isValid.value) return
  
    try {
      submitting.value = true
      const subject = form.subject?.trim() || `Website enquiry from ${form.name}`
      const body = [
        `Name: ${form.name}`,
        `Email: ${form.email}`,
        '',
        form.message
      ].join('\n')
  
      const href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      success.value = true
      // small delay so the success message flashes before redirecting
      setTimeout(() => { window.location.href = href }, 150)
    } catch (e) {
      error.value = 'Could not open your email app. Please email us directly.'
    } finally {
      submitting.value = false
    }
  }
  </script>
  