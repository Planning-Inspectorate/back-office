// @ts-nocheck
import { Page } from './basePage';
import { faker } from '@faker-js/faker';

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
		answerCell: (question) =>
			cy.contains(this.selectors.tableCell, question, { matchCase: true }).next(),
		changeLink: (question) =>
			cy.contains(this.selectors.tableCell, question, { matchCase: false }).nextUntil('a')
	};

	checkAnswer(question, answer) {
		this.elements.answerCell(question).then(($elem) => {
			cy.wrap($elem.text().trim()).should('equal', answer.trim());
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
}
