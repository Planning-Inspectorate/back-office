// @ts-nocheck
import { Page } from './basePage';

export class FileUploadPage extends Page {
	elements = {
		chooseFileInput: () => cy.get('#upload-file-1')
	};

	get uploadFileBtnText() {
		return 'Upload files';
	}

	get uploadNewVersionBtnText() {
		return 'Upload new version';
	}

	// U S E R  A C T I O N S
	uploadFile(fileName, newVersion = false) {
		const text = newVersion ? this.uploadNewVersionBtnText : this.uploadFileBtnText;
		this.clickButtonByText(text);
		cy.fixture(fileName).as('file');
		this.elements.chooseFileInput().selectFile('@file', { force: true });
	}

	verifyUploadButtonIsVisible(reverse = false) {
		const assertion = reverse ? 'not.exist' : 'exist';
		this.basePageElements.buttonByLabelText(this.uploadFileBtnText).should(assertion);
	}

	verifyUploadIsComplete() {
		cy.wait(7000);
		cy.reload();
		cy.wait(2000);
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
	verifyDocumentSelectError(){
		cy.get('.govuk-list > li:nth-child(1) > a:nth-child(1)').contains('Select documents to make changes to statuses');
	}

	backToProjectDocumentationPage(){
		cy.get('li:nth-child(1) a:nth-child(1)').click();

	}
	verifyFileIsUploaded() {
		cy.wait(5000);
		cy.reload();
	}
	clickDownloadFile(){
		cy.get('#main-content > div > div > nav > a:nth-child(3)').should('exist');
		cy.get('#main-content > div > div > nav > a:nth-child(3)').click();
	}
}
