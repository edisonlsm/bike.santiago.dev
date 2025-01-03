import type { Strava } from '~/types/strava';
import { z } from 'zod'

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, z.object({
    access_token: z.string(),
    per_page: z.number().default(1)
  }).parse);

  const uri = new URL(useRuntimeConfig().stravaApiUrl + `/athlete/activities`)
  uri.searchParams.append('per_page', query.per_page.toString())

  const stats = await $fetch<Strava.Activity[]>(
    uri.href,
    {
      headers: {
        'Authorization': 'Bearer ' + query.access_token
      }
    }
  )

  return stats;
})