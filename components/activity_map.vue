<template>
  <ClientOnly>
    <LMap
      ref="map"
      :use-global-leaflet="false"
      @ready="onMapReady"
      class="z-0"
    >
      <LPolyline :lat-lngs="coordinates" color="#FC4C02">

      </LPolyline>
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
    leafMap.fitBounds(bounds, { padding: [16, 16] });
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