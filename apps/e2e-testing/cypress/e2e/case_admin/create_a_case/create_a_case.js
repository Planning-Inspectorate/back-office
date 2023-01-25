// @ts-nocheck
import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { ApplicationsHomePage } from 'apps/e2e-testing/cypress/page_objects/applicationsHomePage';
import { faker } from '@faker-js/faker';
import { CreateCasePage } from 'apps/e2e-testing/cypress/page_objects/createCasePage';

const applicationHomePage = new ApplicationsHomePage();
const createCasePage = new CreateCasePage();

const now = Date.now();
let caseName = `Automation_Test_Case_${now}`;
let orgName = `Automation_Test_Org_${now}`;
let firstName = faker.name.firstName();
let lastName = faker.name.lastName();
let description = faker.lorem.sentence();
let geographicalLocation = faker.lorem.sentence();
const caseTeamEmail = faker.internet.email();
const applicantEmail = `${firstName}.${lastName}@email.com`;
const website = faker.internet.url();
const phoneNumber = faker.phone.number('+4479########');
const dateSubmissionPublished = `Q1 ${new Date().getFullYear() + 1}`;
const dateInternal = faker.date.future(1);

When('the user starts the creation of a new case', function () {
	applicationHomePage.clickCreateNewCaseButton();
});

When('the user enters a name and description for the new case', function () {
	createCasePage.sections.nameAndDescription.validatePage();
	createCasePage.sections.nameAndDescription.fillCaseName(caseName);
	createCasePage.sections.nameAndDescription.fillCaseDescription(description);
});

When('the user enters geographical information for the new case', function () {
	createCasePage.sections.geographicalInformation.validatePage();
	createCasePage.sections.geographicalInformation.fillLocation(geographicalLocation);
	createCasePage.sections.geographicalInformation.fillEastingGridRef('123456');
	createCasePage.sections.geographicalInformation.fillNorthingGridRef('123456');
});

When('the user enters the case team email address for the new case', function () {
	createCasePage.sections.projectEmail.validatePage();
	createCasePage.sections.projectEmail.fillCaseEmail(caseTeamEmail);
});

When("the user enters the applicant's organisation name for the new case", function () {
	createCasePage.sections.applicantOrganisation.validatePage();
	createCasePage.sections.applicantOrganisation.fillOrganisationName(orgName);
});

When("the user enters the applicant's first and last name for the new case", function () {
	createCasePage.sections.applicantName.validatePage();
	createCasePage.sections.applicantName.fillApplicantFirstName(firstName);
	createCasePage.sections.applicantName.fillApplicantLastName(lastName);
});

When("the user enters the applicant's website for the new case", function () {
	createCasePage.sections.applicantWebsite.validatePage();
	createCasePage.sections.applicantWebsite.fillApplicantWebsite(website);
});

When("the user enters the applicant's email for the new case", function () {
	createCasePage.sections.applicantEmail.validatePage();
	createCasePage.sections.applicantEmail.fillApplicantEmail(applicantEmail);
});

When("the user enters the applicant's phone number for the new case", function () {
	createCasePage.sections.applicantPhoneNumber.validatePage();
	createCasePage.sections.applicantPhoneNumber.fillPhoneNumber(phoneNumber);
});

When(
	'the user enters {string} into the key dates anticipated submission date input',
	function (dateAsQuarter) {
		createCasePage.sections.keyDates.validatePage();
		createCasePage.sections.keyDates.fillSumbissionPublishedDate(dateAsQuarter);
	}
);

When(
	'the user enters {string} {string} {string} into the key dates internal anticipated submission date input',
	function (dd, mm, yyyy) {
		createCasePage.sections.keyDates.validatePage();
		createCasePage.sections.keyDates.fillInternalAnticipatedDay(dd);
		createCasePage.sections.keyDates.fillInternalAnticipatedMonth(mm);
		createCasePage.sections.keyDates.fillInternalAnticipatedYear(yyyy);
	}
);

Then('the user should confirm that a new case has been created', function () {
	createCasePage.sections.caseCreated.validateCaseCreated();
});
