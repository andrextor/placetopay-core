import { z } from "zod";

export const NameValuePairSchema = z.object({
	keyword: z.string().min(1),
	value: z.any(),
	displayOn: z
		.enum(["none", "payment", "receipt", "both", "approved"])
		.optional(),
});

export type Fields = z.infer<typeof NameValuePairSchema>;
