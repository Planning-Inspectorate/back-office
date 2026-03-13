/**
 * Returns section data based on the section name
 *
 * @param {string} sectionName
 * @param {Record<string, any>} urlSectionNames
 * @param {Record<string, any>} sectionData
 * @returns {Record<string, any>}
 */
export const getSectionData = (sectionName, urlSectionNames = {}, sectionData = {}) => {
	if (!sectionName) {
		return {};
	}

	const formattedSectionName = Object.keys(urlSectionNames).find(
		(key) => urlSectionNames[key] === sectionName
	);

	if (!formattedSectionName) {
		return {};
	}

	return Object.keys(sectionData).includes(formattedSectionName)
		? sectionData[formattedSectionName]
		: {};
};

/**
 * Sets data to be displayed in table on the delete confirmation page
 *
 * @param {{invoiceNumber?: string, invoiceStage?: string, amountDue?: string, agenda?: string, meetingDate?: string}} tableData
 * @param {{ getDisplayValue: Function, getStatusTag: Function, formatDateForDisplay: Function, invoiceStageDisplayValues: object}} helpers
 * @returns {Array<Array<{ text?: string, html?: string }>>}
 */
export const getRows = (tableData, helpers) => {
	/** @type {Array<any>} */
	let rows = [];

	if (tableData.invoiceNumber) {
		rows = [
			[
				{
					text: helpers.getDisplayValue(helpers.invoiceStageDisplayValues, tableData.invoiceStage)
				},
				{ text: tableData.amountDue ? `£${tableData.amountDue}` : '' },
				{ text: tableData.invoiceNumber },
				{ html: helpers.getStatusTag(tableData) }
			]
		];
	}

	if (tableData.agenda) {
		rows = [
			[{ text: tableData.agenda }, { text: helpers.formatDateForDisplay(tableData.meetingDate) }]
		];
	}

	return rows;
};

/**
 * Sets parameters needed to generate backlink URL for delete confirmation page
 *
 * @param {{invoiceNumber?: string, agenda?: string, caseId: string, id: string}} tableData
 * @returns {Object}
 */
export const getBackLinkParams = (tableData) => {
	/** @type {Record<string, any>} */
	let urlParams = {};

	if (tableData.invoiceNumber) {
		urlParams = { caseId: tableData.caseId, feeId: tableData.id };
	}

	if (tableData.agenda) {
		urlParams = { caseId: tableData.caseId, meetingId: tableData.id };
	}

	return urlParams;
};
