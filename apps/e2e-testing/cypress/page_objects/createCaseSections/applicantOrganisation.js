// @ts-nocheck
import { SectionBase } from './sectionBase';

export class ApplicantOrganisationSection extends SectionBase {
	elements = {
		organisationName: () => cy.get('#applicant\\.organisationName')
	};

	fillOrganisationName(organisationName) {
		this.elements.organisationName().clear().type(organisationName);
	}

	validatePage() {
		this.validateSectionHeader('Enter the Applicant’s organisation');
	}
}
