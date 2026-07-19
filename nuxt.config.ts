// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@vueuse/nuxt', 'nuxt-shiki', '@nuxtjs/seo'],

  css: ['~/assets/css/main.css'],

  shiki: {
    defaultTheme: 'vesper',
  },

  site: {
    url: 'https://obs-raw.streamer.bot',
    name: 'OBS Raw Generator | Streamer.bot',
  },

  ogImage: {
    zeroRuntime: true,
  },

  sitemap: {
    zeroRuntime: true
  },

  fonts: {
    families: [
      { name: 'DM Sans', global: true },
      { name: 'Jost', weights: [200, 300, 400, 500, 600, 700], global: true },
      { name: 'DM Mono', weights: [300, 400, 500], global: true },
    ],
  },

  routeRules: {
    '/': { prerender: true },
    '/**': { prerender: true },
  },

  nitro: {
    preset: 'cloudflare_pages_static',
    prerender: {
      autoSubfolderIndex: false
    },
    cloudflare: {
      deployConfig: true,
      wrangler: {
        name: 'streamerbot-obs-raw',
      }
    }
  },

  experimental: {
    typescriptPlugin: true,
  },

  compatibilityDate: '2026-06-30',

  $development: {
    devtools: {
      enabled: true,
    },
    vite: {
      optimizeDeps: {
        include: ['@unhead/schema-org/vue', 'obs-websocket-js', 'zod'],
      },
    },
  },
});
