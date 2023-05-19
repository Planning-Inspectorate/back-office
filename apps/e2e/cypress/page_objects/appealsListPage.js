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
}
