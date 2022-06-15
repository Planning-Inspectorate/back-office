import { pick } from "lodash-es";
import { mapDateStringToUnixTimestamp } from "../../utils/mapping/map-date-string-to-unix-timestamp.js";
import { mapKeysUsingObject } from "../../utils/mapping/map-keys-using-object.js";
import { mapValuesUsingObject } from "../../utils/mapping/map-values-using-object.js";

/**
 * @typedef {{name: string, displayNameEn: string, displayNameCy: string, abbreviation: string}} SectorResponse
 * @typedef {{id: number, modifiedDate: number, reference: string, sector: SectorResponse, subSector: SectorResponse}} ApplicationWithSectorResponse 
 * @typedef {{id: number, modifiedDate: number, reference: string}} ApplicationResponse
 */

/**
 * 
 * @param {import('@pins/api').Schema.Application} application 
 * @returns {ApplicationResponse}
 */
const mapApplication = (application) => {
    /** @type {{id: number, reference: string, modifiedAt: Date}} */
    const filtered = pick(application, ['id', 'reference', 'modifiedAt']);

    /** @type {ApplicationResponse} */
    const mappedKeys = mapKeysUsingObject(filtered, {modifiedAt: 'modifiedDate'});

    /** @type {ApplicationResponse} */
    const mappedValues = mapValuesUsingObject(mappedKeys, {modifiedDate: mapDateStringToUnixTimestamp});

    return mappedValues;
}

/**
 * 
 * @param {import('@pins/api').Schema.Sector | import('@pins/api').Schema.SubSector} sector 
 * @returns {SectorResponse}
 */
const mapSector = (sector) => {
    return pick(sector, ['name', 'abbreviation', 'displayNameEn', 'displayNameCy']);
}

/**
 * 
 * @param {import('@pins/api').Schema.Application} application 
 * @returns {ApplicationWithSectorResponse}
 */
const mapApplicationWithSectorAndSubSector = (application) => {
    const applicationData = mapApplication(application);

    return {
        ...applicationData,
        subSector: mapSector(application.subSector),
        sector: mapSector(application.subSector.sector)
    }
}

/**
 * 
 * @param {import('@pins/api').Schema.Application[]} applications 
 * @returns {ApplicationWithSectorResponse[]}
 */
export const mapApplicationsWithSectorAndSubSector = (applications) => {
    return applications.map((application) => mapApplicationWithSectorAndSubSector(application))
}
