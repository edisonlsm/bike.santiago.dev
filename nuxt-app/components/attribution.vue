<template>
  <footer class="fixed bottom-0 left-0 flex flex-col items-start">
    <PoweredByStravaLogo class="inline-block h-12 text-white fill-current" />
    <span class="inline-block text-xs bg-white bg-opacity-50 p-1">© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong></span>
  </footer>
</template>

<script setup>
import PoweredByStravaLogo from '~/assets/powered_by_strava.svg?component'
</script>