import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { generateAuth } from "./auth";

describe("AuthHelper (Functional)", () => {
	const login = "test_login_123";
	const secretKey = "test_secret_456";

	it("should return the correct object structure", () => {
		const auth = generateAuth(login, secretKey);

		expect(auth).toHaveProperty("login", login);
		expect(auth).toHaveProperty("tranKey");
		expect(auth).toHaveProperty("nonce");
		expect(auth).toHaveProperty("seed");
	});

	it("should generate a valid seed in ISO 8601 format", () => {
		const auth = generateAuth(login, secretKey);

		// Verifica que la fecha sea válida
		const parsedDate = Date.parse(auth.seed);
		expect(isNaN(parsedDate)).toBe(false);
	});

	it("should generate a tranKey that matches the Placetopay algorithm", () => {
		/**
		 * Algoritmo: Base64(SHA1(rawNonce + seed + secretKey))
		 */
		const auth = generateAuth(login, secretKey);

		// 1. Decodificar el nonce de Base64 para obtener el valor original
		const rawNonce = Buffer.from(auth.nonce, "base64").toString("utf8");

		// 2. Re-calcular el hash
		const expectedTranKey = createHash("sha1")
			.update(rawNonce + auth.seed + secretKey)
			.digest("base64");

		// 3. Deben ser idénticos
		expect(auth.tranKey).toBe(expectedTranKey);
	});

	it("should produce different nonces on every call", () => {
		const auth1 = generateAuth(login, secretKey);
		const auth2 = generateAuth(login, secretKey);

		expect(auth1.nonce).not.toBe(auth2.nonce);
		expect(auth1.tranKey).not.toBe(auth2.tranKey);
	});
});
