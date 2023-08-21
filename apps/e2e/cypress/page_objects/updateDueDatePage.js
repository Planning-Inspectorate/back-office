// @ts-nocheck
import { Page } from './basePage';

export class UpdateDueDatePage extends Page {
	_selectors = {
		uniqueSelector: 'selector-name'
	};

	// S E L E C T O R S

	selectors = {
		dateInputDay: '#due-date-day',
		dateInputMonth: '#due-date-month',
		dateInputYear: '#due-date-year',
		skipButton: '.govuk-button'
	};

	// E L E M E N T S

	updateDueDateElements = {
		enterDateDay: () => cy.get(this.selectors.dateInputDay),
		enterDateMonth: () => cy.get(this.selectors.dateInputMonth),
		enterDateYear: () => cy.get(this.selectors.dateInputYear),
		clickSkipButton: () => cy.contains(this.selectors.skipButton, 'Skip')
	};

	// A C T I O N S

	enterDateDay(text, index = 0) {
		cy.get('#due-date-day');
		this.updateDueDateElements.enterDateDay().eq(index).clear().type(text);
	}

	enterDateMonth(text, index = 0) {
		cy.get('#due-date-month');
		this.updateDueDateElements.enterDateMonth().eq(index).clear().type(text);
	}
	enterDateYear(text, index = 0) {
		cy.get('#due-date-year');
		this.updateDueDateElements.enterDateYear().eq(index).clear().type(text);
	}
	clickSkipButton(text) {
		this.updateDueDateElements.clickSkipButton(text).click();
	}
}
