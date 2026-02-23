import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css'
        }
      ]
    }
  },
  devtools: true,
  modules: [
    '@pinia/nuxt',

],



css: [
    '~/assets/css/main.css',
    // 'grapesjs/dist/css/grapes.min.css',
    // 'grapesjs-preset-webpage/dist/grapesjs-preset-webpage.min.css'
],
  vite: {
    plugins: [      
      tailwindcss(),    
    ],  
  },
  // routeRules: {
  //   '/': { redirect: '/login' } // default 308; or use { redirect: { to: '/login', statusCode: 302 } }
  // },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
      swaggerJson: process.env.NUXT_PUBLIC_SWAGGER_JSON,
    },
  },
})
