import { type $Fetch, ofetch } from "ofetch";
import { StatusSchema } from "../schemas";
import { generateAuth } from "./auth";
import { PlacetopayError } from "./errors";

export interface HttpClientConfig {
	login: string;
	secretKey: string;
	baseUrl: string;
	timeout?: number;
}

export class HttpClient {
	private readonly api: $Fetch;

	constructor(private readonly config: HttpClientConfig) {
		this.api = ofetch.create({
			baseURL: this.config.baseUrl.replace(/\/$/, ""),
			timeout: this.config.timeout || 20000,
			retry: 2,
			retryDelay: 1000,
			retryStatusCodes: [408, 429, 500, 502, 503, 504],

			async onRequest({ options }) {
				const auth = await generateAuth(config.login, config.secretKey);

				let body = options.body;
				if (typeof body === 'string') {
					try { body = JSON.parse(body); } catch (e) { }
				}

				options.body = {
					auth,
					...(options.body as object),
				};
			},

			async onResponseError({ response }) {
				const data = response._data;

				if (data?.status) {
					const errorParsed = StatusSchema.safeParse(data.status);
					if (errorParsed.success) {
						throw new PlacetopayError(errorParsed.data);
					}
				}

				throw new Error(
					`[Placetopay Core] HTTP ${response.status}: ${response.statusText}`,
				);
			},
		});
	}

	public async post<T>(
		endpoint: string,
		payload: Record<string, unknown> = {},
	): Promise<T> {
		const path = endpoint.replace(/^\//, "");

		return this.api<T>(path, {
			method: "POST",
			body: payload,
		});
	}
}
