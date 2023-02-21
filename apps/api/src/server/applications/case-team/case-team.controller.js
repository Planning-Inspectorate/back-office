import { keys } from 'lodash-es';
import * as caseRepository from '../../repositories/case.repository.js';
import { mapApplicationWithSectorAndSubSector } from '../../utils/mapping/map-application-with-sector-and-subsector.js';
import { applicationStates } from '../state-machine/application.machine.js';

/**
 * @typedef {{name: string, displayNameEn: string, displayNameCy: string, abbreviation: string}} SectorResponse
 * @typedef {{id: number, modifiedDate: number, reference: string, status: string | object, sector: SectorResponse | null | undefined, subSector?: SectorResponse | null | undefined}} ApplicationWithSectorResponse
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
 * @returns {string[]}
 */
const getListOfStatuses = () => {
	return keys(applicationStates);
};

/**
 * @type {import('express').RequestHandler}
 * @returns {Promise<void>}
 */
export const getApplications = async (_request, response) => {
	const applications = await caseRepository.getByStatus(getListOfStatuses());

	response.send(mapApplicationsWithSectorAndSubSector(applications));
};
