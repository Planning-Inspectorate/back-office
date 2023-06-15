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
		this.saveCaseIdFromUrl();
	}

	saveCaseReference() {
		cy.get('strong')
			.invoke('text')
			.then((text) => {
				Cypress.env('currentCreatedCase', text);
				cy.log('successfully copied new case reference', Cypress.env('currentCreatedCase'));
			});
	}

	saveCaseIdFromUrl(url) {
		cy.url().then((url) => {
			expect(url).include('case-created');
			const regex = /\/(\d+)\/case-created$/;
			const match = url.match(regex);
			const id = match[1];
			Cypress.env('currentCreatedCaseId', id);
		});
	}
}
