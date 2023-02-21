// @ts-nocheck
import { SectionBase } from './sectionBase';

export class CaseCreatedSection extends SectionBase {
	validateCaseCreated() {
		cy.get(this.selectors.panelTitle)
			.invoke('text')
			.then((text) => {
				cy.wrap(text.trim()).should('equal', 'New case has been created');
			});
		this.saveCaseReference();
	}

	saveCaseReference() {
		cy.get('strong')
			.invoke('text')
			.then((text) => {
				Cypress.env('currentCreatedCase', text);
			});
	}
}
