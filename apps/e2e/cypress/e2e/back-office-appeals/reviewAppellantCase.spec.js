// @ts-nocheck
/// <reference types="cypress"/>

import { users } from '../../fixtures/users';
import { AppealsListPage } from '../../page_objects/appealsListPage';
import { UpdateDueDatePage } from '../../page_objects/updateDueDatePage';
const appealsListPage = new AppealsListPage();
const updateDueDatePage = new UpdateDueDatePage();

describe('Appeals feature', () => {
	beforeEach(() => {
		cy.login(users.appeals.caseAdmin);
	});

	it('Validate appellant case', () => {
		cy.visit('/appeals-service/appeals-list');
		appealsListPage.clickAppealFromList(2);
		appealsListPage.selectAppellantCaseOutcome('Valid');
		appealsListPage.clickButtonByText('Continue');
		appealsListPage.clickLinkByText('Go to case details');
		const status = 'Valid';
		const testData = { rowIndex: 0, cellIndex: 0, textToMatch: status, strict: true };
		appealsListPage.verifyTableCellText(testData);
	});

	it('Invalidate appellant case', () => {
		cy.visit('/appeals-service/appeals-list');
		appealsListPage.clickAppealFromList(2);
		appealsListPage.selectAppellantCaseOutcome('Invalid');
		appealsListPage.clickButtonByText('Continue');
		appealsListPage.chooseCheckboxByIndex(1);
		appealsListPage.clickButtonByText('Continue');
		appealsListPage.clickButtonByText('Confirm');
		appealsListPage.clickLinkByText('Go to case details');
		const status = 'Invalid';
		const testData = { rowIndex: 0, cellIndex: 0, textToMatch: status, strict: true };
		appealsListPage.verifyTableCellText(testData);
	});

	it('incomplete appellant case', () => {
		cy.visit('/appeals-service/appeals-list');
		appealsListPage.clickAppealFromList(14);
		appealsListPage.selectAppellantCaseOutcome('Incomplete');
		appealsListPage.clickButtonByText('Continue');
		appealsListPage.chooseCheckboxByIndex(1);
		appealsListPage.clickButtonByText('Continue');
		updateDueDatePage.enterDateDay('29');
		updateDueDatePage.enterDateMonth('12');
		updateDueDatePage.enterDateYear('2024');
		appealsListPage.clickButtonByText('Save and Continue');
		appealsListPage.clickButtonByText('Confirm');
		appealsListPage.clickLinkByText('Go to case details');
		const status = 'Incomplete';
		const testData = { rowIndex: 0, cellIndex: 0, textToMatch: status, strict: true };
		appealsListPage.verifyTableCellText(testData);
	});

	it('incomplete appellant case reason: other', () => {
		cy.visit('/appeals-service/appeals-list');
		appealsListPage.clickAppealFromList(14);
		appealsListPage.selectAppellantCaseOutcome('Incomplete');
		appealsListPage.clickButtonByText('Continue');
		appealsListPage.chooseCheckboxByIndex(7);
		appealsListPage.fillTextArea('Hello here is some extra info, have a nice day 7384_+!£ =');
		appealsListPage.clickButtonByText('Continue');
		updateDueDatePage.enterDateDay('29');
		updateDueDatePage.enterDateMonth('12');
		updateDueDatePage.enterDateYear('2024');
		appealsListPage.clickButtonByText('Save and Continue');
		appealsListPage.clickButtonByText('Confirm');
		appealsListPage.clickLinkByText('Go to case details');
		const status = 'Incomplete';
		const testData = { rowIndex: 0, cellIndex: 0, textToMatch: status, strict: true };
		appealsListPage.verifyTableCellText(testData);
	});

	it.only('incomplete appellant case skip due date', () => {
		cy.visit('/appeals-service/appeals-list');
		appealsListPage.clickAppealFromList(14);
		appealsListPage.selectAppellantCaseOutcome('Incomplete');
		appealsListPage.clickButtonByText('Continue');
		appealsListPage.chooseCheckboxByIndex(1);
		appealsListPage.clickButtonByText('Continue');
		appealsListPage.clickButtonByText('Skip');
		appealsListPage.clickButtonByText('Confirm');
		appealsListPage.clickLinkByText('Go to case details');
		const status = 'Incomplete';
		const testData = { rowIndex: 0, cellIndex: 0, textToMatch: status, strict: true };
		appealsListPage.verifyTableCellText(testData);
	});
});
