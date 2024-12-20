// @ts-nocheck
import { Page } from './basePage';
import { faker } from '@faker-js/faker';
import { upperFirst } from 'lodash-es';
import { S51AdvicePropertiesPage } from './s51AdviceProperties.js';
import { enquirerString } from '../support/utils/utils.js';

export class S51AdvicePage extends Page {
	elements = {
		titleInput: () => cy.get('#title'),
		titleWelshInput: () => cy.get('#titleWelsh'),
		redactionRadio: (redacted = false) => cy.get(redacted ? '#isRedacted-2' : '#isRedacted'),
		statusRadio: (status) => this.basePageElements.radioButton().contains(status),
		enquirerFirstNameInput: () => cy.get('#enquirerFirstName'),
		enquirerLastNameInput: () => cy.get('#enquirerLastName'),
		enquirerOrganisationInput: () => cy.get('#enquirerOrganisation'),
		enquiryDayInput: () => cy.get('#enquiryDate\\.day'),
		enquiryMonthInput: () => cy.get('#enquiryDate\\.month'),
		enquiryYearInput: () => cy.get('#enquiryDate\\.year'),
		enquiryDetailsInput: () => cy.get('#enquiryDetails'),
		enquiryDetailsWelshInput: () => cy.get('#enquiryDetailsWelsh'),
		adviserInput: () => cy.get('#adviser'),
		adviceDateDayInput: () => cy.get('#adviceDate\\.day'),
		adviceDateMonthInput: () => cy.get('#adviceDate\\.month'),
		adviceDateYearInput: () => cy.get('#adviceDate\\.year'),
		adviceDetailsInput: () => cy.get('#adviceDetails'),
		adviceDetailsWelshInput: () => cy.get('#adviceDetailsWelsh'),
		answerCell: (question, exact = false) => {
			const regEx = exact ? new RegExp(`^${question}$`, 'g') : new RegExp(question);
			return cy.contains(this.selectors.tableCell, regEx).next();
		},
		answerListItem: (question, exact = false) => {
			const regEx = exact ? new RegExp(`^${question}$`, 'g') : new RegExp(question);
			return cy.contains(this.selectors.summaryListKey, regEx).next();
		},
		changeLink: (question) =>
			cy.contains(this.selectors.tableCell, question, { matchCase: false }).nextUntil('a'),
		changetitleLink: () =>
			cy.get('#advice-properties > dl > div:nth-child(1) > dd.govuk-summary-list__actions > a'),
		saveAndReturnTile: () => cy.get('#main-content > form > button'),
		verifyTitleUpdated: () =>
			cy.get('#advice-properties > dl > div:nth-child(1) > dd.govuk-summary-list__value', {
				timeout: 3000
			}),
		verifyTitle: () => cy.get('.govuk-table__body > :nth-child(1) > :nth-child(2)')
	};

	checkAnswer(question, answer, options) {
		const { assertStrict = true, questionExactText = false } = options || {};
		this.elements.answerCell(question, questionExactText).then(($elem) => {
			const assertion = assertStrict ? 'equal' : 'include';
			cy.wrap($elem.text().trim()).should(assertion, answer.trim());
		});
	}

	checkAdviceProperty(question, answer, options) {
		const { assertStrict = true, questionExactText = false } = options || {};
		this.elements.answerListItem(question, questionExactText).then(($elem) => {
			const assertion = assertStrict ? 'equal' : 'include';
			cy.wrap($elem.text().trim()).should(assertion, answer.trim());
		});
	}

	clickChangeLink(question) {
		this.elements.changeLink(question).click();
	}

	fillTitle(title) {
		this.elements.titleInput().type(title);
		this.clickContinue();
	}

	fillTitleWelsh(titleWelsh, isEdit) {
		this.elements.titleWelshInput().clear().type(titleWelsh);
		this.clickSaveAndReturn();
	}

	fillEnquirerDetails(opts) {
		const { firstName, lastName, organisation } = opts;
		if (firstName) this.elements.enquirerFirstNameInput().type(firstName);
		if (lastName) this.elements.enquirerLastNameInput().type(lastName);
		if (organisation) this.elements.enquirerOrganisationInput().type(organisation);
		this.clickContinue();
	}

	fillEnquiryDetail(enquiryDetails) {
		this.elements.enquiryDetailsInput().clear().type(enquiryDetails);
		this.clickSaveAndReturn();
	}

	fillEnquiryDetails(opts) {
		this.elements.enquiryDayInput().type(opts.day);
		this.elements.enquiryMonthInput().type(opts.month);
		this.elements.enquiryYearInput().type(opts.year);
		this.elements.enquiryDetailsInput().type(opts.enquiryDetails);
		this.clickContinue();
	}

	fillEnquiryDetailsWelsh(enquiryDetailsWelsh, isEdit) {
		this.elements.enquiryDetailsWelshInput().clear().type(enquiryDetailsWelsh);
		this.clickSaveAndReturn();
	}

	fillAdviserDetails(adviserName) {
		this.elements.adviserInput().type(adviserName);
		this.clickContinue();
	}

	fillAdviceDetail(adviceDetails) {
		this.elements.adviceDetailsInput().clear().type(adviceDetails);
		this.clickSaveAndReturn();
	}

	fillAdviceDetails(opts) {
		this.elements.adviceDateDayInput().type(opts.day);
		this.elements.adviceDateMonthInput().type(opts.month);
		this.elements.adviceDateYearInput().type(opts.year);
		this.elements.adviceDetailsInput().type(opts.adviceDetails);
		this.clickContinue();
	}

	fillAdviceDetailsWelsh(adviceDetailsWelsh, isEdit) {
		this.elements.adviceDetailsWelshInput().clear().type(adviceDetailsWelsh);
		this.clickSaveAndReturn();
	}

	chooseEnquiryMethod(method) {
		cy.contains(method).click();
		this.clickContinue();
	}

	completeS51Advice(mainDetails, enquirerDetails, titledetails) {
		const {
			methodOfEnquiry,
			day,
			month,
			year,
			dateFullFormatted,
			enquiryDetails,
			adviserName,
			adviceDetails
		} = mainDetails;

		this.fillTitle(titledetails);
		this.fillEnquirerDetails({ ...enquirerDetails });
		this.chooseEnquiryMethod(methodOfEnquiry);
		this.fillEnquiryDetails({ day, month, year, enquiryDetails });
		this.fillAdviserDetails(adviserName);
		this.fillAdviceDetails({ day, month, year, adviceDetails });
		this.checkAnswer('S51 title', titledetails);
		this.checkAnswer('Enquirer', enquirerString({ ...enquirerDetails }), {
			assertStrict: true
		});
		this.checkAnswer('Enquiry method', methodOfEnquiry);
		this.checkAnswer('Enquiry date', dateFullFormatted);
		this.checkAnswer('Enquiry details', enquiryDetails);
		this.checkAnswer('Advice given by', adviserName);
		this.checkAnswer('Date advice given', dateFullFormatted);
		this.checkAnswer('Advice given', adviceDetails, { questionExactText: true });

		this.clickButtonByText('Create S51 advice item');
		this.basePageElements.successBanner().then(($banner) => {
			const text = $banner.text().trim();
			expect(text).to.include('New S51 advice item created');
		});
		cy.reload();
		this.basePageElements.successBanner().should('not.exist');

		const propertiesPage = new S51AdvicePropertiesPage();
		propertiesPage.checkAllProperties(mainDetails, enquirerDetails, titledetails);
	}
	verifyS51PubishandUnpublish() {
		this.clickBackLink();
		this.setOverallStatus('Ready to publish');
		this.selectAllDocuments();
		this.clickButtonByText('Apply changes');
		cy.get('.govuk-body-m').click();
		cy.get('#selectAll').click();
		cy.get('.govuk-button').click();
		cy.get('.govuk-panel__title').contains('S51 advice item successfully published');
		cy.get('.display--flex > .govuk-link').click();
		this.clickLinkByText('View/edit advice');
		this.clickButtonByText('Unpublish');
		this.clickButtonByText('Unpublish S51 advice');
		cy.get('.govuk-panel__title').contains('S51 advice item successfully unpublished');
		cy.get('.display--flex > .govuk-link').click();
	}
	setOverallStatus(status) {
		this.elements.statusRadio(status).click({ force: true });
	}
	verifyTile(title) {
		this.elements.verifyTitle().contains(title);
	}
	publishS51IncludingWelshFields() {
		cy.get('.govuk-body-m').click();
		cy.get('#selectAll').click();
		cy.get('.govuk-button').click();
		cy.get('.govuk-panel__title').contains('S51 advice item successfully published');
	}

	publishS51WithoutWelshFields() {
		this.clickBackLink();
		this.selectAllDocuments();
		this.setOverallStatus('Ready to publish');
		this.clickButtonByText('Apply changes');
		cy.get(
			'#main-content > div:nth-child(3) > div > div.govuk-width-container > div:nth-child(2) > div.govuk-grid-column-one-third > a'
		).click();
		cy.get('#selectAll').click();
		cy.get('.govuk-button').click();
		cy.get('.govuk-panel__title').contains('S51 advice item successfully published');
	}
}
