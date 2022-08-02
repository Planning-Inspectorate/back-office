import { pick } from 'lodash-es';
import { mapSector } from '../../utils/mapping/map-sector.js';
import { mapCaseStatus } from './map-case-status.js';
import { mapDateStringToUnixTimestamp } from './map-date-string-to-unix-timestamp.js';
import { mapGridReference } from './map-grid-reference.js';
import { mapKeysUsingObject } from './map-keys-using-object.js';
import { mapRegion } from './map-region.js';
import { mapServiceCustomer } from './map-service-customer.js';
import { mapValuesUsingObject } from './map-values-using-object.js';
import { mapZoomLevel } from './map-zoom-level.js';

/**
 * @param {import('@pins/api').Schema.Case} caseDetails
 * @returns {{
 *  caseDetails?: { title?: string | undefined, description?: string | undefined, caseEmail?: string | undefined },
 * 	gridReference?: { easting?: number | undefined, northing?: number | undefined },
 *  regions: { displayNameEn?: string | undefined, displayNameCy?: string | undefined }
 *  keyDates?: { firstNotifiedDate?: number | undefined, submissionDate?: number | undefined }
 *  subSector?: { name: string | undefined, abbreviation: string | undefined, displayNameEn: string | undefined, displayNameCy: string | undefined },
 *  sector?: { name: string | undefined, abbreviation: string | undefined, displayNameEn: string | undefined, displayNameCy: string | undefined },
 *  applicant: { organisationName?: string | undefined, firstName?: string | undefined, middleName?: string | undefined, lastName?: string | undefined, email?: string | undefined, website?: string | undefined, phoneNumber?: string | undefined},
 *  mapZoomLevel?: { displayNameEn: string | undefined, displayNameCy: string | undefined, locationDescription: string | undefined },
 *  regionNames?: string[],
 *  address?: { addressLine1?: string | undefined, addressLine2?: string | undefined, town?: string | undefined, county?: string | undefined, postcode?: string | undefined}}}
 */
export const mapCaseDetails = (caseDetails) => {
	const caseDetailsFormatted = pick(caseDetails, ['id', 'reference', 'title', 'description']);
	const sectorFormatted = mapSector(caseDetails?.ApplicationDetails?.subSector?.sector);
	const subSectorFormatted = mapSector(caseDetails?.ApplicationDetails?.subSector);
	const zoomLevelFormatted = mapZoomLevel(caseDetails?.ApplicationDetails?.zoomLevel);
	const regionsFormatted = caseDetails?.ApplicationDetails?.regions?.map((region) =>
		mapRegion(region.region)
	);
	const applicantsFormatted = caseDetails?.serviceCustomer?.map((serviceCustomer) =>
		mapServiceCustomer(serviceCustomer)
	);
	const gridReferenceFormatted = mapGridReference(caseDetails?.ApplicationDetails?.gridReference);

	const keyDates = mapValuesUsingObject(
		mapKeysUsingObject(pick(caseDetails?.ApplicationDetails, ['firstNotifiedAt', 'submissionAt']), {
			firstNotifiedAt: 'firstNotifiedDate',
			submissionAt: 'submissionDate'
		}),
		{
			firstNotifiedDate: mapDateStringToUnixTimestamp,
			submissionDate: mapDateStringToUnixTimestamp
		}
	);

	return {
		...caseDetailsFormatted,
		...(caseDetails.CaseStatus && { status: mapCaseStatus(caseDetails.CaseStatus) }),
		caseEmail: caseDetails?.ApplicationDetails?.caseEmail,
		sector: sectorFormatted,
		subSector: subSectorFormatted,
		applicant: applicantsFormatted,
		geographicalInformation: {
			mapZoomLevel: zoomLevelFormatted,
			locationDescription: caseDetails?.ApplicationDetails?.locationDescription,
			gridReference: gridReferenceFormatted,
			regions: regionsFormatted
		},
		keyDates
	};
};
