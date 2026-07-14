/**
 * Raised when a ZIP fails shapefile content validation (missing required files).
 * Distinguishes expected validation failures from unexpected infrastructure errors,
 * so the caller can decide whether to mark the document as invalid or re-throw.
 */
export class ShapefileValidationError extends Error {
	/** @param {string} message */
	constructor(message) {
		super(message);
		this.name = 'ShapefileValidationError';
	}
}
