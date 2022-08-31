import { ValidationErrors } from '@pins/express';
export type ApplicationsCreateConfirmationProps = {
	values: { reference: string };
}

export type ApplicationsCreateCheckYourAnswersProps = {
	values: {
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
		'applicant.address.addressLine1'?: string;
		'applicant.address.addressLine2'?: string;
		'applicant.address.town'?: string;
		'applicant.address.postcode'?: string;
		'applicant.website'?: string;
		'applicant.email'?: string;
		'applicant.phoneNumber'?: string;

		'keyDates.submissionDatePublished': string;
		'keyDates.submissionDateInternal': string;
	};
	errors?: ValidationErrors;
};

export type ApplicationsCreateCheckYourAnswersBody = {
	submissionDatePublished: string;
	submissionInternalDay: string;
	submissionInternalMonth: string;
	submissionInternalYear: string;
};
