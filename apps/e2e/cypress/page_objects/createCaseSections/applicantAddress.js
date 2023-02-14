// @ts-nocheck
import { SectionBase } from './sectionBase';

export class ApplicantAddressSection extends SectionBase {
	elements = {
		postcode: () => cy.get('#postcode')
	};

	fillApplicantPostcode(postcode) {
		this.elements.postcode().clear().type(postcode);
	}

	validatePage() {
		this.validateSectionHeader('Enter the Applicant’s address');
	}
}
