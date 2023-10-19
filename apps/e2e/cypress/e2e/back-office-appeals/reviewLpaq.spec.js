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

	it('Complete LPAQ', () => {
		cy.visit('/appeals-service/appeals-list');
		appealsListPage.clickAppealFromList(18);
		appealsListPage.clickReviewLpaq(7);
		appealsListPage.selectRadioButtonByValue('Complete');
		appealsListPage.clickButtonByText('Continue');
		appealsListPage.clickLinkByText('Go back to case details');
		const status = 'Complete';
		const testData = { rowIndex: 1, cellIndex: 0, textToMatch: status, strict: true };
		appealsListPage.verifyTableCellText(testData);
	});

	it('incomplete LPAQ', () => {
		cy.visit('/appeals-service/appeals-list');
		appealsListPage.clickAppealFromList(18);
		appealsListPage.clickReviewLpaq(7);
		appealsListPage.selectRadioButtonByValue('Incomplete');
		appealsListPage.clickButtonByText('Continue');
		appealsListPage.chooseCheckboxByIndex(1);
		appealsListPage.fillInput1('Hello here is some extra info, have a nice day 7384_+!£ =');
		appealsListPage.clickButtonByText('Continue');
		updateDueDatePage.enterDateDay('29');
		updateDueDatePage.enterDateMonth('12');
		updateDueDatePage.enterDateYear('2024');
		appealsListPage.clickButtonByText('Save and Continue');
		appealsListPage.clickButtonByText('Confirm');
		appealsListPage.clickLinkByText('Go to case details');
		const status = 'Incomplete';
		const testData = { rowIndex: 1, cellIndex: 0, textToMatch: status, strict: true };
		appealsListPage.verifyTableCellText(testData);
	});

	it('incomplete LPAQ add another', () => {
		cy.visit('/appeals-service/appeals-list');
		appealsListPage.clickAppealFromList(18);
		appealsListPage.clickReviewLpaq(7);
		appealsListPage.selectRadioButtonByValue('Incomplete');
		appealsListPage.clickButtonByText('Continue');
		appealsListPage.chooseCheckboxByIndex(1);
		appealsListPage.fillInput1('Hello here is some extra info, have a nice day 7384_+!£ =');
		appealsListPage.addAnotherButton();
		appealsListPage.fillInput2('Hello here is some extra info, have a nice day 7384_+!£ =');
		appealsListPage.clickButtonByText('Continue');
		updateDueDatePage.enterDateDay('29');
		updateDueDatePage.enterDateMonth('12');
		updateDueDatePage.enterDateYear('2024');
		appealsListPage.clickButtonByText('Save and Continue');
		appealsListPage.clickButtonByText('Confirm');
		appealsListPage.clickLinkByText('Go to case details');
		const status = 'Incomplete';
		const testData = { rowIndex: 1, cellIndex: 0, textToMatch: status, strict: true };
		appealsListPage.verifyTableCellText(testData);
	});

	it('incomplete LPAQ skip due date', () => {
		cy.visit('/appeals-service/appeals-list');
		appealsListPage.clickAppealFromList(18);
		appealsListPage.clickReviewLpaq(7);
		appealsListPage.selectRadioButtonByValue('Incomplete');
		appealsListPage.clickButtonByText('Continue');
		appealsListPage.fillInput1('Hello here is some extra info, have a nice day 7384_+!£ =');
		appealsListPage.chooseCheckboxByIndex(1);
		appealsListPage.clickButtonByText('Continue');
		appealsListPage.clickButtonByText('Skip');
		appealsListPage.clickButtonByText('Confirm');
		appealsListPage.clickLinkByText('Go to case details');
		const status = 'Incomplete';
		const testData = { rowIndex: 1, cellIndex: 0, textToMatch: status, strict: true };
		appealsListPage.verifyTableCellText(testData);
	});
});
