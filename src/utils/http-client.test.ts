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
		vi.stubGlobal("fetch", vi.fn());
	});

	it("should clean trailing slash from baseUrl and leading slash from endpoint", async () => {
		vi.mocked(fetch).mockResolvedValue(
			new Response(JSON.stringify({ ok: true }), { status: 200 }),
		);

		await client.post("/test-path", { foo: "bar" });

		const [url] = vi.mocked(fetch).mock.calls[0];

		expect(url).toBe("https://api.test.com/test-path");
	});

	it("should inject auth object via onRequest interceptor", async () => {
		vi.mocked(fetch).mockResolvedValue(
			new Response(JSON.stringify({ ok: true }), { status: 200 }),
		);

		await client.post("test", { reference: "REF123" });

		const [, options] = vi.mocked(fetch).mock.calls[0];
		const body = JSON.parse(options?.body as string);

		expect(body).toHaveProperty("auth");
		expect(body.auth).toHaveProperty("login", config.login);
		expect(body.auth).toHaveProperty("tranKey");
		expect(body.reference).toBe("REF123");
	});

	it("should throw PlacetopayError when API returns a valid status object", async () => {
		const errorResponse = {
			status: {
				status: "FAILED",
				reason: "401",
				message: "Invalid credentials",
				date: new Date().toISOString(),
			},
		};

		vi.mocked(fetch).mockResolvedValue(
			new Response(JSON.stringify(errorResponse), {
				status: 401,
				headers: { "Content-Type": "application/json" },
			}),
		);

		try {
			await client.post("/fail", {});
			expect.fail("Should have thrown PlacetopayError");
		} catch (error: unknown) {
			expect(error).toBeInstanceOf(PlacetopayError);

			if (error instanceof PlacetopayError) {
				expect(error.reason).toBe("401");
				expect(error.status).toBe("FAILED");
				expect(error.message).toBe("Invalid credentials");
			}
		}
	});

	it("should throw generic error when response has data but status is invalid", async () => {
		const weirdResponse = { status: { something: "wrong" } };

		vi.mocked(fetch).mockResolvedValue(
			new Response(JSON.stringify(weirdResponse), {
				status: 400,
				statusText: "Bad Request",
				headers: { "Content-Type": "application/json" },
			}),
		);

		await expect(client.post("/bad-json", {})).rejects.toThrow(/HTTP 400/);
	});

	it("should throw a descriptive error for non-Placetopay failures (500)", async () => {
		vi.mocked(fetch).mockResolvedValue(
			new Response("Internal Server Error", {
				status: 500,
				statusText: "Internal Server Error",
			}),
		);

		await expect(client.post("/crash", {})).rejects.toThrow(
			/HTTP 500: Internal Server Error/,
		);
	});
});
