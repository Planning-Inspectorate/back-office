// @ts-nocheck
/// <reference types="cypress"/>

import { Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { Page } from '../../page_objects/basePage';

const page = new Page();
const foldersSelector = `${page.selectors.link}${page.selectors.smallHeader}`;

const getAllPaths = (folders, path = []) => {
	let allPaths = new Set();
	for (let folder of folders) {
		let newPath = [...path, folder.name];
		if (folder.subfolders.length > 0) {
			let subPaths = getAllPaths(folder.subfolders, newPath);
			subPaths.forEach((subPath) => allPaths.add(subPath));
		} else {
			allPaths.add(newPath);
		}
	}
	return Array.from(allPaths);
};

// U S E R  A C T I O N S
Then(/^the user validates all folder paths$/, function async() {
	cy.fixture('folder-structure').then((folders) => {
		const caseId = Cypress.env('currentCreatedCaseId');
		const folderBase = `/applications-service/case/${caseId}/project-documentation`;
		const paths = getAllPaths(folders);
		paths.forEach((folderPath) => {
			console.log(folderPath);
			cy.wait(1000);
			cy.visit(folderBase);
			folderPath.forEach((p, i) => {
				if (i !== 0) {
					cy.get('.govuk-accordion__show-all').invoke('attr', 'aria-expanded', 'true');
				} else {
					page.clickLinkByText(new RegExp(p));
				}
			});
		});
	});
});
