<template>
  <div class="h-full w-full">
    <div class="relative w-full h-full bg-black bg-opacity-30 bg-cover bg-center bg-blend-overlay" v-bind:style="mainBackgroundStyle">
      <div class="inline-block m-4 p-4 bg-white rounded-lg">
        <StravaProfile :profile="data.profile" />
        <!-- <GeneralStats :title="$t('headings.this_year')" :stat="data.stats.ytd_ride_totals" />
        <GeneralStats :title="$t('headings.all_time')" :stat="data.stats.all_ride_totals" /> -->
      </div>
      
      <div class="absolute bottom-4 right-4 flex justify-start items-center bg-white rounded-lg">
        <div class="w-full md:w-auto text-right">
          <!-- <span class="block my-2 mx-4 text-strava-orange text-lg font-bold">
            {{ $t('headings.last_ride') }}
          </span>
          <div class="my-2 mx-4">
            <RideStats :activity="data.lastActivity" />
          </div>
          <hr class="border-2 text-strava-orange" /> -->
          <span class="block m-2 text-strava-orange text-lg font-bold">
            {{ $t('headings.longest_ride') }}
          </span>
          <div class="my-2 mx-4">
            <RideStats :activity="data.longestActivity" />
          </div>
        </div>
      </div>
    </div>

    <Attribution />
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
      const { profile_id, firstname, lastname, profile } = await getStravaProfile(access_token)

      // Get stats
      const { all_ride_totals, ytd_ride_totals } = await getStravaStats(access_token)

      // Get last activity
      const lastActivity = await getStravaLastActivity(access_token, runtimeConfig.mapBoxAccessToken)

      // Get longest activity
      const longestActivity = await getStravaLongestActivity(access_token, runtimeConfig.mapBoxAccessToken)

      const strava = {
        profile: {
          id: profile_id,
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

  const isShowingLastActivity = false;

  const mainBackgroundStyle = computed(() => {
    const activity = isShowingLastActivity ? data.value.lastActivity : data.value.longestActivity
    return { backgroundImage: 'url(' + activity.mapImage + ')' }
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

    // const fileName = './assets/' + b64.substring(0, 10) + '.png'

    // console.log(fileName)

    // await fs.promises.writeFile(fileName, buffer)

    // return fileName;
  }
</script>