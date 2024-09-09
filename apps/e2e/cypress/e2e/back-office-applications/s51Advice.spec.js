// @ts-nocheck

import { SearchResultsPage } from '../../page_objects/searchResultsPage';
import { users } from '../../fixtures/users';
import { CreateCasePage } from '../../page_objects/createCasePage';
import { projectInformation } from '../../support/utils/createProjectInformation';
import { ApplicationsHomePage } from '../../page_objects/applicationsHomePage';
import { S51AdvicePage } from '../../page_objects/s51AdvicePage.js';
import { s51AdviceDetails } from '../../support/utils/createS51Advice.js';
import { updateProjectRegions } from '../../support/utils/utils';

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
	let projectInfo;

	before(() => {
		projectInfo = projectInformation({ excludeWales: true });
		cy.login(applicationsUsers.caseAdmin);
		createCasePage.createCase(projectInfo);
	});

	describe('in an English region', () => {
		beforeEach(() => {
			applicationsHomePage.loadCurrentCase();
			s51AdvicePage.clickLinkByText(texts.projectDocumentationLinkText);
			s51AdvicePage.clickLinkByText(texts.s51AdviceLinkText);
			s51AdvicePage.clickButtonByText(texts.createS51AdviceButtonText);
		});

		it('As a user able to create S51 Advice - Enquirer Full Details', () => {
			const details = s51AdviceDetails();
			const titlefirst = 'firsttitle';
			s51AdvicePage.completeS51Advice(
				details,
				{
					organisation: details.organisation,
					firstName: details.firstName,
					lastName: details.lastName
				},
				titlefirst
			);
			s51AdvicePage.publishS51WithoutWelshFields();
		});

		it('As a user able to create S51 Advice - Enquirer Name Only', () => {
			const details = s51AdviceDetails();
			const titlesecond = 'secondtitle';
			s51AdvicePage.completeS51Advice(
				details,
				{
					firstName: details.firstName,
					lastName: details.lastName
				},
				titlesecond
			);
		});

		it('As a user able to create S51 Advice - Enquirer Org Only', () => {
			const details = s51AdviceDetails();
			const titlethird = 'thirdtitle';
			s51AdvicePage.completeS51Advice(details, { organisation: details.organisation }, titlethird);
		});
	});

	describe('updating English fields', () => {
		beforeEach(() => {
			applicationsHomePage.loadCurrentCase();
			s51AdvicePage.clickLinkByText(texts.projectDocumentationLinkText);
			s51AdvicePage.clickLinkByText(texts.s51AdviceLinkText);
		});

		it('As a user able to update the enquiry details', () => {
			s51AdvicePage.clickLinkByText('View/edit advice');
			s51AdvicePage.clickLinkByText('Enquiry details');
			s51AdvicePage.fillEnquiryDetail('enquiry details updated');
			s51AdvicePage.validateBannerMessage('Enquiry details updated');
		});
	});

	describe('updating region to be Wales', () => {
		before(() => {
			if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
				applicationsHomePage.loadCurrentCase();
				updateProjectRegions(['Wales']);
			}
		});

		beforeEach(() => {
			if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
				applicationsHomePage.loadCurrentCase();
				s51AdvicePage.clickLinkByText(texts.projectDocumentationLinkText);
				s51AdvicePage.clickLinkByText(texts.s51AdviceLinkText);
			}
		});

		it('As a user able to view an existing S51 Advice with Welsh fields included', () => {
			if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
				s51AdvicePage.clickLinkByText('View/edit advice');
				s51AdvicePage.basePageElements.linkByText('S51 title in Welsh');
				s51AdvicePage.basePageElements.linkByText('Enquiry details in Welsh');
				s51AdvicePage.basePageElements.linkByText('Advice given in Welsh');
			}
		});

		it('As a user able to prevent an S51 Advice being published without completed welsh fields', () => {
			if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
				s51AdvicePage.selectRadioButtonByValue('Ready to publish');
				s51AdvicePage.chooseCheckboxByIndex(1);
				s51AdvicePage.clickButtonByText('Apply changes');
				s51AdvicePage.validateErrorMessageIsInSummary(
					'Enter missing information about the S51 advice'
				);
				s51AdvicePage.validateErrorMessage('Enter missing information about the S51 advice');
				s51AdvicePage.clickLinkByText('View/edit advice');
				s51AdvicePage.checkAdviceProperty('Status', 'Not checked');
			}
		});

		it('As a user able to edit the title in welsh for an existing S51 Advice', () => {
			if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
				const details = s51AdviceDetails();
				s51AdvicePage.clickLinkByText('View/edit advice');
				s51AdvicePage.clickLinkByText('S51 title in Welsh');
				s51AdvicePage.clickButtonByText('Save and return');
				s51AdvicePage.validateErrorMessage('Enter the S51 title in Welsh');
				s51AdvicePage.fillTitleWelsh('X'.repeat(300), true);
				s51AdvicePage.validateErrorMessage(
					'The S51 title in Welsh must be 255 characters or fewer'
				);
				s51AdvicePage.fillTitleWelsh(details.titleWelsh, true);
				s51AdvicePage.validateBannerMessage('S51 title in Welsh updated');
			}
		});

		it('As a user able to edit the enquiry details in welsh for an existing S51 Advice', () => {
			if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
				const details = s51AdviceDetails();
				s51AdvicePage.clickLinkByText('View/edit advice');
				s51AdvicePage.clickLinkByText('Enquiry details in Welsh');
				s51AdvicePage.clickButtonByText('Save and return');
				s51AdvicePage.validateErrorMessage('Enter the S51 Enquiry details in Welsh');
				s51AdvicePage.fillEnquiryDetailsWelsh('X'.repeat(300), true);
				s51AdvicePage.validateErrorMessage(
					'The S51 Enquiry details in Welsh must be 255 characters or fewer'
				);
				s51AdvicePage.fillEnquiryDetailsWelsh(details.enquiryDetailsWelsh, true);
				s51AdvicePage.validateBannerMessage('Enquiry details in Welsh updated');
			}
		});

		it('As a user able to edit the advice details in welsh for an existing S51 Advice', () => {
			if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
				const details = s51AdviceDetails();
				s51AdvicePage.clickLinkByText('View/edit advice');
				s51AdvicePage.clickLinkByText('Advice given in Welsh');
				s51AdvicePage.clickButtonByText('Save and return');
				s51AdvicePage.validateErrorMessage('Enter the S51 Advice given in Welsh');
				s51AdvicePage.fillAdviceDetailsWelsh('X'.repeat(300), true);
				s51AdvicePage.validateErrorMessage(
					'The S51 Advice given in Welsh must be 255 characters or fewer'
				);
				s51AdvicePage.fillAdviceDetailsWelsh(details.adviceDetailsWelsh, true);
				s51AdvicePage.validateBannerMessage('Advice given in Welsh updated');
			}
		});

		it('As a user able to publish a S51 Advice with completed welsh fields', () => {
			if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
				const details = s51AdviceDetails();
				s51AdvicePage.clickLinkByText('View/edit advice');
				s51AdvicePage.clickLinkByText('S51 title in Welsh');
				s51AdvicePage.fillTitleWelsh(details.titleWelsh, true);
				s51AdvicePage.clickLinkByText('Enquiry details in Welsh');
				s51AdvicePage.fillEnquiryDetailsWelsh(details.enquiryDetailsWelsh, true);
				s51AdvicePage.clickLinkByText('Advice given in Welsh');
				s51AdvicePage.fillAdviceDetailsWelsh(details.adviceDetailsWelsh, true);
				s51AdvicePage.clickBackLink();
				s51AdvicePage.selectRadioButtonByValue('Ready to publish');
				s51AdvicePage.chooseCheckboxByIndex(1);
				s51AdvicePage.clickButtonByText('Apply changes');
				s51AdvicePage.clickLinkByText('View/edit advice');
				s51AdvicePage.checkAdviceProperty('Status', 'Ready to publish');
			}
		});
	});

	describe('in a Welsh region', () => {
		beforeEach(() => {
			if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
				applicationsHomePage.loadCurrentCase();
				s51AdvicePage.clickLinkByText(texts.projectDocumentationLinkText);
				s51AdvicePage.clickLinkByText(texts.s51AdviceLinkText);
				s51AdvicePage.clickButtonByText(texts.createS51AdviceButtonText);
			}
		});

		it('As a user able to create and publish an S51 Advice', () => {
			if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
				const details = s51AdviceDetails();
				s51AdvicePage.completeS51Advice(
					details,
					{ organisation: details.organisation },
					'Welsh Advice'
				);
				s51AdvicePage.basePageElements.linkByText('S51 title in Welsh');
				s51AdvicePage.basePageElements.linkByText('Enquiry details in Welsh');
				s51AdvicePage.basePageElements.linkByText('Advice given in Welsh');
			}
		});
	});
});
