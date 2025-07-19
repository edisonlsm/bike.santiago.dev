<template>
  <div class="w-dvw h-dvh">
    <div class="relative w-full h-full">

      <div class="absolute top-0 left-0 right-0 bottom-0 z-0 overflow-hidden">
        <ActivityMap :activity="currentActivity" />
        <div class="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-15 pointer-events-none" :style="{ 'z-index': 1000 }"></div>
      </div>

      <div
        class="absolute top-0 left-0 flex flex-col sm:flex-row justify-center sm:justify-between items-end sm:items-start w-full p-safe-offset-4 space-y-4 sm:space-y-0 pointer-events-none">
        <AthleteStatsCard :athlete="data!.athlete" :athleteStats="data!.stats" class="pointer-events-auto" />

        <button
          class="px-4 py-2 text-xs rounded-lg bg-strava-orange bg-opacity-50 hover:bg-opacity-100 text-white pointer-events-auto"
          @click="isShowingLastActivity = !isShowingLastActivity">
          {{ isShowingLastActivity ? $t('headings.see_longest_ride') : $t('headings.see_last_ride') }}
        </button>
      </div>

      <div
        class="absolute bottom-0 right-0 flex flex-col sm:flex-row justify-center sm:justify-between items-end w-full pointer-events-none">
        <div class="px-safe-offset-4 pb-4 sm:pb-8 order-1 sm:order-2 pointer-events-auto">
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

  html {
    overscroll-behavior: none;
  }
</style>

<script setup lang="ts">
  import type { Strava } from './types/strava';

  const requestFetch = useRequestFetch()

  const { data, error } = await useAsyncData(
    'strava info',
    async () => {
      const response = await requestFetch('/api/strava/auth')
      // Get token
      const accessToken = response.access_token;
      // Get profile
      const athlete: Strava.Athlete = await requestFetch(
        '/api/strava/athlete',
        { query: { access_token: accessToken }}
      );

      console.log(`Auth Response: ${JSON.stringify(response)}`)

      const [stats, lastActivity] = await Promise.all([
        fetchStats(athlete.id, accessToken),
        fetchLastActivity(accessToken),
        // fetchLongestActivity(accessToken),
      ])

      console.log(`Stats Response: ${stats}`)
      console.log(`LastActivity Response: ${lastActivity}`)
      // console.log(`LongestActivity Response: ${longestActivity}`)

      return {
        athlete,
        stats,
        lastActivity,
        // longestActivity,
      }
    },
  )

  const isShowingLastActivity = ref(true);

  const currentActivity = computed(() => {
    return data.value!.lastActivity;
    // return isShowingLastActivity.value ? data.value!.lastActivity : data.value!.longestActivity
  })

  async function fetchStats(athleteId: number, accessToken: string) {
    const stats: Strava.AthleteStats = await requestFetch(
        `/api/strava/athletes/${athleteId}/stats`,
        { query: { access_token: accessToken }}
      );
      return stats;
  }

  async function fetchLastActivity(accessToken: string) {
    // Get last activity
    const activities: Strava.Activity[] = await requestFetch(
      `/api/strava/athlete/rides`,
      { query: { access_token: accessToken }}
    )
    const lastActivity = activities[0]

    const photos = await fetchActivityPhotos(lastActivity, accessToken);
    lastActivity.photos = photos;
    return lastActivity;
  }

  async function fetchLongestActivity(accessToken: string) {
    const longestActivityId = useRuntimeConfig().stravaLongestActivityId;
    const longestActivity: Strava.Activity = await requestFetch(
      `/api/strava/activities/${longestActivityId}`,
      { query: { access_token: accessToken }}
    )

    const photos = await fetchActivityPhotos(longestActivity, accessToken);
    longestActivity.photos = photos;
    return longestActivity;
  }

  async function fetchActivityPhotos(activity: Strava.Activity, accessToken: string) {
    const photos: Strava.ActivityPhotos<'1024'>[] = await requestFetch(
      `/api/strava/activities/${activity.id}/photos`,
      { query: { access_token: accessToken, size: '1024' } }
    )
    return photos;
  }
</script>
