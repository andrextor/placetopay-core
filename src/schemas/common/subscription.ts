import { z } from "zod";
import { NameValuePairSchema } from "./fields";

/**
 * SubscriptionRequestSchema
 * Used to generate a subscription session where the user registers a payment method
 */
export const SubscriptionRequestSchema = z.object({
	reference: z
		.string()
		.max(64)
		.describe("Unique reference for the subscription tokenization"),
	description: z
		.string()
		.max(255)
		.describe("Description of the subscription purpose"),
	fields: z
		.array(NameValuePairSchema)
		.optional()
		.describe("Custom additional information for the session"),
});

export type SubscriptionRequest = z.infer<typeof SubscriptionRequestSchema>;
