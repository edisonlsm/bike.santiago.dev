<template>
  <div class="flex flex-col items-start w-full sm:w-auto">
    <PoweredByStravaLogo class="inline-block h-8 sm:h-12 text-white fill-current" />
    <span class="inline-block text-xxs bg-white bg-opacity-50 p-1">© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong></span>
  </div>
</template>

<script setup lang="ts">
import PoweredByStravaLogo from '~/assets/powered_by_strava.svg?component'
</script>