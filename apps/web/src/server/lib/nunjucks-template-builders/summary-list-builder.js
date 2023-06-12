/**
 * @param {string} header
 * @param {{title: string, value: string | string[], valueType: string, actionText: string, actionLink: string}[]} rowArray
 * @returns {{card: {title: {text: string}}, rows: {key: {text: string}, value: {html: string}, actions:{items: {href: string, text: string, visuallyHiddenText: string }[]}}[]}}
 */
export function generateSummaryList(header, rowArray) {
	const rows = [];
	for (const row of rowArray) {
		rows.push({
			key: {
				text: row.title
			},
			value: {
				html: formatRowValue(row)
			},
			actions: {
				items: [
					{
						href: row.actionLink,
						text: row.actionText,
						visuallyHiddenText: row.title
					}
				]
			}
		});
	}
	return {
		card: {
			title: {
				text: header
			}
		},
		rows: rows
	};
}

/**
 * @param {{ valueType: string; value: string | string[]; }} row
 */
function formatRowValue(row) {
	let rowValueAsHtml = '';
	if (Array.isArray(row.value)) {
		const arrayOfValues = row.value;
		for (const value of arrayOfValues) {
			const htmlTags = getHtmlTags(row.valueType, value);
			rowValueAsHtml += `${htmlTags.startTag}${value}${htmlTags.endTag}<br>`;
		}
	} else {
		const htmlTags = getHtmlTags(row.valueType, row.value);
		rowValueAsHtml = `${htmlTags.startTag}${row.value}${htmlTags.endTag}`;
	}
	return rowValueAsHtml;
}

/**
 * @param {string} type text | link
 * @param {string} link optional: if type is link
 * @returns {{startTag: string, endTag: string}} <{{startTag}}>, </{{endTag}}>
 */
function getHtmlTags(type, link) {
	/**
	 * @type {Object<string, {startTag: string, endTag: string}>}
	 */
	let determineHtmlTag = {
		text: { startTag: '<p>', endTag: '</p>' },
		link: { startTag: `<a href="${link}" class="govuk-link">`, endTag: `</a>` }
	};

	return determineHtmlTag[type];
}
