// @ts-nocheck
import { Page } from './basePage';

export class CasePage extends Page {
	elements = {
		answerCell: (question) =>
			cy.contains(this.selectors.summaryListKey, question, { matchCase: false }).next(),
		answerTableCell: (question) =>
			cy.contains(this.selectors.tableHeader, question, { matchCase: false }).next(),
		changeLink: (question) =>
			cy
				.contains(this.selectors.summaryListKey, question, { matchCase: false })
				.siblings()
				.last()
				.find('a'),
		changeTableLink: (question) =>
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
			cy.contains(this.selectors.summaryListKey, keyText, { matchCase: false }).next()
	};

	checkProjectAnswer(question, answer, forceSummaryTest = false) {
		if (Cypress.env('featureFlags')['applic-55-welsh-translation'] || forceSummaryTest) {
			this.elements
				.answerCell(question)
				.scrollIntoView()
				.then(($elem) => {
					expect($elem.text().trim().replaceAll('\n', '')).to.eq(answer);
				});
		} else {
			this.elements
				.answerTableCell(question)
				.scrollIntoView()
				.then(($elem) => {
					expect($elem.text().trim().replaceAll('\n', '')).to.eq(answer);
				});
		}
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

	clickChangeLink(question, forceSummaryTest) {
		if (Cypress.env('featureFlags')['applic-55-welsh-translation'] || forceSummaryTest) {
			this.elements.changeLink(question).click();
		} else {
			this.elements.changeTableLink(question).click();
		}
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
		this.clickBreadcrumbLinkByText('Project documentation');
		this.clickBackLink();
		this.clickPublishProjectButton();
		this.clickButtonByText('Accept and publish project');
		this.validateSuccessPanelTitle('Project page successfully published');
		this.clickLinkByText('Go back to Overview');
		this.basePageElements.clickOnUnpublishProjectLink().click();
		this.basePageElements.buttonByLabelText('Unpublish project').click();
		this.validateSuccessPanelTitle('Project page successfully unpublished');
	}
}
