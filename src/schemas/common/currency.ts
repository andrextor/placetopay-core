import { z } from "zod";

export const CurrencySchema = z
	.string()
	.length(3)
	.describe("ISO 4217 alpha code (e.g. COP, USD)");

export type Currency = z.infer<typeof CurrencySchema>;
