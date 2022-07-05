import { defineNuxtConfig } from 'nuxt'
import svgLoader from "vite-svg-loader"

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    target: "static",
    ssr: true,
    modules: [
        '@nuxtjs/tailwindcss',
        '@intlify/nuxt3'
    ],
    vite: {
        plugins: [
            svgLoader()
        ]
    },
    intlify: {
        localeDir: "locales",
        vueI18n: {
          locale: "pt-BR",
          fallbackLocale: "en-US",
          availableLocales: ["pt-BR", "en-US"],
          sync: true,
        },
    }
})
