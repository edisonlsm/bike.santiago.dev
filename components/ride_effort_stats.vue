<template>
  <div>
    <span class="block w-full">
      {{ $t('activity.distance') }}:
      <span class="font-bold text-strava-orange">
        {{ activityDistance }}km
      </span>
    </span>
    <span class="block pt-2 w-full">
      {{ $t('activity.elevation') }}:
      <span class="font-bold text-strava-orange">
        {{ activityClimbMeters }}m
      </span>
    </span>
  </div>
</template>

<script setup lang="ts">
import type { Strava } from '../types/strava';

const props = defineProps<{
  activity: Strava.Activity
}>()

const activityDistance = computed(() => {
  const meters = props.activity.distance
  const km = (meters / 1000)
  const formatter = new Intl.NumberFormat('pt-BR', { useGrouping: true, minimumFractionDigits: 0, maximumFractionDigits: 2 })
  return `${formatter.format(km)}`
})
const activityClimbMeters = computed (() => {
  const meters = props.activity.total_elevation_gain
  const formatter = new Intl.NumberFormat('pt-BR', { useGrouping: true, minimumFractionDigits: 0, maximumFractionDigits: 2 })
  return `${formatter.format(meters)}`
})
</script>