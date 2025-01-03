<template>
  <StatsCard class="w-full sm:w-fit">
    <StravaAthlete :athlete="athlete" />

    <button class="mt-3 text-strava-orange text-sm" @click="isShowingAthleteStats = !isShowingAthleteStats">
      {{ isShowingAthleteStats ? $t('stats.hide') : $t('stats.show') }}
    </button>

    <div class="general-stats overflow-hidden" :class="isShowingAthleteStats ? 'max-h-96' : 'max-h-0'">
      <GeneralStats class="pt-4 " :title="$t('headings.this_year')" :stat="athleteStats.ytd_ride_totals" />
      <GeneralStats class="pt-2" :title="$t('headings.all_time')" :stat="athleteStats.all_ride_totals" />
    </div>
  </StatsCard>
</template>

<script setup lang="ts">
import type { Strava } from '~/types/strava';

const props = defineProps<{
  athlete: Strava.Athlete,
  athleteStats: Strava.AthleteStats
}>()

const isShowingAthleteStats = ref(false);
</script>

<style lang="pcss">
.general-stats {
  transition: max-height 0.25s linear;
}
</style>