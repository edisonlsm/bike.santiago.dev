import type { Strava } from '~/types/strava';
import { z } from 'zod'

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, z.object({
    access_token: z.string(),
    athlete_id: z.string(),
  }).parse);

  const stats = await $fetch<Strava.AthleteStats>(
    useRuntimeConfig().stravaApiUrl + `/athletes/${query.athlete_id}/stats`,
    {
      headers: {
        'Authorization': 'Bearer ' + query.access_token
      }
    }
  )

  return stats;
})