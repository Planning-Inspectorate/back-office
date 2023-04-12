// @ts-nocheck
/// <reference types="cypress"/>

import { Then, When } from '@badeball/cypress-cucumber-preprocessor';
import '../commands';
import { FileUploadPage } from '../../page_objects/uploadFiles';

const fileUploadPage = new FileUploadPage();

// U S E R  A C T I O N S
When(/^the user uploads a file$/, function () {
	fileUploadPage.uploadFile();
});

Then(/^the folder should have "(\d+)" document$/, function (fileCount) {
	fileUploadPage.verifyFolderDocuments(fileCount);
});

When(/^the user waits for the file to upload$/, function () {
	const checkUpload = () => {
		cy.get('body').then(($body) => {
			if ($body.text().includes('Awaiting upload')) {
				cy.wait(15000);
				cy.reload();
			}
		});
	};
	// Checks if file is uploaded up to 3 times
	checkUpload();
	checkUpload();
	checkUpload();
	cy.contains('a', 'Download').should('exist');
});

When(/^the user downloads file "(\d+)" from the folder document page$/, function (fileNumber) {
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
});

Then(/^the file should have been downloaded$/, function (fileNumber) {
	cy.readFile('../../downloads/sample-doc').should('exist');
});
