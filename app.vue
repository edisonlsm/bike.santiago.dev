<template>
  <div class="w-full h-full">
    <div class="relative w-full h-full">

      <div class="absolute top-0 left-0 w-full h-full z-0" :class="activityMapScrollStyle">
        <div class="relative" :style="activityMapWrapperStyle">
          <img :src="currentActivityMap" :style="activityMapStyle" />
          <div class="absolute top-0 left-0 w-full h-full bg-black bg-opacity-20"></div>
        </div>
      </div>

      <div
        class="absolute top-0 left-0 flex flex-col sm:flex-row justify-center sm:justify-between items-end sm:items-start w-full">
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
          class="mx-4 mt-0 mb-4 sm:my-4 sm:mr-8 px-4 py-2 text-xs rounded-lg bg-strava-orange bg-opacity-50 hover:bg-opacity-100 text-white"
          @click="isShowingLastActivity = !isShowingLastActivity">
          {{ isShowingLastActivity ? $t('headings.see_longest_ride') : $t('headings.see_last_ride') }}
        </button>
      </div>

      <div
        class="absolute bottom-0 right-0 flex flex-col sm:flex-row justify-center sm:justify-between items-end w-full">
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

  const viewportWidth = ref(0);
  const viewportHeight = ref(0);

  // const mapScroll = ref(0)

  onMounted(() => {
    // viewportWidth.value = window.innerWidth
    // viewportHeight.value = window.innerHeight

    // nextTick(() => {
    //   if (viewportWidth.value > viewportHeight.value) {
    //     mapScroll.value.scrollTop = (mapScroll.value.scrollTopMax / 2)
    //   }
    //   else {
    //     mapScroll.value.scrollLeft = (mapScroll.value.scrollLeftMax / 2)
    //   }
    // })

    // window.onresize = (e) => {
    //   viewportWidth.value = window.innerWidth
    //   viewportHeight.value = window.innerHeight
    // }
  })

  const currentActivity = computed(() => {
    return isShowingLastActivity.value ? data.value!.lastActivity : data.value!.longestActivity
  })

  const currentActivityMap = computed(() => {
    const activity = isShowingLastActivity.value ? data.value!.lastActivity : data.value!.longestActivity
    return activity.mapImage
  })

  const activityMapScrollStyle = computed(() => {
    if (viewportWidth.value > viewportHeight.value) {
      return ['overflow-x-hidden', 'overflow-y-scroll']
    }
    else {
      return ['overflow-x-scroll', 'overflow-y-hidden']
    }
  })

  const activityMapWrapperStyle = computed(() => {
    if (viewportWidth.value > viewportHeight.value) {
      return { width: '100%', height: 'auto' }
    }
    else {
      return { width: 'fit-content', height: '100%' }
    }
  })

  const activityMapStyle = computed(() => {
    if (viewportWidth.value > viewportHeight.value) {
      return { maxWidth: '100%', width: '100%', height: 'auto' }
    }
    else {
      return { maxWidth: 'none', width: 'auto', height: '100%' }
    }
  })
</script>

<style lang="pcss">
.general-stats {
  transition: max-height 0.25s linear;
}
</style>

<script lang="ts">
  

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
    lastActivity.mapImage = await getMapboxMap(lastActivity.map.summary_polyline, mapboxToken)

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

    activity.mapImage = await getMapboxMap(activity.map.polyline, mapboxToken)

    return activity
  }

  async function getMapboxMap(polyline: string, mapboxToken: string) {
    // console.log(decode(polyline, 5));
    // First, unescape polyline backslashes
    const unescaped_polyline = polyline.replace('\\\\', '\\')

    // Now, url encode it
    const encoded_polyline = encodeURIComponent(unescaped_polyline)

    // Create the path parameter
    // https://docs.mapbox.com/api/maps/static-images/#path
    const map_path = 'path-5+FC4C02-1.0' + '(' + encoded_polyline + ')'

    const image = await $fetch(
      'https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/' + map_path + '/auto/1280x1280@2x',
      {
        params: {
          padding: 128,
          access_token: mapboxToken
        }
      }
    )

    //@ts-ignore
    const buffer = Buffer.from(await image.arrayBuffer())
    const b64 = buffer.toString('base64')

    const base64 = 'data:image/png;base64,' + b64

    return base64
  }
</script>