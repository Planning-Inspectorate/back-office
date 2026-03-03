// @ts-nocheck
import { Page } from './basePage';

export class FolderDocumentsPage extends Page {
	elements = {
		redactionRadio: (redactedStatus) =>
			this.basePageElements.radioButton().contains(redactedStatus),
		statusRadio: (status) => this.basePageElements.radioButton().contains(status)
	};

	// U S E R  A C T I O N S
	setRedactionStatus(redactedStatus = 'Unredacted') {
		this.elements.redactionRadio(redactedStatus).click({ force: true });
	}

	/**
	 * Sets the status for the selected document.
	 * @param {string} status - Status to be set. (options are: 'Not checked', 'Checked', 'Ready to publish' and 'Do not publish').
	 */
	setOverallStatus(status) {
		this.elements.statusRadio(status).click({ force: true });
	}

	markAllReadyToPublish(redactedStatus = 'Redacted') {
		this.setRedactionStatus(redactedStatus);
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
	navigateToProjectFolder() {
		this.goToFolderDocumentPage();
	}
	unpublishDocument() {
		this.clickButtonByText('Unpublish');
		this.clickButtonByText('Unpublish documents');
		this.validateSuccessPanelTitle('Document/s successfully unpublished');
	}
	verifyDeleteButtonIsVisible() {
		this.basePageElements.buttonByLabelText('Delete').should('exist');
	}
	applyChangesWithoutSelectingDocument() {
		this.setOverallStatus('Ready to publish');
		this.clickButtonByText('Apply changes');
	}
	applyChanges() {
		this.setOverallStatus('Ready to publish');
		this.selectAllDocuments();
		this.clickButtonByText('Apply changes');
	}
	clickOnPublishButton() {
		this.clickButtonByText('Publish documents');
	}
}
