import { keys } from 'lodash-es';
import * as caseRepository from '../../repositories/case.repository.js';
import { mapApplicationWithSectorAndSubSector } from '../../utils/mapping/map-application-with-sector-and-subsector.js';
import { applicationStates } from '../state-machine/application.machine.js';

/**
 * @typedef {import('apps/api/src/server/utils/mapping/map-sector.js').SectorResponse} SectorResponse
  @typedef {import('apps/api/src/server/utils/mapping/map-application-with-sector-and-subsector').ApplicationWithSectorResponse} ApplicationWithSectorResponse */

/**
 *
 * @param {import('@pins/applications.api').Schema.Case[]} applications
 * @returns {ApplicationWithSectorResponse[]}
 */
const mapApplicationsWithSectorAndSubSector = (applications) => {
	return applications.map((application) => mapApplicationWithSectorAndSubSector(application));
};

/**
 *
 * @returns {string[]}
 */
const getListOfStatuses = () => {
	return keys(applicationStates);
};

/**
 * @type {import('express').RequestHandler}
 */
export const getApplications = async (_request, response) => {
	const applications = await caseRepository.getByStatus(getListOfStatuses());

	response.send(mapApplicationsWithSectorAndSubSector(applications));
};
