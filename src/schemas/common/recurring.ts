import { z } from "zod";

export const RecurringSchema = z.object({
	periodicity: z
		.enum(["D", "M", "Y", "W"])
		.describe("D=Day, W=Week, M=Month, Y=Year"),
	interval: z.number().int().min(1),
	nextPayment: z.string().describe("Next payment date (YYYY-MM-DD)"),
	maxPeriods: z.number().int().min(-1),
	dueDate: z.string().optional(),
	startDate: z
		.string()
		.optional()
		.describe("Informative start date (YYYY-MM-DD)"),
});

export type Recurring = z.infer<typeof RecurringSchema>;
