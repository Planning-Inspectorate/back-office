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
			const expectedBeforePreAppDates = {
				'Date first notified of project': '',
				'Project published on website': '',
				'Anticipated submission date published': projectInfo.publishedDate,
				'Anticipated submission date internal': projectInfo.internalDateFullFormatted,
				'Section 46 notification': ''
			};

			const expectedBeforeScreeningScoping = {
				'Screening opinion sought': '',
				'Screening opinion issued': '',
				'Scoping opinion sought': '',
				'Scoping opinion issued': ''
			};

			const generatePreAppDatesData = () => {
				const data = {
					'Date first notified of project': getRandomFormattedDate(),
					'Project published on website': getRandomFormattedDate(),
					'Anticipated submission date published': getRandomQuarterDate(),
					'Anticipated submission date internal': getRandomFormattedDate(),
					'Section 46 notification': getRandomFormattedDate()
				};
				return data;
			};

			const generateScreeningScopingData = () => {
				const data = {
					'Screening opinion sought': getRandomFormattedDate(),
					'Screening opinion issued': getRandomFormattedDate(),
					'Scoping opinion sought': getRandomFormattedDate(),
					'Scoping opinion issued': getRandomFormattedDate()
				};
				return data;
			};

			const expectedAfterPreAppDates = generatePreAppDatesData();
			const expectedAfterScreeningScoping = generateScreeningScopingData();

			applicationsHomePage.loadCurrentCase();
			validateProjectOverview(projectInfo, true);
			casePage.clickLinkByText('Key dates');
			casePage.showAllSections();
			keyDatesPage.validateSectionDates('Pre-application dates', expectedBeforePreAppDates);
			keyDatesPage.validateSectionDates('Screening and Scoping', expectedBeforeScreeningScoping);
			keyDatesPage.clickManageDates('Pre-application dates');
			keyDatesPage.preApplication(expectedAfterPreAppDates);
			keyDatesPage.clickButtonByText('Save and return');
			cy.reload();
			casePage.showAllSections();
			keyDatesPage.validateSectionDates('Pre-application dates', expectedAfterPreAppDates);
		});
	});
});
