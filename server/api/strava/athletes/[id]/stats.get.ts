import type { Strava } from '~/types/strava';
import { z } from 'zod'

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, z.object({
    access_token: z.string(),
  }).parse);

  const params = await getValidatedRouterParams(event, z.object({
    id: z.string()
  }).parse);

  try {
    const stats = await $fetch<Strava.AthleteStats>(
      useRuntimeConfig().stravaApiUrl + `/athletes/${params.id}/stats`,
      {
        headers: {
          'Authorization': 'Bearer ' + query.access_token
        }
      }
    )
    return stats;
  }
  catch (e) {
    console.log(e)
    throw e
  }

})