import { z } from "zod";
import { PaymentRequestSchema } from "../common/payment";
import { PersonSchema } from "../common/person";
import { StatusSchema } from "../common/status";

// --- A. Create Session Response ---
export const CreateSessionResponseSchema = z.object({
	status: StatusSchema,
	requestId: z.number().nullish(),
	processUrl: z.string().nullish(),
});

// --- B. Transaction Response (Detalle del pago) ---
export const TransactionResponseSchema = z.object({
	status: StatusSchema,
	internalReference: z.union([z.number(), z.string()]).nullish(),
	paymentMethod: z.string().nullish(),
	paymentMethodName: z.string().nullish(),
	issuerName: z.string().nullish(),
	amount: z
		.object({
			from: z.object({ currency: z.string(), total: z.number() }),
			to: z.object({ currency: z.string(), total: z.number() }),
			factor: z.number(),
		})
		.nullish(),
	authorization: z.string().nullish(),
	reference: z.string().nullish(),
	receipt: z.string().nullish(),
	franchise: z.string().nullish(),
	refunded: z.boolean().default(false).nullish(),
	processorFields: z.array(z.any()).nullish(),
});

// --- C. Get Session Information ---
export const RedirectInformationSchema = z.object({
	requestId: z.number().nullish(),
	status: StatusSchema,
	request: z
		.object({
			locale: z.string().nullish(),
			payer: PersonSchema.nullish(),
			buyer: PersonSchema.nullish(),
			payment: PaymentRequestSchema.nullish(),
			fields: z.array(z.any()).nullish(),
			returnUrl: z.string().nullish(),
			ipAddress: z.string().nullish(),
			userAgent: z.string().nullish(),
			expiration: z.string().nullish(),
		})
		.nullish(),
	payment: z.array(TransactionResponseSchema).nullish(),
	subscription: z.any().nullish(),
});

/**
 * CollectResponseSchema
 */
export const CollectResponseSchema = z.object({
	requestId: z.number().nullish(),
	status: StatusSchema,
	request: z.any().nullish(),
	payment: z.array(TransactionResponseSchema).nullish(),
	subscription: z.any().nullish(),
});

export type CollectResponse = z.infer<typeof CollectResponseSchema>;
export type CreateSessionResponse = z.infer<typeof CreateSessionResponseSchema>;
export type RedirectInformation = z.infer<typeof RedirectInformationSchema>;
