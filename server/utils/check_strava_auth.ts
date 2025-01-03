export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  if (!query.access_token) {
    console.log('Missing access token!!')
    throw createError({
      status: 400,
      message: "Missing required parameters!"
    })
  }
})