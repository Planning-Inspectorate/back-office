// @ts-nocheck
import { Page } from './basePage';

export class FileUploadPage extends Page {
	elements = {
		chooseFileInput: () => cy.get('#upload-file-1')
	};

	// U S E R  A C T I O N S
	uploadFile() {
		this.elements.chooseFileInput().selectFile(
			{
				contents: Cypress.Buffer.from('file contents'),
				fileName: 'test.pdf',
				mimeType: 'application/pdf',
				lastModified: Date.now()
			},
			{ force: true }
		);
	}
}
