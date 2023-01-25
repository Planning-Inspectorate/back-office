// @ts-nocheck
import { SectionBase } from './sectionBase';

export class ApplicantEmailSection extends SectionBase {
	elements = {
		applicantEmail: () => cy.get('#applicant\\.email')
	};

	fillApplicantEmail(email) {
		this.elements.applicantEmail().clear().type(email);
	}

	validatePage() {
		this.validateSectionHeader('Enter the applicant’s email address');
	}
}
