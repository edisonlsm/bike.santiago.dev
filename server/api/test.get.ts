export default defineEventHandler(async (event) => {
  console.log(Object.keys(event.context));
  console.log(Object.keys(useRuntimeConfig(event)));
  return {
    hello: 'world',
    keys: Object.keys(event.context)
  }
})