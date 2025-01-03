<template>
  <div class="w-full h-full">
    <div class="relative w-full h-full">

      <div class="absolute top-0 left-0 right-0 bottom-0 z-0 overflow-hidden">
        <ActivityMap :activity="currentActivity" />
        <div class="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-20" :style="{ 'z-index': 1000 }"></div>
      </div>

      <div
        class="absolute top-0 left-0 flex flex-col sm:flex-row justify-center sm:justify-between items-end sm:items-start w-full p-4 space-y-4 sm:space-y-0">
        <AthleteStatsCard :athlete="data!.athlete" :athleteStats="data!.stats" />

        <button
          class="px-4 py-2 text-xs rounded-lg bg-strava-orange bg-opacity-50 hover:bg-opacity-100 text-white"
          @click="isShowingLastActivity = !isShowingLastActivity">
          {{ isShowingLastActivity ? $t('headings.see_longest_ride') : $t('headings.see_last_ride') }}
        </button>
      </div>

      <div
        class="absolute bottom-0 right-0 flex flex-col sm:flex-row justify-center sm:justify-between items-end w-full">
        <div class="px-4 py-8 order-1 sm:order-2 ">
          <RideStats :activity="currentActivity" :isShowingLastActivity="isShowingLastActivity" />
        </div>

        <Attribution class="order-2 sm:order-1" />
      </div>
    </div>
  </div>
</template>

<style>
  html,
  body,
  #__nuxt,
  #__layout {
    height: 100%;
  }
</style>

<script setup lang="ts">
  import type { Strava } from './types/strava';
  import { decode } from "@googlemaps/polyline-codec"

  const requestFetch = useRequestFetch()

  const { data, error } = await useAsyncData(
    'strava info',
    async () => {
      const response = await requestFetch('/api/strava/auth')

      // Get token
      const access_token = response.access_token;
      // Get profile
      const athlete: Strava.Athlete = await requestFetch(
        '/api/strava/athlete',
        { query: { access_token }}
      );

      // Get stats,
      const stats: Strava.AthleteStats = await requestFetch(
        `/api/strava/athletes/${athlete.id}/stats`,
        { query: { access_token }}
      );

      // Get last activity
      const activities: Strava.Activity[] = await requestFetch(
        `/api/strava/athlete/activities`,
        { query: { access_token }}
      )
      const lastActivity = activities[0]

      // Get longest activity
      const longestActivityId = useRuntimeConfig().stravaLongestActivityId;
      const longestActivity: Strava.Activity = await requestFetch(
        `/api/strava/athlete/activities/${longestActivityId}`,
        { query: { access_token }}
      )

      return {
        athlete,
        stats,
        lastActivity,
        longestActivity,
      }
    },
  )

  const isShowingLastActivity = ref(true);

  const currentActivity = computed(() => {
    return isShowingLastActivity.value ? data.value!.lastActivity : data.value!.longestActivity
  })
</script>

<style lang="pcss">
.general-stats {
  transition: max-height 0.25s linear;
}
</style>
