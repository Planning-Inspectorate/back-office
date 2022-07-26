import * as caseRepository from '../../repositories/case.repository.js';
import { mapApplicationWithSectorAndSubSector } from '../../utils/mapping/map-application-with-sector-and-subsector.js';
import {databaseConnector} from "../../utils/database-connector.js";

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
 * @type {import('express').RequestHandler}
 */
export const getApplications = async (request, response) => {
	const applications = await caseRepository.getAll();

	let index = 0;
	for (const app of applications) {
		const regions = [];
		const caseId = app.id;
		const allRegsIds = await databaseConnector.regionsOnApplicationDetails.findMany({
			where: {
				applicationDetails: {
					caseId
				}
			}
		});

		for (const r of allRegsIds) {
			if (r.regionId) {
				const rhx = await databaseConnector.region.findUnique({
					where: {
						id: r.regionId,
					},
				});

				regions.push(rhx)
			}
		}
		applications[index].regions = regions;
		index+=1;
	}

	response.send(mapApplicationsWithSectorAndSubSector(applications));
};
