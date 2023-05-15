// @ts-nocheck
import { Page } from './basePage';

export class FileUploadPage extends Page {
	elements = {
		chooseFileInput: () => cy.get('#upload-file-1')
	};

	get uploadFileBtnText() {
		return 'Upload files';
	}

	// U S E R  A C T I O N S
	uploadFile() {
		this.clickButtonByText(this.uploadFileBtnText);
		cy.fixture('sample-doc.pdf').as('pdf');
		this.elements.chooseFileInput().selectFile('@pdf', { force: true });
	}

	verifyUploadButtonIsVisible(reverse = false) {
		const assertion = reverse ? 'not.exist' : 'exist';
		this.basePageElements.buttonByLabelText(this.uploadFileBtnText).should(assertion);
	}

	verifyUploadIsComplete() {
		cy.wait(5000);
		cy.reload();
		const messages = ['Awaiting upload', 'Awaiting virus check'];
		messages.map((message) => cy.contains(message).should('not.exist'));
		cy.contains('a', 'View/Edit properties').should('exist');
		cy.contains('a', 'Download').should('exist');
	}

	downloadFile(fileNumber, button = false) {
		/**
			Cypress waits for a load event when the download button/link is clicked.
			The event doesn't fire when the download link is clicked which fails our test.
			So we reload the page 5s after the button/link is clicked to remedy this.
		**/

		cy.window()
			.document()
			.then((doc) => {
				doc.addEventListener('click', () => {
					setTimeout(() => {
						doc.location.reload();
					}, 5000);
				});

				if (button) {
					this.clickButtonByText('Download');
				} else {
					cy.get('[data-action]')
						.eq(fileNumber - 1)
						.click();
				}
			});
	}
}
