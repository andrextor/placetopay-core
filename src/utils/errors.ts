import type { Status } from "../schemas";

export class PlacetopayError extends Error {
	public readonly status: string;
	public readonly reason: string;
	public readonly date: string;
	public readonly rawStatus: Status;

	constructor(status: Status) {
		super(status.message);
		this.name = "PlacetopayError";
		this.status = status.status;
		this.reason = status.reason;
		this.date = status.date;
		this.rawStatus = status;

		Object.setPrototypeOf(this, PlacetopayError.prototype);
	}
}
