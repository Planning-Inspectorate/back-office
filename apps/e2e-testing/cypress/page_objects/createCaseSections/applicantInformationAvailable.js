// @ts-nocheck
import { SectionBase } from "./sectionBase";

export class ApplicantInformationAvailableSection extends SectionBase {

	validatePage() {
		this.validateSectionHeader("Choose the Applicant information you have available");
	}
}
