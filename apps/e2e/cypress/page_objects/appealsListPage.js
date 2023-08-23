// @ts-nocheck
import { indexOf } from 'lodash';
import { Page } from './basePage';

export class AppealsListPage extends Page {
	// Examples

	_selectors = {
		uniqueSelector: 'selector-name'
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
}
