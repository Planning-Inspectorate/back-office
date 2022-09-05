import { sortBy } from 'lodash-es';
import { keys, without } from 'lodash-es';
import * as caseRepository from '../../repositories/case.repository.js';
import { mapApplicationWithSectorAndSubSector } from '../../utils/mapping/map-application-with-sector-and-subsector.js';
import { applicationStates } from '../state-machine/application.machine.js';

/**
 * @typedef {{name: string, displayNameEn: string, displayNameCy: string, abbreviation: string}} SectorResponse
 * @typedef {{id: number, modifiedDate: number, reference: string, status: string | object, sector: SectorResponse, subSector: SectorResponse}} ApplicationWithSectorResponse
 */

/**
 *
 * @param {import('@pins/api').Schema.Case[]} applications
 * @returns {ApplicationWithSectorResponse[]}
 */
const mapApplicationsWithSectorAndSubSector = (applications) => {
	return applications.map((application) => mapApplicationWithSectorAndSubSector(application));
};

/**
 *
 * @param {import('@pins/api').Schema.Case[]} applications
 * @returns {import('@pins/api').Schema.Case[]}
 */
const sortApplications = (applications) => {
	return sortBy(applications, ['ApplicationDetails.subSector.abbreviation']);
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
 */
export const getApplications = async (request, response) => {
	const applications = await caseRepository.getByStatus(getListOfStatusesWithoutDraft());

	const sortedApplications = sortApplications(applications);

	response.send(mapApplicationsWithSectorAndSubSector(sortedApplications));
};
