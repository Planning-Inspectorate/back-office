/**
 * Builds a GOVUK summary list from the given items.
 *
 * @param {Array<{
 *   key: string,
 *   value?: string,
 *   html?: string,
 *   actions?: Array<{
 *     href: string,
 *     text: string,
 *     visuallyHiddenText?: string
 *   }>
 * }>} items
 * @returns {Array<{
 *   key: { text: string },
 *   value: { html: string } | { text?: string },
 *   actions?: { items: Array<{ href: string, text: string, visuallyHiddenText?: string }> }
 * }>}
 */
export function buildSummaryList(items) {
	return items.map((item) => {
		/** @type {{
		 *   key: { text: string },
		 *   value: { html: string } | { text?: string },
		 *   actions?: { items: Array<{ href: string, text: string, visuallyHiddenText?: string }> }
		 * }} */
		const row = {
			key: { text: item.key },
			value: item.html ? { html: item.html } : { text: item.value }
		};

		if (item.actions && item.actions.length) {
			row.actions = {
				items: item.actions.map((action) => ({
					href: action.href,
					text: action.text,
					visuallyHiddenText: action.visuallyHiddenText
				}))
			};
		}

		return row;
	});
}
