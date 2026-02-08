import { z } from "zod";

export const CardSchema = z.object({
	number: z.string().min(12).max(20),
	expiration: z
		.string()
		.regex(/^[01]\d\/\d{2}$/)
		.describe("Format MM/YY"),
	cvv: z.string().min(3).max(4).optional(),
});

export const TokenSchema = z.object({
	token: z.string().min(1),
	subtoken: z.string().optional(),
	cvv: z.string().optional(),
	installments: z.number().int().optional(),
});

export const AccountSchema = z.object({
	bankCode: z.string(),
	accountType: z.enum(["SAV", "DDA", "CCD"]),
	accountNumber: z.string(),
	bankName: z.string().optional(),
});

export const InstrumentSchema = z.object({
	card: CardSchema.optional(),
	token: TokenSchema.optional(),
	account: AccountSchema.optional(),
	otp: z.string().optional(),
	pin: z.string().optional(),
});

export type Instrument = z.infer<typeof InstrumentSchema>;
