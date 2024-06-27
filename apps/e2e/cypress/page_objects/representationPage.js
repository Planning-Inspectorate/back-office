// @ts-nocheck
import { Page } from './basePage';
import { SearchResultsPage } from '../page_objects/searchResultsPage';
const searchResultsPage = new SearchResultsPage();

export class RepresentationPage extends Page {
	elements = {
		firstName: () => cy.get('#firstName'),
		secondName: () => cy.get('#lastName'),
		saveAndContinue: () => cy.get('.govuk-button'),
		postCode: () => cy.get('#lookupPostcode'),
		findAddress: () => cy.get('.govuk-button'),
		selectAddress: () => cy.get('#address'),
		preferredContact: () => cy.get('#contactMethod-2'),
		representativeType: () => cy.get('#type'),
		under18: () => cy.get('#under18-3'),
		representationEntity: () => cy.get('#representationEntity'),
		day: () => cy.get('#received-date-day'),
		month: () => cy.get('#received-date-month'),
		year: () => cy.get('#received-date-year'),
		reprsentationContent: () => cy.get('#originalRepresentation'),
		skipLink: () => cy.get('#main-content > div > div > a'),
		submitForReview: () => cy.get('.govuk-button'),
		searchRepresentation: () => cy.get('#searchTerm'),
		searchRepresentationButton: () => cy.get(':nth-child(7) > :nth-child(2) > .govuk-button'),
		searchResults: () => cy.get('div.govuk-grid-row:nth-child(7) > div:nth-child(1) > p'),
		reviewLink: () => cy.get('.govuk-table__row > :nth-child(6) > a'),
		statusLink: () =>
			cy.get(
				'#main-content > div > div > dl:nth-child(10) > div:nth-child(2) > dd.govuk-summary-list__actions > a'
			),
		statusOption: () => cy.get('#changeStatus-4'),
		gobackLink: () => cy.get('.govuk-back-link'),
		keyDates: () => this.basePageElements.linkByText('Key dates'),
		preexmaninationToggle: () =>
			cy.get(
				'div.govuk-accordion__section:nth-child(4) > div:nth-child(1) > h2:nth-child(1) > button:nth-child(1) > span:nth-child(3) > span:nth-child(1) > span:nth-child(2)'
			),
		manageDate: () => cy.get('#accordion-key-dates-content-3 > div:nth-child(1) > a:nth-child(1)'),
		repDay: () =>
			cy.get(
				'body > div:nth-child(4) > main:nth-child(2) > form:nth-child(2) > div:nth-child(3) > fieldset:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > input:nth-child(2)'
			),
		repMonth: () =>
			cy.get(
				'body > div:nth-child(4) > main:nth-child(2) > form:nth-child(2) > div:nth-child(3) > fieldset:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > input:nth-child(2'
			),
		repYear: () =>
			cy.get(
				'body > div:nth-child(4) > main:nth-child(2) > form:nth-child(2) > div:nth-child(3) > fieldset:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(3) > input:nth-child(2'
			),
		viewPublishQueue: () => cy.get('#main-content > form:nth-child(4) > p:nth-child(2) > a'),
		statusVerify: () => cy.get('#list-convictions-status-1'),
		optionStatusInvalid: () => cy.get('#changeStatus')
	};

	chooseAddressDetails(optionNumber) {
		this.elements.selectAddress().select(optionNumber);
	}
	fillRepresentationDetails() {
		var dt = new Date();
		let day = dt.getDay();
		let mon = dt.getMonth();
		let year = dt.getFullYear() - 1;

		this.elements.firstName().type('Representation First Name');
		this.elements.secondName().type('Surname');
		this.elements.saveAndContinue().click();
		this.elements.postCode().type('GU21 3HB');
		this.elements.saveAndContinue().click();
		this.chooseAddressDetails(1);
		this.elements.saveAndContinue().click();
		this.elements.preferredContact().click();
		this.elements.saveAndContinue().click();
		this.elements.representativeType().click();
		this.elements.saveAndContinue().click();
		this.elements.under18().click();
		this.elements.saveAndContinue().click();
		this.elements.representationEntity().click();
		this.elements.saveAndContinue().click();
		this.elements.day().type(day);
		this.elements.month().type(mon);
		this.elements.year().type(year);
		this.elements.reprsentationContent().type('reprsentation content');
		this.elements.saveAndContinue().click();
		this.elements.skipLink().click();
		this.elements.submitForReview().click();
		this.elements.searchResults().contains('results');
	}

	publishUnpublshRepresentations() {
		var dtrep = new Date();
		let dayrp = dtrep.getDay().toString().padStart(2, '0');
		let monrp = dtrep.getMonth().toString().padStart(2, '0');
		let yearrp = dtrep.getFullYear().toString().padStart(2, '0');
		this.elements.reviewLink().click();
		this.elements.statusLink().click();
		this.elements.statusOption().click();
		this.elements.saveAndContinue().click();
		this.elements.gobackLink().click();
		this.clickonProjectDocumentation();
		this.gotoProjectOverviewpage();
		this.elements.keyDates().click();
		this.elements.preexmaninationToggle().click();
		this.elements.manageDate().click();
		this.elements.repDay().type(dayrp);
		this.elements.repMonth().type(monrp);
		this.elements.repYear().type(yearrp - 1);
		this.elements.saveAndContinue().click();
		searchResultsPage.clickLinkByText('Project documentation');
		searchResultsPage.clickLinkByText('Relevant representations');
		this.elements.viewPublishQueue().click();
		this.elements.saveAndContinue().click();
		this.elements.statusVerify().contains('PUBLISHED');
		this.elements.reviewLink().click();
		this.elements.statusLink().click();
		this.elements.optionStatusInvalid().click();
		this.elements.saveAndContinue().click();
		this.elements.saveAndContinue().click();
		this.elements.gobackLink().click();
		this.elements.statusVerify().contains('AWAITING REVIEW');
	}
}
