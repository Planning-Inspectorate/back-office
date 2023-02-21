import { keys } from 'lodash-es';
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
 * @returns {string[]}
 */
const getListOfStatuses = () => {
	return keys(applicationStates);
};

/**
 * @type {import('express').RequestHandler}
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 * @returns {Promise<void>}
 */
export const getApplications = async (request, response) => {
	const applications = await caseRepository.getByStatus(getListOfStatuses());

	// sort ascending order of subsector abbreviation, BC, EN, ... WA, WS, WW
	applications.sort((a, b) =>
		((a.ApplicationDetails?.subSector?.abbreviation || '') >
		(b.ApplicationDetails?.subSector?.abbreviation || '')
			? 1
			: -1)
	);

	response.send(mapApplicationsWithSectorAndSubSector(applications));
};
