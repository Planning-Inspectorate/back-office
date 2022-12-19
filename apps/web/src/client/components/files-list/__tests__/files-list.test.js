/**
 * @jest-environment jsdom
 */

// TODO: investigate why Jest PAI functions not defined
/* eslint-disable no-undef */
// @ts-nocheck
import initFilesListModule from '../files-list.module.js';
import { mockWindowLocation } from '../../../../../testing/app/mocks/client-side.js';

const DOM = `<form class="pins-files-list" method="post"><span class="display--sr-only">Manage Documents in this location</span><div class="govuk-grid-row display--flex"><div class="govuk-grid-column-two-thirds"><div class="pins-files-list__statuses"><h3 class="govuk-heading-s">Statuses</h3><div class="govuk-grid-row"><div><div class="govuk-form-group"><fieldset class="govuk-fieldset"> <legend class="govuk-fieldset__legend"> Redaction </legend> <div class="govuk-radios" data-module="govuk-radios"> <div class="govuk-radios__item"> <input class="govuk-radios__input" id="isRedacted" name="isRedacted" type="radio" value="0"> <label class="govuk-label govuk-radios__label" for="isRedacted"> Unredacted </label> </div><div class="govuk-radios__item"> <input class="govuk-radios__input" id="isRedacted-2" name="isRedacted" type="radio" value="1"> <label class="govuk-label govuk-radios__label" for="isRedacted-2"> Redacted </label> </div></div></fieldset></div></div><div><div class="govuk-form-group"><fieldset class="govuk-fieldset"> <legend class="govuk-fieldset__legend"> Status </legend> <div class="govuk-radios" data-module="govuk-radios"> <div class="govuk-radios__item"> <input class="govuk-radios__input" id="status" name="status" type="radio" value="not_user_checked"> <label class="govuk-label govuk-radios__label" for="status"> Not checked </label> </div><div class="govuk-radios__item"> <input class="govuk-radios__input" id="status-2" name="status" type="radio" value="user_checked"> <label class="govuk-label govuk-radios__label" for="status-2"> Checked </label> </div><div class="govuk-radios__item"> <input class="govuk-radios__input" id="status-3" name="status" type="radio" value="ready_to_publish"> <label class="govuk-label govuk-radios__label" for="status-3"> Ready to publish </label> </div><div class="govuk-radios__item"> <input class="govuk-radios__input" id="status-4" name="status" type="radio" value="do_not_publish"> <label class="govuk-label govuk-radios__label" for="status-4"> Do not publish </label> </div></div></fieldset></div></div><div><button class="govuk-button" data-module="govuk-button"> Apply changes</button><a href="." class="govuk-link govuk-link--no-visited-state">Clear selected</a></div></div></div></div><div class="govuk-grid-column-one-third"><div class="pins-files-list__actions"><p class="govuk-heading-s">Document actions</p><a href="1" class="govuk-link">Download selected</a><a href="2" class="govuk-link">Edit properties</a><a href="3" class="govuk-link">Publish selected</a><a href="4" class="govuk-link">Unpublish selected</a><a href="5" class="govuk-link">Move selected</a></div></div></div><div class="pins-files-list__info govuk-body"><h3 class="govuk-heading-s">Select documents to make changes to statuses</h3><div class="pagination-info"><p>This folder contains 2 document(s).Showing 1- 2document(s).</p><div><div class="govuk-form-group"> <label class="govuk-label" for="pageSize"> View </label> <select class="govuk-select" id="pageSize" name="pageSize"> <option value="25">25</option> <option value="50" selected="">50</option> <option value="75">75</option> <option value="100">100</option> <option value="125">125</option> </select></div></div></div><p><span id="selectedFilesNumber">0</span> document(s) selected</p></div><table class="govuk-table pins-files-list__table pins-table"><thead class="govuk-table__head govuk-body-s"><tr class="govuk-table__row"><th scope="col" class="govuk-table__header">Select</th><th scope="col" class="govuk-table__header">Document information</th><th scope="col" class="govuk-table__header">Date received</th><th scope="col" class="govuk-table__header">Redaction</th><th scope="col" class="govuk-table__header">Status</th><th scope="col" class="govuk-table__header">Actions</th></tr></thead><tbody class="govuk-table__body govuk-body-s"><tr class="govuk-table__row"><td class="govuk-table__cell"><div class="govuk-form-group"> <div class="govuk-checkboxes" data-module="govuk-checkboxes"> <div class="govuk-checkboxes__item"> <input class="govuk-checkboxes__input" id="selectAll" name="selectAll" type="checkbox" value="true"> <label class="govuk-label govuk-checkboxes__label" for="selectAll"> Select all </label> </div></div></div></td><td class="govuk-table__cell" colspan="5"><p>Select all documents on page</p></td></tr><tr class="govuk-table__row "><td class="govuk-table__cell"><div class="govuk-form-group"> <div class="govuk-checkboxes" data-module="govuk-checkboxes"> <div class="govuk-checkboxes__item"> <input class="govuk-checkboxes__input" id="selectedFilesIds[]" name="selectedFilesIds[]" type="checkbox" value="daf5d23c-80cf-485c-be15-5fa248beaf5a"> <label class="govuk-label govuk-checkboxes__label" for="selectedFilesIds[]"> boardingpass.pdf </label> </div></div></div></td><td class="govuk-table__cell"><p class="govuk-body-s govuk-!-font-weight-bold">boardingpass.pdf</p><p class="file-info colour--secondary">From: </p><p class="file-info colour--secondary">File type and size: ,0 KB</p></td><td class="govuk-table__cell">01/01/1970</td><td class="govuk-table__cell">Unredacted</td><td class="govuk-table__cell">Do not publish</td><td class="govuk-table__cell"><a class="govuk-link govuk-body-s" href="/edit">View/Editproperties</a><a class="govuk-link govuk-body-s" href="">Download</a></td></tr><tr class="govuk-table__row "><td class="govuk-table__cell"><div class="govuk-form-group"> <div class="govuk-checkboxes" data-module="govuk-checkboxes"> <div class="govuk-checkboxes__item"> <input class="govuk-checkboxes__input" id="selectedFilesIds[]" name="selectedFilesIds[]" type="checkbox" value="d0edb27f-b6cf-4dc0-ba9a-43d0e4af277e"> <label class="govuk-label govuk-checkboxes__label" for="selectedFilesIds[]"> current.png </label> </div></div></div></td><td class="govuk-table__cell"><p class="govuk-body-s govuk-!-font-weight-bold">current.png</p><p class="file-info colour--secondary">From: </p><p class="file-info colour--secondary">File type and size: ,0 KB</p></td><td class="govuk-table__cell">01/01/1970</td><td class="govuk-table__cell">Unredacted</td><td class="govuk-table__cell">Do not publish</td><td class="govuk-table__cell"><a class="govuk-link govuk-body-s" href="/edit">View/Editproperties</a><a class="govuk-link govuk-body-s" href="">Download</a></td></tr></tbody></table><nav class="govuk-pagination" role="navigation" aria-label="results"><ul class="govuk-pagination__list"><li class="govuk-pagination__item govuk-pagination__item--current"> <a class="govuk-link govuk-pagination__link" href="?number=1&amp;size=50" aria-label="Page 1" aria-current="page"> 1 </a> </li></ul></nav></form>`;

document.body.innerHTML = DOM;

initFilesListModule();

describe('Files list', () => {
	describe('Toggle all checkbox', () => {
		const selectAllCheckBox = document.querySelector('input[name="selectAll"]');
		const selectedFilesNumber = document.querySelector('#selectedFilesNumber');

		it('should select all when checked', async () => {
			selectAllCheckBox.checked = false;
			await selectAllCheckBox.click();

			const checkedFiles = document.querySelectorAll('input[name="selectedFilesIds[]"]:checked');

			expect(checkedFiles.length).toBe(2);
			expect(selectedFilesNumber.textContent).toBe('2');
		});

		it('should unselect all when unchecked', async () => {
			selectAllCheckBox.checked = true;
			await selectAllCheckBox.click();

			const checkedFiles = document.querySelectorAll('input[name="selectedFilesIds[]"]:checked');

			expect(checkedFiles.length).toBe(0);
			expect(selectedFilesNumber.textContent).toBe('0');
		});
	});

	describe('Pagination dropdown', () => {
		let windowLocation;

		beforeEach(() => {
			windowLocation = window.location;
			mockWindowLocation();
		});

		afterEach(() => {
			window.location = windowLocation;
		});

		it('Should refresh the page with the right pageSize', () => {
			const pageSizeSelect = document.querySelector('select[name="pageSize"]');

			pageSizeSelect.value = 50;
			pageSizeSelect.dispatchEvent(new Event('change'));

			expect(window.location.assign).toBeCalledWith('.?number=1&size=50');
		});
	});
});
