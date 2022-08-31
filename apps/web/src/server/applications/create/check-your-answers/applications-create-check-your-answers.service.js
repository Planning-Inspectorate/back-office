/** @typedef {import('./applications-create-check-your-answers.types').ApplicationsCreateCheckYourAnswersProps} ApplicationsCreateCheckYourAnswersProps */

/**
 * // TODO: - temp version - need to read real case data from DB
 *
 * tmp not used yet param {string} id
 *
 * @returns {ApplicationsCreateCheckYourAnswersProps}
 */
// export const getApplicationDraft = (id) => {
export const getApplicationDraft = () => {
	// read the draft case from DB
	// and set up the values array for rendering
	const caseData = {
		values: {
			'case.title': 'Heathrow Terminal 9',
			'case.description':
				'A new terminal for Heathrow airport on the south side next to terminal 8',
			'case.sector': 'Transport',
			'case.subSector': 'Airports',
			'case.location': 'Approximately 8km off the coast of Kent',
			'case.easting': '123456',
			'case.northing': '654321',
			'case.regions': ['South East', 'North West'],
			'case.zoomLevel': 'Region',
			'case.teamEmail': 'NIEnquiries@planninginspectorate.gov.uk',

			'applicant.organisationName': 'Heathrow Airport',
			'applicant.firstName': 'John',
			'applicant.middleName': '',
			'applicant.lastName': 'Appleseed',
			'applicant.address.addressLine1': 'Nelson Road',
			'applicant.address.addressLine2': '',
			'applicant.address.town': 'Hounslow',
			'applicant.address.postcode': 'TW6 2GW',
			'applicant.website': 'heathrow.com/company/about-heathrow/expansion',
			'applicant.email': 'contact.heathrowairport@fly.com',
			'applicant.phoneNumber': '0300 123 3000',

			'keyDates.submissionDatePublished': 'Q4 2024',
			'keyDates.submissionDateInternal': '20 April 2024'
		}
	};

	return caseData;
};
