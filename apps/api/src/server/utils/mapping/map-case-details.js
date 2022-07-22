// @ts-nocheck
// import { regions } from 'apps/api/prisma/seed-samples.js';
// import { pick } from 'lodash-es';
// import { mapKeysUsingObject } from '../../utils/mapping/map-keys-using-object.js';
// import { mapValuesUsingObject } from '../../utils/mapping/map-values-using-object.js';

/**
 * @param {import('@pins/applications').ApplicationDetails} applicationDetails
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
export const mapCaseDetails = (applicationDetails) => {
	// const caseDetails = pick(applicationDetails, ['id', 'reference', 'status', 'title', 'description', 'caseEmail']);

	// const sector = pick(applicationDetails.sector, ['name', 'abbreviation', 'displayNameEn', 'displayNameCy' ]);

	// const subSector = pick(applicationDetails.subSector, ['name', 'abbreviation', 'displayNameEn', 'displayNameCy' ]);

	// const geographicalInformation = pick(applicationDetails.regions, ['displayNameEn', 'displayNameCy']);

	// const mapZoomLevel = pick(applicationDetails.mapZoomLevel, ['displayNameEn', 'displayNameCy', 'locationDescription' ]);

	// const gridReference = pick(applicationDetails.gridReference, ['easting', 'northing']);

	// const keyDates = pick(applicationDetails.keyDates, ['firstNotifiedDate', 'submissionDate']);

	// const applicant = pick(applicationDetails.application, ['firstName', 'middleName', 'lastName', 'email', 'address', 'website', 'phoneNumber']);

	// const address = pick(applicationDetails.address, ['addressLine1', 'addressLine2', 'county', 'town', 'postcode'])

	return {
		id: applicationDetails.id,
		reference: applicationDetails.reference,
		status: applicationDetails.status,
		title: applicationDetails.title,
		description: applicationDetails.description,
		caseEmail: applicationDetails.ApplicationDetails.caseEmail,
		sector: {
			name: applicationDetails.ApplicationDetails.subSector.sector.name,
			abbreviation: applicationDetails.ApplicationDetails.subSector.sector.abbreviation,
			displayNameEn: applicationDetails.ApplicationDetails.subSector.sector.displayNameEn,
			displayNameCy: applicationDetails.ApplicationDetails.subSector.sector.displayNameCy
		},
		subSector: {
			name: applicationDetails.ApplicationDetails.subSector.name,
			abbreviation: applicationDetails.ApplicationDetails.subSector.abbreviation,
			displayNameEn: applicationDetails.ApplicationDetails.subSector.displayNameEn,
			displayNameCy: applicationDetails.ApplicationDetails.subSector.displayNameCy
		},
		geographicalInformation: {
			mapZoomLevel: {
				displayNameEn: applicationDetails.ApplicationDetails.zoomLevel.displayNameEn,
				displayNameCy: applicationDetails.ApplicationDetails.zoomLevel.displayNameCy
			},
			// locationDescription: geographicalInformation.locationDescription,
			// gridReference: { easting: geographicalInformation.gridReference, northing: geographicalInformation.gridReference },
			regions: {
				displayNameEn: applicationDetails.ApplicationDetails.regions[0].region.displayNameEn,
				displayNameCy: applicationDetails.ApplicationDetails.regions[0].region.displayNameCy
			},
			applicant: {
				firstName: applicationDetails.serviceCustomer[0].firstName,
				middleName: applicationDetails.serviceCustomer[0].middleName,
				lastName: applicationDetails.serviceCustomer[0].lastName,
				email: applicationDetails.serviceCustomer[0].email,
				address: {
					addressLine1: applicationDetails.serviceCustomer[0].address.addressLine1,
					addressLine2: applicationDetails.serviceCustomer[0].address.addressLine2,
					county: applicationDetails.serviceCustomer[0].address.county,
					town: applicationDetails.serviceCustomer[0].address.town,
					postcode: applicationDetails.serviceCustomer[0].address.postcode
				},
				website: applicationDetails.serviceCustomer[0].website,
				phoneNumber: applicationDetails.serviceCustomer[0].phoneNumber
			}
		},
		keyDates: {
			firstNotifiedDate: applicationDetails.ApplicationDetails.firstNotifiedAt,
			submissionDate: applicationDetails.ApplicationDetails.submissionAt
		}
	};
};
