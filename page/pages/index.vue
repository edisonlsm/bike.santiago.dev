<template>
  <div class="h-full">
    <header class="m-8 w-full md:w-1/2 text-lg">
      <span class="block">{{ $t('intro.one') }}</span>
      <span class="block pt-2">{{ $t('intro.two') }}</span>
    </header>

    <div class="m-8 flex justify-start items-center">
      <img src="https://dgalywyr863hv.cloudfront.net/pictures/athletes/23428282/9877134/6/large.jpg" class="rounded-full">
      <StravaIcon class="h-12 w-12 text-strava-orange ml-2 fill-current" />
      <div class="flex flex-col items-start">
        <p class="text-2xl">
          Edison Santiago
        </p>
        <a
          href="https://www.strava.com/athletes/23428282"
          class="text-strava-orange text-lg"
        >
          {{ $t('intro.add_strava') }}
        </a>
      </div>
    </div>

    <div class="flex justify-start">
      <div class="m-8 w-full md:w-auto">
        <span class="mb-2 text-strava-orange text-2xl font-bold">
          {{ $t('headings.this_year') }}
        </span>
        <p class="text-xl">
          {{ $t('stats.stayed') }}
          <span class="font-bold">{{ thisYearHours }}</span>
          {{ $t('stats.on_top_bicycle') }}
        </p>
        <p class="text-xl">
          {{ $t('stats.ride') }}
          <span class="font-bold">{{ thisYearKms }}</span>
          {{ $t('stats.kilometers') }}
        </p>
        <p class="text-xl">
          {{ $t('stats.climbed') }}
          <span class="font-bold">{{ thisYearClimbMeters }}</span>
          {{ $t('stats.meters') }}
        </p>
      </div>

      <div class="m-8 w-full md:w-auto">
        <span class="mb-2 text-strava-orange text-2xl font-bold">
          {{ $t('headings.all_time') }}
        </span>
        <p class="text-xl">
          {{ $t('stats.stayed') }}
          <span class="font-bold">{{ allTimeHours }}</span>
          {{ $t('stats.on_top_bicycle') }}
        </p>
        <p class="text-xl">
          {{ $t('stats.ride') }}
          <span class="font-bold">{{ allTimeKms }}</span>
          {{ $t('stats.kilometers') }}
        </p>
        <p class="text-xl">
          {{ $t('stats.climbed') }}
          <span class="font-bold">{{ allTimeClimbMeters }}</span>
          {{ $t('stats.meters') }}
        </p>
      </div>
    </div>

    <div class="m-8">
      <span class="mb-2 text-strava-orange text-2xl font-bold">
        {{ $t('headings.last_ride') }}
      </span>
      <img
        :src="lastActivityStaticGoogleMap"
        class="w-80 h-80"
      >
      <span class="block pt-2 w-full">
        {{ strava.lastActivity.name }}
      </span>
      <span class="block pt-2 w-full">
        Distância:
        <span class="font-bold text-strava-orange">
          {{ lastActivityDistance }}km
        </span>
      </span>
      <span class="block pt-2 w-full">
        Ganho de Elevação:
        <span class="font-bold text-strava-orange">
          {{ lastActivityClimbMeters }}m
        </span>
      </span>
    </div>

    <footer class="fixed bottom-2 right-2 h-12 flex justify-end">
      <PoweredByStravaLogo />
    </footer>
  </div>
</template>

<script>
import * as crypto from 'crypto';
import * as url from 'url';
import { Duration } from 'luxon'

import StravaIcon from '~/assets/strava.svg?inline'
import PoweredByStravaLogo from '~/assets/powered_by_strava.svg?inline'

export default {
  components: {
    StravaIcon,
    PoweredByStravaLogo
  },
  async asyncData ({ $axios }) {
    const strava = await $axios.$get('https://santiago-bike-stats.santiago.workers.dev/')

    return { strava }
  },
  computed: {
    thisYearHours () {
      const seconds = this.strava.stats.ytd_ride_totals.moving_time

      const duration = Duration.fromObject({ seconds })

      const formattedDuration = duration.toFormat('d h m')
      const values = formattedDuration.split(' ')

      return `${values[0]} d, ${values[1]} h, ${values[2]} min`
    },
    thisYearKms () {
      const meters = this.strava.stats.ytd_ride_totals.distance
      const km = Math.floor(meters / 1000)
      const formatter = new Intl.NumberFormat({ useGrouping: true, minimumFractionDigits: 0, maximumFractionDigits: 0 })

      return `${formatter.format(km)}`
    },
    thisYearClimbMeters () {
      const meters = this.strava.stats.ytd_ride_totals.elevation_gain
      const formatter = new Intl.NumberFormat({ useGrouping: true, minimumFractionDigits: 0, maximumFractionDigits: 0 })

      return `${formatter.format(meters)}`
    },

    allTimeHours () {
      const seconds = this.strava.stats.all_ride_totals.moving_time

      const duration = Duration.fromObject({ seconds })

      const formattedDuration = duration.toFormat('d h m')
      const values = formattedDuration.split(' ')

      return `${values[0]} d, ${values[1]} h, ${values[2]} min`
    },
    allTimeKms () {
      const meters = this.strava.stats.all_ride_totals.distance
      const km = Math.floor(meters / 1000)
      const formatter = new Intl.NumberFormat({ useGrouping: true, minimumFractionDigits: 0, maximumFractionDigits: 0 })

      return `${formatter.format(km)}`
    },
    allTimeClimbMeters () {
      const meters = this.strava.stats.all_ride_totals.elevation_gain
      const formatter = new Intl.NumberFormat({ useGrouping: true, minimumFractionDigits: 0, maximumFractionDigits: 0 })

      return `${formatter.format(meters)}`
    },

    lastActivityStaticGoogleMap () {
      const API_KEY = 'AIzaSyDDonBQFoIfn2oXn9DvTiDn_7O-MTSEt4A'

      let mapPolyline = this.strava.lastActivity.map.summary_polyline
      mapPolyline = mapPolyline.replace('\\\\', '\\')

      const mapUrl = new URL('https://maps.googleapis.com/maps/api/staticmap')

      mapUrl.searchParams.append('size', '1000x1000')
      mapUrl.searchParams.append('maptype', 'roadmap')
      mapUrl.searchParams.append('path', `color:0xFC4C02FF|weight:5|enc:${mapPolyline}`)
      mapUrl.searchParams.append('key', API_KEY)

      console.log(this.strava.lastActivity.map.summary_polyline)
      console.log(mapPolyline)

      // const urlToSign = mapUrl.toString()
      // const secret = 'gMlsEMszpzJMHqMkj2cjkpevhR4='

      // const signedUrl = this.signGoogleMapsUri(urlToSign, secret)

      return mapUrl.toString()
    },

    lastActivityDistance () {
      const meters = this.strava.lastActivity.distance
      const km = (meters / 1000).toFixed(2)
      const formatter = new Intl.NumberFormat({ useGrouping: true, minimumFractionDigits: 0, maximumFractionDigits: 0 })

      return `${formatter.format(km)}`
    },

    lastActivityClimbMeters () {
      const meters = this.strava.lastActivity.total_elevation_gain

      const formatter = new Intl.NumberFormat({ useGrouping: true, minimumFractionDigits: 0, maximumFractionDigits: 0 })

      return `${formatter.format(meters)}`
    }
  },
  methods: {
    /**
     * Takes a key and signs the data with it.
     *
     * @param  {string} key  Your unique secret key.
     * @param  {string} data The url to sign.
     * @return {string}
     */
    encodeBase64Hash (key, data) {
      return crypto.createHmac('sha1', key).update(data).digest('base64')
    },

    /**
     * Sign a URL using a secret key.
     *
     * @param  {string} path   The url you want to sign.
     * @param  {string} secret Your unique secret key.
     * @return {string}
     */
    signGoogleMapsUri (path, secret) {
      const uri = new URL(path)
      const dataToEncode = `${uri.pathname}?${uri.searchParams.toString()}`
      const safeSecret = Buffer.from(secret, 'base64')
      const hashedSignature = this.encodeBase64Hash(safeSecret, dataToEncode)
      return uri.toString() + '&signature=' + hashedSignature
    }
  }
}
</script>

<style>
html, body, #__nuxt, #__layout {
  min-height: 100%;
}

* {
  font-family: 'Roboto';
}
</style>

<i18n>
{
  "en": {
    "intro": {
      "one": "Hi, I'm Edison Santiago and I really like cycling!",
      "two": "I also like statistics, so I assembled this here so I can see all the stats that matter to me at one place :)",
      "add_strava": "Add on Strava"
    },
    "headings": {
      "all_time": "Since July 2017, I:",
      "this_year": "This year, I:",
      "last_ride": "Last ride:"
    },
    "stats": {
      "stayed": "stayed",
      "on_top_bicycle": "on top of the bicycle",
      "ride": "ride",
      "kilometers": "kilometers",
      "climbed": "climbed",
      "meters": "meters"
    }
  },
  "br": {
    "intro": {
      "one": "Olá! Me chamo Edison Santiago e eu realmente gosto de pedalar!",
      "two": "Eu também gosto de estatísticas, então montei esta página para que eu possa ver todas as estatísticas relevantes em um lugar só :)",
      "add_strava": "Adicionar no Strava"
    },
    "headings": {
      "all_time": "Desde Julho de 2017, eu:",
      "this_year": "Neste ano, eu já:",
      "last_ride": "Último pedal:"
    },
    "stats": {
      "stayed": "fiquei",
      "on_top_bicycle": "em cima da bicicleta",
      "ride": "pedalei",
      "kilometers": "quilômetros",
      "climbed": "subi",
      "meters": "metros"
    }
  }
}
</i18n>
