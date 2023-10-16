// @ts-nocheck
import { Page } from './basePage';

export class FolderDocumentsPage extends Page {
	elements = {
		redactionRadio: (redacted = false) => cy.get(redacted ? '#isRedacted-2' : '#isRedacted'),
		statusRadio: (status) => this.basePageElements.radioButton().contains(status)
	};

	// U S E R  A C T I O N S
	setRedactionStatus(redacted = false) {
		this.elements.redactionRadio(redacted).click({ force: true });
	}

	/**
	 * Sets the status for the selected document.
	 * @param {string} status - Status to be set. (options are: 'Not checked', 'Checked', 'Ready to publish' and 'Do not publish').
	 */
	setOverallStatus(status) {
		this.elements.statusRadio(status).click({ force: true });
	}

	markAllReadyToPublish(redacted = false) {
		this.setRedactionStatus(redacted);
		this.setOverallStatus('Ready to publish');
		this.selectAllDocuments();
		this.clickButtonByText('Apply changes');
	}

	publishAllDocumentsInList() {
		this.selectAllDocuments();
		this.clickButtonByText('Publish documents');
		this.validateSuccessPanelTitle('Document/s successfully published');
	}

	validateSuccessfulPublish(projectInfo, caseRef, docCount) {
		this.validateSuccessPanelBody(`${docCount} documents published to the NI website`);
		this.validateSuccessPanelBody(projectInfo.projectName);
		this.validateSuccessPanelBody(caseRef);
	}

	validatePublishingQueueCase(projectInfo, caseRef) {
		cy.contains(projectInfo.projectName).should('exist');
		cy.contains(caseRef).should('exist');
	}
	navigateToProjectFolder(){
		this.goToFolderDocumentPage();
	}
	unpublishDocument() {
		this.basePageElements.unpublishLink().click();
		this.clickButtonByText('Unpublish documents');
		this.validateSuccessPanelTitle('Document/s successfully unpublished');
	}
}
