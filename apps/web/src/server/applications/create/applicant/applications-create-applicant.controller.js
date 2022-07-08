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
		{ id: 1, name: 'name', displayNameEn: 'Name', displayNameCy: 'Name' },
		{ id: 2, name: 'email', displayNameEn: 'Email', displayNameCy: 'Name' },
		{ id: 3, name: 'address', displayNameEn: 'Address', displayNameCy: 'Name' }
	];

	response.render('applications/create/applicant/_types', { applicantInfoTypes });
}
