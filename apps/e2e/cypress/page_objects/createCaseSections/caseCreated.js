// @ts-nocheck
import { SectionBase } from './sectionBase';

export class CaseCreatedSection extends SectionBase {
	validateCaseCreated() {
		cy.get(this.selectors.panelTitle)
			.invoke('text')
			.then((text) => {
				cy.wrap(text.trim()).should('equal', 'New case has been created');
			});
	}

	getCaseRefeRefreence() {
		this.validateCaseCreated();
		cy.get('strong')
			.invoke('text')
			.then((text) => {
				Cypress.env('CURRENT_CASE_REFEENCE', text);
			});
	}
}
