// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@pinia/nuxt'
  ],

  tailwindcss: {
    viewer: false
  },

  postcss: {
    plugins: {
      'tailwindcss/nesting': false
    }
  },

  vite: {
    optimizeDeps: {
      include: ['lucide-vue-next']
    }
  },

  shadcn: {
    prefix: '',
    componentDir: './app/components/ui'
  },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'KavoraX Admin — Enterprise Management Panel',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'KavoraX Global Admin Panel — Scalable enterprise management console starter.'
        },
        { name: 'theme-color', content: '#0b0f14' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600;700&family=Roboto+Condensed:wght@700;800;900&display=swap'
        }
      ]
    }
  },

  typescript: {
    strict: true
  }
})
