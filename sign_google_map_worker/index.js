/**
 * Convert from 'web safe' base64 to true base64.
 *
 * @param  {string} safeEncodedString The code you want to translate
 *                                    from a web safe form.
 * @return {string}
 */
function removeWebSafe(safeEncodedString) {
  return safeEncodedString.replace(/-/g, '+').replace(/_/g, '/');
}

/**
 * Convert from true base64 to 'web safe' base64
 *
 * @param  {string} encodedString The code you want to translate to a
 *                                web safe form.
 * @return {string}
 */
function makeWebSafe(encodedString) {
  return encodedString.replace(/\+/g, '-').replace(/\//g, '_');
}

/**
 * Takes a base64 code and decodes it.
 *
 * @param  {string} code The encoded data.
 * @return {string}
 */
function decodeBase64Hash(code) {
  return atob(code)
}

/**
 * Takes a key and signs the data with it.
 *
 * @param  {string} key  Your unique secret key.
 * @param  {string} data The url to sign.
 * @return {string}
 */
async function encodeBase64Hash(key, data) {
  const encoder = new TextEncoder()
  const secretKeyData = encoder.encode(key)
  const hmacKey = await crypto.subtle.importKey(
    "raw",
    secretKeyData,
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"],
  )

  const hmac = await crypto.subtle.sign("HMAC", hmacKey, encoder.encode(data))

  // `hmac` is an ArrayBuffer, so we need to jump through a couple of hoops to get
  // it into a ByteString, and then a Base64-encoded string.
  const base64Mac = btoa(String.fromCharCode(...new Uint8Array(hmac)))

  return base64Mac
}

/**
 * Sign a URL using a secret key.
 *
 * @param  {string} url   The url you want to sign.
 * @param  {string} secret Your unique secret key.
 * @return {string}
 */
async function sign(url, secret) {
  const uri = new URL(url);
  // const path = uri.pathname + '?' + uri.searchParams.toString();
  const safeSecret = decodeBase64Hash(removeWebSafe(secret));
  
  const dataToEncode = '/maps/api/staticmap?center=40.714%2C+-73.998&zoom=12&size=400x400&key=AIzaSyDDonBQFoIfn2oXn9DvTiDn_7O-MTSEt4A'
  const hashedSignature = await encodeBase64Hash(safeSecret, path);
  const safeHashedSignature = makeWebSafe(hashedSignature)
  return uri.toString() + '&signature=' + hashedSignature;
}

/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  const url = 'https://maps.googleapis.com/maps/api/staticmap?center=40.714%2c%20-73.998&zoom=12&size=400x400&key=AIzaSyDDonBQFoIfn2oXn9DvTiDn_7O-MTSEt4A'

  const secret = 'gMlsEMszpzJMHqMkj2cjkpevhR4='

  const signed_url = await sign(url, secret)

  console.log(signed_url)

  return new Response('Hello worker!', {
    headers: { 'content-type': 'text/plain' },
  })
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})