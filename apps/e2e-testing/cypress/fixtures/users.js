export const users = {
	caseOfficer: {
		email: Cypress.env('CASE_OFFICER_EMAIL'),
		id: 'case-officer'
	},
	caseOfficerAdmin: {
		email: Cypress.env('CASE_OFFICER_ADMIN_EMAIL'),
		id: 'case-officer-admin'
	},
	inspector: { email: Cypress.env('INSPECTOR_EMAIL'), id: 'inspector' },
	caseOfficerInspector: {
		email: Cypress.env('CASE_OFFICER_INSPECTOR_EMAIL'),
		id: 'case-officer-inspector'
	},
	caseOfficerAdminInspector: {
		email: Cypress.env('CASE_OFFICER_ADMIN_INSPECTOR_EMAIL'),
		id: 'case-officer-admin-inspector'
	},
	caseOfficerCaseOfficerAdmin: {
		email: Cypress.env('CASE_OFFICER_CASE_OFFICER_ADMIN_EMAIL'),
		id: 'case-office-case-officer-admin'
	}
};
