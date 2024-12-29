<template>
  <div class="w-full h-full">
    <div class="relative w-full h-full">

      <div class="absolute top-0 left-0 right-0 bottom-0 z-0 overflow-hidden">
        <ClientOnly>
          <LMap
            ref="map"
            :use-global-leaflet="false"
            @ready="onMapReady"
            v-bind:bounds="currentActivityBounds"
            class="z-0"
          >
            <LPolyline :lat-lngs="currentActivityLatLng" >

            </LPolyline>
            <LTileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
              layer-type="base"
              name="OpenStreetMap"
            />
          </LMap>
        </ClientOnly>
        <div class="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-20" :style="{ 'z-index': 1000 }"></div>
      </div>

      <div
        class="absolute top-0 left-0 flex flex-col sm:flex-row justify-center sm:justify-between items-end sm:items-start w-full p-4 space-y-4 sm:space-y-0">
          <StatsCard class="w-full sm:w-fit">
            <StravaProfile :profile="data!.profile" />

            <button class="mt-3 text-strava-orange text-sm" @click="isShowingAthleteStats = !isShowingAthleteStats">
              {{ isShowingAthleteStats ? $t('stats.hide') : $t('stats.show') }}
            </button>

            <div class="general-stats overflow-hidden" :class="isShowingAthleteStats ? 'max-h-96' : 'max-h-0'">
              <GeneralStats class="pt-4 " :title="$t('headings.this_year')" :stat="data!.stats.ytd_ride_totals" />
              <GeneralStats class="pt-2" :title="$t('headings.all_time')" :stat="data!.stats.all_ride_totals" />
            </div>
          </StatsCard>

        <button
          class="px-4 py-2 text-xs rounded-lg bg-strava-orange bg-opacity-50 hover:bg-opacity-100 text-white"
          @click="isShowingLastActivity = !isShowingLastActivity">
          {{ isShowingLastActivity ? $t('headings.see_longest_ride') : $t('headings.see_last_ride') }}
        </button>
      </div>

      <div
        class="absolute bottom-0 right-0 flex flex-col sm:flex-row justify-center sm:justify-end items-end w-full">
        <div class="px-4 py-8">
          <StatsCard class="order-1 sm:order-2 w-full sm:w-auto sm:pr-8">
            <div
              class="w-full sm:w-auto flex flex-row sm:flex-col justify-around sm:justify-start items-center sm:items-start space-x-8 sm:space-x-0 space-y-0 sm:space-y-2">
              <div>
                <span class="block text-strava-orange text-lg font-bold">
                  {{ isShowingLastActivity ? $t('headings.last_ride') : $t('headings.longest_ride') }}
                </span>
                <RideGeneralStats :activity="currentActivity" />
              </div>
              <div class="">
                <RideEffortStats :activity="currentActivity" />
              </div>
            </div>
          </StatsCard>
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
  import L from 'leaflet'
  import type { Strava } from './types/strava';

  const map = ref<{
    leafletObject: L.Map
  } | null>(null)

  const onMapReady = () => {
    if (map.value) {
      const leafMap = map.value!.leafletObject;

      leafMap.zoomControl.remove()

      // Set bounds manually on first time
      const bounds = currentActivityBounds.value;

      leafMap.setMaxBounds(bounds);
      leafMap.fitBounds(bounds, { padding: [16, 16] });
    }
  }

  const { data, error } = await useAsyncData(
    'strava info',
    async () => {
      const runtimeConfig = useRuntimeConfig()

      // Get token
      const accessToken = await getStravaToken(runtimeConfig.stravaClientId, runtimeConfig.stravaClientSecret, runtimeConfig.stravaRefreshToken)

      // Get profile
      const { id, firstname, lastname, profile } = await getStravaProfile(accessToken)

      // Get stats
      const { all_ride_totals, ytd_ride_totals } = await getStravaStats(accessToken)

      // Get last activity
      const lastActivity = await getStravaLastActivity(accessToken, runtimeConfig.mapBoxAccessToken)

      // Get longest activity
      const longestActivity = await getStravaLongestActivity(accessToken, runtimeConfig.mapBoxAccessToken)

      const strava = {
        profile: {
          id: id,
          firstname,
          lastname,
          profile
        },
        stats: {
          all_ride_totals,
          ytd_ride_totals
        },
        lastActivity,
        longestActivity
      }

      return strava
    },
  )

  const isShowingLastActivity = ref(false);
  const isShowingAthleteStats = ref(false);

  const currentActivity = computed(() => {
    return isShowingLastActivity.value ? data.value!.lastActivity : data.value!.longestActivity
  })

  const currentActivityMap = computed(() => {
    return currentActivity.value.mapImage
  })

  const currentActivityLatLng = computed<LatLngTuple[]>(() => {
    return currentActivity.value.latLngTuples;
  })

  const currentActivityBounds = computed<LatLngTuple[]>(() => {
    const lats = currentActivity.value.latLngTuples.map((t) => t[0]);
    const lngs = currentActivity.value.latLngTuples.map((t) => t[1]);

    const min: LatLngTuple = [
      Math.min(...lats),
      Math.min(...lngs),
    ];
    const max: LatLngTuple = [
      Math.max(...lats),
      Math.max(...lngs),
    ];
    const bounds = [min, max];
    return bounds;
  })
</script>

<style lang="pcss">
.general-stats {
  transition: max-height 0.25s linear;
}
</style>

<script lang="ts">
  import { decode, type LatLngTuple } from "@googlemaps/polyline-codec"

  const STRAVA_API_URL = 'https://www.strava.com/api/v3'

  const LONGEST_ACTIVITY_ID = '6569620057'

  async function getStravaToken(clientId: string, clientSecret: string, refreshToken: string) {
    const { access_token } = await $fetch<Strava.TokenResponse>('https://www.strava.com/oauth/token', {
      method: 'POST',
      params: {
        'client_id': clientId,
        'client_secret': clientSecret,
        'grant_type': 'refresh_token',
        'refresh_token': refreshToken
      }
    })

    return access_token;
  }

  async function getStravaProfile(accessToken: string) {
    const profile = await $fetch<Strava.Profile>(
      STRAVA_API_URL + '/athlete',
      {
        headers: {
          'Authorization': 'Bearer ' + accessToken
        }
      }
    )

    return profile;
  }

  async function getStravaStats(accessToken: string) {
    const stats = await $fetch<Strava.AthleteStats>(
      STRAVA_API_URL + '/athletes/23428282/stats',
      {
        headers: {
          'Authorization': 'Bearer ' + accessToken
        }
      }
    )

    return stats;
  }

  async function getStravaLastActivity(accessToken: string, mapboxToken: string) {
    const activities = await $fetch<Strava.Activity[]>(
      STRAVA_API_URL + '/athlete/activities?per_page=1',
      {
        headers: {
          'Authorization': 'Bearer ' + accessToken
        }
      }
    )

    let lastActivity = activities[0];
    lastActivity.latLngTuples = getMapCoordinates(lastActivity.map.summary_polyline);

    return activities[0]
  }

  async function getStravaLongestActivity(accessToken: String, mapboxToken: string) {
    let activity = await $fetch<Strava.Activity>(
      STRAVA_API_URL + '/activities/' + LONGEST_ACTIVITY_ID,
      {
        headers: {
          'Authorization': 'Bearer ' + accessToken
        }
      }
    )

    activity.latLngTuples = getMapCoordinates(activity.map.polyline);

    return activity
  }

  function getMapCoordinates(encodedPolyline: string) {
    const coordinates = decode(encodedPolyline, 5);

    return coordinates;
  }
</script>