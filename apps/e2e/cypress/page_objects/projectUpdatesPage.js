// @ts-nocheck
import { Page } from './basePage';

export class ProjectUpdatesPage extends Page {
	elements = {
		content: (contentId) => cy.get(contentId).find('.toastui-editor-contents p'),
		reviewLink: (text) =>
			cy.contains(this.selectors.tableRow, text, { matchCase: false }).find('a'),
		changeLink: (question) =>
			cy
				.contains(this.selectors.summaryListKey, question, { matchCase: false })
				.siblings()
				.last()
				.find('a')
	};

	clearContent(id) {
		this.elements.content(id).type('{backspace}'.repeat(20));
	}

	fillContent(id, text) {
		this.clearContent(id);
		this.elements.content(id).type(text);
	}

	fillEnglishContent(text) {
		this.fillContent('#backOfficeProjectUpdateContent', text);
	}

	fillWelshContent(text) {
		this.fillContent('#backOfficeProjectUpdateContentWelsh', text);
	}

	clickReviewLink(text) {
		this.elements.reviewLink(text).click();
	}

	clickChangeLink(question) {
		this.elements.changeLink(question).click();
	}
}
