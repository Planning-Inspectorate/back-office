// @ts-nocheck
import { SectionBase } from './sectionBase';

export class ApplicantPhoneNumberSection extends SectionBase {
	elements = {
		phoneNumber: () => cy.get('#applicant\\.phoneNumber')
	};

	fillPhoneNumber(phoneNumber) {
		this.elements.phoneNumber().clear().type(phoneNumber);
	}

	validatePage() {
		this.validateSectionHeader('Enter the Applicant’s phone number');
	}
}
