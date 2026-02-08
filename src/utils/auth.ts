import { createHash, randomBytes } from "node:crypto";
import type { PlacetopayAuth } from "../schemas";

/**
 * Generates a fresh set of authentication credentials required by
 */
export function generateAuth(login: string, secretKey: string): PlacetopayAuth {
	const seed = new Date().toISOString();

	// Generate a random 16-byte nonce
	const rawNonce = randomBytes(16).toString("hex");

	// Nonce must be Base64 encoded for the JSON payload
	const nonce = Buffer.from(rawNonce).toString("base64");

	// Create the tranKey: SHA1(rawNonce + seed + secretKey)
	const tranKey = createHash("sha1")
		.update(rawNonce + seed + secretKey)
		.digest("base64");

	return {
		login,
		tranKey,
		nonce,
		seed,
	};
}
