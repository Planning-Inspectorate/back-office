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

	checkAnswer(question, answer) {
		this.elements.answerCell(question).then(($elem) => {
			cy.wrap($elem.text().trim()).should('equal', answer.trim());
		});
	}

	clickChangeLink(question) {
		this.elements.changeLink(question).click();
	}

	checkAllProperties(details, enquirerDetails) {
		this.checkAnswer('S51 title', details.title);
		this.checkAnswer('Enquirer', enquirerString({ ...enquirerDetails }));
		this.checkAnswer('Enquiry method', details.methodOfEnquiry);
		this.checkAnswer('Enquiry date', details.dateFullFormatted);
		this.checkAnswer('Enquiry details', details.enquiryDetails);
		this.checkAnswer('Advise given by (internal use only)', details.adviserName);
		this.checkAnswer('Date advice given', details.dateFullFormatted);
		this.checkAnswer('Advice given', details.adviceDetails);
	}
}
