<template>
  <div>
    <NuxtWelcome />
  </div>
</template>

<script setup>
  // Get token
  const { data } = await useAsyncData(
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

  console.log(data);
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
    
    return image;
  }
</script>