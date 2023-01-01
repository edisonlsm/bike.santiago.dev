<template>
  <div>
    <a :href="'https://www.strava.com/activities/' + activity.id" target="_blank" class="hover:underline">
      <span class="block w-full font-bold text-xl">
        {{ activity.name }}
      </span>
    </a>
    <span class="block pt-2 w-full">
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

<script setup>
const props = defineProps({
    activity: {
        type: Object,
        required: true
    }
})

const activityDistance = computed(() => {
  const meters = props.activity.distance
  const km = (meters / 1000).toFixed(2)
  const formatter = new Intl.NumberFormat({ useGrouping: true, minimumFractionDigits: 0, maximumFractionDigits: 0 })
  return `${formatter.format(km)}`
})
const activityClimbMeters = computed (() => {
  const meters = props.activity.total_elevation_gain
  const formatter = new Intl.NumberFormat({ useGrouping: true, minimumFractionDigits: 0, maximumFractionDigits: 0 })
  return `${formatter.format(meters)}`
})
</script>