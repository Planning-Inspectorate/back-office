// @ts-nocheck
import { Page } from '../basePage';

export class SectionBase extends Page {
	validateSectionHeader(headerText) {
		this.basePageElements
			.sectionHeader()
			.invoke('text')
			.then((text) => {
				cy.wrap(text.trim()).should('equal', headerText.trim());
			});
	}
}
