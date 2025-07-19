import type { Strava } from '~/types/strava';
import { z } from 'zod'

export default defineEventHandler(async (event) => {
  console.log(`defineEventHandler`)

  const query = await getValidatedQuery(event, z.object({
    access_token: z.string(),
  }).parse);

  console.log(`defineEventHandler | query`)

  const params = await getValidatedRouterParams(event, z.object({
    id: z.string()
  }).parse);

  console.log(`defineEventHandler | params`)

  console.log(`longestActivityId: ${params.id}`)

  try {
    const stats = await $fetch<Strava.Activity>(
      useRuntimeConfig().stravaApiUrl + `/activities/${params.id}`,
      {
        headers: {
          'Authorization': 'Bearer ' + query.access_token
        }
      }
    )


    return stats;
  }
  catch (e) {
    console.log(e);
    throw e
  }
})