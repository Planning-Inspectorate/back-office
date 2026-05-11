// @ts-nocheck

import { users } from '../../fixtures/users';
import { ApplicationsHomePage } from '../../page_objects/applicationsHomePage';
import { CreateCasePage } from '../../page_objects/createCasePage';
import { SearchResultsPage } from '../../page_objects/searchResultsPage';
import { getRandomQuarterDate, validateProjectOverview } from '../../support/utils/utils';
import { projectInformation } from '../../support/utils/createProjectInformation';
import { CasePage } from '../../page_objects/casePage';
import { getRandomFormattedDate } from '../../support/utils/utils.js';

import { faker } from '@faker-js/faker';
import { KeyDatesPage } from '../../page_objects/keyDatesPage.js';

const applicationsHomePage = new ApplicationsHomePage();
const casePage = new CasePage();
const createCasePage = new CreateCasePage();
const searchResultsPage = new SearchResultsPage();
const keyDatesPage = new KeyDatesPage();
const { applications: applicationsUsers } = users;

describe('Update Key Dates', () => {
	context('As Case Team Admin', () => {
		let projectInfo = projectInformation();

		before(() => {
			cy.login(applicationsUsers.caseAdmin);
			createCasePage.createCase(projectInfo, true);
		});

		it('As a  user able to update the case information', () => {
			const expectedBefore = {
				'Date first notified of project': '',
				'Date of inception meeting': '',
				'Programme document submission date': '',
				'Section 46 notification': '',
				'Statutory consultation period end date': '',
				'Date for submission of draft documents': '',
				'Project published on website': '',
				'Anticipated submission date published': projectInfo.publishedDate,
				'Anticipated submission date internal': projectInfo.internalDateFullFormatted
			};

			const generateData = () => {
				const data = {
					'Date first notified of project': getRandomFormattedDate(),
					'Date of inception meeting': getRandomFormattedDate(),
					'Programme document submission date': getRandomFormattedDate(),
					'Section 46 notification': getRandomFormattedDate(),
					'Statutory consultation period end date': getRandomFormattedDate(),
					'Date for submission of draft documents': getRandomFormattedDate(),
					'Project published on website': getRandomFormattedDate(),
					'Anticipated submission date published': getRandomQuarterDate(),
					'Anticipated submission date internal': getRandomFormattedDate()
				};

				return data;
			};

			const expectedAfter = generateData();

			applicationsHomePage.loadCurrentCase();
			validateProjectOverview(projectInfo, true);
			casePage.clickLinkByText('Key dates');
			casePage.showAllSections();
			keyDatesPage.validateSectionDates('Pre-application', expectedBefore);
			keyDatesPage.clickManageDates('Pre-application');
			keyDatesPage.preApplication(expectedAfter);
			keyDatesPage.clickButtonByText('Save and return');
			cy.reload();
			casePage.showAllSections();
			keyDatesPage.validateSectionDates('Pre-application', expectedAfter);
		});
	});
});
