// @ts-nocheck
import { Page } from './basePage';

export class ExaminationTimetablePage extends Page {
	elements = {
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
		timetableOptions: () => cy.get('#timetable-type option'),
		changeLink: (question) =>
			cy
				.contains(this.selectors.summaryListKey, question, { matchCase: false })
				.siblings()
				.last()
				.find('a')
				.scrollIntoView()
	};

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

	validateTimeTableOptions(itemOptions) {
		this.elements.timetableOptions().then((options) => {
			const optionValues = [...options].map((o) => o.value);
			expect(optionValues).to.deep.equal(itemOptions);
		});
	}

	toggleExaminationTimetableItem(itemName, hide = true) {
		const actionText = hide ? 'Hide' : 'Show';
		cy.get('.timetable-table').within(() =>
			cy.contains(itemName).within(() => {
				cy.get(this.selectors.accordionToggleText).then(($elem) => {
					const text = $elem.text().trim();
					if (text === actionText) {
						cy.wrap($elem).click();
					}
				});
			})
		);
	}

	hideAllItems() {
		cy.get(this.selectors.accordionToggleText).each(($elem) => {
			if ($elem.text() === 'Hide') {
				cy.wrap($elem).click();
			}
		});
	}

	openExaminationTimetableItemAccordion(itemName) {
		this.hideAllItems();
		this.toggleExaminationTimetableItem(itemName, false);
	}

	deleteAllExaminationTimetableItems() {
		cy.get('body').then(($body) => {
			const exists = $body.find(this.selectors.accordionToggleText).length > 0;
			if (exists) {
				this.hideAllItems();
				cy.get(this.selectors.accordionToggleText).each(($elem) => {
					if ($elem.text() === 'Show') {
						cy.wrap($elem).click();
						this.clickLinkByText('Delete timetable item', { force: true });
						this.clickButtonByText('Delete timetable item');
					}
				});
				this.clickLinkByText('Go back to examination timetable');
			}
		});
	}

	clickChangeLink(question) {
		this.elements.changeLink(question).click({ force: true });
	}

	publishUnpublishExamTimetable() {
		this.clickButtonByText('Preview and publish');
		this.clickButtonByText('Publish examination timetable');
		this.validateSuccessPanelTitle('Timetable item successfully published');
		this.clickLinkByText('Go back to examination timetable');
		this.clickLinkByText('Unpublish timetable');
		this.clickButtonByText('Unpublish examination timetable');
		this.validateSuccessPanelTitle('Timetable item successfully unpublished');
	}
}
