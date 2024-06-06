// @ts-nocheck
import { faker } from '@faker-js/faker';
import { Page } from './basePage';

export class DocumentPropertiesPage extends Page {
	elements = {
		changeLink: (property) =>
			cy
				.contains(this.selectors.summaryListKey, property, { matchCase: false })
				.siblings()
				.last()
				.find('a'),
		propertyValue: (keyText) =>
			cy.contains(this.selectors.summaryListKey, keyText, { matchCase: false }).next()
	};

	fileName = () => 'Filename';
	description = () => 'description';
	descriptionWelsh = () => 'description Welsh';
	from = () => 'From';
	fromWelsh = () => 'From Welsh';
	agent = () => 'Agentname';
	webfilter = () => 'Webfilter name';
	webfilterWelsh = () => 'Welsh filter';
	getDate = (received) => {
		const today = new Date();
		const day = today.getDate().toString().padStart(2, '0');
		const month = (today.getMonth() + 1).toString().padStart(2, '0');
		const year = today.getFullYear();
		return `${day}/${month}/${received ? year - 1 : year}`;
	};

	#save() {
		this.clickButtonByText('Save and return');
	}

	/**
	 * @param {string} property - Label text of the property. i.e `File name`
	 * @param {string} newValue - this is the new value for this property
	 * @returns {void}
	 */
	updateDocumentProperty(property, newValue) {
		this.elements.changeLink(property).click();
		this.fillInput(newValue);
		this.#save();
		this.elements.propertyValue(property).then((elem) => {
			expect(elem.text().trim()).to.eq(newValue);
		});
	}

	/**
	 * @param {string} status - `Readacted` | `Unredacted`
	 * @returns {void}
	 */
	updateRedactionStatus(status) {
		this.elements.changeLink('Redaction').click();
		cy.contains(status).click();
		this.#save();
		this.elements.propertyValue('Redaction').then((elem) => {
			expect(elem.text().trim()).to.eq(status);
		});
	}

	/**
	 * @param {string} type - `Rule 8 letter` | `Exam library` | `No document type`
	 * @returns {void}
	 */
	updateDocumentType(type) {
		this.elements.changeLink('Document type (optional)').click();
		cy.contains(type).click();
		this.#save();
		const value = type === 'No document type' ? '' : type;
		this.elements.propertyValue('Document type (optional)').then((elem) => {
			expect(elem.text().trim()).to.eq(value.trim());
		});
	}

	/**
	 * Updates the dates for current document. Can be used for both `Date received` and `Published date`.
	 * @param {string} type - `Date received` | `Published date`
	 * @param {string} date - in format of DD/MM/YYYY
	 * @returns {void}
	 */
	updateDate(type, date) {
		this.elements.changeLink(type).click();
		const [day, month, year] = date.split('/');
		cy.get('#dateCreated\\.day').clear().type(day);
		cy.get('#dateCreated\\.month').clear().type(month);
		cy.get('#dateCreated\\.year').clear().type(year);
		this.#save();
		this.elements.propertyValue(type).then((elem) => {
			expect(elem.text().trim()).to.eq(`${day}/${month}/${year}`);
		});
	}

	/**
	 * @param {string} status - `Readacted` | `Unredacted`
	 * @returns {void}
	 */
	updateAllProperties(status) {
		this.updateDocumentProperty('File name', this.fileName());
		this.updateDocumentProperty('Description', this.description());
		this.updateDocumentProperty('Who the document is from', this.from());
		this.updateDocumentProperty('Agent (optional)', this.agent());
		this.updateDocumentProperty('Webfilter', this.webfilter());
		this.updateDocumentType('No document type');
		this.updateDate('Date received', this.getDate(true));
		this.updateRedactionStatus(status);
		this.clickBackLink();
	}
	updateAllPropertiesIncludingWelsh(status) {
		this.updateDocumentProperty('File name', this.fileName());
		this.updateDocumentProperty('Description', this.description());
		this.updateDocumentProperty('Description in Welsh', this.descriptionWelsh());
		this.updateDocumentProperty('Who the document is from', this.from());
		this.updateDocumentProperty('Who the document is from in Welsh', this.fromWelsh());
		this.updateDocumentProperty('Agent (optional)', this.agent());
		this.updateDocumentProperty('Webfilter', this.webfilter());
		this.updateDocumentProperty('Webfilter in Welsh', this.webfilterWelsh());
		this.updateDocumentType('No document type');
		this.updateDate('Date received', this.getDate(true));
		this.updateRedactionStatus(status);
		this.clickBackLink();
	}

	validateVersionCount(count) {
		cy.contains('li', `Version: ${count}`).should('be.visible');
		this.clickTabByText('Document history');
		cy.get(`${this.selectors.tableBody} > ${this.selectors.tableRow}`).should('have.length', count);
	}
	verifyUnpublishButtonIsNotVisible() {
		this.basePageElements.buttonByLabelText('Unpublish').should('not.exist');
	}
	verifyUnpublishStatus() {
		cy.get('#tab_document-history').click();
		cy.get('p:nth-child(3) strong').should('have.text', 'Unpublished:');
	}
	verifyPublishStatus() {
		cy.get('#tab_document-history').click();
		cy.get('p:nth-child(2) strong').should('have.text', 'Published:');
	}
	verifyDocumentIsDeleted() {
		this.clickButtonByText('Delete');
		cy.get('.govuk-button').click();
		cy.get('.govuk-panel').contains('Document successfully deleted');
	}
	verifyNaviagtedBackToDocPropertiesPage() {
		this.clickButtonByText('Delete');
		cy.get('.govuk-back-link').click();
		cy.get('#tab_document-history').should('exist');
	}
	getDocumentRefNumber() {
		cy.get('li:nth-child(3)').then(($value) => {
			const getElementText = $value.text();
			cy.log('printling the text value :-> ' + getElementText);
			Cypress.env('DocRef', getElementText);
		});
	}
	enterDocumentRefNumber(docmentNumber) {
		cy.get('div.govuk-summary-list__row:nth-child(3) > dt').then(($elem) => {
			const text = $elem.text().trim();
			if (text === 'Description in Welsh') {
				cy.get('div.govuk-summary-list__row:nth-child(11) > dd:nth-child(3) > a').click();
				cy.get('#transcript').type(docmentNumber);
				cy.get('.govuk-button').click();
			} else {
				cy.get(
					'#document-properties > dl > div:nth-child(8) > dd.govuk-summary-list__actions > a'
				).click();
				cy.get('#transcript').type(docmentNumber);
				cy.get('.govuk-button').click();
			}
		});
	}
	validateTranscriptValue() {
		const caseRef = Cypress.env('currentCreatedCase');
		cy.get('div.govuk-summary-list__row:nth-child(3) > dt').then(($elem) => {
			const text = $elem.text().trim();
			if (text === 'Description in Welsh') {
				cy.get('.govuk-summary-list__row:nth-child(11) > dd').contains(caseRef);
			} else {
				cy.get('.govuk-summary-list__row:nth-child(8) > dd').contains(caseRef);
			}
		});
	}
	enterIncorrectDocumentRefNumber(docmentNumber) {
		cy.get('div.govuk-summary-list__row:nth-child(3) > dt').then(($elem) => {
			const text = $elem.text().trim();
			if (text === 'Description in Welsh') {
				cy.get('div.govuk-summary-list__row:nth-child(11) > dd:nth-child(3) > a').click();
				cy.get('#transcript').type(docmentNumber);
				cy.get('.govuk-button').click();
			} else {
				cy.get(
					'#document-properties > dl > div:nth-child(8) > dd.govuk-summary-list__actions > a'
				).click();
				cy.get('#transcript').type(docmentNumber);
				cy.get('.govuk-button').click();
			}
		});
	}
	validateDocumentErrorMessage() {
		cy.get('#transcript-error').contains('Please enter a valid document reference number.');
	}
	verifyDocumentPropertiesHeading() {
		cy.get('.govuk-caption-xl').contains('Document properties');
	}

	goBackToPrjdocumentationPage() {
		cy.get('li.govuk-breadcrumbs__list-item:nth-child(1) > a:nth-child(1)', {
			timeout: 2000
		}).click();
	}
	goBackToOverviewPage() {
		cy.get('.govuk-back-link', { timeout: 1000 }).click();
	}
	enterDocRefandValidateTranscriptValue() {
		cy.wrap(this.getDocumentRefNumber()).then(() => {
			cy.log('Printing the cypress env value: ' + Cypress.env('DocRef'));
			const docRefer = Cypress.env('DocRef');
			var splitRef = docRefer.split(' ')[3];
			this.enterDocumentRefNumber(splitRef);
			this.validateTranscriptValue();
		});
	}
}
