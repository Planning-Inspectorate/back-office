// @ts-nocheck
import { Page } from "./basePage";

export class ApplicationsHomePage extends Page {

	elements = {
		createNewCaseButton: () => this.basePageElements.buttonByLabelText('Create New Case Here'),
		createNewCaseHeader: () =>
			cy.get(":nth-child(2) > .pins-dashboard-box > .govuk-heading-l"),
		searchApplicationsBtn: () =>
			this.basePageElements.buttonByLabelText('Search'),
		searchApplicationsInput: () => cy.get("#searchApplications"),
	};

	verifyCreateCaseIsNotAvailable() {
		this.elements.createNewCaseHeader().should("not.exist");
		this.elements.createNewCaseButton().should("not.exist");
	}

	clickCreateNewCaseButton() {
		this.elements.createNewCaseButton().click();
	}


}
