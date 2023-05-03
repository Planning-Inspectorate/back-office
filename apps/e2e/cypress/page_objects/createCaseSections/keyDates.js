// @ts-nocheck
import { SectionBase } from './sectionBase';

export class KeyDatesSection extends SectionBase {
	elements = {
		submissionPublishedDateInput: () => cy.get('#keyDates\\.submissionDatePublished'),
		internalAnticipatedDateDay: () => cy.get('#keyDates\\.submissionDateInternal\\.day'),
		internalAnticipatedDateMonth: () => cy.get('#keyDates\\.submissionDateInternal\\.month'),
		internalAnticipatedDateYear: () => cy.get('#keyDates\\.submissionDateInternal\\.year')
	};

	fillSumbissionPublishedDate(date) {
		this.elements.submissionPublishedDateInput().clear().type(date);
	}

	fillInternalAnticipatedDay(day) {
		this.elements.internalAnticipatedDateDay().clear().type(day);
	}

	fillInternalAnticipatedMonth(month) {
		this.elements.internalAnticipatedDateMonth().clear().type(month);
	}

	fillInternalAnticipatedYear(year) {
		this.elements.internalAnticipatedDateYear().clear().type(year);
	}

	validatePage() {
		this.validateSectionHeader('Enter the key dates of the project');
	}
}
