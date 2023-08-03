// @ts-nocheck
/// <reference types="cypress"/>

import { SearchResultsPage } from '../../page_objects/searchResultsPage';
import { users } from '../../fixtures/users';
import { CreateCasePage } from '../../page_objects/createCasePage';
import { projectInformation } from '../../support/utils/createProjectInformation';
import { ApplicationsHomePage } from '../../page_objects/applicationsHomePage';
import { S51AdvicePage } from '../../page_objects/s51AdvicePage.js';
import { s51AdviceDetails } from '../../support/utils/createS51Advice.js';

const applicationsHomePage = new ApplicationsHomePage();
const createCasePage = new CreateCasePage();
const searchResultsPage = new SearchResultsPage();
const s51AdvicePage = new S51AdvicePage();
const { applications: applicationsUsers } = users;

const texts = {
	projectDocumentationLinkText: 'Project documentation',
	s51AdviceLinkText: 'S51 advice',
	createS51AdviceButtonText: 'Create new S51 advice',
	successMessageText: 'Timetable item successfully created'
};

describe('Section 51 Advice', () => {
	let projectInfo = projectInformation();
	let caseRef;

	before(() => {
		cy.login(applicationsUsers.caseAdmin);
		createCasePage.createCase(projectInfo);
	});

	beforeEach(() => {
		cy.visit('/');
		caseRef = Cypress.env('currentCreatedCase');
		applicationsHomePage.searchFor(caseRef);
		searchResultsPage.clickTopSearchResult();
		s51AdvicePage.clickLinkByText(texts.projectDocumentationLinkText);
		s51AdvicePage.clickLinkByText(texts.s51AdviceLinkText);
		s51AdvicePage.clickButtonByText(texts.createS51AdviceButtonText);
	});

	it('S51 Advice - Enquirer Full Details', () => {
		const {
			firstName,
			lastName,
			organisation,
			title,
			methodOfEnquiry,
			enquirerFull,
			day,
			month,
			year,
			dateFullFormatted,
			enquiryDetails,
			adviserName,
			adviceDetails
		} = s51AdviceDetails();
		s51AdvicePage.fillTitle(title);
		s51AdvicePage.fillEnquirerDetails({ firstName, lastName, organisation });
		s51AdvicePage.chooseEnquiryMethod(methodOfEnquiry);
		s51AdvicePage.fillEnquiryDetails({ day, month, year, enquiryDetails });
		s51AdvicePage.fillAdviserDetails(adviserName);
		s51AdvicePage.fillAdviceDetails({ day, month, year, adviceDetails });
		s51AdvicePage.checkAnswer('S51 title', title);
		s51AdvicePage.checkAnswer('Enquirer', enquirerFull);
		s51AdvicePage.checkAnswer('Enquiry method', methodOfEnquiry.toLowerCase());
		s51AdvicePage.checkAnswer('Enquiry date', dateFullFormatted);
		s51AdvicePage.checkAnswer('Enquiry details', enquiryDetails);
		s51AdvicePage.checkAnswer('Advise given by (internal use only)', adviserName);
		s51AdvicePage.checkAnswer('Date advice given', dateFullFormatted);
		s51AdvicePage.checkAnswer('Advice given', adviceDetails);
	});

	it('S51 Advice - Enquirer Name Only', () => {
		const {
			firstName,
			lastName,
			title,
			methodOfEnquiry,
			day,
			month,
			year,
			dateFullFormatted,
			enquiryDetails,
			adviserName,
			adviceDetails
		} = s51AdviceDetails();
		s51AdvicePage.fillTitle(title);
		s51AdvicePage.fillEnquirerDetails({ firstName, lastName });
		s51AdvicePage.chooseEnquiryMethod(methodOfEnquiry);
		s51AdvicePage.fillEnquiryDetails({ day, month, year, enquiryDetails });
		s51AdvicePage.fillAdviserDetails(adviserName);
		s51AdvicePage.fillAdviceDetails({ day, month, year, adviceDetails });
		s51AdvicePage.checkAnswer('S51 title', title);
		s51AdvicePage.checkAnswer('Enquirer', `${firstName} ${lastName}`);
		s51AdvicePage.checkAnswer('Enquiry method', methodOfEnquiry.toLowerCase());
		s51AdvicePage.checkAnswer('Enquiry date', dateFullFormatted);
		s51AdvicePage.checkAnswer('Enquiry details', enquiryDetails);
		s51AdvicePage.checkAnswer('Advise given by (internal use only)', adviserName);
		s51AdvicePage.checkAnswer('Date advice given', dateFullFormatted);
		s51AdvicePage.checkAnswer('Advice given', adviceDetails);
	});

	it('S51 Advice - Enquirer Org Only', () => {
		const {
			organisation,
			title,
			methodOfEnquiry,
			day,
			month,
			year,
			dateFullFormatted,
			enquiryDetails,
			adviserName,
			adviceDetails
		} = s51AdviceDetails();
		s51AdvicePage.fillTitle(title);
		s51AdvicePage.fillEnquirerDetails({ organisation });
		s51AdvicePage.chooseEnquiryMethod(methodOfEnquiry);
		s51AdvicePage.fillEnquiryDetails({ day, month, year, enquiryDetails });
		s51AdvicePage.fillAdviserDetails(adviserName);
		s51AdvicePage.fillAdviceDetails({ day, month, year, adviceDetails });
		s51AdvicePage.checkAnswer('S51 title', title);
		s51AdvicePage.checkAnswer('Enquirer', organisation);
		s51AdvicePage.checkAnswer('Enquiry method', methodOfEnquiry.toLowerCase());
		s51AdvicePage.checkAnswer('Enquiry date', dateFullFormatted);
		s51AdvicePage.checkAnswer('Enquiry details', enquiryDetails);
		s51AdvicePage.checkAnswer('Advise given by (internal use only)', adviserName);
		s51AdvicePage.checkAnswer('Date advice given', dateFullFormatted);
		s51AdvicePage.checkAnswer('Advice given', adviceDetails);
	});
});
