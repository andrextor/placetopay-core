import type {
	CollectResponse,
	CreateSessionResponse,
	RedirectInformation,
} from "../schemas";
import { StatusMock } from "./status-mocks";

export class CheckoutMock {
	/**
	 * Simula la respuesta de creación de sesión (WebCheckout)
	 */
	static createSession(
		overrides?: Partial<CreateSessionResponse>,
	): CreateSessionResponse {
		return {
			status: StatusMock.ok(),
			requestId: Math.floor(Math.random() * 1000000),
			processUrl: "https://checkout.placetopay.com/session/1/abcde",
			...overrides,
		};
	}

	/**
	 * Simula la respuesta de consulta de sesión (GetSession)
	 */
	static getSession(
		status: "APPROVED" | "REJECTED" | "PENDING" = "APPROVED",
		overrides?: Partial<RedirectInformation>,
	): RedirectInformation {
		return {
			requestId: 123456,
			status: StatusMock.ok({
				status: status,
				message:
					status === "APPROVED"
						? "La petición ha sido aprobada"
						: "La petición ha sido declinada",
			}),
			request: {
				locale: "es_CO", // Requerido por Zod
				payment: {
					reference: "ORDER_123",
					description: "Pago de prueba",
					amount: {
						currency: "COP",
						total: 50000,
						taxes: [], // Requerido por Zod
						details: [], // Requerido por Zod
					},
				},
				expiration: new Date(Date.now() + 3600000).toISOString(), // Requerido por Zod
				returnUrl: "https://mysite.com/response",
				ipAddress: "127.0.0.1",
				userAgent: "PlacetoPay SDK Mock",
			},
			payment:
				status === "PENDING"
					? []
					: [
							{
								status: StatusMock.ok({ status: status }),
								internalReference: 987654, // Debe ser NUMBER para Zod
								paymentMethod: "visa",
								amount: {
									from: { currency: "COP", total: 50000 },
									to: { currency: "COP", total: 50000 },
									factor: 1,
								},
								authorization: "000000",
								receipt: "123456789",
								franchise: "VISA",
								franchiseName: "Visa",
								issuerName: "BANCO MOCK",
								lastDigits: "1111",
							},
						],
			...overrides,
		} as RedirectInformation;
	}

	/**
	 * Simula la respuesta de un cobro automático (Collect)
	 */
	static collect(overrides?: Partial<CollectResponse>): CollectResponse {
		return {
			status: StatusMock.ok({ status: "APPROVED" }),
			requestId: Math.floor(Math.random() * 1000000),
			reference: "COLLECT_REF_001",
			signature: "mock_signature_hash",
			payment: [
				{
					status: StatusMock.ok({ status: "APPROVED" }),
					internalReference: 123123, // Debe ser NUMBER
					paymentMethod: "visa",
					amount: {
						from: { currency: "COP", total: 10000 },
						to: { currency: "COP", total: 10000 },
						factor: 1,
					},
					authorization: "000000",
					receipt: "123456789",
					franchise: "VISA",
					issuerName: "BANCO MOCK",
					lastDigits: "1111",
				},
			],
			...overrides,
		} as CollectResponse;
	}
}
