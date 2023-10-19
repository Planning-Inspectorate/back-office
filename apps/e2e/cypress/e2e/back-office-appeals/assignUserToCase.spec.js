// @ts-nocheck
/// <reference types="cypress"/>

import { users } from '../../fixtures/users';
import { AppealsListPage } from '../../page_objects/appealsListPage';
import { SearchResultsPage } from '../../page_objects/searchResultsPage';
import { projectInformation } from '../../support/utils/createProjectInformation';

const page = new AppealsListPage();
describe('Appeals feature', () => {
	beforeEach(() => {
		cy.login(users.appeals.caseAdmin);
	});

	it('Case officer should be able to assign themselves to a case using name search', () => {
		cy.visit('/appeals-service/appeals-list');
		page.clickAppealFromList(18);
		page.clickCaseOfficer(15);
		page.nationalListSearch('case');
		page.basePageElements.summaryListValue('caseteamofficer.test@planninginspectorate.gov.uk');
		page.clickLinkByText('Assign');
		page.selectRadioButtonByValue('Yes');
		page.clickButtonByText('Continue');
		page.validateBannerMessage('Case officer has been assigned');
		page.checkAnswerSummaryValue('caseteamofficer.test@planninginspectorate.gov.uk');
	});

	it('Inspector should be able to assign themselves to a case using name search', () => {
		cy.visit('/appeals-service/appeals-list');
		page.clickAppealFromList(18);
		page.clickInspector(15);
		page.nationalListSearch('test');
		page.basePageElements.summaryListValue('inspectorappeals.test@planninginspectorate.gov.uk');
		page.clickLinkByText('Assign');
		page.selectRadioButtonByValue('Yes');
		page.clickButtonByText('Continue');
		page.validateBannerMessage('Inspector has been assigned');
		page.checkAnswerSummaryValue('inspectorappeals.test@planninginspectorate.gov.uk');
	});

	it('Case officer should be able to change assigned user', () => {
		cy.visit('/appeals-service/appeals-list');
		page.clickAppealFromList(18);
		page.clickCaseOfficer(16);
		page.nationalListSearch('Rachel');
		page.basePageElements.summaryListValue('rachel.harvey@planninginspectorate.gov.uk');
		page.clickLinkByText('Assign');
		page.selectRadioButtonByValue('Yes');
		page.clickButtonByText('Continue');
		page.validateBannerMessage('Case officer has been assigned');
		page.checkAnswerSummaryValue('Rachel HarveyRachel.Harvey@planninginspectorate.gov.uk');
	});

	it('Inspector should be able to change assigned user', () => {
		cy.visit('/appeals-service/appeals-list');
		page.clickAppealFromList(18);
		page.clickInspector(17);
		page.nationalListSearch('Rachel');
		page.basePageElements.summaryListValue('rachel.harvey@planninginspectorate.gov.uk');
		page.clickLinkByText('Assign');
		page.selectRadioButtonByValue('Yes');
		page.clickButtonByText('Continue');
		page.validateBannerMessage('Inspector has been assigned');
		page.checkAnswerSummaryValue('Rachel HarveyRachel.Harvey@planninginspectorate.gov.uk');
	});

	it('Case officer should be able to remove assigned user', () => {
		cy.visit('/appeals-service/appeals-list');
		page.clickAppealFromList(18);
		page.clickCaseOfficer(16);
		page.basePageElements.summaryListValue('rachel.harvey@planninginspectorate.gov.uk');
		page.clickLinkByText('Remove');
		page.selectRadioButtonByValue('Yes');
		page.clickButtonByText('Continue');
		page.selectRadioButtonByValue('No');
		page.clickButtonByText('Continue');
		page.validateBannerMessage('Case officer has been removed');
		page.checkValueIsBlank(15);
	});

	it('Inspector should be able to remove assigned user', () => {
		cy.visit('/appeals-service/appeals-list');
		page.clickAppealFromList(18);
		page.clickInspector(17);
		page.basePageElements.summaryListValue('rachel.harvey@planninginspectorate.gov.uk');
		page.clickLinkByText('Remove');
		page.selectRadioButtonByValue('Yes');
		page.clickButtonByText('Continue');
		page.selectRadioButtonByValue('No');
		page.clickButtonByText('Continue');
		page.validateBannerMessage('Inspector has been removed');
		page.checkValueIsBlank(16);
	});
});
