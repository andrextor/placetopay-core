import type { Status } from "../schemas";

export class PlacetopayError extends Error {
	public readonly status: string;
	public readonly reason: string | number;
	public readonly date: string;

	constructor(status: Status) {
		super(status.message);
		this.name = "PlacetopayError";
		this.status = status.status;
		this.reason = status.reason;
		this.date = status.date;

		Object.setPrototypeOf(this, PlacetopayError.prototype);
	}
}
