<template>
    <div class="p-4 flex justify-start items-center bg-white rounded-lg">
        <img :src="profile.picture" class="h-16 w-16 rounded-full">
        <StravaIcon class="h-12 w-12 text-strava-orange ml-2 fill-current" />
        <div class="flex flex-col items-start">
        <p class="text-2xl">
            {{ profile.firstname + ' ' + profile.lastname }}
        </p>
        <a
            :href="'https://www.strava.com/athletes/' + profile.id"
            target="_blank"
            class="text-strava-orange text-sm"
        >
            {{ t('intro.add_strava') }}
        </a>
        </div>
    </div>
</template>

<script setup>
import StravaIcon from '~/assets/strava.svg?component'


import { useI18n } from "vue-i18n"
const { t } = useI18n()

const props = defineProps({
    profile: {
        type: Object,
        required: true
    }
})
</script>