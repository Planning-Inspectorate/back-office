// @ts-nocheck
import { enquirerString } from '../support/utils/utils.js';
import { Page } from './basePage';

export class S51AdvicePropertiesPage extends Page {
	elements = {
		answerCell: (question) =>
			cy.contains(this.selectors.summaryListKey, question, { matchCase: true }).next(),
		changeLink: (question) =>
			cy.contains(this.selectors.summaryListKey, question, { matchCase: false }).nextUntil('a')
	};

	checkAnswer(question, answer, strict = true) {
		this.elements.answerCell(question).then(($elem) => {
			const assertion = strict ? 'equal' : 'include';
			cy.wrap($elem.text().replace(/\s+/g, ' ').trim()).should(assertion, answer.trim());
		});
	}

	clickChangeLink(question) {
		this.elements.changeLink(question).click();
	}

	checkAllProperties(details, enquirerDetails) {
		this.checkAnswer('S51 title', details.title);
		this.checkAnswer('Enquirer', enquirerString({ ...enquirerDetails }), false);
		this.checkAnswer('Enquiry method', details.methodOfEnquiry);
		this.checkAnswer('Enquiry date', details.dateFullFormatted);
		this.checkAnswer('Enquiry details', details.enquiryDetails);
		this.checkAnswer('Advice given by (internal use only)', details.adviserName);
		this.checkAnswer('Date advice given', details.dateFullFormatted);
	}
}
