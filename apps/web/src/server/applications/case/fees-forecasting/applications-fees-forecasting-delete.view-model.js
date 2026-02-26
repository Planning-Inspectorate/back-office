import {
	invoiceStageDisplayValues,
	sectionDeleteData,
	urlSectionNames
} from './fees-forecasting.config.js';
import { getSectionData } from './applications-fees-forecasting.utils.js';
import { buildTable } from '../../../lib/table-mapper.js';
import { url } from '../../../lib/nunjucks-filters/index.js';
import { getDisplayValue, getStatusTag } from './applications-fees-forecasting-index.view-model.js';

/**
 * @typedef {object} InvoiceData
 * @property {number} id
 * @property {number} caseId
 * @property {string} invoiceNumber
 * @property {string} invoiceStage
 * @property {string} [amountDue]
 * @property {string} [paymentDueDate]
 * @property {string} [paymentDate]
 * @property {string} [refundIssueDate]
 */

/**
 * Builds the view model for the fees forecasting delete page.
 *
 * @param {string} projectName
 * @param {string} sectionName
 * @param {InvoiceData|null} tableData
 * @returns {Object}
 */
export const getFeesForecastingDeleteViewModel = (projectName, sectionName, tableData) => {
	const section = getSectionData(sectionName, urlSectionNames, sectionDeleteData);

	const deleteTable = buildTable({
		headers: ['Stage', 'Amount', 'Invoice number', 'Status'],
		rows: tableData
			? [
					[
						{ text: getDisplayValue(invoiceStageDisplayValues, tableData.invoiceStage) },
						{ text: tableData.amountDue ? `£${tableData.amountDue}` : '' },
						{ text: tableData.invoiceNumber },
						{ html: getStatusTag(tableData) }
					]
			  ]
			: []
	});

	return {
		pageTitle:
			section?.sectionTitle && projectName ? `${section.sectionTitle} - ${projectName}` : '',
		pageHeading: section?.pageHeading || '',
		warningText: section?.warningText || '',
		backLink: tableData
			? url('fees-forecasting-fee', { caseId: tableData.caseId, feeId: tableData.id })
			: '',
		tableData: deleteTable
	};
};
