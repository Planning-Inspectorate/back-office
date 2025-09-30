// @ts-nocheck
import { Page } from './basePage';
import { SearchResultsPage } from '../page_objects/searchResultsPage';
const searchResultsPage = new SearchResultsPage();

export class RepresentationPage extends Page {
	elements = {
		firstName: () => cy.get('#firstName'),
		secondName: () => cy.get('#lastName'),
		postCode: () => cy.get('#lookupPostcode'),
		selectAddress: () => cy.get('#address'),
		preferredContact: () => cy.get('#contactMethod-2'),
		representativeType: () => cy.get('#type'),
		under18: () => cy.get('#under18-3'),
		representationEntity: () => cy.get('#representationEntity'),
		day: () => cy.get('#received-date-day'),
		month: () => cy.get('#received-date-month'),
		year: () => cy.get('#received-date-year'),
		reprsentationContent: () => cy.get('#originalRepresentation'),
		submitForReview: () => this.basePageElements.linkByText('Submit for review'),
		searchRepresentation: () => cy.get('#searchTerm'),
		searchRepresentationButton: () => cy.get(':nth-child(7) > :nth-child(2) > .govuk-button'),
		searchResults: () => cy.get('div.govuk-grid-row:nth-child(7) > div:nth-child(1) > p'),
		reviewLink: () => cy.get('.govuk-table__row > :nth-child(6) > a'),
		statusLink: () =>
			cy.get(
				'#main-content > div > div > dl:nth-child(10) > div:nth-child(2) > dd.govuk-summary-list__actions > a'
			),
		statusOption: () => cy.get('#changeStatus-4'),
		keyDates: () => this.basePageElements.linkByText('Key dates'),
		preexmaninationToggle: () =>
			cy.get(
				'div.govuk-accordion__section:nth-child(4) > div:nth-child(1) > h2:nth-child(1) > button:nth-child(1) > span:nth-child(3) > span:nth-child(1) > span:nth-child(2)'
			),
		manageDate: () => cy.get('a[data-cy="manage-dates-relevant-representations"]'),
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
		statusVerify: () => cy.get('#list-convictions-status-1'),
		optionStatusInvalid: () => cy.get('#changeStatus')
	};

	chooseAddressDetails(optionNumber) {
		this.elements.selectAddress().select(optionNumber);
	}
	fillRepresentationDetails() {
		var dt = new Date();
		let day = dt.getDay();
		let mon = dt.getMonth() + 1;
		let year = dt.getFullYear() - 1;

		this.elements.firstName().type('Representation First Name');
		this.elements.secondName().type('Surname');
		this.clickSaveAndContinue();
		this.elements.postCode().type('GU21 3HB');
		this.clickButtonByText('Find address');
		this.chooseAddressDetails(1);
		this.clickSaveAndContinue();
		this.elements.preferredContact().click();
		this.clickSaveAndContinue();
		this.elements.representativeType().click();
		this.clickSaveAndContinue();
		this.elements.under18().click();
		this.clickSaveAndContinue();
		this.elements.representationEntity().click();
		this.clickSaveAndContinue();
		this.elements.day().type(day);
		this.elements.month().type(mon);
		this.elements.year().type(year);
		this.elements.reprsentationContent().type('reprsentation content');
		this.clickSaveAndContinue();
		this.clickLinkByText('Skip this step');
		this.clickButtonByText('submit for review');
		this.elements.searchResults().contains('results');
	}

	publishUnpublshRepresentations() {
		var dtrep = new Date();
		let dayrp = dtrep.getDay().toString().padStart(2, '0');
		let monrp = (dtrep.getMonth() + 1).toString().padStart(2, '0');
		let yearrp = dtrep.getFullYear().toString().padStart(2, '0');
		this.elements.reviewLink().click();
		this.elements.statusLink().click();
		this.elements.statusOption().click();
		this.clickContinue();
		this.clickBackLink();
		this.clickonProjectDocumentation();
		this.gotoProjectOverviewpage();
		this.elements.keyDates().click();
		this.elements.preexmaninationToggle().click();
		this.elements.manageDate().click();
		this.elements.repDay().type(dayrp);
		this.elements.repMonth().type(monrp);
		this.elements.repYear().type(yearrp - 1);
		this.clickSaveAndReturn();
		searchResultsPage.clickLinkByText('Project documentation');
		searchResultsPage.clickLinkByText('Relevant representations');
		this.clickLinkByText('View publishing queue');
		this.clickButtonByText('Publish representations');
		this.elements.statusVerify().contains('Published');
		this.elements.reviewLink().click();
		this.elements.statusLink().click();
		this.elements.optionStatusInvalid().click();
		this.clickContinue();
		this.clickButtonByText('Save changes');
		this.clickBackLink();
		this.elements.statusVerify().contains('Awaiting Review');
	}
}
