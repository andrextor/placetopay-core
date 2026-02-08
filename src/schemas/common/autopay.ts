import { z } from "zod";
import { AmountSchema } from "../common/amount";

/**
 * AutopayRecurring Schema
 * Defines the recurrence conditions for the Autopay
 */
export const AutopayRecurringSchema = z.object({
	type: z
		.enum(["FIXED", "VARIABLE"])
		.describe("Type of charge: FIXED amount or VARIABLE amount"),
	periodicity: z.enum(["D", "M", "Y"]),
	interval: z.number().int().min(1),
	nextPayment: z.string().describe("YYYY-MM-DD"),
	maxPeriods: z.number().int().min(-1),
	dueDate: z.string().optional(),
});

/**
 * AutopayRequest Schema
 * Used when 'type' is 'autopay' to register or edit automatic charges.
 */
export const AutopayRequestSchema = z
	.object({
		action: z
			.enum(["CREATE", "EDIT"])
			.describe("Action to perform: CREATE or EDIT"),
		reference: z.string().max(64).describe("Unique reference for the autopay"),
		description: z.string().max(255).describe("Purpose of the autopay"),

		// Required if action is EDIT
		id: z
			.string()
			.uuid()
			.optional()
			.describe("Autopay ID, required for EDIT action"),

		dueDay: z
			.number()
			.int()
			.min(1)
			.max(28)
			.optional()
			.describe("Informing the cut-off day (1-28)"),

		recurring: AutopayRecurringSchema,
		amount: AmountSchema.optional().describe(
			"Fixed amount to charge in each recurrence",
		),
	})
	.superRefine((data, ctx) => {
		if (data.action === "EDIT" && !data.id) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Autopay 'id' is required when action is 'EDIT'",
				path: ["id"],
			});
		}

		if (data.recurring?.type === "FIXED" && !data.amount) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Amount is required when recurring type is 'FIXED'",
				path: ["amount"],
			});
		}
	});

export type AutopayRequest = z.infer<typeof AutopayRequestSchema>;
