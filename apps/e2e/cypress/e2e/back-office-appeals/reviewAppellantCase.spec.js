// @ts-nocheck
/// <reference types="cypress"/>

import { users } from '../../fixtures/users';
import { AppealsListPage } from '../../page_objects/appealsListPage';
import { UpdateDueDatePage } from '../../page_objects/updateDueDatePage';
import { Page } from '../../page_objects/basePage';
const appealsListPage = new AppealsListPage();
const updateDueDatePage = new UpdateDueDatePage();
const basePage = new Page();

describe('Appeals feature', () => {
	beforeEach(() => {
		cy.login(users.appeals.caseAdmin);
	});

	it('Validate appellant case', () => {
		cy.visit('/appeals-service/appeals-list');
		appealsListPage.clickAppealFromList(2);
		appealsListPage.clickAccordionByText('case documentation');
		appealsListPage.clickLinkByText('Review');
		basePage.basePageElements.radioButton().contains('Valid').click();
		appealsListPage.clickButtonByText('Continue');
		appealsListPage.clickLinkByText('Go to case details');
	});

	it('Invalidate appellant case', () => {
		cy.visit('/appeals-service/appeals-list');
		appealsListPage.clickAppealFromList(2);
		appealsListPage.clickAccordionByText('case documentation');
		appealsListPage.clickLinkByText('Review');
		basePage.basePageElements.radioButton().contains('Invalid').click();
		appealsListPage.clickButtonByText('Continue');
		appealsListPage.chooseCheckboxByIndex(1);
		appealsListPage.clickButtonByText('Continue');
		appealsListPage.clickButtonByText('Confirm');
		appealsListPage.clickLinkByText('Go to case details');
	});

	it('incomplete appellant case', () => {
		cy.visit('/appeals-service/appeals-list');
		appealsListPage.clickAppealFromList(14);
		appealsListPage.clickAccordionByText('case documentation');
		appealsListPage.clickLinkByText('Review');
		basePage.basePageElements.radioButton().contains('Incomplete').click();
		appealsListPage.clickButtonByText('Continue');
		appealsListPage.chooseCheckboxByIndex(1);
		appealsListPage.clickButtonByText('Continue');
		updateDueDatePage.enterDateDay('29');
		updateDueDatePage.enterDateMonth('12');
		updateDueDatePage.enterDateYear('2024');
		appealsListPage.clickButtonByText('Save and Continue');
		appealsListPage.clickButtonByText('Confirm');
		appealsListPage.clickLinkByText('Go to case details');
	});

	it('incomplete appellant case reason: other', () => {
		cy.visit('/appeals-service/appeals-list');
		appealsListPage.clickAppealFromList(14);
		appealsListPage.clickAccordionByText('case documentation');
		appealsListPage.clickLinkByText('Review');
		basePage.basePageElements.radioButton().contains('Incomplete').click();
		appealsListPage.clickButtonByText('Continue');
		appealsListPage.chooseCheckboxByIndex(7);
		basePage.fillTextArea('Hello here is some extra info, have a nice day 7384_+!£ =');
		appealsListPage.clickButtonByText('Continue');
		updateDueDatePage.enterDateDay('29');
		updateDueDatePage.enterDateMonth('12');
		updateDueDatePage.enterDateYear('2024');
		appealsListPage.clickButtonByText('Save and Continue');
		appealsListPage.clickButtonByText('Confirm');
		appealsListPage.clickLinkByText('Go to case details');
	});

	it('incomplete appellant case skip due date', () => {
		cy.visit('/appeals-service/appeals-list');
		appealsListPage.clickAppealFromList(14);
		appealsListPage.clickAccordionByText('case documentation');
		appealsListPage.clickLinkByText('Review');
		basePage.basePageElements.radioButton().contains('Incomplete').click();
		appealsListPage.clickButtonByText('Continue');
		appealsListPage.chooseCheckboxByIndex(7);
		basePage.fillTextArea('Hello here is some extra info, have a nice day 7384_+!£ =');
		appealsListPage.clickButtonByText('Continue');
		updateDueDatePage.clickSkipButton('Skip');
		appealsListPage.clickButtonByText('Confirm');
		appealsListPage.clickLinkByText('Go to case details');
	});
});
