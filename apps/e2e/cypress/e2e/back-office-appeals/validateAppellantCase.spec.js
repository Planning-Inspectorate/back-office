// @ts-nocheck
/// <reference types="cypress"/>

import { users } from '../../fixtures/users';
import { AppealsListPage } from '../../page_objects/appealsListPage';

const page = new AppealsListPage();
describe('Appeals feature', () => {
	beforeEach(() => {
		cy.login(users.inspector);
	});

	it('Validate appellant case', () => {
		cy.visit('/appeals-service/appeals-list');
		page.clickAppealFromList(2);
		page.clickAccordionByText('case documentation');
		page.clickLinkByText('Review');
		page.basePageElements.radioButton().contains('Valid').click();
		page.clickButtonByText('Continue');
		page.clickLinkByText('Go to case details');
	});
});
