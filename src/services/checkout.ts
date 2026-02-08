import {
	type CollectRequest,
	CollectRequestSchema,
	type CollectResponse,
	CollectResponseSchema,
	type CreateSessionRequest,
	CreateSessionRequestSchema,
	type CreateSessionResponse,
	type RedirectInformation,
	RedirectInformationSchema,
} from "../schemas";
import { BaseService, type MethodOptions } from "./base";

export class CheckoutService extends BaseService {
	/**
	 * Generates a new payment session (WebCheckout)
	 */
	async createSession(
		payload: CreateSessionRequest,
		options?: MethodOptions,
	): Promise<CreateSessionResponse> {
		if (!options?.raw) {
			CreateSessionRequestSchema.parse(payload);
		}

		return this.http.post<CreateSessionResponse>("/api/session", payload);
	}

	/**
	 * Retrieves information about an existing session
	 */
	async getSession(requestId: string | number): Promise<RedirectInformation> {
		const response = await this.http.post<RedirectInformation>(
			`/api/session/${requestId}`,
			{},
		);
		return RedirectInformationSchema.parse(response);
	}

	/**
	 * Performs a payment using a previously tokenized instrument (Server-to-Server)
	 */
	async collect(payload: CollectRequest): Promise<CollectResponse> {
		const data = CollectRequestSchema.parse(payload);
		const response = await this.http.post<CollectResponse>(
			"/api/collect",
			data,
		);

		return CollectResponseSchema.parse(response);
	}
}
