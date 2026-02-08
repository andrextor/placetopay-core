import { z } from "zod";
import { AmountSchema } from "../common/amount";
import { StatusSchema } from "../common/status";

export const GatewayInformationResponseSchema = z.object({
	status: StatusSchema,
	provider: z.string().nullish(),
	serviceCode: z.string().nullish(),
	cardType: z.string().nullish(),
	requireOtp: z.boolean().nullish(),
	requireCvv2: z.boolean().nullish(),
	threeDS: z
		.union([z.enum(["optional", "required", "unsupported"]), z.string()])
		.nullish(),
	bankList: z
		.array(
			z.object({
				code: z.string(),
				description: z.string(),
			}),
		)
		.nullish(),
});

// --- Unified Transaction Response (/process, /query, /collect) ---
export const GatewayTransactionResponseSchema = z.object({
	status: StatusSchema,
	internalReference: z.union([z.number(), z.string()]).nullish(),
	reference: z.string().nullish(),
	paymentMethod: z.string().nullish(),
	franchise: z.string().nullish(),
	franchiseName: z.string().nullish(),
	issuerName: z.string().nullish(),
	amount: AmountSchema.nullish(),
	authorization: z.string().nullish(),
	receipt: z.string().nullish(),
	type: z.string().nullish(),
	refunded: z.boolean().nullish().default(false),
	lastDigits: z.string().nullish(),
	processorFields: z.any().nullish(),
});

export type GatewayInformationResponse = z.infer<
	typeof GatewayInformationResponseSchema
>;
export type GatewayTransactionResponse = z.infer<
	typeof GatewayTransactionResponseSchema
>;
