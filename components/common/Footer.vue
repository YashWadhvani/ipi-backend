<template>
    <footer class="bg-gray-50 border-t border-gray-200 mt-10">
      <div class="grid md:grid-cols-3 gap-8 px-6 py-12 max-w-7xl mx-auto">
        <!-- Left -->
        <div>
          <NuxtLink to="/" class="flex items-center gap-2">
            <img src="../../assets/images/logo.png" alt="IPI Logo" class="h-10 w-auto" />
            <!-- <span class="font-semibold text-red-700">INDIAN PLASTICS INSTITUTE</span> -->
          </NuxtLink>
          <p class="text-sm text-gray-600 mt-3">
            Indian Plastics Institute (IPI) is a professional society registered in April 1985 under the
            Societies Registration Act, 1860 and subsequently under the Public Trusts Act, 1950.
          </p>
          <div class="flex gap-4 mt-4 text-xl text-blue-600">
            <a href="#" class="hover:text-red-700"><i class="fab fa-facebook"></i></a>
            <a href="#" class="hover:text-red-700"><i class="fab fa-instagram"></i></a>
            <a href="#" class="hover:text-red-700"><i class="fab fa-twitter"></i></a>
            <a href="#" class="hover:text-red-700"><i class="fab fa-linkedin"></i></a>
          </div>
        </div>
  
        <!-- Quick Links -->
        <div>
          <h3 class="font-semibold mb-3">Quick Links</h3>
          <ul class="space-y-2 text-sm">
            <li><NuxtLink to="/" class="hover:text-red-700">Home</NuxtLink></li>
            <li><NuxtLink to="/about" class="hover:text-red-700">About</NuxtLink></li>
            <li><NuxtLink to="/management" class="hover:text-red-700">Management</NuxtLink></li>
            <li><NuxtLink to="/chapters" class="hover:text-red-700">IPI Chapters</NuxtLink></li>
            <li><NuxtLink to="/activities" class="hover:text-red-700">Activities & Publications</NuxtLink></li>
            <li><NuxtLink to="/startups" class="hover:text-red-700">Startups</NuxtLink></li>
            <li><NuxtLink to="/csr" class="hover:text-red-700">CSR</NuxtLink></li>
            <li><NuxtLink to="/contact" class="hover:text-red-700">Contact Us</NuxtLink></li>
            <li><NuxtLink to="/careers" class="hover:text-red-700">Careers</NuxtLink></li>
          </ul>
        </div>
  
        <!-- Contact -->
        <div>
          <h3 class="font-semibold mb-3">Get In Touch</h3>
          <p class="text-sm text-gray-600">
            30, Sarvodaya Industrial Estate<br />
            1st Floor, Near Paper Box Factory,<br />
            Off Mahakali Caves Road,<br />
            Andheri (East) Mumbai, Maharashtra 400 093, India
          </p>
          <p class="mt-2 text-sm text-gray-600">
            Email:
            <a href="mailto:indianplasticsinstitute@ipiindia.org" class="text-red-700">
              indianplasticsinstitute@ipiindia.org
            </a>
          </p>
          <p class="text-sm text-gray-600">
            Phone:
            <a href="tel:+912266950347" class="text-red-700">2266950347 / 2266962601</a>
          </p>
        </div>
      </div>
  
      <!-- Bottom -->
      <div class="bg-white text-center text-xs text-gray-500 py-3 border-t border-gray-200">
        Copyright © 2025 Indian Plastics Institute India | Powered by
        <a href="#" class="text-blue-600 hover:text-red-700">IPI India Committee</a>
      </div>
    </footer>
  </template>
  
  <script setup>
  </script>
  