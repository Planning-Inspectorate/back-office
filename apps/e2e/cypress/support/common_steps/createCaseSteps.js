// @ts-nocheck
/// <reference types="cypress"/>

import { When, Then, Before, After } from '@badeball/cypress-cucumber-preprocessor';
import { ApplicationsHomePage } from '../../page_objects/applicationsHomePage';
import { CreateCasePage } from '../../page_objects/createCasePage';
import { SECTORS, SUBSECTORS, REGIONS } from '../utils/options';
import { faker } from '@faker-js/faker';

const applicationHomePage = new ApplicationsHomePage();
const createCasePage = new CreateCasePage();
let projectInfo;
let projectInfoNew;

const fileOne = `${faker.lorem.word(5)}.json`;
const fileTwo = `${faker.lorem.word(5)}.json`;

after(() => {
	cy.deleteFile([fileOne, fileTwo]);
});

Before({ tags: '@InitCaseInfo' }, () => {
	Cypress.env({ mainProjectFile: fileOne, secondProjectFile: fileTwo });
	cy.createProjectInformation(fileOne, fileTwo);
	cy.fixture(fileOne).then((file) => {
		projectInfo = file;
	});
	cy.fixture(fileTwo).then((file) => {
		projectInfoNew = file;
	});
});

Before({ tags: '@CreateCaseForTest' }, () => {
	createCasePage.createCase(projectInfo);
});

// W H E N - P R O J E C T  I N F O R M A T I O N
When('the user starts the creation of a new case', function () {
	applicationHomePage.clickCreateNewCaseButton();
});

When('the user enters a name and description for the new case', function () {
	createCasePage.sections.nameAndDescription.validatePage();
	createCasePage.sections.nameAndDescription.fillCaseName(projectInfo.projectName);
	createCasePage.sections.nameAndDescription.fillCaseDescription(projectInfo.projectDescription);
	createCasePage.clickSaveAndContinue();
});

When('the user enters geographical information for the new case', function () {
	createCasePage.sections.geographicalInformation.validatePage();
	createCasePage.sections.geographicalInformation.fillLocation(projectInfo.projectLocation);
	createCasePage.sections.geographicalInformation.fillEastingGridRef(projectInfo.gridRefEasting);
	createCasePage.sections.geographicalInformation.fillNorthingGridRef(projectInfo.gridRefNorthing);
	createCasePage.clickSaveAndContinue();
});

When('the user enters the case email address for the new case', function () {
	createCasePage.sections.projectEmail.validatePage();
	createCasePage.sections.projectEmail.fillCaseEmail(projectInfo.projectEmail);
	createCasePage.clickSaveAndContinue();
});

When('the user chooses the {string} sector option', function (sectorOption) {
	const options = SECTORS;
	const index = options.indexOf(sectorOption);
	if (index === -1) {
		throw new Error(
			`Error: ${sectorOption} does not exist\n Available options: ${options.join(',')}}`
		);
	}
	createCasePage.chooseRadioBtnByIndex(index);
	createCasePage.clickSaveAndContinue();
});

When('the user chooses the {string} subsector option', function (subsectorOption) {
	const options = SUBSECTORS;
	const index = options.indexOf(subsectorOption);
	if (index === -1) {
		throw new Error(
			`Error: ${sectorOption} does not exist\n Available options: ${options.join(',')}}`
		);
	}
	createCasePage.chooseRadioBtnByIndex(index);
	createCasePage.clickSaveAndContinue();
});

When('the user chooses the sector for the case', function () {
	createCasePage.sections.sector.chooseSector(projectInfo.sector);
	createCasePage.clickSaveAndContinue();
});

When('the user chooses the subsector for the case', function () {
	createCasePage.sections.subSector.chooseSubsector(projectInfo.sector, projectInfo.subsector);
	createCasePage.clickSaveAndContinue();
});

When('the user chooses the regions for the new case', function () {
	createCasePage.sections.regions.chooseRegions(projectInfo.regions);
	createCasePage.clickSaveAndContinue();
});

When('the user chooses the zoom level for the new case', function () {
	createCasePage.sections.zoomLevel.chooseZoomLevel(projectInfo.zoomLevel);
	createCasePage.clickSaveAndContinue();
});

// W H E N - A P P L I C A N T  I N F O R M A T I O N
When('the user chooses all the available options for applicant information available', function () {
	createCasePage.sections.applicantInformationAvailable.chooseAll();
	createCasePage.clickSaveAndContinue();
});

When("the user enters the applicant's organisation name for the new case", function () {
	createCasePage.sections.applicantOrganisation.validatePage();
	createCasePage.sections.applicantOrganisation.fillOrganisationName(projectInfo.orgName);
	createCasePage.clickSaveAndContinue();
});

When("the user enters the applicant's first and last name for the new case", function () {
	createCasePage.sections.applicantName.validatePage();
	createCasePage.sections.applicantName.fillApplicantFirstName(projectInfo.applicantFirstName);
	createCasePage.sections.applicantName.fillApplicantLastName(projectInfo.applicantLastName);
	createCasePage.clickSaveAndContinue();
});

When("the user enters the applicant's website for the new case", function () {
	createCasePage.sections.applicantWebsite.validatePage();
	createCasePage.sections.applicantWebsite.fillApplicantWebsite(projectInfo.applicantWebsite);
	createCasePage.clickSaveAndContinue();
});

When("the user enters the applicant's email for the new case", function () {
	createCasePage.sections.applicantEmail.validatePage();
	createCasePage.sections.applicantEmail.fillApplicantEmail(projectInfo.applicantEmail);
	createCasePage.clickSaveAndContinue();
});

When("the user enters the applicant's phone number for the new case", function () {
	createCasePage.sections.applicantPhoneNumber.validatePage();
	createCasePage.sections.applicantPhoneNumber.fillPhoneNumber(projectInfo.applicantPhoneNumber);
	createCasePage.clickSaveAndContinue();
});

// W H E N - K E Y  D A T E S
When('the user enters the anticipated submission date', function () {
	createCasePage.sections.keyDates.validatePage();
	createCasePage.sections.keyDates.fillSumbissionPublishedDate(projectInfo.publishedDate);
});

When(
	/^the user enters the internal anticipated submission date (\d{2}\/\d{2}\/\d{4}|correctly)?$/,
	function (date) {
		createCasePage.sections.keyDates.validatePage();
		console.log(date);
		const validDate = date !== 'correctly';
		const [dd, mm, yyyy] = date.split('/');
		const day = validDate ? dd : projectInfo.internalDateDay;
		const month = validDate ? mm : projectInfo.internalDateMonth;
		const year = validDate ? yyyy : projectInfo.internalDateYear;
		createCasePage.sections.keyDates.fillInternalAnticipatedDay(day);
		createCasePage.sections.keyDates.fillInternalAnticipatedMonth(month);
		createCasePage.sections.keyDates.fillInternalAnticipatedYear(year);
	}
);

// W H E N - C O N F I R M A T I O N
When('the user confirms the creation of the new case', function () {
	createCasePage.clickButtonByText('I accept - confirm creation of a new case');
});

// T H E N - C O N F I R M A T I O N
Then('the user should confirm that a new case has been created', function () {
	createCasePage.sections.caseCreated.validateCaseCreated();
});

Then(
	/^the user should successfully verify (complete|mandatory) answers on the summary page against form inputs$/,
	function (checkType) {
		const mandatoryOnly = checkType === 'mandatory';
		createCasePage.sections.checkYourAnswers.checkAllAnswers(projectInfo, mandatoryOnly);
	}
);
