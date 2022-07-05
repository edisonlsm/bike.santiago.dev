<template>
  <div class="h-full">
    <div class="m-8 flex justify-start items-center">
      <img src="https://dgalywyr863hv.cloudfront.net/pictures/athletes/23428282/9877134/6/large.jpg" class="rounded-full">
      <StravaIcon class="h-12 w-12 text-strava-orange ml-2 fill-current" />
      <div class="flex flex-col items-start">
        <p class="text-2xl">
          Edison Santiago
        </p>
        <a
          href="https://www.strava.com/athletes/23428282"
          class="text-strava-orange text-lg"
        >
          {{ t('intro.add_strava') }}
        </a>
      </div>
    </div>

    <div class="flex justify-start">
      <div class="m-8 w-full md:w-auto">
        <span class="mb-2 text-strava-orange text-2xl font-bold">
          {{ $t('headings.this_year') }}
        </span>
        <p class="text-xl">
          {{ $t('stats.stayed') }}
          <span class="font-bold">{{ thisYearHours }}</span>
          {{ $t('stats.on_top_bicycle') }}
        </p>
        <p class="text-xl">
          {{ $t('stats.ride') }}
          <span class="font-bold">{{ thisYearKms }}</span>
          {{ $t('stats.kilometers') }}
        </p>
        <p class="text-xl">
          {{ $t('stats.climbed') }}
          <span class="font-bold">{{ thisYearClimbMeters }}</span>
          {{ $t('stats.meters') }}
        </p>
      </div>

      <div class="m-8 w-full md:w-auto">
        <span class="mb-2 text-strava-orange text-2xl font-bold">
          {{ $t('headings.all_time') }}
        </span>
        <p class="text-xl">
          {{ $t('stats.stayed') }}
          <span class="font-bold">{{ allTimeHours }}</span>
          {{ $t('stats.on_top_bicycle') }}
        </p>
        <p class="text-xl">
          {{ $t('stats.ride') }}
          <span class="font-bold">{{ allTimeKms }}</span>
          {{ $t('stats.kilometers') }}
        </p>
        <p class="text-xl">
          {{ $t('stats.climbed') }}
          <span class="font-bold">{{ allTimeClimbMeters }}</span>
          {{ $t('stats.meters') }}
        </p>
      </div>
    </div>

    <div class="flex justify-start">
      <div class="m-8 w-full md:w-auto">
        <span class="mb-2 text-strava-orange text-2xl font-bold">
          {{ $t('headings.last_ride') }}:
        </span>
        <img
          :src="data.lastActivity.mapImage"
          class="h-60"
        >
        <span class="block pt-2 w-full">
          {{ data.lastActivity.name }}
        </span>
        <span class="block pt-2 w-full">
          {{ $t('activity.distance') }}:
          <span class="font-bold text-strava-orange">
            {{ lastActivityDistance }}km
          </span>
        </span>
        <span class="block pt-2 w-full">
          {{ $t('activity.elevation') }}:
          <span class="font-bold text-strava-orange">
            {{ lastActivityClimbMeters }}m
          </span>
        </span>
      </div>

      <div class="m-8 w-full md:w-auto">
        <span class="mb-2 text-strava-orange text-2xl font-bold">
          {{ $t('headings.longest_ride') }}
        </span>
        <img
          :src="data.longestActivity.mapImage"
          class="h-60"
        >
        <span class="block pt-2 w-full">
          {{ data.longestActivity.name }}
        </span>
        <span class="block pt-2 w-full">
          {{ $t('activity.distance') }}:
          <span class="font-bold text-strava-orange">
            {{ longestActivityDistance }}km
          </span>
        </span>
        <span class="block pt-2 w-full">
          {{ $t('activity.elevation') }}:
          <span class="font-bold text-strava-orange">
            {{ longestActivityClimbMeters }}m
          </span>
        </span>
      </div>
    </div>

    <footer class="fixed bottom-2 right-2 h-12 flex justify-end">
      <PoweredByStravaLogo />
    </footer>
  </div>
</template>

<script setup>
  import StravaIcon from '~/assets/strava.svg?component'
  import PoweredByStravaLogo from '~/assets/powered_by_strava.svg?component'

  import { Duration } from 'luxon'

  import { useI18n } from "vue-i18n"
  const { t } = useI18n()

  // Get token
  const { data, pending, error, refresh } = await useAsyncData(
    'strava info',
    async () => {
      const runtimeConfig = useRuntimeConfig()

      // Get token
      const access_token = await getStravaToken(runtimeConfig.stravaClientId, runtimeConfig.stravaClientSecret, runtimeConfig.stravaRefreshToken)
      
      // Get profile
      const { firstname, lastname, profile } = await getStravaProfile(access_token)

      // Get stats
      const { all_ride_totals, ytd_ride_totals } = await getStravaStats(access_token)

      // Get last activity
      const lastActivity = await getStravaLastActivity(access_token, runtimeConfig.mapBoxAccessToken)

      // Get longest activity
      const longestActivity = await getStravaLongestActivity(access_token, runtimeConfig.mapBoxAccessToken)

      const strava = {
        profile: {
          firstname, lastname, picture: profile
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

  const thisYearHours = computed(() => {
    const seconds = data.value.stats.ytd_ride_totals.moving_time
    const duration = Duration.fromObject({ seconds })
    const formattedDuration = duration.toFormat('d h m')
    const values = formattedDuration.split(' ')
    return `${values[0]} d, ${values[1]} h, ${values[2]} min`
  })
  const thisYearKms = computed(() => {
    const meters = data.value.stats.ytd_ride_totals.distance
    const km = Math.floor(meters / 1000)
    const formatter = new Intl.NumberFormat({ useGrouping: true, minimumFractionDigits: 0, maximumFractionDigits: 0 })
    return `${formatter.format(km)}`
  })
  const thisYearClimbMeters = computed(() => {
    const meters = data.value.stats.ytd_ride_totals.elevation_gain
    const formatter = new Intl.NumberFormat({ useGrouping: true, minimumFractionDigits: 0, maximumFractionDigits: 0 })
    return `${formatter.format(meters)}`
  })

  const allTimeHours = computed(() => {
    const seconds = data.value.stats.all_ride_totals.moving_time
    const duration = Duration.fromObject({ seconds })
    const formattedDuration = duration.toFormat('d h m')
    const values = formattedDuration.split(' ')
    return `${values[0]} d, ${values[1]} h, ${values[2]} min`
  })
  const allTimeKms = computed(() => {
    const meters = data.value.stats.all_ride_totals.distance
    const km = Math.floor(meters / 1000)
    const formatter = new Intl.NumberFormat({ useGrouping: true, minimumFractionDigits: 0, maximumFractionDigits: 0 })
    return `${formatter.format(km)}`
  })
  const allTimeClimbMeters = computed(() => {
    const meters = data.value.stats.all_ride_totals.elevation_gain
    const formatter = new Intl.NumberFormat({ useGrouping: true, minimumFractionDigits: 0, maximumFractionDigits: 0 })
    return `${formatter.format(meters)}`
  })

  const lastActivityDistance = computed(() => {
    const meters = data.value.lastActivity.distance
    const km = (meters / 1000).toFixed(2)
    const formatter = new Intl.NumberFormat({ useGrouping: true, minimumFractionDigits: 0, maximumFractionDigits: 0 })
    return `${formatter.format(km)}`
  })
  const lastActivityClimbMeters = computed (() => {
    const meters = data.value.lastActivity.total_elevation_gain
    const formatter = new Intl.NumberFormat({ useGrouping: true, minimumFractionDigits: 0, maximumFractionDigits: 0 })
    return `${formatter.format(meters)}`
  })


  const longestActivityDistance = computed(() => {
    const meters = data.value.longestActivity.distance
    const km = (meters / 1000).toFixed(2)
    const formatter = new Intl.NumberFormat({ useGrouping: true, minimumFractionDigits: 0, maximumFractionDigits: 0 })
    return `${formatter.format(km)}`
  })
  const longestActivityClimbMeters = computed (() => {
    const meters = data.value.longestActivity.total_elevation_gain
    const formatter = new Intl.NumberFormat({ useGrouping: true, minimumFractionDigits: 0, maximumFractionDigits: 0 })
    return `${formatter.format(meters)}`
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
      'https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/' + map_path + '/auto/500x300',
      {
        params: {
          access_token: mapbox_token
        }
      }
    )

    const buffer = Buffer.from(await image.arrayBuffer())
    const b64 = buffer.toString('base64')

    const base64 = 'data:image/png;base64,' + b64

    return base64;
  }
</script>