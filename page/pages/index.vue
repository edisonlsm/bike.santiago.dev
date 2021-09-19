<template>
  <div>
    {{ strava.stats }}
  </div>
</template>

<script>
export default {
  async asyncData ({ $axios }) {
    const strava = await $axios.$get('https://santiago-bike-stats.santiago.workers.dev/')

    return { strava }
  }
}
</script>
