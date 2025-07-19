import svgLoader from "vite-svg-loader"

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: { enabled: true },

    app: {
        head: {
            title: 'Santiago Bike Stats',
            meta: [
                { name: 'theme-color', content: '#fc4c02' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' }
            ]
        }
    },

    nitro: {
        preset: 'cloudflare-pages-static'
    },

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
        stravaApiUrl: process.env.STRAVA_API_URL,
        stravaLongestActivityId: process.env.STRAVA_LONGEST_ACTIVITY_ID,
        stravaClientId: process.env.STRAVA_CLIENT_ID,
        stravaClientSecret: process.env.STRAVA_CLIENT_SECRET,
        stravaRefreshToken: process.env.STRAVA_REFRESH_TOKEN
    }
})