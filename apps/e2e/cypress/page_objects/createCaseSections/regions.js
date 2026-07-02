// @ts-nocheck
import { REGIONS } from '../../support/utils/options';
import { SectionBase } from './sectionBase';

export class RegionsSection extends SectionBase {
	elements = {
		answerCell: (question) =>
			cy.contains(this.selectors.tableCell, question, { matchCase: false }).next(),
		changeLink: (question) =>
			cy.contains(this.selectors.tableCell, question, { matchCase: false }).nextUntil('a')
	};

	chooseRegions(regions) {
		if (!regions?.length) {
			throw new Error('At least one region is required to create a case');
		}

		const allRegions = REGIONS;
		regions.map((region) => {
			if (allRegions.includes(region)) {
				this.chooseCheckboxByIndex(allRegions.indexOf(region));
			} else {
				throw new Error(`Invalid region: ${region}`);
			}
		});
	}

	validatePage() {
		this.validateSectionHeader('Choose one or multiple regions');
	}
}
