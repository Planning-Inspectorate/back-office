// @ts-nocheck
import { Page } from './basePage';

export class ProjectUpdatesPage extends Page {
	elements = {
		content: (contentId) => cy.get(contentId).find('.toastui-editor-contents p')
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
}
