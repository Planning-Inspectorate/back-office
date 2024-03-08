// @ts-nocheck
/// <reference types="cypress"/>

import { users } from '../../fixtures/users';
import { ApplicationsHomePage } from '../../page_objects/applicationsHomePage';
import { CreateCasePage } from '../../page_objects/createCasePage';
import { projectInformation } from '../../support/utils/createProjectInformation';

const createCasePage = new CreateCasePage();
const applicationsHomePage = new ApplicationsHomePage();
const projectInfo = projectInformation();
const { applications: applicationsUsers } = users;

describe('Create A Case', () => {


	context('As a Case Team Admin User', () => {
		it('Should successfully create a case as an admin', () => {
			cy.login(applicationsUsers.caseAdmin);
			cy.visit('/');
			const projectInfo = projectInformation();
			createCasePage.createCase(projectInfo);
		});

		it('Should validate that all input validation errors in the create case flow', () => {
			cy.login(applicationsUsers.caseAdmin);
			cy.visit('/');
			applicationsHomePage.clickCreateNewCaseButton();
			createCasePage.clickSaveAndContinue();
			createCasePage.validateErrorMessageCountOnPage(2);
			createCasePage.validateErrorMessage('Enter the name of the project');
			createCasePage.validateErrorMessage('Enter the description of the project');
			createCasePage.sections.nameAndDescription.fillCaseName(projectInfo.projectName);
			createCasePage.sections.nameAndDescription.fillCaseDescription(
				projectInfo.projectDescription
			);
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
			createCasePage.sections.geographicalInformation.fillEastingGridRef(
				projectInfo.gridRefEasting
			);
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
			createCasePage.sections.checkYourAnswers.checkAllAnswers(projectInfo, true);
			createCasePage.clickButtonByText('I accept - confirm creation of a new case');
			createCasePage.sections.caseCreated.validateCaseCreated();
		});
	});

});
