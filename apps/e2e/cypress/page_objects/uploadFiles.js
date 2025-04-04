// @ts-nocheck
import 'cypress-wait-until';
import { Page } from './basePage';
import { SearchResultsPage } from '../page_objects/searchResultsPage';
const searchResultsPage = new SearchResultsPage();

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
		cy.waitUntil(
			async () => {
				cy.reload();
				const $downloadLink = cy.$$(`a:contains('Download')`);
				return !!$downloadLink.length;
			},
			{ timeout: 30000 }
		);
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
	verifyDocumentSelectError() {
		this.validateErrorMessageIsInSummary('Select documents to make changes to statuses');
	}

	backToProjectDocumentationPage() {
		this.basePageElements.breadcrumbLinkByText('Project documentation').click();
	}
	verifyFileIsUploaded() {
		cy.wait(5000);
		cy.reload();
	}
	clickDownloadFile() {
		this.clickButtonByText('Download');
	}
	fileUpload(filename, count) {
		this.verifyUploadButtonIsVisible();
		this.uploadFile(filename);
		searchResultsPage.clickButtonByText('Save and continue');
		this.verifyFolderDocuments(count);
		this.verifyUploadIsComplete();
	}

	verifyFolderTitle(title) {
		cy.contains('h2.govuk-heading-l', title);
	}

	showSubfolders() {
		cy.contains('button.govuk-accordion__section-button span', 'Show').click();
	}

	createFolder() {
		this.clickLinkByText('Create folder');
	}

	renameFolder() {
		this.clickLinkByText('Rename folder');
	}

	deleteFolder() {
		this.clickLinkByText('Delete folder');
	}

	hasFolder(text) {
		this.verifyTableContains(text);
	}

	clickFolder(text) {
		cy.contains('#pins-subfolder-accordian-content-1 a', text).click();
	}
}
