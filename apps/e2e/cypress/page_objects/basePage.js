// @ts-nocheck
import { users } from '../fixtures/users';

// @ts-nocheck
export class Page {
	// S E L E C T O R S

	selectors = {
		backLink: '.govuk-back-link',
		button: '.govuk-button',
		body: '.govuk-body',
		centralCol: '.pins-column--central',
		checkbox: '.govuk-checkboxes__item',
		formGroup: '.govuk-form-group',
		headingLeft: '.govuk-heading-l',
		leftCol: '.pins-column--left',
		link: '.govuk-link',
		panel: '.govuk-panel',
		panelTitle: '.govuk-panel__title',
		radio: '.govuk-radios__item',
		rightCol: '.pins-column--right',
		select: '.govuk-select',
		smallHeader: '.govuk-heading-s',
		tableBody: '.govuk-table__body',
		tableRow: '.govuk-table__row'
	};

	// E L E M E N T S

	basePageElements = {
		applicationHeaderCentral: () => cy.get(`${this.selectors.centralCol} > p`),
		backLink: () => cy.get(this.selectors.backLink),
		button: () => cy.get(this.selectors.button),
		buttonByLabelText: (buttonText) =>
			cy.contains(this.selectors.button, buttonText, { matchCase: false }),
		checkbox: () => cy.get(this.selectors.checkbox),
		goToDashboardLink: () =>
			cy.contains(`${this.selectors.rightCol} ${this.selectors.link}`, 'Go To Dashboard', {
				matchCase: false
			}),
		loggedInUser: () => cy.get(`${this.selectors.rightCol} > span`),
		radioButton: () => cy.get(this.selectors.radio),
		sectionHeader: () => cy.get(this.selectors.headingLeft),
		selectElem: () => cy.get(this.selectors.select),
		saveAndContinue: () => this.clickButtonByText('Save and Continue'),
		signOutLink: () =>
			cy.contains(`${this.selectors.rightCol} ${this.selectors.link}`, 'Sign Out', {
				matchCase: false
			}),
		tableBody: () => cy.get(this.selectors.tableBody),
		tableRow: () => cy.get(this.selectors.tableRow)
	};

	// A C T I O N S

	chooseCheckboxByIndex(optionNumber) {
		this.basePageElements
			.checkbox()
			.find('input')
			.eq(optionNumber - 1)
			.check();
	}

	chooseRadioBtnByIndex(optionNumber) {
		this.basePageElements
			.radioButton()
			.find('input')
			.eq(optionNumber - 1)
			.check();
	}

	chooseSelectItemByIndex(optionNumber) {
		this.basePageElements.selectElem().select(optionNumber - 1);
	}

	clickBackLink(buttonText) {
		this.basePageElements.backLink().click();
	}

	clickButtonByText(buttonText) {
		this.basePageElements.buttonByLabelText(buttonText).click();
	}

	clickSaveAndContinue() {
		this.basePageElements.buttonByLabelText('Save And Continue').click();
	}

	// A S S E R T I O N S

	validateNumberOfCheckboxes(checkboxCount) {
		this.basePageElements.checkbox().should('have.length', checkboxCount);
	}

	validateNumberOfRadioBtn(radioCount) {
		this.basePageElements.radioButton().should('have.length', radioCount);
	}

	verifyCaseAdminIsSignedIn() {
		this.basePageElements.loggedInUser().invoke('text').should('equal', users.caseAdmin.typeName);
	}

	verifyCaseTeamIsSignedIn() {
		this.basePageElements.loggedInUser().invoke('text').should('equal', users.caseTeam.typeName);
	}

	verifyInspectorIsSignedIn() {
		this.basePageElements.loggedInUser().invoke('text').should('equal', users.inspector.typeName);
	}
}
