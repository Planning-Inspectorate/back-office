export class TransitionStateError extends Error {
	/**
	 * @param {string} message
	 * @param {{type: string, context: object}} config
	 */
	constructor(message, { type, context }) {
		super(message);
		this.type = type;
		this.context = context;
	}
}
