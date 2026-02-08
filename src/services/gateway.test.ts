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
		const validInfoPayload: GatewayInformationRequest = {
			locale: "es_CO",
			payment: {
				reference: "REF_INFO_TEST",
				amount: { currency: "COP", total: 1000 },
			},
		};

		it("should fetch gateway information successfully", async () => {
			const mockResponse = GatewayMock.information();
			vi.mocked(mockHttpClient.post).mockResolvedValue(mockResponse);

			const result = await service.information(validInfoPayload);

			expect(mockHttpClient.post).toHaveBeenCalledWith(
				"/gateway/information",
				validInfoPayload,
			);
			expect(result.bankList).toBeDefined();
		});

		it("should skip request validation if raw option is true", async () => {
			vi.mocked(mockHttpClient.post).mockResolvedValue(
				GatewayMock.information(),
			);

			// Payload incompleto que fallaría sin la opción raw
			const incompletePayload = { payment: { reference: "TEST" } };

			await service.information(
				incompletePayload as unknown as GatewayInformationRequest,
				{
					raw: true,
				},
			);

			expect(mockHttpClient.post).toHaveBeenCalled();
		});
	});

	describe("process", () => {
		const validProcessPayload: GatewayProcessRequest = {
			locale: "en",
			payment: {
				reference: "REF_TEST",
				description: "Test direct payment",
				amount: { currency: "USD", total: 50, taxes: [], details: [] },
			},
			instrument: {
				card: {
					number: "4111111111111111",
					cvv: "123",
					expiration: "12/26",
				},
			},
		};

		it("should process a transaction successfully", async () => {
			const mockResponse = GatewayMock.transaction("APPROVED");
			vi.mocked(mockHttpClient.post).mockResolvedValue(mockResponse);

			const result = await service.process(validProcessPayload);

			expect(result.status.status).toBe("APPROVED");
			expect(result.authorization).toBe("000000");
		});

		it("should skip request validation when raw is enabled", async () => {
			const weirdPayload = { custom_field: "value" };
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

		it("should throw if response schema validation fails", async () => {
			// Respuesta malformada (sin status) para forzar error en GatewayTransactionResponseSchema.parse
			vi.mocked(mockHttpClient.post).mockResolvedValue({
				internalReference: 123,
			});

			await expect(service.process(validProcessPayload)).rejects.toThrow();
		});
	});

	describe("query", () => {
		const validQueryPayload: GatewayQueryRequest = {
			internalReference: 123456,
		};

		it("should query status and handle null fields", async () => {
			const mockResponse = GatewayMock.transaction("REJECTED", {
				authorization: null,
				receipt: null,
			});
			vi.mocked(mockHttpClient.post).mockResolvedValue(mockResponse);

			const result = await service.query(validQueryPayload);

			expect(result.status.status).toBe("REJECTED");
			expect(result.authorization).toBeNull();
		});

		it("should skip request validation in query when raw is enabled", async () => {
			vi.mocked(mockHttpClient.post).mockResolvedValue(
				GatewayMock.transaction(),
			);

			await service.query(
				{ any_ref: "abc" } as unknown as GatewayQueryRequest,
				{
					raw: true,
				},
			);

			expect(mockHttpClient.post).toHaveBeenCalled();
		});
	});
});
