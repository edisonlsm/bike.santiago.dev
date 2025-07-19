import type { Strava } from '~/types/strava';
import { z } from 'zod'

export default defineEventHandler(async (event) => {
  console.log(`defineEventHandler`)
  const query = await getValidatedQuery(event, z.object({
    access_token: z.string(),
  }).parse);

  const id = useRuntimeConfig().stravaLongestActivityId;

  console.log(`stravaLongestActivityId: ${id}`)

  try {
    const stats = await $fetch<Strava.Activity>(
      useRuntimeConfig().stravaApiUrl + `/activities/${id}`,
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