// @ts-nocheck
/// <reference types="cypress"/>

import { users } from '../../fixtures/users';
import { AppealsListPage } from '../../page_objects/appealsListPage';
import { UpdateDueDatePage } from '../../page_objects/updateDueDatePage';
const appealsListPage = new AppealsListPage();
const updateDueDatePage = new UpdateDueDatePage();

describe.skip('Appeals feature', () => {
	beforeEach(() => {
		cy.login(users.appeals.caseAdmin);
	});

	it('Change to acommpanied site visit from case timetable', () => {
		cy.visit('/appeals-service/appeals-list');
		appealsListPage.clickAppealFromList(20);
		appealsListPage.clickChangeVisitTypeHasCaseTimetable();
		appealsListPage.selectRadioButtonByValue('Accompanied');
		updateDueDatePage.enterVisitDay('29');
		updateDueDatePage.enterVisitMonth('12');
		updateDueDatePage.enterVisitYear('3000');
		updateDueDatePage.enterVisitStartTimeHour('10');
		updateDueDatePage.enterVisitStartTimeMiinute('00');
		updateDueDatePage.enterVisitEndTimeHour('14');
		updateDueDatePage.enterVisitEndTimeMinute('00');
		appealsListPage.clickButtonByText('Confirm');
		appealsListPage.clickLinkByText('Go back to case details'),
			appealsListPage.checkAnswer('Visit type', 'Accompanied');
	});

	it('Change to access required site visit from case timetable', () => {
		cy.visit('/appeals-service/appeals-list');
		appealsListPage.clickAppealFromList(20);
		appealsListPage.clickChangeVisitTypeHasCaseTimetable();
		appealsListPage.selectRadioButtonByValue('Access required');
		updateDueDatePage.enterVisitDay('29');
		updateDueDatePage.enterVisitMonth('12');
		updateDueDatePage.enterVisitYear('20300024');
		updateDueDatePage.enterVisitStartTimeHour('10');
		updateDueDatePage.enterVisitStartTimeMiinute('00');
		updateDueDatePage.enterVisitEndTimeHour('14');
		updateDueDatePage.enterVisitEndTimeMinute('00');
		appealsListPage.clickButtonByText('Schedule site visit');
		appealsListPage.clickLinkByText('Go back to case details'),
			appealsListPage.checkAnswer('Visit type', 'Access required');
	});

	it('Change to Unacommpanied site visit without time from case timetable', () => {
		cy.visit('/appeals-service/appeals-list');
		appealsListPage.clickAppealFromList(20);
		appealsListPage.clickChangeVisitTypeHasCaseTimetable();
		appealsListPage.selectRadioButtonByValue('Unaccompanied');
		updateDueDatePage.enterVisitDay('29');
		updateDueDatePage.enterVisitMonth('12');
		updateDueDatePage.enterVisitYear('3000');
		appealsListPage.clickButtonByText('Schedule site visit');
		appealsListPage.clickLinkByText('Go back to case details'),
			appealsListPage.checkAnswer('Visit type', 'Unaccompanied');
	});

	it('Change to Unacommpanied site visit with time from case timetable', () => {
		cy.visit('/appeals-service/appeals-list');
		appealsListPage.clickAppealFromList(20);
		appealsListPage.clickChangeVisitTypeHasCaseTimetable();
		appealsListPage.selectRadioButtonByValue('Unaccompanied');
		updateDueDatePage.enterVisitDay('29');
		updateDueDatePage.enterVisitMonth('12');
		updateDueDatePage.enterVisitYear('3000');
		updateDueDatePage.enterVisitStartTimeHour('10');
		updateDueDatePage.enterVisitStartTimeMiinute('00');
		updateDueDatePage.enterVisitEndTimeHour('14');
		updateDueDatePage.enterVisitEndTimeMinute('00');
		appealsListPage.clickButtonByText('Schedule site visit');
		appealsListPage.clickLinkByText('Go back to case details'),
			appealsListPage.checkAnswer('Visit type', 'Unaccompanied');
	});

	it('Change to acommpanied site visit from Site details', () => {
		cy.visit('/appeals-service/appeals-list');
		appealsListPage.clickAppealFromList(20);
		appealsListPage.clickChangeVisitTypeHasSiteDetails();
		appealsListPage.selectRadioButtonByValue('Accompanied');
		appealsListPage.clickButtonByText('Continue');
		appealsListPage.validateBannerMessage('Site visit type has been selected'),
			appealsListPage.checkAnswer('Visit Type', 'Accompanied');
	});

	it('Change to access required site visit from Site details', () => {
		cy.visit('/appeals-service/appeals-list');
		appealsListPage.clickAppealFromList(20);
		appealsListPage.clickChangeVisitTypeHasSiteDetails();
		appealsListPage.selectRadioButtonByValue('Access required');
		appealsListPage.clickButtonByText('Continue');
		appealsListPage.validateBannerMessage('Site visit type has been selected'),
			appealsListPage.checkAnswer('Visit Type', 'Access required');
	});

	it('Change to Unacommpanied site visit from Site details', () => {
		cy.visit('/appeals-service/appeals-list');
		appealsListPage.clickAppealFromList(20);
		appealsListPage.clickChangeVisitTypeHasSiteDetails();
		appealsListPage.selectRadioButtonByValue('Unaccompanied');
		appealsListPage.clickButtonByText('Continue');
		appealsListPage.validateBannerMessage('Site visit type has been selected'),
			appealsListPage.checkAnswer('Visit Type', 'Unaccompanied');
	});
});
