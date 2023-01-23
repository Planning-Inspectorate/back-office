// @ts-nocheck
import { SectionBase } from "./sectionBase";

export class SubSectorSection extends SectionBase {
	validatePage() {
		this.validateSectionHeader("Choose a subsector");
	}
}
