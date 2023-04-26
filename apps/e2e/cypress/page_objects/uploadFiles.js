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
		const checkUpload = () => {
			cy.get('body').then(($body) => {
				if ($body.text().includes('Awaiting upload')) {
					cy.reload();
				}
			});
		};

		for (let i = 0; i < 3; i++) {
			checkUpload();
		}

		cy.contains('a', 'Download', { timeout: 15000 }).should('exist');
	}

	downloadFile(fileNumber) {
		/**
			Cypress waits for a load event when the download button/link is clicked.
			The event doesn't fire when the download link is clicked which fails our test.
			So we reload the page 5s after the button/link is clicked to remedy this.
		**/

		cy.window()
			.document()
			.then(function (doc) {
				doc.addEventListener('click', () => {
					setTimeout(function () {
						doc.location.reload();
					}, 5000);
				});
				cy.get('[data-action]')
					.eq(fileNumber - 1)
					.click();
			});
	}
}
