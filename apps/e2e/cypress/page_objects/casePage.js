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
			cy.contains(this.selectors.summaryListKey, keyText, { matchCase: false }).next()
	};

	checkProjectAnswer(question, answer) {
		this.elements
			.answerCell(question)
			.scrollIntoView()
			.then(($elem) => {
				expect($elem.text().trim()).to.eq(answer);
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
}
