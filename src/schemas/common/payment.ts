import { z } from "zod";
import { AmountSchema } from "./amount";
import { NameValuePairSchema } from "./fields";
import { ItemSchema } from "./item";
import { PersonSchema } from "./person";
import { RecurringSchema } from "./recurring";

export const PaymentRequestSchema = z.object({
	reference: z.string().max(64).describe("Unique payment reference"),
	description: z.string().min(1).max(250).nullish().optional(),
	amount: AmountSchema.required(),
	allowPartial: z.boolean().optional(),
	shipping: PersonSchema.optional(),
	items: z.array(ItemSchema).optional(),
	recurring: RecurringSchema.optional(),
	subscribe: z.boolean().optional(),
	fields: z.array(NameValuePairSchema).optional(),
});

export type PaymentRequest = z.infer<typeof PaymentRequestSchema>;
