// @ts-nocheck
import { SECTORS } from '../../support/utils/options';
import { SectionBase } from './sectionBase';

export class SectorSection extends SectionBase {
	getSectorIndex(sectorName) {
		let options = SECTORS;
		return options.indexOf(sectorName);
	}

	chooseSector(sectorName) {
		this.chooseRadioBtnByIndex(this.getSectorIndex(sectorName));
	}

	validatePage() {
		this.validateSectionHeader('Choose a sector');
	}

	selectTrainingAsSectorSubsector() {
		cy.contains('.govuk-radios__item', 'Training').find('input').check();
		cy.get('.govuk-button').click();
		cy.contains('.govuk-radios__item', 'Training').find('input').check();
		cy.get('.govuk-button').click();
	}
}
