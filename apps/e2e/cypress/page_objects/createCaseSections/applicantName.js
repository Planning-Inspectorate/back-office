// @ts-nocheck
import { SectionBase } from './sectionBase';

export class ApplicantNameSection extends SectionBase {
	elements = {
		firstName: () => cy.get('#applicant\\.firstName'),
		lastName: () => cy.get('#applicant\\.lastName')
	};

	fillApplicantFirstName(firstName) {
		this.elements.firstName().clear().type(firstName);
	}

	fillApplicantLastName(lastName) {
		this.elements.lastName().clear().type(lastName);
	}

	validatePage() {
		this.validateSectionHeader('Enter the applicant’s contact name');
	}
}
