import type { Strava } from '~/types/strava';
import { z } from 'zod'

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, z.object({
    access_token: z.string(),
    size: z.string()
  }).parse);

  const params = await getValidatedRouterParams(event, z.object({
    id: z.string()
  }).parse);

  // TODO: How to make this 1024 dynamic?
  const photos = await $fetch<Strava.ActivityPhotos<'1024'>>(
    useRuntimeConfig().stravaApiUrl + `/activities/${params.id}/photos`,
    {
      query: {
        'size': query.size
      },
      headers: {
        'Authorization': 'Bearer ' + query.access_token
      }
    }
  )

  return photos;
})