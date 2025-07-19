import type { Strava } from '~/types/strava';
import { z } from 'zod'

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, z.object({
    access_token: z.string(),
  }).parse);

  const longestRideId = useRuntimeConfig().stravaLongestActivityId;

  const stats = await $fetch<Strava.Activity>(
    useRuntimeConfig().stravaApiUrl + `/activities/${longestRideId}`,
    {
      headers: {
        'Authorization': 'Bearer ' + query.access_token
      }
    }
  )

  return stats;
})