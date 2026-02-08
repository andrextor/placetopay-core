import type {
	CreatePaymentLinkResponse,
	PaymentLinkQueryResponse,
} from "../schemas";
import { StatusMock } from "./status-mocks";

/**
 * Factory for Payment Link service mocks.
 * Useful for simulating hosted payment pages and payment tracking.
 */
export const PaymentLinkMock = {
	/**
	 * Simulates the response after creating a new Payment Link.
	 */
	create(
		overrides?: Partial<CreatePaymentLinkResponse>,
	): CreatePaymentLinkResponse {
		return {
			status: StatusMock.ok(),
			id: Math.floor(Math.random() * 5000),
			url:
				"https://placetopay.com/link/show/mock-" +
				Math.random().toString(36).substring(7),
			...overrides,
		};
	},

	/**
	 * Simulates a detailed query of a Payment Link.
	 */
	query(
		status: "ACTIVE" | "INACTIVE" | "EXPIRED" = "ACTIVE",
		overrides?: Partial<PaymentLinkQueryResponse>,
	): PaymentLinkQueryResponse {
		const totalAmount = 100000;

		return {
			id: 1234,
			status: status,
			url: "https://placetopay.com/link/show/mock-active-link",
			expirationDate: "2026-12-31T23:59:59-05:00",
			name: "Product Mock Name",
			reference: "REF-LINK-001",
			description: "Description of the payment link product",
			totalPayments: 5,
			availablePayments: status === "ACTIVE" ? 4 : 0,
			paymentExpiration: 15,
			amount: {
				currency: "COP",
				total: totalAmount,
				taxes: [],
				details: [],
			},
			site: {
				id: 1,
				name: "Mock Commerce Site",
			},
			isGeneric: false,
			payments: [
				{
					id: 99,
					requestId: 84076,
					status: "APPROVED",
					message: "The request has been successfully approved",
					amount: { currency: "COP", total: totalAmount },
					paymentMethod: "visa",
					paymentDate: "2026-01-20T10:00:00-05:00",
					authorization: "000000",
					lastDigits: "1111",
				},
			],
			...overrides,
		} as PaymentLinkQueryResponse;
	},

	/**
	 * Simulates the response when deactivating a link.
	 */
	disable(linkId: string | number = "1234", overrides?: Partial<unknown>) {
		return {
			status: StatusMock.ok({
				message: "Payment link successfully deactivated",
			}),
			id: linkId,
			...overrides,
		};
	},
} as const;
