import { z } from "zod";
import { AmountSchema } from "../common/amount";
import { NameValuePairSchema } from "../common/fields";

/**
 * Request to create a new Payment Link
 */
export const CreatePaymentLinkRequestSchema = z.object({
	name: z.string().min(1).describe("Name associated with the payment link"),
	description: z.string().min(1).max(250).nullish().optional(),
	reference: z.string().min(1).max(32),
	expirationDate: z.string().describe("ISO 8601 or YYYY-MM-DD HH:mm:ss"),
	paymentExpiration: z
		.number()
		.int()
		.positive()
		.describe("Minutes allowed to complete session"),
	payment: z.object({
		amount: AmountSchema,
		modifiers: z.array(z.any()).optional(),
	}),
	notificationUrl: z.string().url().optional(),
	locale: z.enum(["en", "es", "pt", "it", "fr"]).default("es"),
	paymentsAllowed: z
		.number()
		.int()
		.optional()
		.describe("Unlimited if not sent"),
	paymentMethod: z.array(z.string()).optional().describe('Ex: ["pse", "visa"]'),
	receiverEmails: z.array(z.string().email()).optional(),
	additional: z.array(NameValuePairSchema).optional(),
	isGeneric: z.boolean().default(false),
});

export type CreatePaymentLinkRequest = z.infer<
	typeof CreatePaymentLinkRequestSchema
>;
