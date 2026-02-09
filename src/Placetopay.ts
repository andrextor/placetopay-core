import type { MethodOptions } from "./services/base";
import { CheckoutService } from "./services/checkout";
import { GatewayService } from "./services/gateway";
import { PaymentLinkService } from "./services/payment-link";
import { HttpClient } from "./utils/http-client";

export interface PlacetopayConfig {
	login: string;
	secretKey: string;
	baseUrl?: string;
	timeout?: number;
}

export class Placetopay {
	private readonly http: HttpClient;

	public readonly checkout: CheckoutService;
	public readonly gateway: GatewayService;
	public readonly paymentLink: PaymentLinkService;

	constructor(config: PlacetopayConfig) {
		const baseUrl = config.baseUrl || "https://checkout-test.placetopay.com";

		this.http = new HttpClient({
			login: config.login,
			secretKey: config.secretKey,
			baseUrl: baseUrl,
			timeout: config.timeout,
		});

		this.checkout = new CheckoutService(this.http);
		this.gateway = new GatewayService(this.http);
		this.paymentLink = new PaymentLinkService(this.http);
	}

	/**
	 * @param payload - Cualquier objeto JSON.
	 */
	public async request<T = unknown>(
		endpoint: string,
		payload: Record<string, unknown> = {},
		options: MethodOptions = {},
	): Promise<T> {
		return this.http.post<T>(endpoint, payload, options);
	}
}
