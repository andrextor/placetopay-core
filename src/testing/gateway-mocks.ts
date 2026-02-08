import type {
	GatewayInformationResponse,
	GatewayTransactionResponse,
} from "../schemas";
import { StatusMock } from "./status-mocks";

/**
 * Factory for Gateway service mocks.
 * Useful for simulating direct card processing, queries, and bank list information.
 */
export const GatewayMock = {
	/**
	 * Generates a mock for a transaction response (process, query, or collect).
	 */
	transaction(
		status: "APPROVED" | "REJECTED" | "PENDING" = "APPROVED",
		overrides?: Partial<GatewayTransactionResponse>,
	): GatewayTransactionResponse {
		const isApproved = status === "APPROVED";

		return {
			status: StatusMock.ok({
				status,
				message: isApproved
					? "La petición ha sido aprobada"
					: "La petición ha sido declinada",
				reason: isApproved ? "00" : "1",
			}),
			internalReference: Math.floor(Math.random() * 1000000),
			reference: `ORDER-"${Math.floor(Math.random() * 9999)}`,
			paymentMethod: "visa",
			franchise: "VS",
			franchiseName: "Visa",
			issuerName: "JPMORGAN CHASE BANK",
			amount: {
				currency: "COP",
				total: 50000,
				taxes: [],
				details: [],
			},
			authorization: isApproved ? "000000" : null,
			receipt: isApproved ? "12345678" : null,
			type: "full",
			refunded: false,
			lastDigits: "1111",
			processorFields: {
				id: "mock_proc_id",
				bincode: "411111",
				lastDigits: "1111",
			},
			...overrides,
		} as GatewayTransactionResponse;
	},

	/**
	 * Generates a mock for the information endpoint (/gateway/information).
	 */
	information(
		overrides?: Partial<GatewayInformationResponse>,
	): GatewayInformationResponse {
		return {
			status: StatusMock.ok(),
			provider: "PlacetoPay",
			serviceCode: "999",
			cardType: "credit",
			requireOtp: false,
			requireCvv2: true,
			threeDS: "optional",
			bankList: [
				{ code: "1022", description: "Banco de Bogotá" },
				{ code: "1013", description: "BBVA Colombia" },
				{ code: "1007", description: "Bancolombia" },
				{ code: "1040", description: "Banco Davivienda" },
				{ code: "1001", description: "Banco Agrario" },
			],
			...overrides,
		} as GatewayInformationResponse;
	},

	/**
	 * Helper for specific failed transactions (e.g., Insufficient funds)
	 */
	rejected(
		message: string = "Fondos insuficientes",
		overrides?: Partial<GatewayTransactionResponse>,
	): GatewayTransactionResponse {
		return this.transaction("REJECTED", {
			status: StatusMock.ok({ status: "REJECTED", message, reason: "51" }),
			...overrides,
		});
	},
} as const;
