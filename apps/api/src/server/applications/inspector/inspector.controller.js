import { keys, without } from 'lodash-es';
import * as caseRepository from '#repositories/case.repository.js';
import { mapApplicationWithSectorAndSubSector } from '#utils/mapping/map-application-with-sector-and-subsector.js';
import { applicationStates } from '../state-machine/application.machine.js';

/**
 * @typedef {import('@pins/applications.api').Api.ApplicationSummary} ApplicationSummary
 */

/**
 *
 * @param {import('@pins/applications.api').Schema.Case[]} applications
 * @returns {ApplicationSummary[]}
 */
const mapApplicationsWithSectorAndSubSector = (applications) => {
	return applications.map((application) => mapApplicationWithSectorAndSubSector(application));
};

/**
 *
 * @returns {string[]}
 */
const getListOfStatusesWithoutDraft = () => {
	return without(keys(applicationStates), 'draft');
};

/**
 * @type {import('express').RequestHandler}
 * @throws {Error}
 */
export const getApplications = async (_request, response) => {
	const applications = await caseRepository.getByStatus(getListOfStatusesWithoutDraft());

	response.send(mapApplicationsWithSectorAndSubSector(applications));
};
