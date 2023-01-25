// @ts-nocheck
import { SectionBase } from './sectionBase';

export class ApplicantWebsiteSection extends SectionBase {
	elements = {
		applicantWebsite: () => cy.get('#applicant\\.website')
	};

	fillApplicantWebsite(applicantWebsite) {
		this.elements.applicantWebsite().clear().type(applicantWebsite);
	}

	validatePage() {
		this.validateSectionHeader('Enter the Applicant’s website');
	}
}
