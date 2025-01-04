<template>
  <ClientOnly>
    <LMap
      ref="map"
      :use-global-leaflet="false"
      @ready="onMapReady"
      class="z-0"
    >
      <LPolyline :lat-lngs="coordinates" color="#FC4C02" />

      <LMarker v-for="photo in activity.photos" :key="photo.unique_id" :lat-lng="photo.location">
        <LIcon class-name="image-icon" :icon-url="photo.urls[1024]" :icon-size="[48, 48]" />
        <LPopup>
          <div class="w-full min-w-64 sm:w-64">
            <img class="rounded-xl" :src="photo.urls[1024]" />
            <span v-if="photo.caption != ''" class="text-lg text-black text-center font-bold break-words">{{ photo.caption }}</span>
          </div>
        </LPopup>
      </LMarker>

      <LTileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
        layer-type="base"
        name="OpenStreetMap"
      />
    </LMap>
  </ClientOnly>
</template>

<script setup lang="ts">
import L from 'leaflet'
import { decode, type LatLngTuple } from '@googlemaps/polyline-codec';
import type { Strava } from '../types/strava';

const props = defineProps<{
  activity: Strava.Activity
}>()

const map = ref<{
  leafletObject: L.Map
} | null>(null)

const coordinates = ref<LatLngTuple[]>(getActivityCoordinates(props.activity))

watch(() => props.activity, (current) => { 
  coordinates.value = getActivityCoordinates(current)
  setMapBoundsWithinCoordinates(coordinates.value)
})

const onMapReady = async () => {
  setMapBoundsWithinCoordinates(coordinates.value)
}

function setMapBoundsWithinCoordinates(coordinates: LatLngTuple[]) {
  if (map.value) {
    const leafMap = map.value!.leafletObject;
    leafMap.zoomControl.remove()
    const bounds = getBoundsForCoordinates(coordinates);
    leafMap.fitBounds(bounds, { padding: [64, 64] });

    // Lock the map for the current view where all the bounds fits
    setTimeout(() => {
      leafMap.setMaxBounds(leafMap.getBounds().pad(0.2))
      leafMap.setMinZoom(leafMap.getZoom())
    }, 1000)
  }
}

function getActivityCoordinates(activity: Strava.Activity) {
  return decode(activity.map.summary_polyline, 5);
}

function getBoundsForCoordinates(coordinates: LatLngTuple[]) {
  const lats = coordinates.map((t) => t[0]);
  const lngs = coordinates.map((t) => t[1]);

  const min: LatLngTuple = [
    Math.min(...lats),
    Math.min(...lngs),
  ];
  const max: LatLngTuple = [
    Math.max(...lats),
    Math.max(...lngs),
  ];
  const bounds = [min, max];
  return bounds;
}
</script>

<style lang="postcss">
.image-icon {
  @apply border-white border-4 rounded-xl opacity-70 hover:opacity-100
}
</style>