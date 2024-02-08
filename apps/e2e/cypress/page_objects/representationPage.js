// @ts-nocheck
import { Page } from './basePage';

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
		skipLink:()=>cy.get('#main-content > div > div > a'),
		submitForReview: () => cy.get('.govuk-button'),
		searchRepresentation: () => cy.get('#searchTerm'),
		searchRepresentationButton: () => cy.get('#main-content > form > div:nth-child(6) > div:nth-child(2) > button'),
		searchResults: () => cy.get('#main-content > form > div:nth-child(7) > div:nth-child(1)')

	};
	chooseAddressDetails(optionNumber) {
		this.elements.selectAddress().select(optionNumber);
	}
	fillRepresentationDetails(){
		var dt = new Date();
		let day=dt.getDay();
		let mon=dt.getMonth();
		let year=dt.getFullYear()-1;

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
	searchRepresenation(){
		this.elements.searchRepresentation().type('Surname');
		this.elements.searchRepresentationButton().click();
		this.elements.searchResults().contains('results');
	}
}
