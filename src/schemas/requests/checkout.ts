import { z } from "zod";
import { AutopayRequestSchema } from "../common/autopay";
import { InstrumentSchema } from "../common/instrument";
import { PaymentRequestSchema } from "../common/payment";
import { PersonSchema } from "../common/person";
import { SubscriptionRequestSchema } from "../common/subscription";

// --- Create Session (Checkout) ---
export const CreateSessionRequestSchema = z.object({
	locale: z.string().default("es_CO"),
	payment: PaymentRequestSchema.optional(),
	subscription: SubscriptionRequestSchema.optional(),
	autopay: AutopayRequestSchema.optional(),
	expiration: z.string().optional().describe("ISO 8601 format"),
	ipAddress: z.string().optional(),
	userAgent: z.string().optional(),
	returnUrl: z.string().url(),
	cancelUrl: z.string().url().optional(),
	buyer: PersonSchema.optional(),
	payer: PersonSchema.optional(),
	skipResult: z.boolean().optional(),
	noBuyerFill: z.boolean().optional(),
});

export const CollectRequestSchema = z.object({
	locale: z.string().default("es_CO"),
	payer: PersonSchema,
	payment: PaymentRequestSchema,
	instrument: InstrumentSchema,
	ipAddress: z.string().optional(),
	userAgent: z.string().optional(),
});

export type CreateSessionRequest = z.infer<typeof CreateSessionRequestSchema>;
export type CollectRequest = z.infer<typeof CollectRequestSchema>;
