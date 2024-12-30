# bike.santiago.dev

A better visualization of **my** Strava cycling data, with yearly/general stats and the longest and last activity!

- Built with Nuxt 3 and deployed on Cloudflare Pages.
- Full static, generated once a day.
- Maps provided by OSM (via Leaflet)!

## Setup

- Create an app on [Strava Developer Portal](https://developers.strava.com/docs/getting-started/#account)
- Make the first OAuth authentication to the Strava API [following their documentation](https://developers.strava.com/docs/getting-started/#oauth)
- Save STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET and the STRAVA_REFRESH_TOKEN returned from the OAuth request on the environment.
- Run `npm run generate` ✨
