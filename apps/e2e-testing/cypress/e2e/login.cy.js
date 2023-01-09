// @ts-nocheck
import { users } from '../fixtures/users';

describe('Login as Different users', () => {
	it('Should be able to see the links ', () => {
		cy.login(users.caseOfficer);
		cy.visit('/');
	});

	it('Login as caseOfficerAdmin', () => {
		cy.login(users.caseOfficerAdmin);
		cy.visit('/');
	});

	it('Login as caseOfficerAdminInspector', () => {
		cy.login(users.caseOfficerAdminInspector);
		cy.visit('/');
	});

	it('Login as caseOfficerCaseOfficerAdmin', () => {
		cy.login(users.caseOfficerCaseOfficerAdmin);
		cy.visit('/');
	});

	it('Login as caseOfficerInspector', () => {
		cy.login(users.caseOfficerInspector);
		cy.visit('/');
	});

	it('Login as inspector', () => {
		cy.login(users.inspector);
		cy.visit('/');
	});
});
