// @ts-nocheck

import { users } from '../../fixtures/users';
import { ApplicationsHomePage } from '../../page_objects/applicationsHomePage';
import { CreateCasePage } from '../../page_objects/createCasePage';
import { projectInformation } from '../../support/utils/createProjectInformation';

const createCasePage = new CreateCasePage();
const applicationsHomePage = new ApplicationsHomePage();
const projectInfo = projectInformation();
const { applications: applicationsUsers } = users;

describe('Create A Case', () => {
	context('As a User', () => {
		it('Should successfully create a case as a user', () => {
			cy.login(applicationsUsers.caseAdmin);
			cy.visit('/');
			const projectInfo = projectInformation();
			createCasePage.createCase(projectInfo);
		});

		it('As a user able to validate that all input validation errors in the create case flow', () => {
			cy.login(applicationsUsers.caseAdmin);
			cy.visit('/');
			applicationsHomePage.verifyPageTitle('Applications - NSIP Applications');
			applicationsHomePage.clickCreateNewCaseButton();
			createCasePage.clickSaveAndContinue();
			applicationsHomePage.verifyPageTitle('Create new case - Enter name and description', {
				error: true
			});
			createCasePage.validateErrorMessageCountOnPage(2);
			createCasePage.validateErrorMessage('Enter project name');
			createCasePage.validateErrorMessage('Enter project description');
			createCasePage.sections.nameAndDescription.fillCaseName(projectInfo.projectName);
			createCasePage.sections.nameAndDescription.fillCaseDescription(
				projectInfo.projectDescription
			);
			createCasePage.clickSaveAndContinue();
			applicationsHomePage.verifyPageTitle('Create new case - Choose a sector');

			createCasePage.clickSaveAndContinue();
			applicationsHomePage.verifyPageTitle('Create new case - Choose a sector', { error: true });
			createCasePage.validateErrorMessageCountOnPage(1);
			createCasePage.validateErrorMessage('Choose the sector of the project');

			createCasePage.sections.sector.chooseSector(projectInfo.sector);
			createCasePage.clickSaveAndContinue();
			applicationsHomePage.verifyPageTitle('Create new case - Choose a subsector');
			createCasePage.clickSaveAndContinue();
			applicationsHomePage.verifyPageTitle('Create new case - Choose a subsector', { error: true });
			createCasePage.validateErrorMessageCountOnPage(1);
			createCasePage.validateErrorMessage('Choose the subsector of the project');
			createCasePage.sections.subSector.chooseSubsector(projectInfo.sector, projectInfo.subsector);
			createCasePage.clickSaveAndContinue();
			applicationsHomePage.verifyPageTitle('Create new case - Enter geographical information');

			createCasePage.clickSaveAndContinue();
			applicationsHomePage.verifyPageTitle('Create new case - Enter geographical information', {
				error: true
			});
			createCasePage.validateErrorMessageCountOnPage(3);
			createCasePage.validateErrorMessage('Enter project location');
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
			applicationsHomePage.verifyPageTitle('Create new case - Choose one or multiple regions');

			createCasePage.clickSaveAndContinue();
			applicationsHomePage.verifyPageTitle('Create new case - Choose one or multiple regions', {
				error: true
			});
			createCasePage.validateErrorMessageCountOnPage(1);
			createCasePage.validateErrorMessage('Choose at least one region');
			createCasePage.sections.regions.chooseRegions(projectInfo.regions);
			createCasePage.clickSaveAndContinue();
			applicationsHomePage.verifyPageTitle('Create new case - Choose map zoom level');

			createCasePage.clickSaveAndContinue();
			applicationsHomePage.verifyPageTitle('Create new case - Enter the project email (optional)');
			createCasePage.clickSaveAndContinue();
			applicationsHomePage.verifyPageTitle(
				'Create new case - Choose the Applicant information you have available'
			);
			createCasePage.clickSaveAndContinue();
			applicationsHomePage.verifyPageTitle('Create new case - Enter the key dates of the project');
			createCasePage.clickSaveAndContinue();
			applicationsHomePage.verifyPageTitle('Create new case - Check your answers');
			createCasePage.sections.checkYourAnswers.checkAllAnswers(projectInfo, true);
			createCasePage.clickButtonByText('I accept - confirm creation of a new case');
			createCasePage.sections.caseCreated.validateCaseCreated();
		});
	});
});
