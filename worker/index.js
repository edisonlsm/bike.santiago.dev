/**
 * 
 * @typedef { {
 *  access_token: String,
 *  expires_at: Number,
 *  refresh_token: String
 * } StravaToken }
 */

let current_access_token = undefined

const STRAVA_API_URL = 'https://www.strava.com/api/v3'

const CLIENT_ID = '71038'

const ATHLETE_ID = '23428282'

async function getStravaLongestActivity() {
  const activityId = await BIKE_STATS.get('longest_ride_id')

  if (!activityId) {
    return undefined
  }

  const stravaAccessToken = await getStravaAccessToken()

  const activitiesURL = STRAVA_API_URL + `/activities/${activityId}`

  const response = await fetch(activitiesURL, {
    headers: {
      'Authorization': `Bearer ${stravaAccessToken}`
    }
  })

  const responseJson = await response.json()

  return responseJson
}

async function getStravaLastActivity() {
  const stravaAccessToken = await getStravaAccessToken()

  // Since we only want the last activity we can set per_page to 1...
  const activitiesURL = STRAVA_API_URL + '/athlete/activities?per_page=1'
  
  const response = await fetch(activitiesURL, {
    headers: {
      'Authorization': `Bearer ${stravaAccessToken}`
    }
  })

  const responseJson = await response.json()

  // The response is an array, but since we only want the first object...
  return responseJson[0]
}

async function getStravaStats() {
  const stravaAccessToken = await getStravaAccessToken()

  const statsURL = STRAVA_API_URL + `/athletes/${ATHLETE_ID}/stats`

  const response = await fetch(statsURL, {
    headers: {
      'Authorization': `Bearer ${stravaAccessToken}`
    }
  })

  const responseJson = await response.json()

  return responseJson
}

async function getStravaProfile() {
  const stravaAccessToken = await getStravaAccessToken()

  const statsURL = STRAVA_API_URL + '/athlete'

  const response = await fetch(statsURL, {
    headers: {
      'Authorization': `Bearer ${stravaAccessToken}`
    }
  })

  const responseJson = await response.json()

  return responseJson
}

// Get Strava Auth Token
async function getStravaAccessToken() {
  // Cache the current access token in memory
  if (current_access_token) {
    return current_access_token
  }

  // To simplify this code, we added the "first" auth info from oauth2 manually into KV
  // So all we have to do now is refresh the token if needed =)

  /** @type { StravaToken } */
  const authInfo = await BIKE_STATS.get('strava_token', { type: "json" })

  const now = new Date()
  const expiresAt = new Date(authInfo.expires_at * 1000)

  const tokenTtl = expiresAt - now

  if (tokenTtl > 3600000) {
    // Token still has more than one hour to live, so use it
    current_access_token = authInfo.access_token
    return authInfo.access_token
  }
  else {
    // Refresh the token
    let oAuthUrl = new URL('https://www.strava.com/oauth/token')

    oAuthUrl.searchParams.append('client_id', CLIENT_ID)

    const client_secret = await BIKE_STATS.get('strava_client_secret')

    oAuthUrl.searchParams.append('client_secret', client_secret)

    oAuthUrl.searchParams.append('grant_type', 'refresh_token')

    oAuthUrl.searchParams.append('refresh_token', authInfo.refresh_token)

    const oAuthUrlStr = oAuthUrl.toString()

    const response = await fetch(oAuthUrlStr, { method: 'POST' })
    
    /** @type { StravaToken } */
    const newAuthInfo = await response.json()
    
    const newAuthString = JSON.stringify(newAuthInfo)
    
    // Write the new credentials at KV
    await BIKE_STATS.put('strava_token', newAuthString)

    current_access_token = newAuthInfo.access_token
    return newAuthInfo.access_token
  }
}

/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  const profile = await getStravaProfile()

  const stats = await getStravaStats()

  const lastActivity = await getStravaLastActivity()

  const longestActivity = await getStravaLongestActivity()

  const stravaData = {
    profile,
    stats,
    lastActivity,
    longestActivity
  }

  const stravaDataStr = JSON.stringify(stravaData)

  return new Response(stravaDataStr, {
    headers: { 'content-type': 'application/json' },
  })
}

// Default worker handler
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})