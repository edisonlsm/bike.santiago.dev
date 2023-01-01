import svgLoader from "vite-svg-loader"

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
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
    },
    runtimeConfig: {
        stravaClientId: process.env.STRAVA_CLIENT_ID,
        stravaClientSecret: process.env.STRAVA_CLIENT_SECRET,
        stravaRefreshToken: process.env.STRAVA_REFRESH_TOKEN,
        mapBoxAccessToken: process.env.MAPBOX_ACCESS_TOKEN,
    }
})
