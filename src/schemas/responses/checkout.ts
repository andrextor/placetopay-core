import { z } from "zod";
import { NameValuePairSchema } from "../common/fields";
import { PaymentRequestSchema } from "../common/payment";
import { PersonSchema } from "../common/person";
import { StatusSchema } from "../common/status";
// Importación corregida si es necesario
// import { SubscriptionRequestSchema } from "../common/subscription"

// --- A. Create Session Response ---
export const CreateSessionResponseSchema = z.object({
	status: StatusSchema,
	requestId: z.number().nullish(), // Más flexible
	processUrl: z.string().nullish(), // A veces no hay URL si falla la creación
});

// --- B. Transaction Response (Detalle del pago) ---
export const TransactionResponseSchema = z.object({
	status: StatusSchema,
	// PlacetoPay a veces devuelve esto como string en ciertos microservicios
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
		.nullish(), // Permite null o undefined
	authorization: z.string().nullish(),
	reference: z.string().nullish(),
	receipt: z.string().nullish(),
	franchise: z.string().nullish(),
	refunded: z.boolean().default(false).nullish(),
	// NameValuePairSchema puede ser estricto, mejor permitir que sea opcional
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
		.nullish(), // Toda la información del request original podría faltar
	payment: z.array(TransactionResponseSchema).nullish(),
	subscription: z.any().nullish(),
});

/**
 * CollectResponseSchema
 */
export const CollectResponseSchema = z.object({
	requestId: z.number().nullish(),
	status: StatusSchema,
	request: z.any().nullish(), // Muy flexible para evitar roturas
	payment: z.array(TransactionResponseSchema).nullish(),
	subscription: z.any().nullish(),
});

export type CollectResponse = z.infer<typeof CollectResponseSchema>;
export type CreateSessionResponse = z.infer<typeof CreateSessionResponseSchema>;
export type RedirectInformation = z.infer<typeof RedirectInformationSchema>;
