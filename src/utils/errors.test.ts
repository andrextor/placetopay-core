import { describe, expect, it } from "vitest";
import type { Status } from "../schemas";
import { PlacetopayError } from "./errors";

describe("PlacetopayError", () => {
	it("should correctly map PlacetoPay status fields to error properties", () => {
		const mockStatus: Status = {
			status: "FAILED",
			reason: "401",
			message: "Autenticación fallida 102",
			date: "2021-11-30T15:12:25-05:00",
		};

		// Constructor actualizado: ahora recibe mockStatus directamente
		const error = new PlacetopayError(mockStatus);

		expect(error).toBeInstanceOf(Error);
		expect(error.name).toBe("PlacetopayError");
		expect(error.message).toBe(mockStatus.message);
		expect(error.status).toBe(mockStatus.status);
		expect(error.reason).toBe(mockStatus.reason);
		expect(error.date).toBe(mockStatus.date);
	});
});
