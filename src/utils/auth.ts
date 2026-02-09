import type { PlacetopayAuth } from "../schemas";

/**
 * Genera el objeto de autenticación para Placetopay
 * Fórmula: tranKey = Base64(SHA-256(nonce + seed + secretKey))
 */
export async function generateAuth(
	login: string,
	secretKey: string,
): Promise<PlacetopayAuth> {
	const nonceValues = new Uint8Array(16);
	crypto.getRandomValues(nonceValues);

	const nonceBase64 = arrayBufferToBase64(nonceValues);

	// 2. Generar Seed (Fecha ISO 8601 actual)
	const seed = new Date().toISOString();

	const rawNonce = getRandomString(16);
	const nonceToSend = btoa(rawNonce);

	const msg = rawNonce + seed + secretKey;

	const encoder = new TextEncoder();
	const data = encoder.encode(msg);
	const hashBuffer = await crypto.subtle.digest("SHA-256", data);

	// 5. Convertir el hash a Base64
	const tranKey = arrayBufferToBase64(hashBuffer);

	return {
		login,
		tranKey,
		nonce: nonceToSend,
		seed,
	};
}

function arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
	let binary = "";
	const bytes = new Uint8Array(buffer);
	const len = bytes.byteLength;
	for (let i = 0; i < len; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	return btoa(binary);
}

function getRandomString(length: number): string {
	const array = new Uint8Array(length);
	crypto.getRandomValues(array);
	return Array.from(array)
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
}
