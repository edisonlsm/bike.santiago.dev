<template>
  <div class="pt-2">
    <a :href="'https://www.strava.com/activities/' + activity.id" target="_blank" class="hover:underline">
      <span class="block w-full font-bold text-xl">
        {{ activity.name }}
      </span>
    </a>
    <span class="block w-full text-xs">
      {{ activityDateAndTime }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'

import type { Strava } from '../types/strava';

const props = defineProps<{
  activity: Strava.Activity
}>()

const activityDateAndTime = computed(() => {
  const dateTime = DateTime.fromISO(props.activity.start_date)
  const date = dateTime.toFormat('dd/MM/yyyy')
  const time = dateTime.toFormat('HH:mm')

  return `${date} ${time}`
})
</script>