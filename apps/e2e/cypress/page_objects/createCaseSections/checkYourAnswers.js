// @ts-nocheck
import { SectionBase } from './sectionBase';

export class CheckYourAnswersSection extends SectionBase {
	elements = {
		answerCell: (question) =>
			cy.contains(this.selectors.tableCell, question, { matchCase: false }).next(),
		changeLink: (question) =>
			cy.contains(this.selectors.tableCell, question, { matchCase: false }).nextUntil('a')
	};
	checkAnswer(question, answer) {
		this.elements.answerCell(question).then(($elem) => {
			cy.wrap($elem).should('have.text', answer);
		});
	}

	clickChangeLink(question) {
		this.elements.changeLink(question).click();
	}

	validatePage() {
		this.validateSectionHeader('Check your answers before creating a new project');
	}
}
