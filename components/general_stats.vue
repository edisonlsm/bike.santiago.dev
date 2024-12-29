<template>
  <div class="w-full sm:w-auto">
    <span class="mb-2 text-strava-orange text-lg font-bold">
      {{ title }}
    </span>
    <p class="text-base">
      {{ $t('stats.stayed') }}
      <span class="font-bold">{{ statHours }}</span>
      {{ $t('stats.on_top_bicycle') }}
    </p>
    <p class="text-base">
      {{ $t('stats.ride') }}
      <span class="font-bold">{{ statKms }}</span>
      {{ $t('stats.kilometers') }}
    </p>
    <p class="text-base">
      {{ $t('stats.climbed') }}
      <span class="font-bold">{{ statClimbedMeters }}</span>
      {{ $t('stats.meters') }}
    </p>
  </div>
</template>

<script setup lang="ts">
  import type { Strava } from '../types/strava';
  import { Duration } from 'luxon'

const props = defineProps<{
  title: string,
  stat: Strava.Stats
}>()

const statHours = computed(() => {
  const seconds = props.stat.moving_time
  const duration = Duration.fromObject({ seconds })
  const formattedDuration = duration.toFormat('d h m')
  const values = formattedDuration.split(' ')
  return `${values[0]} d, ${values[1]} h, ${values[2]} min`
})
const statKms = computed(() => {
  const meters = props.stat.distance
  const km = meters / 1000
  const formatter = new Intl.NumberFormat('pt-BR', { useGrouping: true, minimumFractionDigits: 0, maximumFractionDigits: 0 })
  return `${formatter.format(km)}`
})
const statClimbedMeters = computed(() => {
  const meters = props.stat.elevation_gain
  const formatter = new Intl.NumberFormat('pt-BR', { useGrouping: true, minimumFractionDigits: 0, maximumFractionDigits: 0 })
  return `${formatter.format(meters)}`
})
</script>