import type { PlacetopayAuth } from "../schemas"

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = ""
  const bytes = new Uint8Array(buffer)
  const len = bytes.byteLength
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

/**
 * Genera una cadena hexadecimal aleatoria de forma segura
 */
function getRandomHex(length: number): string {
  const array = new Uint8Array(length)
  const cryptoObj = globalThis.crypto

  if (!cryptoObj) {
    throw new Error(
      "Web Crypto API not available. Use Node.js 19+ or a polyfill."
    )
  }

  cryptoObj.getRandomValues(array)
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

/**
 * Generates a fresh set of authentication credentials using Web Crypto API.
 * Compatible with Browser and Node.js.
 */
export async function generateAuth(
  login: string,
  secretKey: string
): Promise<PlacetopayAuth> {
  const seed = new Date().toISOString()
  const rawNonce = getRandomHex(16)
  const nonce = btoa(rawNonce)
  const msg = rawNonce + seed + secretKey
  const encoder = new TextEncoder()
  const data = encoder.encode(msg)
  const hashBuffer = await globalThis.crypto.subtle.digest("SHA-1", data)
  const tranKey = arrayBufferToBase64(hashBuffer)

  return {
    login,
    tranKey,
    nonce,
    seed,
  }
}
