import type { Status } from "../schemas";

/**
 * Factory for Status objects to be used in tests and mocks.
 */
export const StatusMock = {
	/**
	 * Returns a successful status (OK)
	 */
	ok(overrides?: Partial<Status>): Status {
		return {
			status: "OK",
			reason: "PC",
			message: "Procesado correctamente",
			date: new Date().toISOString(),
			...overrides,
		};
	},

	/**
	 * Returns a failed status (FAILED)
	 */
	failed(overrides?: Partial<Status>): Status {
		return {
			status: "FAILED",
			reason: "401",
			message: "No autorizado",
			date: new Date().toISOString(),
			...overrides,
		};
	},
} as const;
