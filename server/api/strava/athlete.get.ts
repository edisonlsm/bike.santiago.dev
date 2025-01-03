import checkStravaAuth from '~/server/utils/check_strava_auth';
import type { Strava } from '~/types/strava';

export default defineEventHandler({
  onRequest: [checkStravaAuth],
  handler: async (event) => {
    const { access_token } = getQuery(event)

    const profile = await $fetch<Strava.Athlete>(
      useRuntimeConfig().stravaApiUrl + '/athlete',
      {
        headers: {
          'Authorization': 'Bearer ' + access_token
        }
      }
    )

    return profile;
  }
})