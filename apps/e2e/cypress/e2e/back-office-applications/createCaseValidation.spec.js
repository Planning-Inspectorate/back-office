// @ts-nocheck
/// <reference types="cypress"/>

import { users } from '../../fixtures/users';
import { ApplicationsHomePage } from '../../page_objects/applicationsHomePage';
import { CreateCasePage } from '../../page_objects/createCasePage';
import { faker } from '@faker-js/faker';
import { projectInformation } from '../../support/utils/createProjectInformation';

const createCasePage = new CreateCasePage();
const applicationsHomePage = new ApplicationsHomePage();

context('Create A Case - Input Validation', () => {
	const projectInfo = projectInformation();

	before(() => {
		cy.clearAllCookies();
		cy.login(users.caseAdmin);
		cy.visit('/');
		createCasePage.verifyCaseAdminIsSignedIn();
	});

	it('Should validate that all input validations in the create case flow', () => {
		cy.visit('/');
		applicationsHomePage.clickCreateNewCaseButton();
		createCasePage.clickSaveAndContinue();
		createCasePage.validateErrorMessageCountOnPage(2);
		createCasePage.validateErrorMessage('Enter the name of the project');
		createCasePage.validateErrorMessage('Enter the description of the project');
		createCasePage.sections.nameAndDescription.fillCaseName(projectInfo.projectName);
		createCasePage.sections.nameAndDescription.fillCaseDescription(projectInfo.projectDescription);
		createCasePage.clickSaveAndContinue();

		createCasePage.clickSaveAndContinue();
		createCasePage.validateErrorMessageCountOnPage(1);
		createCasePage.validateErrorMessage('Choose the sector of the project');

		createCasePage.sections.sector.chooseSector(projectInfo.sector);
		createCasePage.clickSaveAndContinue();
		createCasePage.clickSaveAndContinue();
		createCasePage.validateErrorMessageCountOnPage(1);
		createCasePage.validateErrorMessage('Choose the subsector of the project');
		createCasePage.sections.subSector.chooseSubsector(projectInfo.sector, projectInfo.subsector);
		createCasePage.clickSaveAndContinue();

		createCasePage.clickSaveAndContinue();
		createCasePage.validateErrorMessageCountOnPage(3);
		createCasePage.validateErrorMessage('Enter the project location');
		createCasePage.validateErrorMessage('Enter the Grid reference Easting');
		createCasePage.validateErrorMessage('Enter the Grid reference Northing');
		createCasePage.sections.geographicalInformation.fillLocation(projectInfo.projectLocation);
		createCasePage.sections.geographicalInformation.fillEastingGridRef(projectInfo.gridRefEasting);
		createCasePage.sections.geographicalInformation.fillNorthingGridRef(
			projectInfo.gridRefNorthing
		);
		createCasePage.clickSaveAndContinue();

		createCasePage.clickSaveAndContinue();
		createCasePage.validateErrorMessageCountOnPage(1);
		createCasePage.validateErrorMessage('Choose at least one region');
		createCasePage.sections.regions.chooseRegions(projectInfo.regions);
		createCasePage.clickSaveAndContinue();

		createCasePage.clickSaveAndContinue();
		createCasePage.clickSaveAndContinue();
		createCasePage.clickSaveAndContinue();
		createCasePage.clickSaveAndContinue();
		createCasePage.validateErrorMessageCountOnPage(4);
		createCasePage.validateErrorMessage('You must enter the anticipated submission date internal');

		createCasePage.sections.keyDates.fillInternalAnticipatedDay('10');
		createCasePage.sections.keyDates.fillInternalAnticipatedMonth('10');
		createCasePage.sections.keyDates.fillInternalAnticipatedYear('2022');

		createCasePage.clickSaveAndContinue();
		createCasePage.validateErrorMessageCountOnPage(4);
		createCasePage.validateErrorMessage(
			'The anticipated submission date internal must be in the future'
		);

		createCasePage.sections.keyDates.fillSumbissionPublishedDate(projectInfo.publishedDate);
		createCasePage.sections.keyDates.fillInternalAnticipatedDay(projectInfo.internalDateDay);
		createCasePage.sections.keyDates.fillInternalAnticipatedMonth(projectInfo.internalDateMonth);
		createCasePage.sections.keyDates.fillInternalAnticipatedYear(projectInfo.internalDateYear);
		createCasePage.clickSaveAndContinue();
		createCasePage.sections.checkYourAnswers.checkAllAnswers(projectInfo, true);
		createCasePage.clickButtonByText('I accept - confirm creation of a new case');
		createCasePage.sections.caseCreated.validateCaseCreated();
	});
});
