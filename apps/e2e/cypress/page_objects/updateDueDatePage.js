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
		skipButton: '.govuk-button',
		visitDateDay: '#visit-date-day',
		visitDateMonth: '#visit-date-month',
		visitDateYear: '#visit-date-year',
		visitStartHour: '#visit-start-time-hour',
		visitStartMinute: '#visit-start-time-minute',
		visitEndHour: '#visit-end-time-hour',
		visitEndMinute: '#visit-end-time-minute'
	};

	// E L E M E N T S

	updateDueDateElements = {
		enterDateDay: () => cy.get(this.selectors.dateInputDay),
		enterDateMonth: () => cy.get(this.selectors.dateInputMonth),
		enterDateYear: () => cy.get(this.selectors.dateInputYear),
		clickSkipButton: () => cy.contains(this.selectors.skipButton, 'Skip'),
		enterVisitDay: () => cy.get(this.selectors.visitDateDay),
		enterVisitMonth: () => cy.get(this.selectors.visitDateMonth),
		enterVisitYear: () => cy.get(this.selectors.visitDateYear),
		enterVisitStartHour: () => cy.get(this.selectors.visitStartHour),
		enterVisitStartMinute: () => cy.get(this.selectors.visitStartMinute),
		enterVisitEndHour: () => cy.get(this.selectors.visitEndHour),
		enterVisitEndMinute: () => cy.get(this.selectors.visitEndMinute)
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

	enterVisitDay(text, index = 0) {
		cy.get('#visit-date-day');
		this.updateDueDateElements.enterVisitDay().eq(index).clear().type(text);
	}

	enterVisitMonth(text, index = 0) {
		cy.get('#visit-date-month');
		this.updateDueDateElements.enterVisitMonth().eq(index).clear().type(text);
	}
	enterVisitYear(text, index = 0) {
		cy.get('#visit-date-year');
		this.updateDueDateElements.enterVisitYear().eq(index).clear().type(text);
	}

	enterVisitStartTimeHour(text, index = 0) {
		cy.get('#visit-start-time-hour');
		this.updateDueDateElements.enterVisitStartHour().eq(index).clear().type(text);
	}

	enterVisitStartTimeMiinute(text, index = 0) {
		cy.get('#visit-start-time-minute');
		this.updateDueDateElements.enterVisitStartMinute().eq(index).clear().type(text);
	}
	enterVisitEndTimeHour(text, index = 0) {
		cy.get('#visit-end-time-hour');
		this.updateDueDateElements.enterVisitEndHour().eq(index).clear().type(text);
	}
	enterVisitEndTimeMinute(text, index = 0) {
		cy.get('#visit-end-time-minute');
		this.updateDueDateElements.enterVisitEndMinute().eq(index).clear().type(text);
	}
}
