import type { Strava } from "~/types/strava";

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()

  const response = await $fetch<Strava.TokenResponse>(
    'https://www.strava.com/oauth/token', {
    method: 'POST',
    params: {
      'client_id': runtimeConfig.stravaClientId,
      'client_secret': runtimeConfig.stravaClientSecret,
      'grant_type': 'refresh_token',
      'refresh_token': runtimeConfig.stravaRefreshToken
    }
  })

  return response;
})