import { z } from "zod";

// ==========================================
// 5. API REQUESTS
// ==========================================

/**
 * Authentication schema (Internal use)
 */
export const AuthSchema = z.object({
	login: z.string(),
	tranKey: z.string(),
	nonce: z.string(),
	seed: z.string(),
});

export type PlacetopayAuth = z.infer<typeof AuthSchema>;
