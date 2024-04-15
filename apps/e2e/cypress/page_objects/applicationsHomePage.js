// @ts-nocheck
import { Page } from './basePage';

export class ApplicationsHomePage extends Page {
	elements = {
		createNewCaseButton: () => this.basePageElements.buttonByLabelText('Create case'),
		createNewCaseHeader: () => cy.get(':nth-child(2) > .pins-dashboard-box > .govuk-heading-l'),
		searchApplicationsBtn: () => this.basePageElements.buttonByLabelText('Search'),
		searchApplicationsInput: () => cy.get('#searchApplications'),
		searchSectionLabel: () => cy.get(this.selectors.formGroup).find('[for=searchApplications]')
	};

	// U S E R  A C T I O N S

	clickCreateNewCaseButton() {
		this.elements.createNewCaseButton().click();
	}

	searchFor(searchTerm, pressEnter = false) {
		const _searchTerm = pressEnter ? `${searchTerm}{enter}` : searchTerm;
		this.elements.searchApplicationsInput().type(_searchTerm);
		if (!pressEnter) {
			this.elements.searchApplicationsBtn().click();
		}
	}

	// A S S E R T I O N S

	verifyCreateCaseIsNotAvailable() {
		this.elements.createNewCaseHeader().should('not.exist');
		this.elements.createNewCaseButton().should('not.exist');
	}

	verifySearchSection() {
		this.elements
			.searchSectionLabel()
			.should('be.visible')
			.and('contain.text', 'Enter keyword, case reference or case title');
		this.elements.searchApplicationsInput().should('be.visible');
		this.elements.searchApplicationsBtn().should('be.visible').and('be.enabled');
	}
}
