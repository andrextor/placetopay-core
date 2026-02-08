import { z } from "zod";
import { InstrumentSchema } from "../common/instrument";
import { PaymentRequestSchema } from "../common/payment";
import { PersonSchema } from "../common/person";

// --- /gateway/information ---
export const GatewayInformationRequestSchema = z.object({
	locale: z.string().default("es_CO"),
	instrument: InstrumentSchema.optional(),
	payment: PaymentRequestSchema.optional(),
	subscription: z.any().optional(),
	metadata: z.record(z.string(), z.any()).optional(),
	ipAddress: z.string().optional(),
	userAgent: z.string().optional(),
});

// --- /gateway/process ---
export const GatewayProcessRequestSchema = z.object({
	locale: z.string().default("es_CO"),
	payer: PersonSchema.optional(),
	buyer: PersonSchema.optional(),
	payment: PaymentRequestSchema,
	instrument: InstrumentSchema,
	idempotenceKey: z.string().max(32).optional(),
	notificationURL: z.string().url().optional(),
	ipAddress: z.string().optional(),
	userAgent: z.string().optional(),
});

// --- /gateway/query ---
export const GatewayQueryRequestSchema = z.object({
	internalReference: z.union([z.string(), z.number()]),
});

// --- /gateway/collect ---
export const GatewayCollectRequestSchema = GatewayProcessRequestSchema.extend(
	{},
);

export type GatewayInformationRequest = z.infer<
	typeof GatewayInformationRequestSchema
>;
export type GatewayProcessRequest = z.infer<typeof GatewayProcessRequestSchema>;
export type GatewayQueryRequest = z.infer<typeof GatewayQueryRequestSchema>;
