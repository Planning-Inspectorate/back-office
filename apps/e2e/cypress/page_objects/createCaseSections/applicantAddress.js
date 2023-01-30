// @ts-nocheck
import { SectionBase } from './sectionBase';

export class ApplicantAddressSection extends SectionBase {
	elements = {
		postcode: () => cy.get('#postcode')
	};

	fillApplicantWebsite(applicantWebsite) {
		this.elements.postcode().clear().type(applicantWebsite);
	}

	validatePage() {
		this.validateSectionHeader('Enter the Applicant’s address');
	}
}
