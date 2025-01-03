<template>
  <StatsCard class="w-full sm:w-auto sm:pr-8">
    <div
      class="w-full sm:w-auto flex flex-row sm:flex-col justify-around sm:justify-start items-center sm:items-start space-x-8 sm:space-x-0 space-y-0 sm:space-y-2">
      <div>
        <span class="block text-strava-orange text-lg font-bold">
          {{ isShowingLastActivity ? $t('headings.last_ride') : $t('headings.longest_ride') }}
        </span>
        <RideGeneralStats :activity="activity" />
      </div>
      <div class="">
        <RideEffortStats :activity="activity" />
      </div>
    </div>
  </StatsCard>
</template>

<script setup lang="ts">
import type { Strava } from '../types/strava';

const props = defineProps<{
  activity: Strava.Activity,
  isShowingLastActivity: boolean
}>()
</script>