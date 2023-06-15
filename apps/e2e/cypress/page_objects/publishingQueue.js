// @ts-nocheck
import { Page } from './basePage';

export class PublishingQueuePage extends Page {
	// U S E R  A C T I O N S
	validateDocumentCountInList(count) {
		cy.get(this.basePageElements.tableRow).should('have.length', 2 + count);
	}
}
