import { z } from "zod";

// ==========================================
// 4. TRANSACTION DETAILS
// ==========================================

export const ItemSchema = z.object({
	sku: z.string().optional(),
	name: z.string().min(1),
	category: z.string().optional(),
	qty: z.number().int().positive(),
	price: z.number().positive(),
	tax: z.number().nonnegative().optional(),
});

export type Item = z.infer<typeof ItemSchema>;
