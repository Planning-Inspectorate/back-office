// @ts-nocheck
import { Page } from './basePage';
import { faker } from '@faker-js/faker';
import { S51AdvicePropertiesPage } from './s51AdviceProperties.js';
import { enquirerString } from '../support/utils/utils.js';
import { type } from 'os';

export class KeyDatesPage extends Page {
	elements = {};

	clickManageDates(sectionName) {
		this.getSection(sectionName).find('a').click();
	}

	preApplication(data) {
		const fields = Object.keys(data);
		// Date first notified of project
		cy.get('#datePINSFirstNotifiedOfProject\\.day').clear().type(data[fields[0]].enteredFormat[0]);
		cy.get('#datePINSFirstNotifiedOfProject\\.month')
			.clear()
			.type(data[fields[0]].enteredFormat[1]);
		cy.get('#datePINSFirstNotifiedOfProject\\.year').clear().type(data[fields[0]].enteredFormat[2]);

		// Project published on website
		cy.get('#dateProjectAppearsOnWebsite\\.day').clear().type(data[fields[1]].enteredFormat[0]);
		cy.get('#dateProjectAppearsOnWebsite\\.month').clear().type(data[fields[1]].enteredFormat[1]);
		cy.get('#dateProjectAppearsOnWebsite\\.year').clear().type(data[fields[1]].enteredFormat[2]);

		// Anticipated date published
		cy.get('[id="submissionAtPublished"]').clear().type(data[fields[2]]);

		// Anticipated submission date internal
		cy.get('#submissionAtInternal\\.day').clear().type(data[fields[3]].enteredFormat[0]);
		cy.get('#submissionAtInternal\\.month').clear().type(data[fields[3]].enteredFormat[1]);
		cy.get('#submissionAtInternal\\.year').clear().type(data[fields[3]].enteredFormat[2]);

		// Screening opinion sought
		cy.get('#screeningOpinionSought\\.day').clear().type(data[fields[4]].enteredFormat[0]);
		cy.get('#screeningOpinionSought\\.month').clear().type(data[fields[4]].enteredFormat[1]);
		cy.get('#screeningOpinionSought\\.year').clear().type(data[fields[4]].enteredFormat[2]);

		// Screening opinion issued
		cy.get('#screeningOpinionIssued\\.day').clear().type(data[fields[5]].enteredFormat[0]);
		cy.get('#screeningOpinionIssued\\.month').clear().type(data[fields[5]].enteredFormat[1]);
		cy.get('#screeningOpinionIssued\\.year').clear().type(data[fields[5]].enteredFormat[2]);

		// Scoping opinion sought
		cy.get('#scopingOpinionSought\\.day').clear().type(data[fields[6]].enteredFormat[0]);
		cy.get('#scopingOpinionSought\\.month').clear().type(data[fields[6]].enteredFormat[1]);
		cy.get('#scopingOpinionSought\\.year').clear().type(data[fields[6]].enteredFormat[2]);

		// Scoping opinion issued
		cy.get('#scopingOpinionIssued\\.day').clear().type(data[fields[7]].enteredFormat[0]);
		cy.get('#scopingOpinionIssued\\.month').clear().type(data[fields[7]].enteredFormat[1]);
		cy.get('#scopingOpinionIssued\\.year').clear().type(data[fields[7]].enteredFormat[2]);

		// Section 46 notification
		cy.get('#section46Notification\\.day').clear().type(data[fields[8]].enteredFormat[0]);
		cy.get('#section46Notification\\.month').clear().type(data[fields[8]].enteredFormat[1]);
		cy.get('#section46Notification\\.year').clear().type(data[fields[8]].enteredFormat[2]);
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
			.get(`${this.selectors.table} tbody ${this.selectors.tableRow}`)
			.each(($row) => {
				const header = $row.find(this.selectors.tableHeader).text().trim();
				const cellValue = $row.find(this.selectors.tableCell).text().trim();
				tableData[header] = cellValue;
			})
			.then(() => {
				return Cypress.Promise.resolve(tableData);
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
					expect(actualData).to.deep.equal(cleanedData);
				});
			});
		});
	}
}
