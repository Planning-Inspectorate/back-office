/** @typedef {import('../../../applications.types').regions} Region */

export type ApplicationsCreateConfirmationProps = {
	values: { reference: string };
};

export type ApplicationsCreateCheckYourAnswersProps = {
	values?: {
		'case.title': string;
		'case.description': string;
		'case.sector'?: string;
		'case.subSector'?: string;
		'case.location'?: string;
		'case.easting'?: string;
		'case.northing'?: string;
		'case.regions'?: string[];
		'case.zoomLevel'?: string;
		'case.teamEmail'?: string;

		'applicant.organisationName'?: string;
		'applicant.firstName'?: string;
		'applicant.middleName'?: string;
		'applicant.lastName'?: string;
		'applicant.address'?: string;
		'applicant.website'?: string;
		'applicant.email'?: string;
		'applicant.phoneNumber'?: string;

		'keyDates.submissionDatePublished': string;
		'keyDates.submissionDateInternal': Date;
	};

	errors?: Record<string, string>;
};
