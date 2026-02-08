import { z } from "zod";

// ==========================================
// 2. PERSONAL INFORMATION
// ==========================================

export const AddressSchema = z.object({
	street: z.string().optional(),
	city: z.string().optional(),
	state: z.string().optional(),
	postalCode: z.string().optional(),
	country: z
		.string()
		.length(2)
		.optional()
		.describe("ISO 3166-1 alpha-2 (e.g. CO, US)"),
	phone: z.string().optional(),
});

export type Address = z.infer<typeof AddressSchema>;
