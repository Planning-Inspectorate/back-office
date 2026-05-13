// @ts-nocheck

import { users } from '../../fixtures/users';
import { ApplicationsHomePage } from '../../page_objects/applicationsHomePage';
import { CreateCasePage } from '../../page_objects/createCasePage';
import { projectInformation } from '../../support/utils/createProjectInformation';
import { validateSectorSubsectorValues } from '../../support/utils/utils.js';
import { SearchResultsPage } from '../../page_objects/searchResultsPage';

const createCasePage = new CreateCasePage();
const applicationsHomePage = new ApplicationsHomePage();
const searchResultsPage = new SearchResultsPage();
const { applications: applicationsUsers } = users;

describe('Create Case with sector as training', () => {
	let projectInfo;

	const createTrainingCase = () => {
		projectInfo = projectInformation({
			includeTrainingSector: true,
			sector: 'Training',
			subsector: 'Training'
		});
		cy.login(applicationsUsers.caseAdmin);
		cy.visit('/');
		createCasePage.clickButtonByText('Create case');
		createCasePage.sections.nameAndDescription.fillCaseName(projectInfo.projectName);
		createCasePage.sections.nameAndDescription.fillCaseDescription(projectInfo.projectDescription);
		createCasePage.clickSaveAndContinue();
		createCasePage.sections.sector.selectTrainingAsSectorSubsector();

		createCasePage.sections.geographicalInformation.fillLocation(projectInfo.projectLocation);
		createCasePage.sections.geographicalInformation.fillEastingGridRef(projectInfo.gridRefEasting);
		createCasePage.sections.geographicalInformation.fillNorthingGridRef(
			projectInfo.gridRefNorthing
		);
		createCasePage.clickSaveAndContinue();
		createCasePage.sections.regions.chooseRegions(projectInfo.regions);
		createCasePage.clickSaveAndContinue();
		createCasePage.clickSaveAndContinue();
		createCasePage.clickSaveAndContinue();
		createCasePage.sections.applicantOrganisation.fillOrganisationName(projectInfo.orgName);
		createCasePage.clickSaveAndContinue();
		createCasePage.clickSaveAndContinue();
		createCasePage.clickSaveAndContinue();
		createCasePage.clickButtonByText('I accept - confirm creation of a new case');
		createCasePage.sections.caseCreated.validateCaseCreated();
	};

	beforeEach(function () {
		if (!Cypress.env('featureFlags')['applics-1036-training-sector']) {
			this.skip();
		}
	});

	it('As a user able to create case with sector and sub-sector as training', () => {
		createTrainingCase();
		cy.then(() => {
			expect(Cypress.env('currentCreatedCase')).to.match(/^TRAIN/);
		});
	});

	it('As a user able to verify the sector and sub sector names', () => {
		createTrainingCase();
		const caseRef = Cypress.env('currentCreatedCase');
		expect(caseRef).to.match(/^TRAIN/);
		applicationsHomePage.searchFor(caseRef);
		searchResultsPage.clickTopSearchResult();
		validateSectorSubsectorValues('Training', 'Training');
	});
});
