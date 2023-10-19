// @ts-nocheck
import { Page } from './basePage';
import { faker } from '@faker-js/faker';
import { S51AdvicePropertiesPage } from './s51AdviceProperties.js';
import { enquirerString } from '../support/utils/utils.js';

export class S51AdvicePage extends Page {
	elements = {
		titleInput: () => cy.get('#title'),
		enquirerFirstNameInput: () => cy.get('#enquirerFirstName'),
		enquirerLastNameInput: () => cy.get('#enquirerLastName'),
		enquirerOrganisationInput: () => cy.get('#enquirerOrganisation'),
		enquiryDayInput: () => cy.get('#enquiryDate\\.day'),
		enquiryMonthInput: () => cy.get('#enquiryDate\\.month'),
		enquiryYearInput: () => cy.get('#enquiryDate\\.year'),
		enquiryDetailsInput: () => cy.get('#enquiryDetails'),
		adviserInput: () => cy.get('#adviser'),
		adviceDateDayInput: () => cy.get('#adviceDate\\.day'),
		adviceDateMonthInput: () => cy.get('#adviceDate\\.month'),
		adviceDateYearInput: () => cy.get('#adviceDate\\.year'),
		adviceDetailsInput: () => cy.get('#adviceDetails'),
		answerCell: (question) => cy.contains(this.selectors.tableCell, new RegExp(question)).next(),
		changeLink: (question) =>
			cy.contains(this.selectors.tableCell, question, { matchCase: false }).nextUntil('a'),
		changetitleLink: () => cy.get('#advice-properties > dl > div:nth-child(1) > dd.govuk-summary-list__actions > a'),
        saveAndReturnTile: () => cy.get('#main-content > form > button'),
        verifyTitleUpdated: () => cy.get('#advice-properties > dl > div:nth-child(1) > dd.govuk-summary-list__value')


	};

	checkAnswer(question, answer, strict = true) {
		this.elements.answerCell(question).then(($elem) => {
			const assertion = strict ? 'equal' : 'include';
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

	fillEnquirerDetails(opts) {
		const { firstName, lastName, organisation } = opts;
		if (firstName) this.elements.enquirerFirstNameInput().type(firstName);
		if (lastName) this.elements.enquirerLastNameInput().type(lastName);
		if (organisation) this.elements.enquirerOrganisationInput().type(organisation);
		this.clickContinue();
	}

	fillEnquiryDetails(opts) {
		this.elements.enquiryDayInput().type(opts.day);
		this.elements.enquiryMonthInput().type(opts.month);
		this.elements.enquiryYearInput().type(opts.year);
		this.elements.enquiryDetailsInput().type(opts.enquiryDetails);
		this.clickContinue();
	}

	fillAdviserDetails(adviserName) {
		this.elements.adviserInput().type(adviserName);
		this.clickContinue();
	}

	fillAdviceDetails(opts) {
		this.elements.adviceDateDayInput().type(opts.day);
		this.elements.adviceDateMonthInput().type(opts.month);
		this.elements.adviceDateYearInput().type(opts.year);
		this.elements.adviceDetailsInput().type(opts.adviceDetails);
		this.clickContinue();
	}

	chooseEnquiryMethod(method) {
		cy.contains(method).click();
		this.clickContinue();
	}

	completeS51Advice(mainDetails, enquirerDetails) {
		const {
			title,
			methodOfEnquiry,
			day,
			month,
			year,
			dateFullFormatted,
			enquiryDetails,
			adviserName,
			adviceDetails
		} = mainDetails;

		this.fillTitle(title);
		this.fillEnquirerDetails({ ...enquirerDetails });
		this.chooseEnquiryMethod(methodOfEnquiry);
		this.fillEnquiryDetails({ day, month, year, enquiryDetails });
		this.fillAdviserDetails(adviserName);
		this.fillAdviceDetails({ day, month, year, adviceDetails });
		this.checkAnswer('S51 title', title);
		this.checkAnswer('Enquirer', enquirerString({ ...enquirerDetails }), false);
		this.checkAnswer('Enquiry method', methodOfEnquiry);
		this.checkAnswer('Enquiry date', dateFullFormatted);
		this.checkAnswer('Enquiry details', enquiryDetails);
		this.checkAnswer('Advice given by', adviserName);
		this.checkAnswer('Date advice given', dateFullFormatted);
		const adviceDetailsData = {
			rowIndex: 7,
			cellIndex: 1,
			textToMatch: adviceDetails,
			strict: true
		};
		this.verifyTableCellText(adviceDetailsData);
		this.clickButtonByText('Create S51 advice item');
		this.basePageElements.successBanner().then(($banner) => {
			const text = $banner.text().trim();
			expect(text).to.include('New S51 advice item created');
		});
		cy.reload();
		this.basePageElements.successBanner().should('not.exist');

		const propertiesPage = new S51AdvicePropertiesPage();
		propertiesPage.checkAllProperties(mainDetails, enquirerDetails);
		this.verifyTitleIsUpdated();
	}
	verifyTitleIsUpdated(){
        this.elements.changetitleLink().click();
        this.elements.titleInput().clear();
        this.elements.titleInput().type("Title Updated");
        this.elements.saveAndReturnTile().click();
        this.elements.verifyTitleUpdated().then((text)=> {
            let actualTitle=text.text();
         expect(actualTitle).to.include("Title Updated");


    });
}
}
