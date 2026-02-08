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
	async createSession(
		payload: CreateSessionRequest | Record<string, unknown>,
		options?: MethodOptions,
	): Promise<CreateSessionResponse> {
		if (!options?.raw) {
			CreateSessionRequestSchema.parse(payload);
		}

		return this.http.post<CreateSessionResponse>("/api/session", payload);
	}

	async getSession(
		requestId: string | number,
		options?: MethodOptions,
	): Promise<RedirectInformation> {
		const response = await this.http.post<RedirectInformation>(
			`/api/session/${requestId}`,
			{},
		);

		if (!options?.raw) {
			return RedirectInformationSchema.parse(response);
		}

		return response;
	}

	async collect(
		payload: CollectRequest | Record<string, unknown>,
		options?: MethodOptions,
	): Promise<CollectResponse> {
		if (!options?.raw) {
			CollectRequestSchema.parse(payload);
		}

		const response = await this.http.post<CollectResponse>(
			"/api/collect",
			payload,
		);

		if (!options?.raw) {
			return CollectResponseSchema.parse(response);
		}

		return response;
	}
}
