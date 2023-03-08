// @ts-nocheck
import { users } from '../fixtures/users';

// @ts-nocheck
export class Page {
	// S E L E C T O R S

	selectors = {
		accordion: '.govuk-accordion',
		backLink: '.govuk-back-link',
		bannerHeader: '.govuk-notification-banner__heading',
		button: '.govuk-button',
		body: '.govuk-body',
		centralCol: '.pins-column--central',
		checkbox: '.govuk-checkboxes__item',
		errorMessage: '.govuk-error-message',
		formGroup: '.govuk-form-group',
		fullColumn: '.govuk-grid-column-full',
		headingLeft: '.govuk-heading-l',
		input: '.govuk-input',
		leftCol: '.pins-column--left',
		link: '.govuk-link',
		list: '.govuk-list',
		mediumHeader: '.govuk-heading-m',
		panel: '.govuk-panel',
		panelTitle: '.govuk-panel__title',
		radio: '.govuk-radios__item',
		rightCol: '.pins-column--right',
		select: '.govuk-select',
		smallHeader: '.govuk-heading-s',
		tableBody: '.govuk-table__body',
		tableCell: '.govuk-table__cell',
		tableHeader: '.govuk-table__header',
		tableRow: '.govuk-table__row',
		tag: '.govuk-tag',
		textArea: '.govuk-textarea',
		summaryListKey: '.govuk-summary-list__key',
		summaryListValue: '.govuk-summary-list__value',
		xlHeader: '.govuk-heading-xl'
	};

	// E L E M E N T S

	basePageElements = {
		accordion: (text) =>
			cy.get(this.selectors.accordion).contains('span', text, { matchCase: false }),
		applicationHeaderCentral: () => cy.get(`${this.selectors.centralCol} > p`),
		backLink: () => cy.get(this.selectors.backLink),
		bannerHeader: () => cy.get(this.selectors.bannerHeader),
		button: () => cy.get(this.selectors.button),
		buttonByLabelText: (buttonText) =>
			cy.contains(this.selectors.button, buttonText, { matchCase: false }),
		checkbox: () => cy.get(this.selectors.checkbox).find('input'),
		errorMessage: () => cy.get(this.selectors.errorMessage),
		goToDashboardLink: () =>
			cy.contains(`${this.selectors.rightCol} ${this.selectors.link}`, 'Go to Dashboard', {
				matchCase: true
			}),
		input: () => cy.get(this.selectors.input),
		linkByText: (text) => cy.contains(this.selectors.link, text, { matchCase: true }),
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
		tableRow: () => cy.get(this.selectors.tableRow),
		textArea: () => cy.get(this.selectors.textArea),
		genericText: () => cy.get(this.selectors.body)
	};

	// A C T I O N S
	chooseCheckboxByIndex(indexNumber) {
		this.basePageElements.checkbox().eq(indexNumber).check();
	}

	clearAllCheckboxes() {
		this.basePageElements
			.checkbox()
			.each(($checkbox) => cy.wrap($checkbox).uncheck({ force: true }));
	}

	clickAccordionByText(text) {
		this.basePageElements.accordion(text).click();
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

	clickLinkByText(linkText) {
		this.basePageElements.linkByText(linkText).click();
	}

	chooseRadioBtnByIndex(indexNumber) {
		this.basePageElements.radioButton().find('input').eq(indexNumber).check();
	}

	chooseSelectItemByIndex(optionNumber) {
		this.basePageElements.selectElem().select(optionNumber);
	}

	fillInput(text, index = 0) {
		this.basePageElements.input().eq(index).clear().type(text);
	}

	fillTextArea(text, index = 0) {
		this.basePageElements.textArea().eq(index).clear().type(text);
	}

	// A S S E R T I O N S

	validateErrorMessage(errorMessage) {
		this.basePageElements.errorMessage().contains(errorMessage).should('exist');
	}

	validateNumberOfCheckboxes(checkboxCount) {
		this.basePageElements.checkbox().should('have.length', checkboxCount);
	}

	validateNumberOfRadioBtn(radioCount) {
		this.basePageElements.radioButton().should('have.length', radioCount);
	}

	verifyCaseAdminIsSignedIn() {
		this.basePageElements.loggedInUser().should('have.text', users.caseAdmin.typeName);
	}

	verifyCaseTeamIsSignedIn() {
		this.basePageElements.loggedInUser().should('have.text', users.caseTeam.typeName);
	}

	verifyInspectorIsSignedIn() {
		this.basePageElements.loggedInUser().should('have.text', users.inspector.typeName);
	}

	verifyFolderDocuments(fileCount) {
		this.basePageElements
			.genericText()
			.contains(`This folder contains ${fileCount} document(s).`)
			.should('exist');
	}
}
