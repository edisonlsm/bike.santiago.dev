export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'santiago-bike-stats',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'assets/fonts/fonts.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/luxon.js'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/i18n',
    '@nuxtjs/svg'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  i18n: {
    baseUrl: 'https://santiago.bike',
    locales: [
      {
        code: 'en',
        iso: 'en-US',
        shortName: 'EN',
        name: 'English',
        isCatchallLocale: true
      },
      {
        code: 'br',
        iso: 'pt-BR',
        shortName: 'PT-BR',
        name: 'Português'
      }
    ],
    defaultLocale: 'en',
    detectBrowserLanguage: true,
    strategy: 'no_prefix',
    vueI18n: {
      fallbackLocale: 'en'
    },
    vueI18nLoader: true
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
