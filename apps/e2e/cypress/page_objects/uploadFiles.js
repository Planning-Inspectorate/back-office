// @ts-nocheck
import { Page } from './basePage';

export class FileUploadPage extends Page {
	elements = {
		chooseFileInput: () => cy.get('#upload-file-1')
	};

	// U S E R  A C T I O N S
	uploadFile() {
		cy.fixture('sample-doc.pdf').as('pdf');
		this.elements.chooseFileInput().selectFile('@pdf', { force: true });
	}
}
