import { beforeEach, describe, expect, it, vi } from "vitest";
import type {
	GatewayInformationRequest,
	GatewayProcessRequest,
	GatewayQueryRequest,
} from "../schemas";
import { GatewayMock } from "../testing/gateway-mocks";
import type { HttpClient } from "../utils/http-client";
import { GatewayService } from "./gateway";

describe("GatewayService", () => {
	let mockHttpClient: HttpClient;
	let service: GatewayService;

	beforeEach(() => {
		mockHttpClient = {
			post: vi.fn(),
		} as unknown as HttpClient;

		service = new GatewayService(mockHttpClient);
	});

	describe("information", () => {
		it("should fetch gateway information with bank list", async () => {
			const mockResponse = GatewayMock.information();
			vi.mocked(mockHttpClient.post).mockResolvedValue(mockResponse);

			const payload = {
				payment: {
					reference: "REF_INFO_TEST",
					amount: { currency: "COP", total: 1000 },
				},
			};

			const result = await service.information(
				payload as GatewayInformationRequest,
			);

			expect(mockHttpClient.post).toHaveBeenCalledWith(
				"/gateway/information",
				payload,
			);
			expect(result.bankList).toBeDefined();
			expect(result.bankList?.length).toBeGreaterThan(0);
		});
	});

	describe("process", () => {
		it("should process a direct transaction successfully", async () => {
			const mockResponse = GatewayMock.transaction("APPROVED");
			vi.mocked(mockHttpClient.post).mockResolvedValue(mockResponse);

			const payload = {
				payment: {
					reference: "REF_TEST",
					description: "Test direct payment",
					amount: { currency: "USD", total: 50 },
				},
				instrument: {
					card: {
						number: "4111111111111111",
						cvv: "123",
						expiration: "12/26",
					},
				},
			};

			const result = await service.process(payload as GatewayProcessRequest);

			expect(mockHttpClient.post).toHaveBeenCalledWith(
				"/gateway/process",
				payload,
			);
			expect(result.status.status).toBe("APPROVED");
			expect(result.authorization).toBe("000000");
		});

		it("should skip validation when raw option is enabled", async () => {
			const weirdPayload = { some_extra_data: "value" };
			vi.mocked(mockHttpClient.post).mockResolvedValue(
				GatewayMock.transaction(),
			);

			await service.process(weirdPayload as unknown as GatewayProcessRequest, {
				raw: true,
			});

			expect(mockHttpClient.post).toHaveBeenCalledWith(
				"/gateway/process",
				weirdPayload,
			);
		});
	});

	describe("query", () => {
		it("should query transaction status and handle null fields correctly", async () => {
			const mockResponse = GatewayMock.transaction("REJECTED", {
				authorization: null,
				receipt: null,
			});
			vi.mocked(mockHttpClient.post).mockResolvedValue(mockResponse);

			const payload = {
				internalReference: 123456,
			};

			const result = await service.query(payload as GatewayQueryRequest);

			expect(mockHttpClient.post).toHaveBeenCalledWith(
				"/gateway/query",
				payload,
			);
			expect(result.status.status).toBe("REJECTED");
			expect(result.authorization).toBeNull();
		});
	});
});
