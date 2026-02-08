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
		payload: GatewayInformationRequest,
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
		payload: GatewayProcessRequest,
		options?: MethodOptions,
	): Promise<GatewayTransactionResponse> {
		if (!options?.raw) {
			GatewayProcessRequestSchema.parse(payload);
		}
		const response = await this.http.post<GatewayTransactionResponse>(
			"/gateway/process",
			payload,
		);
		return GatewayTransactionResponseSchema.parse(response);
	}

	/**
	 * Consult a transaction status by its internal reference
	 */
	async query(
		payload: GatewayQueryRequest,
		options?: MethodOptions,
	): Promise<GatewayTransactionResponse> {
		if (!options?.raw) {
			GatewayQueryRequestSchema.parse(payload);
		}
		const response = await this.http.post<GatewayTransactionResponse>(
			"/gateway/query",
			payload,
		);
		return GatewayTransactionResponseSchema.parse(response);
	}
}
