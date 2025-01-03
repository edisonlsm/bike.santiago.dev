export default defineEventHandler((event) => {
  throw createError({
    status: 404
  })
})