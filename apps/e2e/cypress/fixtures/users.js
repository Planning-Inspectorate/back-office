export const users = {
	applications: {
		caseTeam: {
			email: Cypress.env('CASE_TEAM_EMAIL'),
			id: 'case-team',
			typeName: 'Case team'
		},
		caseAdmin: {
			email: Cypress.env('CASE_ADMIN_EMAIL'),
			id: 'case-admin',
			typeName: 'Case admin officer'
		},
		inspector: {
			email: Cypress.env('INSPECTOR_EMAIL'),
			id: 'inspector',
			typeName: 'Inspector'
		}
	},
	appeals: {
		validationOfficer: {
			email: Cypress.env('VALIDATION_OFFICER_EMAIL'),
			id: 'validation-officer',
			typeName: 'Validation officer'
		},
		caseAdmin: {
			email: Cypress.env('CASE_ADMIN_EMAIL'),
			id: 'case-admin',
			typeName: 'Case admin'
		}
	}
};
