// @ts-nocheck
import { Page } from './basePage';

export class KeyDatesPage extends Page {
	elements = {};

	clickManageDates(sectionName) {
		const manageDatesSelectors = {
			'Pre-application': '[data-cy="manage-dates-pre-application-section"]'
		};
		const selector = manageDatesSelectors[sectionName];

		if (selector) {
			cy.get(selector).click();
			return;
		}

		this.getSection(sectionName).find('a').first().click();
	}

	preApplication(data) {
		this.fillDate('datePINSFirstNotifiedOfProject', data['Date first notified of project']);
		this.fillDate('inceptionMeetingDate', data['Date of inception meeting']);
		this.fillDate('programmeDocumentSubmissionDate', data['Programme document submission date']);
		this.fillDate('section46Notification', data['Section 46 notification']);
		this.fillDate(
			'statutoryConsultationPeriodEndDate',
			data['Statutory consultation period end date']
		);
		this.fillDate('draftDocumentSubmissionDate', data['Date for submission of draft documents']);
		this.fillDate('dateProjectAppearsOnWebsite', data['Project published on website']);
		cy.get('[id="submissionAtPublished"]')
			.clear()
			.type(data['Anticipated submission date published']);
		this.fillDate('submissionAtInternal', data['Anticipated submission date internal']);
	}

	fillDate(fieldName, date) {
		cy.get(`#${fieldName}\\.day`).clear().type(date.enteredFormat[0]);
		cy.get(`#${fieldName}\\.month`).clear().type(date.enteredFormat[1]);
		cy.get(`#${fieldName}\\.year`).clear().type(date.enteredFormat[2]);
	}

	getSection(sectionName) {
		return cy
			.contains(this.selectors.accordionSectionHeader, sectionName)
			.parentsUntil(this.selectors.accordionSectionExpanded)
			.eq(0);
	}

	getTableData() {
		const tableData = {};
		return cy
			.get(`${this.selectors.table} tbody ${this.selectors.tableRow}, .govuk-summary-list__row`)
			.then(($rows) => {
				$rows.each((_, row) => {
					const $row = Cypress.$(row);
					const header = $row.find(this.selectors.tableHeader).text().trim();
					const summaryHeader = $row.find(this.selectors.summaryListKey).text().trim();
					const cellValue = $row.find(this.selectors.tableCell).text().trim();
					const summaryValue = $row.find(this.selectors.summaryListValue).text().trim();
					const key = header || summaryHeader;
					const value = cellValue || summaryValue;

					if (!key) {
						return;
					}

					tableData[key] = value;
				});

				return tableData;
			});
	}

	validateSectionDates(sectionName, expectedData) {
		this.getSection(sectionName).then((section) => {
			cy.wrap(section).within(() => {
				this.getTableData().then((actualData) => {
					const cleanedData = {};
					for (const [key, value] of Object.entries(expectedData)) {
						if (typeof expectedData[key] !== 'string') {
							cleanedData[key] = value.displayedDate;
						} else {
							cleanedData[key] = value;
						}
					}
					const relevantData = Object.fromEntries(
						Object.keys(cleanedData).map((key) => [key, actualData[key]])
					);
					expect(relevantData).to.deep.equal(cleanedData);
				});
			});
		});
	}
}
