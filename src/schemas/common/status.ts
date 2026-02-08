import { z } from "zod";

/**
 * 1. The Enum: Defines the allowed string values
 */
export const StatusEnum = z.enum([
	"OK",
	"FAILED",
	"APPROVED",
	"APPROVED_PARTIAL",
	"PARTIAL_EXPIRED",
	"REJECTED",
	"PENDING",
	"PENDING_VALIDATION",
	"REFUNDED",
]);

/**
 * 2. The Status Object Schema:
 * This is what Placetopay actually returns in the "status" field
 */
export const StatusSchema = z.object({
	status: StatusEnum, // Here we use the enum defined above
	reason: z.string().describe("Internal reason code (e.g., '00', 'PT')"),
	message: z.string().describe("Human readable message from the gateway"),
	date: z.string().describe("ISO 8601 status date"),
});

export type Status = z.infer<typeof StatusSchema>;
