// --- 1. Responses ---

export type { PlacetopayConfig } from "./Placetopay";
export { Placetopay } from "./Placetopay";
// --- 3. Schemas & Core Class ---
export * from "./schemas";

// --- 2. Requests ---
export type {
	CollectRequest,
	CreateSessionRequest,
} from "./schemas/requests/checkout";
export type {
	GatewayInformationRequest,
	GatewayProcessRequest,
	GatewayQueryRequest,
} from "./schemas/requests/gateway";
export type { CreatePaymentLinkRequest } from "./schemas/requests/payment-link";
export type {
	CollectResponse,
	CreateSessionResponse,
	RedirectInformation,
} from "./schemas/responses/checkout";
export type {
	GatewayInformationResponse,
	GatewayTransactionResponse,
} from "./schemas/responses/gateway";
export type {
	CreatePaymentLinkResponse,
	DisablePaymentLinkResponse,
	PaymentLinkQueryResponse,
} from "./schemas/responses/payment-link";

// --- 4. Services (Optional) ---
export * from "./services/checkout";
export * from "./services/gateway";
export * from "./services/payment-link";
