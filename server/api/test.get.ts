export default defineEventHandler(async (event) => {
  return {
    hello: 'world',
    keys: Object.keys(event.context)
  }
})