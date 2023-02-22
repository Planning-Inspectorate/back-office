// @ts-nocheck
import { APPLICANT_INFO } from '../../support/utils/options';
import { SectionBase } from './sectionBase';

export class ApplicantInformationAvailableSection extends SectionBase {
	validatePage() {
		this.validateSectionHeader('Choose the Applicant information you have available');
	}

	chooseAll() {
		for (let i = 0; i < APPLICANT_INFO.length; i++) {
			this.chooseCheckboxByIndex(i);
		}
	}

	validatePage() {
		this.validateSectionHeader('Choose a sector');
	}
}
