// @ts-nocheck
import { SectionBase } from './sectionBase';

export class RegionsSection extends SectionBase {
	validatePage() {
		this.validateSectionHeader('Choose one or multiple regions');
	}
}
