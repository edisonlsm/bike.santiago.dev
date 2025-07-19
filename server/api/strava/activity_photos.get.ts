import type { Strava } from '~/types/strava';
import { z } from 'zod'

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, z.object({
    access_token: z.string(),
    size: z.string(),
    activityId: z.string()
  }).parse);

  // TODO: How to make this 1024 dynamic?
  const photos = await $fetch<Strava.ActivityPhotos<'1024'>>(
    useRuntimeConfig().stravaApiUrl + `/activities/${query.activityId}/photos`,
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