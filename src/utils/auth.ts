import { createHash, randomBytes } from "node:crypto";
import type { PlacetopayAuth } from "../schemas";

/**
 * Generates a fresh set of authentication credentials required by
 */
export function generateAuth(login: string, secretKey: string): PlacetopayAuth {
	const seed = new Date().toISOString();
	const rawNonce = randomBytes(16).toString("hex");
	const nonce = Buffer.from(rawNonce).toString("base64");
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
