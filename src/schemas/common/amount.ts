import { z } from "zod";
import { CurrencySchema } from "./currency";
import { TaxSchema } from "./tax";

export const AmountDetailSchema = z.object({
	kind: z.string().describe("Detail type (e.g. shipping, tip)"),
	amount: z.number(),
});

export const AmountSchema = z.object({
	currency: z.string().default("USD"),
	total: z.number().default(0),
	taxes: z.array(z.any()).nullish().default([]),
	details: z.array(z.any()).nullish().default([]),
});

export type Amount = z.infer<typeof AmountSchema>;
