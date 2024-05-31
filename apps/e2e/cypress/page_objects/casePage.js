// @ts-nocheck
import { Page } from './basePage';

export class CasePage extends Page {
	elements = {
		answerCell: (question) =>
			cy.contains(this.selectors.tableHeader, question, { matchCase: false }).next(),
		changeLink: (question) =>
			cy
				.contains(this.selectors.tableHeader, question, { matchCase: false })
				.siblings()
				.last()
				.find('a'),
		caseReference: (reference) => cy.contains(this.selectors.mediumHeader, reference),
		caseName: () => cy.get(this.selectors.xlHeader),
		keyDatesSubmission: () => cy.get(this.selectors.list).children().eq(0),
		keyDatesSubmissionInternal: () => cy.get(this.selectors.list).children().eq(1),
		sectorInformation: (sector, subector) =>
			cy.contains(this.selectors.fullColumn, `${sector}, ${subector}`),
		summaryValue: (keyText) =>
			cy.contains(this.selectors.summaryListKey, keyText, { matchCase: false }).next(),
		summaryTableValue: (keyText) =>
			cy.contains(this.selectors.tableHeader, keyText, { matchCase: false }).next(),
		caseRefTRAIN: () =>
			cy.get('table.govuk-table:nth-child(3) > tbody:nth-child(2) > tr:nth-child(1) > td'),
		caseTrain: () =>
			cy.get(
				'table.govuk-table:nth-child(2) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(2)'
			)
	};

	checkProjectAnswer(question, answer) {
		this.elements
			.answerCell(question)
			.scrollIntoView()
			.then(($elem) => {
				expect($elem.text().trim().replaceAll('\n', '')).to.eq(answer);
			});
	}

	validateSummaryItem(keyText, valueText) {
		this.elements
			.summaryValue(keyText)
			.scrollIntoView()
			.invoke('text')
			.then((text) => {
				expect(text.trim()).to.equal(valueText);
			});
	}

	validateSummaryTableItem(keyText, valueText) {
		this.elements
			.summaryTableValue(keyText)
			.scrollIntoView()
			.invoke('text')
			.then((text) => {
				expect(text.trim()).to.equal(valueText);
			});
	}

	validateKeyDates(summaryDate, internalDate) {
		this.elements.keyDatesSubmission().scrollIntoView().should('contain.text', summaryDate);
		this.elements
			.keyDatesSubmissionInternal()
			.scrollIntoView()
			.should('contain.text', internalDate);
	}

	clickChangeLink(question) {
		this.elements.changeLink(question).click();
	}

	validateUserIsUnableToEdit() {
		this.elements.changeLink('Project name').should('not.exist');
	}

	clickPublishProjectButton() {
		if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
			this.clickButtonByText('Publish project');
		} else {
			this.clickButtonByText('Preview and publish project');
		}
	}

	publishUnpublishProject() {
		this.clickLinkByText('Project documentation');
		this.basePageElements.backToProjectPage().click();
		this.clickPublishProjectButton();
		this.clickButtonByText('Accept and publish project');
		this.validateSuccessPanelTitle('Project page successfully published');
		cy.get('#main-content > div > div > a').click();
		this.basePageElements.clickOnUnpublishProjectLink().click();
		this.basePageElements.buttonByLabelText('Unpublish project').click();
		this.validateSuccessPanelTitle('Project page successfully unpublished');
	}
}
