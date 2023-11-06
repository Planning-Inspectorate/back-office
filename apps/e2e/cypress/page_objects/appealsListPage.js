// @ts-nocheck

import { Page } from './basePage';

export class AppealsListPage extends Page {
	// Examples

	_selectors = {
		link: 'govuk-link',
		uniqueSelector: 'selector-name',
		summaryListValue: '.govuk-summary-list__value'
	};

	clickMyUniqueElement() {
		// Selector from this class this._selectors
		cy.get(this._selectors.uniqueSelector).click();
	}

	useBaseElementOrSelector() {
		// Methods that returns an element
		this.basePageElements.buttonByLabelText('Click me').click();

		// Methods that perform an action
		this.clickButtonByText('Click me');

		// Selectors from base page eg this.selectors
		cy.get(this.selectors.errorMessage).should('have.text', 'this is an error message');
	}

	//ELEMENTS

	appealsPageElements = {
		answerCellAppeals: (answer) =>
			cy.contains(this.selectors.summaryListValue, answer, { matchCase: false }),
		link: () => cy.get(this._selectors.link)
	};

	//ACTIONS

	clickAppealFromList(position) {
		this.basePageElements
			.tableRow()
			.eq(position - 1)
			.find(this.selectors.link)
			.click();
	}

	clickReviewLpaq(position) {
		this.clickAccordionByText('Case documentation');
		this.basePageElements
			.tableCell()
			.eq(position - 2)
			.find(this.selectors.link)
			.click();
	}

	clickReviewAppellantCase(position) {
		this.clickAccordionByText('Case documentation');
		this.basePageElements
			.tableCell()
			.eq(position - 2)
			.find(this.selectors.link)
			.click();
	}

	clickChangeVisitTypeHasCaseTimetable() {
		this.clickAccordionByText('Case timetable');
		cy.get(
			'#accordion-default425-content-3 > .govuk-summary-list > :nth-child(3) > .govuk-summary-list__actions > .govuk-link'
		).click();
	}

	clickChangeVisitTypeHasSiteDetails() {
		this.clickAccordionByText('Site details');
		cy.get(':nth-child(8) > .govuk-summary-list__actions > .govuk-link').click();
	}
	fillInput(text, index = 0) {
		this.basePageElements.input().eq(index).clear().type(text);
	}

	fillInput1(text, index = 1) {
		this.basePageElements.input().eq(index).clear().type(text);
	}

	fillInput2(text, index = 2) {
		this.basePageElements.input().eq(index).clear().type(text);
	}

	addAnotherButton() {
		cy.get('#conditional-incompleteReason-2 > .pins-add-another > .govuk-button').click();
	}

	nationalListSearch(text) {
		this.fillInput(text);
		this.clickButtonByText('Search');
	}

	selectAppellantOutcome(outcome) {
		this.clickAccordionByText('Case documentation');
		cy.contains(this.selectors.tableHeader, 'Appellant case');
		this.clickAppealFromList(2);
		this.selectRadioButtonByValue(outcome);
	}

	selectLpaqOutcome(outcome) {
		this.clickAccordionByText('Case documentation');
		cy.contains(this.selectors.tableHeader, 'LPA Questionnaire');
		this.clickAppealFromList(3);
		this.selectRadioButtonByValue(outcome);
	}

	verifyBannerTitle() {
		cy.contains(this.selectors.bannerTitle);
	}

	verifyBannerContent() {
		cy.contains(this.selectors.bannerContent);
	}

	clickCaseOfficer() {
		this.clickAccordionByText('Case Team');
		cy.get(
			'#accordion-default423-content-5 > .govuk-summary-list > :nth-child(1) > .govuk-summary-list__actions > .govuk-link'
		).click();
	}
	clickInspector() {
		this.clickAccordionByText('Case Team');
		cy.get(
			'#accordion-default423-content-5 > .govuk-summary-list > :nth-child(2) > .govuk-summary-list__actions > .govuk-link'
		).click();
	}

	checkAnswerSummaryValue(answer) {
		this.appealsPageElements.answerCellAppeals(answer).then(($elem) => {
			cy.wrap($elem)
				.invoke('text')
				.then((text) => expect(text.trim()).to.equal(answer));
		});
	}

	checkValueIsBlank(position) {
		this.clickAccordionByText('Case Team');
		this.basePageElements
			.summaryListValue()
			.eq(position - 1)
			.should('not.have.text');
	}
}

//ASSERTIONS
