import { z } from "zod";
import { AmountSchema } from "../common/amount";
import { StatusSchema } from "../common/status";

// --- Create Payment Link Response ---
export const CreatePaymentLinkResponseSchema = z.object({
	status: StatusSchema,
	id: z.union([z.string(), z.number()]).nullish(),
	url: z.string().nullish(),
});

// --- Query Payment Link Response ---
export const PaymentLinkQueryResponseSchema = z.object({
	id: z.union([z.string(), z.number()]).nullish(),
	status: z
		.union([z.enum(["ACTIVE", "INACTIVE", "EXPIRED"]), z.string()])
		.nullish(),
	url: z.string().nullish(),
	expirationDate: z.string().nullish(),
	name: z.string().nullish(),
	reference: z.string().nullish(),
	description: z.string().nullish(),
	totalPayments: z.number().nullish().default(0),
	availablePayments: z.number().nullish().default(0),
	paymentExpiration: z.number().nullish(),
	amount: AmountSchema.nullish(),
	site: z
		.object({
			id: z.union([z.string(), z.number()]).nullish(),
			name: z.string().nullish(),
		})
		.nullish(),
	isGeneric: z.boolean().nullish().default(false),
	// List of transactions attempted via this link
	payments: z
		.array(
			z.object({
				id: z.union([z.string(), z.number()]).nullish(),
				requestId: z.union([z.string(), z.number()]).nullish(),
				status: z.string().nullish(),
				message: z.string().nullish(),
				amount: z
					.object({
						currency: z.string().nullish(),
						total: z.union([z.string(), z.number()]).nullish(),
					})
					.nullish(),
				paymentMethod: z.string().nullish(),
				paymentDate: z.string().nullish(),
				authorization: z.string().nullish(),
				lastDigits: z.string().nullish(),
			}),
		)
		.nullish()
		.default([]),
});

// --- Disable Payment Link Response ---
export const DisablePaymentLinkResponseSchema = z.object({
	status: StatusSchema,
	id: z.union([z.string(), z.number()]).nullish(),
});

export type CreatePaymentLinkResponse = z.infer<
	typeof CreatePaymentLinkResponseSchema
>;
export type PaymentLinkQueryResponse = z.infer<
	typeof PaymentLinkQueryResponseSchema
>;
export type DisablePaymentLinkResponse = z.infer<
	typeof DisablePaymentLinkResponseSchema
>;
