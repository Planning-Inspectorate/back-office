// @ts-nocheck
import { SectionBase } from "./sectionBase";

export class SectorSection extends SectionBase {
	validatePage() {
		this.validateSectionHeader("Choose a sector");
	}
}
