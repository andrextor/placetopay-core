import { z } from "zod";

// ==========================================
// 3. FINANCIAL INFORMATION
// ==========================================

export const TaxSchema = z.object({
	kind: z.string().describe("Tax type (e.g. valueAddedTax)"),
	amount: z.number().positive(),
	base: z.number().nonnegative().optional(),
});

export type Tax = z.infer<typeof TaxSchema>;
