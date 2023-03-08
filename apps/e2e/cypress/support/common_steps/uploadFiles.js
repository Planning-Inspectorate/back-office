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
