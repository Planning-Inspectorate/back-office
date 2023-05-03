// @ts-nocheck
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
}
