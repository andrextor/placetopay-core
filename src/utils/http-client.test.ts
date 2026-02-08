import { beforeEach, describe, expect, it, vi } from "vitest";
import { PlacetopayError } from "./errors";
import { HttpClient } from "./http-client";

describe("HttpClient", () => {
	const config = {
		login: "test_user",
		secretKey: "test_key",
		baseUrl: "https://api.test.com/",
	};

	let client: HttpClient;

	beforeEach(() => {
		client = new HttpClient(config);
		// Mockeamos el fetch global
		vi.stubGlobal("fetch", vi.fn());
	});

	it("should inject auth object via onRequest interceptor", async () => {
		const mockData = {
			requestId: 1,
			status: { status: "OK", reason: "PC", message: "Success", date: "now" },
		};

		// Simulación de respuesta exitosa usando el constructor nativo de Response
		vi.mocked(fetch).mockResolvedValue(
			new Response(JSON.stringify(mockData), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			}),
		);

		const payload = { reference: "REF123" };
		await client.post("/test-path", payload);

		const [url, options] = vi.mocked(fetch).mock.calls[0];
		const body = JSON.parse(options?.body as string);

		// Verificaciones
		expect(url).toContain("https://api.test.com/test-path");
		expect(body).toHaveProperty("auth"); // El interceptor hizo su trabajo
		expect(body.auth).toHaveProperty("login", config.login);
		expect(body.reference).toBe("REF123");
	});

	it("should throw PlacetopayError when API returns a FAILED status object", async () => {
		const errorResponse = {
			status: {
				status: "FAILED",
				reason: "401",
				message: "Invalid credentials",
				date: "2026-01-01T00:00:00Z",
			},
		};

		// Simulamos un error 401 que ofetch capturará
		vi.mocked(fetch).mockResolvedValue(
			new Response(JSON.stringify(errorResponse), {
				status: 401,
				statusText: "Unauthorized",
				headers: { "Content-Type": "application/json" },
			}),
		);

		// El interceptor onResponseError debería lanzar PlacetopayError
		await expect(client.post("/fail", {})).rejects.toThrow(PlacetopayError);
	});

	it("should throw a descriptive error for non-Placetopay failures (500)", async () => {
		vi.mocked(fetch).mockResolvedValue(
			new Response("Internal Server Error", {
				status: 500,
				statusText: "Internal Server Error",
			}),
		);

		await expect(client.post("/crash", {})).rejects.toThrow(/HTTP 500/);
	});
});
