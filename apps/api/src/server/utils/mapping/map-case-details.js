// @ts-nocheck
import { isEmpty, pick } from 'lodash-es';
import { mapKeysUsingObject } from '../../utils/mapping/map-keys-using-object.js';
import { mapValuesUsingObject } from '../../utils/mapping/map-values-using-object.js';

/**
 * @param {import('@pins/applications').ApplicationDetails} applicationDetails
 * @returns {{
 *  caseDetails?: { title?: string | undefined, description?: string | undefined, caseEmail?: string | undefined },
 * 	gridReference?: { easting?: number | undefined, northing?: number | undefined },
 *  regions: { displayNameEn?: string | undefined, displayNameCy?: string | undefined }
 *  geographicalInformation?: { locationDescription?: string | undefined },
 *  keyDates?: { firstNotifiedDate?: number | undefined, submissionDate?: number | undefined }
 *  subSector?: { name: string | undefined, abbreviation: string | undefined, displayNameEn: string | undefined, displayNameCy: string | undefined },
 *  sector?: { name: string | undefined, abbreviation: string | undefined, displayNameEn: string | undefined, displayNameCy: string | undefined },
 *  applicant: { organisationName?: string | undefined, firstName?: string | undefined, middleName?: string | undefined, lastName?: string | undefined, email?: string | undefined, website?: string | undefined, phoneNumber?: string | undefined},
 *  mapZoomLevel?: { displayNameEn: string | undefined, displayNameCy: string | undefined, locationDescription: string | undefined },
 *  regionNames?: string[],
 *  address?: { addressLine1?: string | undefined, addressLine2?: string | undefined, town?: string | undefined, county?: string | undefined, postcode?: string | undefined}}}
 */
export const mapCaseDetails = (applicationDetails) => {

    const caseDetails = pick(applicationDetails, ['id', 'reference', 'status', 'title', 'description', 'caseEmail']);

    const sector = pick(applicationDetails.sector, ['name', 'abbreviation', 'displayNameEn', 'displayNameCy' ]);

    const subSector = pick(applicationDetails.subSector, ['name', 'abbreviation', 'displayNameEn', 'displayNameCy' ]);
    
    const geographicalInformation = pick(applicationDetails.regions, ['displayNameEn', 'displayNameCy']);

    const mapZoomLevel = pick(applicationDetails.mapZoomLevel, ['displayNameEn', 'displayNameCy', 'locationDescription' ]);

    const gridReference = pick(applicationDetails.gridReference, ['easting', 'northing']);
    
    const keyDates = pick(applicationDetails.keyDates, ['firstNotifiedDate', 'submissionDate']);

    const applicant = pick(applicationDetails.application, ['firstName', 'middleName', 'lastName', 'email', 'address', 'website', 'phoneNumber']);

    const address = pick(applicationDetails.address, ['addressLine1', 'addressLine2', 'county', 'town', 'postcode'])

    return { caseDetails, sector, subSector, geographicalInformation, mapZoomLevel, gridReference, applicant, address, keyDates }

};

