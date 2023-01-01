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

<script setup>
import { DateTime } from 'luxon'
const props = defineProps({
    activity: {
        type: Object,
        required: true
    }
})

const activityDateAndTime = computed(() => {
  const dateTime = DateTime.fromISO(props.activity.start_date)
  const date = dateTime.toFormat('dd/MM/yyyy')
  const time = dateTime.toFormat('HH:mm')

  return `${date} ${time}`
})
</script>