// @ts-nocheck
import { Page } from './basePage';

export class ExaminationTimetablePage extends Page {
	elements = {
		createNewItemOptions: () => cy.get('#timetable-type option'),
		itemNameInput: () => cy.get('#name'),
		dateDayInput: () => cy.get('#date\\.day'),
		dateMonthInput: () => cy.get('#date\\.month'),
		dateYearInput: () => cy.get('#date\\.year'),
		startDateDayInput: () => cy.get('#startDate\\.day'),
		startDateMonthInput: () => cy.get('#startDate\\.month'),
		startDateYearInput: () => cy.get('#startDate\\.year'),
		endDateDayInput: () => cy.get('#endDate\\.day'),
		endDateMonthInput: () => cy.get('#endDate\\.month'),
		endDateYearInput: () => cy.get('#endDate\\.year'),
		startTimeHoursInput: () => cy.get('#startTime\\.hours'),
		startTimeMinutesInput: () => cy.get('#startTime\\.minutes'),
		endTimeHoursInput: () => cy.get('#endTime\\.hours'),
		endTimeMinutesInput: () => cy.get('#endTime\\.minutes'),
		description: () => cy.get('#description'),
		timetableSelectInput: () => cy.get('#timetable-type'),
		answerCell: (question) =>
			cy.contains(this.selectors.summaryListKey, question, { matchCase: false }).next()
	};

	checkAnswer(question, answer) {
		this.elements.answerCell(question).then(($elem) => {
			cy.wrap($elem)
				.invoke('text')
				.then((text) => expect(text.trim()).to.equal(answer));
		});
	}

	fillItemDetails(options) {
		this.elements.itemNameInput().clear().type(options.itemName);
		this.elements.dateDayInput().clear().type(options.day);
		this.elements.dateMonthInput().clear().type(options.month);
		this.elements.dateYearInput().clear().type(options.startYear);
		this.elements.startTimeHoursInput().clear().type(options.startHour);
		this.elements.startTimeMinutesInput().clear().type(options.minutes);
		this.elements.endTimeHoursInput().clear().type(options.endHour);
		this.elements.endTimeMinutesInput().clear().type(options.minutes);
		this.elements.description().clear().type(options.description);
	}

	fillItemDetailsStartAndEnd(options) {
		this.elements.itemNameInput().clear().type(options.itemName);
		this.elements.startDateDayInput().clear().type(options.day);
		this.elements.startDateMonthInput().clear().type(options.month);
		this.elements.startDateYearInput().clear().type(options.startYear);
		this.elements.startTimeHoursInput().clear().type(options.startHour);
		this.elements.startTimeMinutesInput().clear().type(options.minutes);
		this.elements.endDateDayInput().clear().type(options.day);
		this.elements.endDateMonthInput().clear().type(options.month);
		this.elements.endDateYearInput().clear().type(options.endYear);
		this.elements.endTimeHoursInput().clear().type(options.endHour);
		this.elements.endTimeMinutesInput().clear().type(options.minutes);
		this.elements.description().clear().type(options.description);
	}

	fillItemNameAndDate(options) {
		this.elements.itemNameInput().clear().type(options.itemName);
		this.elements.dateDayInput().clear().type(options.day);
		this.elements.dateMonthInput().clear().type(options.month);
		this.elements.dateYearInput().clear().type(options.startYear);
		this.elements.description().clear().type(options.description);
	}

	validateItemCreated() {
		cy.get(this.selectors.panelTitle)
			.invoke('text')
			.then((text) => {
				cy.wrap(text.trim()).should('equal', 'Timetable item successfully added');
			});
	}

	selectTimetableItem(itemType) {
		this.elements.timetableSelectInput().select(itemType);
	}
}
