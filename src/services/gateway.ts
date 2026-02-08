import {
	type GatewayInformationRequest,
	GatewayInformationRequestSchema,
	type GatewayInformationResponse,
	type GatewayProcessRequest,
	GatewayProcessRequestSchema,
	type GatewayQueryRequest,
	GatewayQueryRequestSchema,
	type GatewayTransactionResponse,
	GatewayTransactionResponseSchema,
} from "../schemas";
import { BaseService, type MethodOptions } from "./base";

export class GatewayService extends BaseService {
	/**
	 * Check card information and available credit types
	 */
	async information(
		payload: GatewayInformationRequest | Record<string, unknown>,
		options?: MethodOptions,
	): Promise<GatewayInformationResponse> {
		if (!options?.raw) {
			GatewayInformationRequestSchema.parse(payload);
		}
		return this.http.post<GatewayInformationResponse>(
			"/gateway/information",
			payload,
		);
	}

	/**
	 * Process a direct transaction (Card or Token)
	 */
	async process(
		payload: GatewayProcessRequest | Record<string, unknown>,
		options?: MethodOptions,
	): Promise<GatewayTransactionResponse> {
		if (!options?.raw) {
			GatewayProcessRequestSchema.parse(payload);
		}
		const response = await this.http.post<GatewayTransactionResponse>(
			"/gateway/process",
			payload,
		);

		if (!options?.raw) {
			return GatewayTransactionResponseSchema.parse(response);
		}

		return response;
	}

	/**
	 * Consult a transaction status by its internal reference
	 */
	async query(
		payload: GatewayQueryRequest | Record<string, unknown>,
		options?: MethodOptions,
	): Promise<GatewayTransactionResponse> {
		if (!options?.raw) {
			GatewayQueryRequestSchema.parse(payload);
		}
		const response = await this.http.post<GatewayTransactionResponse>(
			"/gateway/query",
			payload,
		);

		if (!options?.raw) {
			return GatewayTransactionResponseSchema.parse(response);
		}

		return response;
	}
}
