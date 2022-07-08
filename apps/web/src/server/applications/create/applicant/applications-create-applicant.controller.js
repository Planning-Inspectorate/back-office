/** @typedef {import('../../applications.router').DomainParams} DomainParams */
/** @typedef {import('./applications-create-applicant.types').ApplicationsCreateApplicantTypesProps} ApplicationsCreateApplicantTypesProps */

/**
 * View the first step (name & description) of the application creation
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateApplicantTypesProps,
 * {}, {}, {}, DomainParams>}
 */
export async function viewApplicationsCreateApplicantTypes(req, response) {
	const applicantInfoTypes = [
		{ name: 'name', displayNameEn: 'Name' },
		{ name: 'email', displayNameEn: 'Email' },
		{ name: 'address', displayNameEn: 'Address' }
	];

	response.render('applications/create/applicant/_types', { applicantInfoTypes });
}
