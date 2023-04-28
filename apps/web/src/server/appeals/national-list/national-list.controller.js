import * as nationalListService from './national-list.service.js';

/** @typedef {import('@pins/appeals').CaseOfficer.AppealSummary} AppealSummary */

/**
 * @typedef {object} ViewNationalListRenderOptions
 * @property {object[]} appeals
 * @property {string} userRole
 */

/** @type {import('@pins/express').RenderHandler<ViewNationalListRenderOptions>}  */
export const viewNationalList = async (_, response) => {
	const appeals = await nationalListService.findAllAppeals();

	response.render('appeals/all-appeals/dashboard.njk', { userRole: 'Case officer', appeals });
};
