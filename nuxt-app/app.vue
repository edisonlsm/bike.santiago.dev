<template>
  <div class="h-full w-full">
    <div class="relative w-full h-full">

      <div class="absolute top-0 left-0 w-full h-full z-0" :class="activityMapScrollStyle" ref="mapScroll">
        <div class="relative" :style="activityMapWrapperStyle">
          <img :src="currentActivityMap" :style="activityMapStyle" />
          <div class="absolute top-0 left-0 w-full h-full bg-black bg-opacity-30"></div>
        </div>
      </div>

      <StatsCard class="w-full sm:w-fit">
        <StravaProfile :profile="data.profile" />
        <!-- <GeneralStats :title="$t('headings.this_year')" :stat="data.stats.ytd_ride_totals" /> -->
        <!-- <GeneralStats :title="$t('headings.all_time')" :stat="data.stats.all_ride_totals" /> -->
      </StatsCard>

      <div class="absolute bottom-0 right-0 flex flex-col sm:flex-row justify-center sm:justify-between items-end w-full">
        <StatsCard class="order-1 sm:order-2 w-full sm:w-auto sm:pr-8">
          <div class="w-full sm:w-auto flex flex-row sm:flex-col justify-around sm:justify-start items-center sm:items-start space-x-8 sm:space-x-0 space-y-0 sm:space-y-2">
            <span class="block text-strava-orange text-lg font-bold">
              {{ isShowingLastActivity ? $t('headings.last_ride') : $t('headings.longest_ride') }}
            </span>
            <div class="">
              <RideStats :activity="currentActivity" />
            </div>
          </div>
        </StatsCard>

        <Attribution class="order-2 sm:order-1" />
      </div>
    </div>

    
  </div>
</template>

<style>
html, body, #__nuxt, #__layout {
  height: 100vh;
}
</style>

<script setup>
  import { computed } from '@vue/reactivity';
  import * as fs from 'fs';

  const { data, pending, error, refresh } = await useAsyncData(
    'strava info',
    async () => {
      const runtimeConfig = useRuntimeConfig()

      // Get token
      const access_token = await getStravaToken(runtimeConfig.stravaClientId, runtimeConfig.stravaClientSecret, runtimeConfig.stravaRefreshToken)
      
      // Get profile
      const { id, firstname, lastname, profile } = await getStravaProfile(access_token)

      // Get stats
      const { all_ride_totals, ytd_ride_totals } = await getStravaStats(access_token)

      // Get last activity
      const lastActivity = await getStravaLastActivity(access_token, runtimeConfig.mapBoxAccessToken)

      // Get longest activity
      const longestActivity = await getStravaLongestActivity(access_token, runtimeConfig.mapBoxAccessToken)

      const strava = {
        profile: {
          id: id,
          firstname,
          lastname,
          picture: profile
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

  if (error) {
    console.log(error)
  }

  const isShowingLastActivity = ref(false);

  const viewportWidth = ref(0);
  const viewportHeight = ref(0);

  const mapScroll = ref(null)

  onMounted(() => {
    viewportWidth.value = window.innerWidth
    viewportHeight.value = window.innerHeight

    console.log(mapScroll.value)

    nextTick(() => {
      if (viewportWidth.value > viewportHeight.value) {
        mapScroll.value.scrollTop = (mapScroll.value.scrollTopMax / 2)
      }
      else {
        mapScroll.value.scrollLeft = (mapScroll.value.scrollLeftMax / 2)
      }
    })

    window.onresize = (e) => {
      viewportWidth.value = window.innerWidth
      viewportHeight.value = window.innerHeight
    }
  })

  const currentActivity = computed(() => {
    return isShowingLastActivity.value ? data.value.lastActivity : data.value.longestActivity
  })

  const currentActivityMap = computed(() => {
    const activity = isShowingLastActivity.value ? data.value.lastActivity : data.value.longestActivity
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

<script>
  const STRAVA_API_URL = 'https://www.strava.com/api/v3'

  const LONGEST_ACTIVITY_ID = '6569620057'

  async function getStravaToken(client_id, client_secret, refresh_token) {
    const { access_token }  = await $fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      params: {
        'client_id': client_id,
        'client_secret': client_secret,
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token
      }
    })

    return access_token;
  }

  async function getStravaProfile(access_token) {
    const profile = await $fetch(
      STRAVA_API_URL + '/athlete',
      {
        headers: {
          'Authorization': 'Bearer ' + access_token
        }
      }
    )

    return profile;
  }

  async function getStravaStats(access_token) {
    const stats = await $fetch(
      STRAVA_API_URL + '/athletes/23428282/stats',
      {
        headers: {
          'Authorization': 'Bearer ' + access_token
        }
      }
    )

    return stats;
  }

  async function getStravaLastActivity(access_token, mapbox_token) {
    const activities = await $fetch(
      STRAVA_API_URL + '/athlete/activities?per_page=1',
      {
        headers: {
          'Authorization': 'Bearer ' + access_token
        }
      }
    )

    let lastActivity = activities[0];
    lastActivity.mapImage = await getMapboxMap(lastActivity.map.summary_polyline, mapbox_token)

    return activities[0]
  }

  async function getStravaLongestActivity(access_token, mapbox_token) {
    let activity = await $fetch(
      STRAVA_API_URL + '/activities/' + LONGEST_ACTIVITY_ID,
      {
        headers: {
          'Authorization': 'Bearer ' + access_token
        }
      }
    )

    activity.mapImage = await getMapboxMap(activity.map.polyline, mapbox_token)

    return activity
  }

  async function getMapboxMap(polyline, mapbox_token) {
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
          access_token: mapbox_token
        }
      }
    )

    const buffer = Buffer.from(await image.arrayBuffer())
    const b64 = buffer.toString('base64')

    const base64 = 'data:image/png;base64,' + b64

    return base64
  }
</script>