import { beforeEach, describe, expect, it, vi } from "vitest";
import { StatusMock } from "../testing/status-mocks";
import type { HttpClient } from "../utils/http-client";
import { PaymentLinkService } from "./payment-link";

describe("PaymentLinkService", () => {
	let mockHttpClient: HttpClient;
	let service: PaymentLinkService;

	beforeEach(() => {
		// Mockeamos el HttpClient
		mockHttpClient = {
			post: vi.fn(),
		} as unknown as HttpClient;

		service = new PaymentLinkService(mockHttpClient);
	});

	describe("create", () => {
		it("should create a payment link and validate the response", async () => {
			// Mock de respuesta exitosa
			const mockResponse = {
				status: StatusMock.ok(),
				id: 12345,
				url: "https://placetopay.com/link/mock-session",
			};
			vi.mocked(mockHttpClient.post).mockResolvedValue(mockResponse);

			const payload = {
				name: "Producto Test",
				description: "Descripción de prueba",
				reference: "REF-123",
				expirationDate: "2026-12-31 23:59:59",
				paymentExpiration: 60,
				payment: {
					amount: { currency: "COP", total: 50000, taxes: [], details: [] },
				},
				locale: "es" as const,
				isGeneric: false,
			};

			const result = await service.create(payload as any);

			// Verificamos que llame al endpoint correcto
			expect(mockHttpClient.post).toHaveBeenCalledWith(
				"api/payment-link",
				payload,
			);
			// Verificamos que el parse de respuesta funcionó
			expect(result.id).toBe(12345);
			expect(result.status.status).toBe("OK");
		});

		it("should throw validation error if payload is invalid", async () => {
			const invalidPayload = { name: "" }; // Fallará por min(1)
			await expect(service.create(invalidPayload as any)).rejects.toThrow();
		});
	});

	describe("query", () => {
		it("should query a payment link by ID using POST", async () => {
			const linkId = "98765";
			const mockResponse = {
				id: 98765,
				status: "ACTIVE",
				url: "https://placetopay.com/link/mock-session",
				name: "Link Activo",
				reference: "REF-001",
				totalPayments: 0,
				availablePayments: 1,
				paymentExpiration: 30,
				amount: { currency: "COP", total: 10000, taxes: [], details: [] },
				site: { id: 1, name: "Test Site" },
				isGeneric: false,
			};

			vi.mocked(mockHttpClient.post).mockResolvedValue(mockResponse);

			const result = await service.query(linkId);

			// Verificamos que llame al endpoint con el ID y cuerpo vacío
			expect(mockHttpClient.post).toHaveBeenCalledWith(
				`api/payment-link/${linkId}`,
				{},
			);
			expect(result.status).toBe("ACTIVE");
			expect(result.id).toBe(98765);
		});
	});

	describe("disable", () => {
		it("should call the disable endpoint using POST", async () => {
			const linkId = 555;
			const mockResponse = {
				status: StatusMock.ok({ message: "Link disabled" }),
				id: linkId,
			};

			vi.mocked(mockHttpClient.post).mockResolvedValue(mockResponse);

			const result = await service.disable(linkId);

			expect(mockHttpClient.post).toHaveBeenCalledWith(
				`api/payment-link/disable/${linkId}`,
				{},
			);
			expect(result.id).toBe(linkId);
			expect(result.status.status).toBe("OK");
		});
	});
});
