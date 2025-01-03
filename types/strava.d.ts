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
    firstname: string,
    lastname: string,
    profile: string
  }

  export interface Stats {
    count: number,
    distance: number,
    moving_time: number,
    elapsed_time: number,
    elevation_gain: number,
  }

  export interface AthleteStats {
    all_ride_totals: StravaStats,
    ytd_ride_totals: StravaStats
  }

  export interface ActivityMap {
    polyline: string,
    summary_polyline: string,
  }

  export interface Activity {
    name: string,
    id: number,
    start_date: string,
    distance: number,
    total_elevation_gain: number,
    map: StravaActivityMap,
    mapImage?: string,
    latLngTuples: LatLngTuple[],
  }
}

