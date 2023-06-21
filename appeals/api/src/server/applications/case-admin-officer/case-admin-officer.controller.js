import { keys } from 'lodash-es';
import * as caseRepository from '../../repositories/case.repository.js';
import { mapApplicationWithSectorAndSubSector } from '../../utils/mapping/map-application-with-sector-and-subsector.js';
import { applicationStates } from '../state-machine/application.machine.js';

/**
 * @typedef {import('apps/api/src/server/utils/mapping/map-sector.js').SectorResponse} SectorResponse
 * @typedef {{id: number, modifiedDate: number, reference: string, status: string | object, sector?: SectorResponse | null, subSector?: SectorResponse | null}} ApplicationWithSectorResponse
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
 */
export const getApplications = async (request, response) => {
	const applications = await caseRepository.getByStatus(getListOfStatuses());

	// sort ascending order of subsector abbreviation, BC, EN, ... WA, WS, WW
	applications.sort((a, b) =>
		(a.ApplicationDetails?.subSector?.abbreviation || '') >
		(b.ApplicationDetails?.subSector?.abbreviation || '')
			? 1
			: -1
	);

	response.send(mapApplicationsWithSectorAndSubSector(applications));
};
