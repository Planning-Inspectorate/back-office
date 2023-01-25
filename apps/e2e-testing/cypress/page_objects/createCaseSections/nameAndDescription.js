// @ts-nocheck
import { SectionBase } from './sectionBase';

export class NameAndDescriptionSection extends SectionBase {
	elements = {
		name: () => cy.get('#title'),
		description: () => cy.get('#description')
	};

	fillCaseName(caseName) {
		this.elements.name().clear().type(caseName);
	}

	fillCaseDescription(caseDescription) {
		this.elements.description().clear().type(caseDescription);
	}

	validatePage() {
		this.validateSectionHeader('Enter name and description');
	}
}
