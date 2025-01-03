<template>
  <div class="flex justify-start items-center">
    <img :src="athlete.profile" class="h-16 w-16 rounded-full">
    <StravaIcon class="h-12 w-12 text-strava-orange ml-2 fill-current" />
    <div class="flex flex-col items-start">
    <p class="text-2xl">
        {{ athlete.firstname + ' ' + athlete.lastname }}
    </p>
    <a
        :href="'https://www.strava.com/athletes/' + athlete.id"
        target="_blank"
        class="text-strava-orange text-sm"
    >
        {{ $t('intro.add_strava') }}
    </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import StravaIcon from '~/assets/strava.svg?component'
import type { Strava } from '~/types/strava';

const props = defineProps<{
    athlete: Strava.Athlete
}>()
</script>