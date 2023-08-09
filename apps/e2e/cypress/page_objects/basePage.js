// @ts-nocheck
import { users } from '../fixtures/users';
import { assertType } from '../support/utils/assertType';

// @ts-nocheck
export class Page {
	// S E L E C T O R S

	selectors = {
		accordion: '.govuk-accordion',
		accordionToggleText: '.govuk-accordion__section-toggle-text',
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
		panelBody: '.govuk-panel__body',
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
		summaryErrorMessages: '.govuk-error-summary [href="#msg"]',
		xlHeader: '.govuk-heading-xl',
		caption: '.govuk-caption-m'
	};

	// E L E M E N T S

	basePageElements = {
		accordion: (text) =>
			cy.get(this.selectors.accordion).contains('span', text, { matchCase: false }),
		answerCell: (question) =>
			cy.contains(this.selectors.summaryListKey, question, { matchCase: false }).next(),
		applicationHeaderCentral: () => cy.get(`${this.selectors.centralCol} > p`),
		backLink: () => cy.get(this.selectors.backLink),
		bannerHeader: () => cy.get(this.selectors.bannerHeader),
		button: () => cy.get(this.selectors.button),
		buttonByLabelText: (buttonText) =>
			cy.contains(this.selectors.button, buttonText, { matchCase: false }),
		checkbox: () => cy.get(this.selectors.checkbox).find('input'),
		changeLink: (question) =>
			cy.contains(this.selectors.tableCell, question, { matchCase: false }).nextUntil('a'),
		errorMessage: () => cy.get(this.selectors.errorMessage),
		summaryErrorMessages: () => cy.get(this.selectors.summaryErrorMessages),
		goToDashboardLink: () =>
			cy.contains(`${this.selectors.rightCol} ${this.selectors.link}`, 'Go to Dashboard', {
				matchCase: true
			}),
		input: () => cy.get(this.selectors.input),
		linkByText: (text) => cy.contains(this.selectors.link, text, { matchCase: true }),
		loggedInUser: () => cy.get(`${this.selectors.rightCol} > span`),
		panelBody: () => cy.get(`${this.selectors.panelBody}`),
		panelTitle: () => cy.get(`${this.selectors.panelTitle}`),
		radioButton: () => cy.get(this.selectors.radio),
		sectionHeader: () => cy.get(this.selectors.headingLeft),
		selectAllCheckboxes: () => cy.get('#selectAll'),
		selectElem: () => cy.get(this.selectors.select),
		saveAndContinue: () => this.clickButtonByText('Save and Continue'),
		signOutLink: () =>
			cy.contains(`${this.selectors.rightCol} ${this.selectors.link}`, 'Sign Out', {
				matchCase: false
			}),
		clearSearchResultsButton: () => cy.contains(this.selectors.caption, 'Clear search results'),
		tableBody: () => cy.get(this.selectors.tableBody),
		tableRow: () => cy.get(this.selectors.tableRow),
		tableCell: () => cy.get(this.selectors.tableCell),
		textArea: () => cy.get(this.selectors.textArea),
		genericText: () => cy.get(this.selectors.body)
	};

	// A C T I O N S
	chooseCheckboxByIndex(indexNumber) {
		this.basePageElements.checkbox().eq(indexNumber).check();
	}

	checkAnswer(question, answer) {
		this.basePageElements.answerCell(question).then(($elem) => {
			cy.wrap($elem)
				.invoke('text')
				.then((text) => expect(text.trim()).to.equal(answer));
		});
	}

	clickChangeLink(question) {
		this.basePageElements.changeLink(question).click();
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

	clickContinue() {
		this.clickButtonByText('Continue');
	}

	clickSaveAndContinue() {
		this.clickButtonByText('Save And Continue');
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

	clearSearchResults() {
		this.basePageElements.clearSearchResultsButton().click();
	}

	// A S S E R T I O N S
	validateBannerMessage(successMessage) {
		this.basePageElements.bannerHeader().then(($banner) => {
			expect($banner.text().trim()).to.equal(successMessage);
		});
	}

	validateErrorMessage(errorMessage) {
		this.basePageElements.errorMessage().contains(errorMessage).should('exist');
	}

	validateErrorMessageIsInSummary(errorMessage) {
		const messages = [];
		this.basePageElements
			.summaryErrorMessages()
			.each((message) => {
				messages.push(message.text().trim());
			})
			.then(() => {
				expect(messages).to.include(errorMessage);
			});
	}

	validateErrorMessageCountOnPage(numberOfErrors) {
		this.basePageElements.errorMessage().should('have.length', numberOfErrors);
	}

	validateNumberOfCheckboxes(checkboxCount) {
		this.basePageElements.checkbox().should('have.length', checkboxCount);
	}

	validateNumberOfRadioBtn(radioCount) {
		this.basePageElements.radioButton().should('have.length', radioCount);
	}

	verifyCaseAdminIsSignedIn() {
		this.basePageElements.loggedInUser().should('have.text', users.applications.caseAdmin.typeName);
	}

	verifyCaseTeamIsSignedIn() {
		this.basePageElements.loggedInUser().should('have.text', users.applications.caseTeam.typeName);
	}

	verifyInspectorIsSignedIn() {
		this.basePageElements.loggedInUser().should('have.text', users.applications.inspector.typeName);
	}

	verifyFolderDocuments(fileCount) {
		cy.get('.pins-files-list > .govuk-table .govuk-table__row').should(
			'have.length',
			2 + fileCount
		);
	}

	verifyDocumentUploaded(fileName) {
		this.basePageElements.tableCell().contains(fileName).should('exist');
	}

	showAllSections() {
		cy.get('body').then(($body) => {
			const exists = $body.find('span:contains(Show all sections)').length > 0;
			if (exists) {
				this.clickAccordionByText('Show all sections');
			}
		});
	}

	selectAllDocuments() {
		this.basePageElements.selectAllCheckboxes().scrollIntoView().check({ force: true });
	}

	validateSuccessPanelTitle(successMessage, exactMatch = false) {
		this.basePageElements.panelTitle().should(assertType(exactMatch), successMessage);
	}

	validateSuccessPanelBody(successMessage, exactMatch = false) {
		this.basePageElements.panelBody().should(assertType(exactMatch), successMessage);
	}

	navigateToAppealsService() {
		cy.visit('/appeals-service/appeals-list');
	}

	goToDashboard() {
		this.basePageElements.goToDashboardLink().click();
	}
}
