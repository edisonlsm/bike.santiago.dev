import svgLoader from "vite-svg-loader"

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: { enabled: true },

    modules: ["nitro-cloudflare-dev", "@nuxtjs/tailwindcss", "@nuxtjs/i18n", "@nuxtjs/leaflet"],

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
    build: {
        transpile: ['@googlemaps/polyline-codec']
    },
    runtimeConfig: {
        stravaClientId: process.env.STRAVA_CLIENT_ID,
        stravaClientSecret: process.env.STRAVA_CLIENT_SECRET,
        stravaRefreshToken: process.env.STRAVA_REFRESH_TOKEN
    }
})