import type { HttpClient } from "../utils/http-client";

export interface MethodOptions {
	/**
	 * If true, skips Zod validation and sends the payload exactly as provided.
	 * Useful for beta features or custom fields not yet in the SDK.
	 */
	raw?: boolean;

	/**
	 * Custom headers to inject into the request.
	 * Useful for proxy targets (x-p2p-host), auth overrides, or tracking headers.
	 */
	headers?: Record<string, string>;
}

export abstract class BaseService {
	constructor(protected readonly http: HttpClient) {}
}
