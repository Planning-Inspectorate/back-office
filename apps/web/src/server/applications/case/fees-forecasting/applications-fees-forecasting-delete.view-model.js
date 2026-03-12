import {
	invoiceStageDisplayValues,
	sectionDeleteData,
	urlSectionNames
} from './fees-forecasting.config.js';
import { getSectionData } from './applications-fees-forecasting.utils.js';
import { buildTable } from '../../../lib/table-mapper.js';
import { url } from '../../../lib/nunjucks-filters/index.js';
import { getDisplayValue, getStatusTag } from './applications-fees-forecasting-index.view-model.js';
import { formatDateForDisplay } from '../../../lib/dates.js';

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
 * @typedef {object} MeetingData
 * @property {number} id
 * @property {number} caseId
 * @property {string} agenda
 * @property {string|null} meetingDate
 */

/**
 * Builds the view model for the fees forecasting delete page.
 *
 * @param {string} projectName
 * @param {string} sectionName
 * @param {InvoiceData|MeetingData|null} tableData
 * @returns {Object}
 */
export const getFeesForecastingDeleteViewModel = (projectName, sectionName, tableData) => {
	const section = getSectionData(sectionName, urlSectionNames, sectionDeleteData);

	const tableConfig = section?.tableConfig;
	const itemToDeleteTable = buildTable({
		headers: tableConfig?.headers || [],
		rows:
			tableData && tableConfig?.getRows
				? tableConfig.getRows(tableData, {
						getDisplayValue,
						getStatusTag,
						formatDateForDisplay,
						invoiceStageDisplayValues
				  })
				: []
	});

	return {
		pageTitle:
			section?.sectionTitle && projectName ? `${section.sectionTitle} - ${projectName}` : '',
		pageHeading: section?.pageHeading || '',
		warningText: section?.warningText || '',
		backLink: tableData
			? url(section?.backLinkSectionName, section?.getBackLinkParams(tableData))
			: '',
		tableData: itemToDeleteTable
	};
};
