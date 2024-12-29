import svgLoader from "vite-svg-loader"

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    ssr: true,

    modules: ['@nuxtjs/tailwindcss', "@nuxtjs/i18n"],

    vite: {
        plugins: [
            svgLoader()
        ]
    },
    i18n: {
        experimental: {
            typedOptionsAndMessages: 'all'
        },
        strategy: 'no_prefix',
        locales: [
            {
                code: 'en-us',
                file: 'en-US.json'
            },
            {
                code: 'pt-br',
                file: 'pt-BR.json'
            }
        ],
        lazy: true,
        defaultLocale: 'pt-br',
    },
    runtimeConfig: {
        stravaClientId: process.env.STRAVA_CLIENT_ID,
        stravaClientSecret: process.env.STRAVA_CLIENT_SECRET,
        stravaRefreshToken: process.env.STRAVA_REFRESH_TOKEN,
        mapBoxAccessToken: process.env.MAPBOX_ACCESS_TOKEN,
    },

    compatibilityDate: "2024-12-29"
})