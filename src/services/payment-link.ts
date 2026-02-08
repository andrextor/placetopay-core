import {
	type CreatePaymentLinkRequest,
	CreatePaymentLinkRequestSchema,
	type CreatePaymentLinkResponse,
	CreatePaymentLinkResponseSchema,
	type PaymentLinkQueryResponse,
	PaymentLinkQueryResponseSchema,
} from "../schemas";
import { BaseService, type MethodOptions } from "./base";

export class PaymentLinkService extends BaseService {
	/**
	 * CREATE: Genera un link de pago nuevo.
	 */
	async create(
		payload: CreatePaymentLinkRequest,
		options?: MethodOptions,
	): Promise<CreatePaymentLinkResponse> {
		if (!options?.raw) {
			CreatePaymentLinkRequestSchema.parse(payload);
		}

		const response = await this.http.post<CreatePaymentLinkResponse>(
			"api/payment-link",
			payload,
		);

		return CreatePaymentLinkResponseSchema.parse(response);
	}

	async query(
		linkId: string | number,
		options?: MethodOptions,
	): Promise<PaymentLinkQueryResponse> {
		const response = await this.http.post<PaymentLinkQueryResponse>(
			`api/payment-link/${linkId}`,
			{}, // El cuerpo va vacío porque HttpClient inyecta el 'auth' automáticamente
		);

		if (!options?.raw) {
			return PaymentLinkQueryResponseSchema.parse(response);
		}
		return response;
	}

	/**
	 * DISABLE: Desactiva un link antes de su expiración.
	 */
	async disable(linkId: string | number): Promise<unknown> {
		const response = await this.http.post(
			`api/payment-link/disable/${linkId}`,
			{},
		);

		return response;
	}
}
