import type { LatLngTuple } from "@googlemaps/polyline-codec"

export namespace Strava {
  export interface TokenResponse {
    token_type: string,
    access_token: string,
    expires_at: number,
    expires_in: number,
    refresh_token: string
  }

  export interface Athlete {
    id: number,
    username: string,
    firstname: string,
    lastname: string,
    bio?: string,
    city: string,
    state: string,
    country: string,
    profile_medium: string,
    profile: string
  }

  export interface Stats {
    count: number,
    distance: number,
    moving_time: number,
    elapsed_time: number,
    elevation_gain: number,
    achievement_count?: number
  }

  export interface AthleteStats {
    biggest_ride_distance: number,
    biggest_climb_elevation_gain: number,
    recent_ride_totals: Strava.Stats,
    all_ride_totals: Strava.Stats,
    ytd_ride_totals: Strava.Stats
  }

  export interface ActivityMap {
    polyline: string,
    summary_polyline: string,
  }

  export interface Activity {
    name: string,
    distance: number,
    moving_time: number,
    elapsed_time: number,
    total_elevation_gain: number,
    id: number,
    start_date: string,
    map: Strava.ActivityMap,
  }
}

