import { pick } from 'lodash-es';
import { getRegionById } from '../../repositories/region.repository.js';
import { getSectorById } from '../../repositories/sector.repository.js';
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
 * @param {import('@pins/api').Schema.Case} applicationDetails
 * @returns {{
 *  title?: string | undefined,
 *  description?: string | undefined,
 *  caseEmail?: string | undefined,
 *  status?: string | undefined,
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
export const mapApplicationDetails = async (applicationDetails) => {
	const caseDetailsFormatted = pick(applicationDetails, [
		'id',
		'reference',
		'title',
		'description'
	]);

	const sectorUnformatted = await getSectorById(
		applicationDetails?.ApplicationDetails?.subSector?.sectorId
	);
	const sectorFormatted = mapSector(sectorUnformatted);
	const subSectorFormatted = mapSector(applicationDetails?.ApplicationDetails?.subSector);
	const zoomLevelFormatted = mapZoomLevel(applicationDetails?.ApplicationDetails?.zoomLevel);
	const regionsFormatted = await Promise.all(
		applicationDetails?.ApplicationDetails?.regions?.map(async (region) => {
			const getRegById = await getRegionById(region.regionId);

			return mapRegion(getRegById);
		})
	);

	const applicantsFormatted = applicationDetails?.serviceCustomer?.map((serviceCustomer) =>
		mapServiceCustomer(serviceCustomer)
	);
	const gridReferenceFormatted = mapGridReference(applicationDetails?.gridReference);

	const unmappedKeyDates = mapValuesUsingObject(
		mapKeysUsingObject(
			pick(applicationDetails?.ApplicationDetails, [
				'submissionAtInternal',
				'submissionAtPublished'
			]),
			{
				firstNotifiedAt: 'submissionAtInternal',
				submissionAt: 'submissionAtPublished'
			}
		),
		{
			firstNotifiedDate: mapDateStringToUnixTimestamp,
			submissionDate: mapDateStringToUnixTimestamp
		}
	);

	const keyDates = {
		submissionDatePublished: unmappedKeyDates?.submissionAtPublished,
		submissionDateInternal: unmappedKeyDates?.submissionAtInternal
	};

	return {
		...caseDetailsFormatted,
		...(applicationDetails.CaseStatus && { status: mapCaseStatus(applicationDetails.CaseStatus) }),
		caseEmail: applicationDetails?.ApplicationDetails?.caseEmail,
		sector: sectorFormatted,
		subSector: subSectorFormatted,
		applicants: applicantsFormatted,
		geographicalInformation: {
			mapZoomLevel: zoomLevelFormatted,
			locationDescription: applicationDetails?.ApplicationDetails?.locationDescription,
			gridReference: gridReferenceFormatted,
			regions: regionsFormatted
		},
		keyDates
	};
};
