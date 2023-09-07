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

	it('Change to acommpanied site visit from case timetable', () => {
		cy.visit('/appeals-service/appeals-list');
		appealsListPage.clickAppealFromList(20);
		appealsListPage.clickChangeVisitTypeHasCaseTimetable(15);
		appealsListPage.selectRadioButtonByValue('Accompanied');
		updateDueDatePage.enterVisitDay('29');
		updateDueDatePage.enterVisitMonth('12');
		updateDueDatePage.enterVisitYear('2024');
		updateDueDatePage.enterVisitStartTimeHour('10');
		updateDueDatePage.enterVisitStartTimeMiinute('15');
		updateDueDatePage.enterVisitEndTimeHour('14');
		updateDueDatePage.enterVisitEndTimeMinute('00');
		appealsListPage.clickButtonByText('Schedule site visit');
		appealsListPage.clickLinkByText('Go back to case details'),
			appealsListPage.checkAnswer('site visit', '29 December 2024');
	});

	it('Change to access required site visit from case timetable', () => {
		cy.visit('/appeals-service/appeals-list');
		appealsListPage.clickAppealFromList(20);
		appealsListPage.clickChangeVisitTypeHasCaseTimetable(15);
		appealsListPage.selectRadioButtonByValue('Access required');
		updateDueDatePage.enterVisitDay('29');
		updateDueDatePage.enterVisitMonth('12');
		updateDueDatePage.enterVisitYear('2024');
		updateDueDatePage.enterVisitStartTimeHour('10');
		updateDueDatePage.enterVisitStartTimeMiinute('15');
		updateDueDatePage.enterVisitEndTimeHour('14');
		updateDueDatePage.enterVisitEndTimeMinute('00');
		appealsListPage.clickButtonByText('Schedule site visit');
		appealsListPage.clickLinkByText('Go back to case details'),
			appealsListPage.checkAnswer('site visit', '29 December 2024');
	});

	it('Change to Unacommpanied site visit without time from case timetable', () => {
		cy.visit('/appeals-service/appeals-list');
		appealsListPage.clickAppealFromList(20);
		appealsListPage.clickChangeVisitTypeHasCaseTimetable(15);
		appealsListPage.selectRadioButtonByValue('Unaccompanied');
		updateDueDatePage.enterVisitDay('29');
		updateDueDatePage.enterVisitMonth('12');
		updateDueDatePage.enterVisitYear('2024');
		appealsListPage.clickButtonByText('Schedule site visit');
		appealsListPage.clickLinkByText('Go back to case details'),
			appealsListPage.checkAnswer('site visit', '29 December 2024');
	});

	it('Change to Unacommpanied site visit with time from case timetable', () => {
		cy.visit('/appeals-service/appeals-list');
		appealsListPage.clickAppealFromList(20);
		appealsListPage.clickChangeVisitTypeHasCaseTimetable(15);
		appealsListPage.selectRadioButtonByValue('Unaccompanied');
		updateDueDatePage.enterVisitDay('29');
		updateDueDatePage.enterVisitMonth('12');
		updateDueDatePage.enterVisitYear('2024');
		updateDueDatePage.enterVisitStartTimeHour('10');
		updateDueDatePage.enterVisitStartTimeMiinute('15');
		updateDueDatePage.enterVisitEndTimeHour('14');
		updateDueDatePage.enterVisitEndTimeMinute('00');
		appealsListPage.clickButtonByText('Schedule site visit');
		appealsListPage.clickLinkByText('Go back to case details'),
			appealsListPage.checkAnswer('site visit', '29 December 2024');
	});

	it('Change to acommpanied site visit from Site details', () => {
		cy.visit('/appeals-service/appeals-list');
		appealsListPage.clickAppealFromList(20);
		appealsListPage.clickChangeVisitTypeHasSiteDetails(15);
		appealsListPage.selectRadioButtonByValue('Accompanied');
		appealsListPage.clickButtonByText('Continue');
		appealsListPage.validateBannerMessage('Site visit type has been selected'),
			appealsListPage.checkAnswer('Visit Type', 'Accompanied');
	});

	it('Change to access required site visit from Site details', () => {
		cy.visit('/appeals-service/appeals-list');
		appealsListPage.clickAppealFromList(20);
		appealsListPage.clickChangeVisitTypeHasSiteDetails(15);
		appealsListPage.selectRadioButtonByValue('Access required');
		appealsListPage.clickButtonByText('Continue');
		appealsListPage.validateBannerMessage('Site visit type has been selected'),
			appealsListPage.checkAnswer('Visit Type', 'Access required');
	});

	it('Change to Unacommpanied site visit from Site details', () => {
		cy.visit('/appeals-service/appeals-list');
		appealsListPage.clickAppealFromList(20);
		appealsListPage.clickChangeVisitTypeHasSiteDetails(15);
		appealsListPage.selectRadioButtonByValue('Unaccompanied');
		appealsListPage.clickButtonByText('Continue');
		appealsListPage.validateBannerMessage('Site visit type has been selected'),
			appealsListPage.checkAnswer('Visit Type', 'Unaccompanied');
	});
});
