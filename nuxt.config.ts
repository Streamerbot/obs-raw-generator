import { createResolver } from 'nuxt/kit';

const { resolve } = createResolver(import.meta.url);

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@vueuse/nuxt', 'nuxt-shiki', '@nuxtjs/seo'],

  css: ['~/assets/css/main.css'],

  alias: {
    'shiki/wasm': resolve('./stubs/shiki-wasm.mjs'),
  },

  shiki: {
    defaultTheme: 'vesper',
    bundledLangs: ['json'],
  },

  site: {
    url: 'https://obs-raw.streamer.bot',
    name: 'OBS Raw Generator | Streamer.bot',
  },

  fonts: {
    families: [
      { name: 'DM Sans', global: true },
      { name: 'Jost', weights: [200, 300, 400, 500, 600, 700], global: true },
      { name: 'DM Mono', weights: [300, 400, 500], global: true },
    ],
  },

  icon: {
    customCollections: [
      {
        prefix: 'sb',
        dir: resolve('./app/assets/icons/sb'),
      },
    ],
  },

  routeRules: {
    '/': { prerender: true },
  },

  nitro: {
    preset: 'cloudflare-module',
    prerender: {
      autoSubfolderIndex: false,
    },
    cloudflare: {
      deployConfig: true,
      wrangler: {
        name: 'streamerbot-obs-raw',
      },
    },
  },

  experimental: {
    typescriptPlugin: true,
  },

  compatibilityDate: '2026-10-16',

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
