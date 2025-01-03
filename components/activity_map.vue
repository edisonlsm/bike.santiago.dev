<template>
  <ClientOnly>
    <LMap
      ref="map"
      :use-global-leaflet="false"
      @ready="onMapReady"
      @vue:updated="onMapReady"
      class="z-0"
    >
      <LPolyline :lat-lngs="activity.latLngTuples" color="#FC4C02">

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
import type { LatLngTuple } from '@googlemaps/polyline-codec';
import type { Strava } from '../types/strava';

const props = defineProps<{
  activity: Strava.Activity
}>()

const map = ref<{
  leafletObject: L.Map
} | null>(null)

const onMapReady = async () => {
  if (map.value) {
    const leafMap = map.value!.leafletObject;

    leafMap.zoomControl.remove()

    const bounds = getActivityBounds(props.activity);

    leafMap.fitBounds(bounds, { padding: [16, 16] });
  }
}

function getActivityBounds(activity: Strava.Activity) {
  const lats = activity.latLngTuples.map((t) => t[0]);
    const lngs = activity.latLngTuples.map((t) => t[1]);

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