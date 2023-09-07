// @ts-nocheck
import { REGIONS, ZOOM_LEVELS, SUBSECTORS } from '../fixtures/options.js';

// @ts-nocheck
export const generateTestData = () => {
	const getRandomInt = (digits) => {
		return Math.pow(10, digits - 1);
	};

	const generateApplicant = () => {
		return {
			organisationName: `Organisation_${Math.random().toString(36).substring(7)}`,
			firstName: `FirstName_${Math.random().toString(36).substring(7)}`,
			middleName: `MiddleName_${Math.random().toString(36).substring(7)}`,
			lastName: `LastName_${Math.random().toString(36).substring(7)}`,
			email: `email_${Math.random().toString(36).substring(7)}@example.com`,
			address: {
				addressLine1: 'Temple Quay House',
				addressLine2: `2 The Square`,
				town: 'Bristol',
				county: 'Temple Quay',
				postcode: 'BS1 6PN'
			},
			website: `www.example_${Math.random().toString(36).substring(7)}.com`,
			phoneNumber: `PhoneNumber_${Math.random().toString(36).substring(7)}`
		};
	};

	const futureDate = new Date();
	futureDate.setFullYear(futureDate.getFullYear() + 3);
	console.log(futureDate.toISOString());

	const testData = {
		title: `Title_${Math.random().toString(36).substring(7)}`,
		description: `Description_${Math.random().toString(36).substring(7)}`,
		subSectorName: SUBSECTORS[0],
		caseEmail: `email_${Math.random().toString(36).substring(7)}@example.com`,
		geographicalInformation: {
			mapZoomLevelName: ZOOM_LEVELS[0],
			locationDescription: `Location_${Math.random().toString(36).substring(7)}`,
			regionNames: ['Wales'],
			gridReference: {
				easting: `${getRandomInt(6)}`,
				northing: `${getRandomInt(6)}`
			}
		},
		applicants: generateApplicant(),
		keyDates: {
			preApplication: {
				submissionAtPublished: `Q${getRandomInt(4) + 1} ${
					futureDate.getFullYear() + getRandomInt(3)
				}`,
				submissionAtInternal: '01/02/2025'
			}
		}
	};

	return testData;
};
