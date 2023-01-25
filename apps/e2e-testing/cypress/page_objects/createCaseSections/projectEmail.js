// @ts-nocheck
import { SectionBase } from './sectionBase';

export class ProjectEmailSection extends SectionBase {
	elements = {
		caseEmail: () => cy.get('#caseEmail'),
		description: () => cy.get('#description')
	};

	fillCaseEmail(caseEmail) {
		this.elements.caseEmail().clear().type(caseEmail);
	}

	validatePage() {
		this.validateSectionHeader('Enter the project email');
	}
}
