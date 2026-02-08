import { beforeEach, describe, expect, it, vi } from "vitest";
import { CheckoutMock } from "../testing/checkout-mocks";
import type { HttpClient } from "../utils/http-client";
import { CheckoutService } from "./checkout";

describe("CheckoutService", () => {
	let mockHttpClient: HttpClient;
	let service: CheckoutService;

	beforeEach(() => {
		// Mockeamos el HttpClient para no hacer peticiones reales
		mockHttpClient = {
			post: vi.fn(),
		} as unknown as HttpClient;

		service = new CheckoutService(mockHttpClient);
	});

	describe("createSession", () => {
		it("should call /api/session and return a successful mock response", async () => {
			// 1. Preparamos el Mock de respuesta usando nuestra factoría
			const mockResponse = CheckoutMock.createSession({ requestId: 777 });
			vi.mocked(mockHttpClient.post).mockResolvedValue(mockResponse);

			// 2. Payload válido según el esquema
			const payload = {
				payment: {
					reference: "TEST_1",
					description: "Prueba",
					amount: { currency: "COP", total: 10000 },
				},
				returnUrl: "https://mysite.com",
				ipAddress: "127.0.0.1",
				userAgent: "ViteTest",
			};

			const result = await service.createSession(payload as any);

			// 3. Verificaciones
			expect(mockHttpClient.post).toHaveBeenCalledWith("/api/session", payload);
			expect(result.requestId).toBe(777);
			expect(result.status.status).toBe("OK");
		});

		it("should throw a validation error if payload is empty", async () => {
			await expect(service.createSession({} as any)).rejects.toThrow();
		});

		it("should skip validation when options.raw is true", async () => {
			const weirdPayload = { algo_no_estandar: "valor" };
			vi.mocked(mockHttpClient.post).mockResolvedValue(
				CheckoutMock.createSession(),
			);

			// No debería fallar aunque el payload no cumpla el esquema de Zod
			await service.createSession(weirdPayload as any, { raw: true });

			expect(mockHttpClient.post).toHaveBeenCalledWith(
				"/api/session",
				weirdPayload,
			);
		});
	});

	describe("getSession", () => {
		it("should call the correct dynamic endpoint and validate output", async () => {
			const requestId = 123456;
			const mockResponse = CheckoutMock.getSession("APPROVED");
			vi.mocked(mockHttpClient.post).mockResolvedValue(mockResponse);

			const result = await service.getSession(requestId);

			expect(mockHttpClient.post).toHaveBeenCalledWith(
				`/api/session/${requestId}`,
				{},
			);
			expect(result.status.status).toBe("APPROVED");
		});
	});

	describe("collect", () => {
		it("should process a server-to-server payment (collect)", async () => {
			const mockResponse = CheckoutMock.collect();
			vi.mocked(mockHttpClient.post).mockResolvedValue(mockResponse);

			const payload = {
				payer: {
					document: "123",
					documentType: "CC",
					name: "J",
					surname: "D",
					email: "j@d.com",
				},
				payment: {
					reference: "REF",
					description: "D",
					amount: { currency: "COP", total: 100 },
				},
				instrument: { token: { token: "TOKEN123" } },
			};

			const result = await service.collect(payload as any);

			expect(mockHttpClient.post).toHaveBeenCalledWith(
				"/api/collect",
				expect.objectContaining({
					payment: expect.objectContaining({
						reference: "REF",
					}),
				}),
			);
			expect(result.status.status).toBe("APPROVED");
		});
	});
});
