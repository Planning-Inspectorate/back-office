// @ts-nocheck
import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { ApplicationsHomePage } from '../../page_objects/applicationsHomePage';
import { faker } from '@faker-js/faker';
import { CreateCasePage } from '../../page_objects/createCasePage';
import { projectInformation } from '../utils/createProjectInformation';
import { SECTORS } from '../utils/options';

const applicationHomePage = new ApplicationsHomePage();
const createCasePage = new CreateCasePage();
const pi = projectInformation();

When('the user creates a new case', function () {
	applicationHomePage.clickCreateNewCaseButton();
	createCasePage.sections.nameAndDescription.fillCaseName(pi.projectName);
	createCasePage.sections.nameAndDescription.fillCaseDescription(pi.projectDescription);
	createCasePage.clickSaveAndContinue();
	createCasePage.sections.sector.chooseSector(SECTORS[0]);
	createCasePage.clickSaveAndContinue();
	createCasePage.sections.subSector.chooseSubsector(pi.subsector);
	createCasePage.clickSaveAndContinue();
	createCasePage.sections.geographicalInformation.fillLocation(pi.projectLocation);
	createCasePage.sections.geographicalInformation.fillEastingGridRef(pi.gridRefEasting);
	createCasePage.sections.geographicalInformation.fillNorthingGridRef(pi.gridRefNorthing);
	createCasePage.clickSaveAndContinue();
	createCasePage.sections.regions.chooseRegions(pi.regions);
	createCasePage.clickSaveAndContinue();
	createCasePage.sections.zoomLevel.chooseZoomLevel(pi.zoomLevel);
	createCasePage.clickSaveAndContinue();
	createCasePage.sections.projectEmail.fillCaseEmail(pi.projectEmail);
	createCasePage.clickSaveAndContinue();
	createCasePage.sections.applicantInformationAvailable.chooseAll();
	createCasePage.clickSaveAndContinue();
	createCasePage.sections.applicantOrganisation.fillOrganisationName(pi.orgName);
	createCasePage.clickSaveAndContinue();
	createCasePage.sections.applicantName.fillApplicantFirstName(pi.applicantFirstName);
	createCasePage.sections.applicantName.fillApplicantLastName(pi.applicantLastName);
	createCasePage.clickSaveAndContinue();
	createCasePage.sections.applicantAddress.fillApplicantPostcode(pi.postcode);
	createCasePage.clickButtonByText('Find address');
	createCasePage.chooseSelectItemByIndex(2);
	createCasePage.clickSaveAndContinue();
	createCasePage.sections.applicantWebsite.fillApplicantWebsite(pi.applicantWebsite);
	createCasePage.clickSaveAndContinue();
	createCasePage.sections.applicantEmail.fillApplicantEmail(pi.applicantEmail);
	createCasePage.clickSaveAndContinue();
	createCasePage.sections.applicantPhoneNumber.fillPhoneNumber(pi.applicantPhoneNumber);
	createCasePage.clickSaveAndContinue();
	createCasePage.sections.keyDates.fillSumbissionPublishedDate(pi.publishedDate);
	createCasePage.sections.keyDates.fillInternalAnticipatedDay(pi.internalDateDay);
	createCasePage.sections.keyDates.fillInternalAnticipatedMonth(pi.internalDateMonth);
	createCasePage.sections.keyDates.fillInternalAnticipatedYear(pi.internalDateYear);
	createCasePage.clickSaveAndContinue();
});

Then('the user checks their answers', function () {
	createCasePage.sections.checkYourAnswers.validatePage();

	// P R O J E C T  I N F O R M A T I O N
	createCasePage.sections.checkYourAnswers.checkAnswer('Project name', pi.projectName);
	createCasePage.sections.checkYourAnswers.checkAnswer(
		'Project description',
		pi.projectDescription
	);
	createCasePage.sections.checkYourAnswers.checkAnswer('Sector', 'Business and Commercial');
	createCasePage.sections.checkYourAnswers.checkAnswer('Subsector', pi.subsector);
	createCasePage.sections.checkYourAnswers.checkAnswer('Project location', pi.projectLocation);
	createCasePage.sections.checkYourAnswers.checkAnswer('Grid reference Easting', pi.gridRefEasting);
	createCasePage.sections.checkYourAnswers.checkAnswer(
		'Grid reference Northing',
		pi.gridRefNorthing
	);
	createCasePage.sections.checkYourAnswers.checkAnswer('Region(s)', pi.regions.sort().join(','));
	createCasePage.sections.checkYourAnswers.checkAnswer('Map zoom level', pi.zoomLevel);

	// A P P L I C A N T  I N F O R M A T I O N
	createCasePage.sections.checkYourAnswers.checkAnswer('Organisation name', pi.orgName);
	createCasePage.sections.checkYourAnswers.checkAnswer('Contact name', pi.applicantFullName);
	createCasePage.sections.checkYourAnswers.checkAnswer('Address', pi.applicantFullAddress);
	createCasePage.sections.checkYourAnswers.checkAnswer('Website', pi.applicantWebsite);
	createCasePage.sections.checkYourAnswers.checkAnswer('Email address', pi.applicantEmail);
	createCasePage.sections.checkYourAnswers.checkAnswer('Telephone number', pi.applicantPhoneNumber);

	// K E Y  D A T E S
	createCasePage.sections.checkYourAnswers.checkAnswer(
		'Anticipated submission date published',
		pi.publishedDate
	);
	createCasePage.sections.checkYourAnswers.checkAnswer(
		'Anticipated submission date internal',
		pi.internalDateFull
	);
});

When('the user completes the creation of the new case', function () {
	createCasePage.clickButtonByText('I accept - confirm creation of a new case');
	createCasePage.sections.caseCreated.validateCaseCreated();
});
