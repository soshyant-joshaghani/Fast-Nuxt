import tailwindcss from '@tailwindcss/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  telemetry: false,

  modules: ['shadcn-nuxt', '@vite-pwa/nuxt'],

  components: {
    dirs: [
      { path: '~/lib/modules/base/ui', pathPrefix: false },
      { path: '~/lib/modules/base', pathPrefix: false, extensions: ['vue'], ignore: ['**/ui/**'] },
    ],
  },

  shadcn: {
    prefix: '',
    componentDir: './lib/modules/base/ui',
  },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
    server: {
      strictPort: true,
    },
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || '/api/v1',
    },
  },

  nitro: {
    devProxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Fast-Nuxt Dashboard',
      short_name: 'Fast-Nuxt',
      theme_color: '#0ea5e9',
      background_color: '#09090b',
      display: 'standalone',
    },
    workbox: {
      navigateFallback: '/',
    },
    devOptions: {
      enabled: true,
    },
  },

  devServer: {
    port: 3100,
    host: '0.0.0.0',
  },
});
