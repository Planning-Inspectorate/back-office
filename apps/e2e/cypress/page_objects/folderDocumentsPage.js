// @ts-nocheck
import { Page } from './basePage';

export class FolderDocumentsPage extends Page {
	elements = {
		redactionRadio: (isRedacted = false) => cy.get(`#isRedacted[value=${isRedacted ? '1' : '0'}]`),
		statusRadio: (status) => this.basePageElements.radioButton().contains(status)
	};

	// U S E R  A C T I O N S
	setRedactionStatus(isRedacted = false) {
		this.elements.redactionRadio().click({ force: true });
	}

	/**
	 * Sets the status for the selected document.
	 * @param {string} status - Status to be set. (options are: 'Not checked', 'Checked', 'Ready to publish' and 'Do not publish').
	 */
	setOverallStatus(status) {
		this.elements.statusRadio(status).click({ force: true });
	}
}
