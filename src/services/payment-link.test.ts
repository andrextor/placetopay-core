import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CreatePaymentLinkRequest } from "../schemas";
import { StatusMock } from "../testing/status-mocks";
import type { HttpClient } from "../utils/http-client";
import { PaymentLinkService } from "./payment-link";

describe("PaymentLinkService", () => {
	let mockHttpClient: HttpClient;
	let service: PaymentLinkService;
	const validPayload: CreatePaymentLinkRequest = {
		name: "Producto Test",
		description: "Descripción de prueba",
		reference: "REF-123",
		expirationDate: "2026-12-31 23:59:59",
		paymentExpiration: 60,
		payment: {
			amount: {
				currency: "COP",
				total: 50000,
				taxes: [],
				details: [],
			},
		},
		locale: "es",
		isGeneric: false,
	};

	beforeEach(() => {
		mockHttpClient = {
			post: vi.fn(),
		} as unknown as HttpClient;

		service = new PaymentLinkService(mockHttpClient);
	});

	describe("create", () => {
		it("should create a payment link and validate the response", async () => {
			const mockResponse = {
				status: StatusMock.ok(),
				id: 12345,
				url: "https://placetopay.com/link/mock-session",
			};
			vi.mocked(mockHttpClient.post).mockResolvedValue(mockResponse);

			const result = await service.create(validPayload);

			expect(mockHttpClient.post).toHaveBeenCalledWith(
				"api/payment-link",
				validPayload,
			);
			expect(result.id).toBe(12345);
			expect(result.status.status).toBe("OK");
		});

		it("should throw validation error if payload is invalid", async () => {
			const invalidPayload = { name: "" };
			await expect(
				service.create(invalidPayload as CreatePaymentLinkRequest),
			).rejects.toThrow();
		});

		it("should create successfully", async () => {
			vi.mocked(mockHttpClient.post).mockResolvedValue({
				status: StatusMock.ok(),
				id: 1,
			});
			const result = await service.create(
				validPayload as CreatePaymentLinkRequest,
			);
			expect(result.id).toBe(1);
		});

		it("should skip validation when raw option is enabled", async () => {
			vi.mocked(mockHttpClient.post).mockResolvedValue({
				status: StatusMock.ok(),
				id: 1,
			});

			await service.create(
				{ name: "" } as unknown as CreatePaymentLinkRequest,
				{ raw: true },
			);
			expect(mockHttpClient.post).toHaveBeenCalled();
		});

		it("should throw if response doesn't match schema", async () => {
			vi.mocked(mockHttpClient.post).mockResolvedValue({
				id: "not-an-object-with-status",
			});
			await expect(
				service.create(validPayload as unknown as CreatePaymentLinkRequest),
			).rejects.toThrow();
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

			expect(mockHttpClient.post).toHaveBeenCalledWith(
				`api/payment-link/${linkId}`,
				{},
			);
			expect(result.status).toBe("ACTIVE");
			expect(result.id).toBe(98765);
		});

		it("should return raw response if raw option is true", async () => {
			const rawData = { some: "unvalidated-data" };
			vi.mocked(mockHttpClient.post).mockResolvedValue(rawData);

			// Cubre la rama del return en query
			const result = await service.query(123, { raw: true });
			expect(result).toEqual(rawData);
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

			const result = (await service.disable(linkId)) as typeof mockResponse;

			expect(mockHttpClient.post).toHaveBeenCalledWith(
				`api/payment-link/disable/${linkId}`,
				{},
			);
			expect(result.id).toBe(linkId);
			expect(result.status.status).toBe("OK");
		});

		it("should call disable endpoint", async () => {
			vi.mocked(mockHttpClient.post).mockResolvedValue({
				status: StatusMock.ok(),
			});

			await service.disable(555);
			expect(mockHttpClient.post).toHaveBeenCalledWith(
				"api/payment-link/disable/555",
				{},
			);
		});
	});
});
