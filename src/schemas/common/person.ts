import { z } from "zod";
import { AddressSchema } from "./address";

export const PersonSchema = z.object({
	document: z.string().min(1).max(30).describe("Identification number"),
	documentType: z
		.string()
		.max(10)
		.optional()
		.describe("Document type (CC, NIT, PP, etc)"),
	name: z.string().min(1).max(120).optional(),
	surname: z.string().min(1).max(120).optional(),
	email: z.string().email().max(100).describe("Primary contact email"),
	mobile: z.string().max(40).optional(),
	company: z.string().max(100).optional(),
	address: AddressSchema.optional(),
});

export type Person = z.infer<typeof PersonSchema>;
