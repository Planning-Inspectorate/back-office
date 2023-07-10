/**
 * @jest-environment jsdom
 */

// TODO: investigate why Jest PAI functions not defined
/* eslint-disable no-undef */
// @ts-nocheck
import initFilesListModule from '../files-list.module.js';
import {
	mockWindowLocation,
	spyClickOnAnchor
} from '../../../../../testing/app/mocks/client-side.js';

const DOM = `<div class="top-errors-hook"></div><form class="pins-files-list" method="post"><span class="display--sr-only">Manage Documents in this location</span><div class="govuk-grid-row display--flex"><div class="govuk-grid-column-two-thirds"><div class="pins-files-list__statuses"><h3 class="govuk-heading-s">Statuses</h3><div class="govuk-grid-row"><div><div class="govuk-form-group"><fieldset class="govuk-fieldset"> <legend class="govuk-fieldset__legend"> Redaction </legend> <div class="govuk-radios" data-module="govuk-radios"> <div class="govuk-radios__item"> <input class="govuk-radios__input" id="isRedacted" name="isRedacted" type="radio" value="0"> <label class="govuk-label govuk-radios__label" for="isRedacted"> Unredacted </label> </div><div class="govuk-radios__item"> <input class="govuk-radios__input" id="isRedacted-2" name="isRedacted" type="radio" value="1"> <label class="govuk-label govuk-radios__label" for="isRedacted-2"> Redacted </label> </div></div></fieldset></div></div><div><div class="govuk-form-group"><fieldset class="govuk-fieldset"> <legend class="govuk-fieldset__legend"> Status </legend> <div class="govuk-radios" data-module="govuk-radios"> <div class="govuk-radios__item"> <input class="govuk-radios__input" id="status" name="status" type="radio" value="not_checked"> <label class="govuk-label govuk-radios__label" for="status"> Not checked </label> </div><div class="govuk-radios__item"> <input class="govuk-radios__input" id="status-2" name="status" type="radio" value="checked"> <label class="govuk-label govuk-radios__label" for="status-2"> Checked </label> </div><div class="govuk-radios__item"> <input class="govuk-radios__input" id="status-3" name="status" type="radio" value="ready_to_publish"> <label class="govuk-label govuk-radios__label" for="status-3"> Ready to publish </label> </div><div class="govuk-radios__item"> <input class="govuk-radios__input" id="status-4" name="status" type="radio" value="do_not_publish"> <label class="govuk-label govuk-radios__label" for="status-4"> Do not publish </label> </div></div></fieldset></div></div><div><button class="govuk-button" data-module="govuk-button"> Apply changes</button><a href="." class="govuk-link govuk-link--no-visited-state">Clear selected</a></div></div></div></div><div class="govuk-grid-column-one-third"><div class="pins-files-list__actions"><p class="govuk-heading-s">Document actions</p><button class="pins-files-list--button-link" id="bulkDownload">Download selected</button><a href="2" class="govuk-link">Edit properties</a><a href="3" class="govuk-link">Publish selected</a><a href="4" class="govuk-link">Unpublish selected</a><a href="5" class="govuk-link">Move selected</a></div></div></div><div class="pins-files-list__info govuk-body"><h3 class="govuk-heading-s">Select documents to make changes to statuses</h3><div class="pagination-info"><p>This folder contains 3 document(s).Showing 1- 3document(s).</p><div><div class="govuk-form-group"> <label class="govuk-label" for="pageSize"> View </label> <select class="govuk-select" id="pageSize" name="pageSize"> <option value="25">25</option> <option value="50" selected="">50</option> <option value="75">75</option> <option value="100">100</option> <option value="125">125</option> </select></div></div></div><p><span id="selectedFilesNumber">0</span> document(s) selected</p></div><table class="govuk-table pins-files-list__table pins-table"><thead class="govuk-table__head govuk-body-s"><tr class="govuk-table__row"><th scope="col" class="govuk-table__header">Select</th><th scope="col" class="govuk-table__header">Document information</th><th scope="col" class="govuk-table__header">Date received</th><th scope="col" class="govuk-table__header">Redaction</th><th scope="col" class="govuk-table__header">Status</th><th scope="col" class="govuk-table__header">Actions</th></tr></thead><tbody class="govuk-table__body govuk-body-s"><tr class="govuk-table__row"><td class="govuk-table__cell"><div class="govuk-form-group"> <div class="govuk-checkboxes" data-module="govuk-checkboxes"> <div class="govuk-checkboxes__item"> <input class="govuk-checkboxes__input" id="selectAll" name="selectAll" type="checkbox" value="true"> <label class="govuk-label govuk-checkboxes__label" for="selectAll"> Select all </label> </div></div></div></td><td class="govuk-table__cell" colspan="5"><p>Select all documents on page</p></td></tr><tr class="govuk-table__row "><td class="govuk-table__cell"><div class="govuk-form-group"> <div class="govuk-checkboxes" data-module="govuk-checkboxes"> <div class="govuk-checkboxes__item"> <input class="govuk-checkboxes__input" id="checkbox-id-52f97bad-3ff0-4c41-a2d6-c0a7c5f6aba3" name="selectedFilesIds[]" type="checkbox" value="52f97bad-3ff0-4c41-a2d6-c0a7c5f6aba3"> <label class="govuk-label govuk-checkboxes__label" for="checkbox-id-52f97bad-3ff0-4c41-a2d6-c0a7c5f6aba3"> Screenshot 2022-11-21 at 11.04.08.png </label> </div></div></div></td><td class="govuk-table__cell"><a data-action="" class="govuk-link govuk-body-s govuk-!-font-weight-bold" href="/documents/1/download/52f97bad-3ff0-4c41-a2d6-c0a7c5f6aba3/preview">Screenshot 2022-11-21 at 11.04.08.png</a><p class="file-info colour--secondary">From: </p><p class="file-info colour--secondary">File type and size: PNG,69.4 KB</p></td><td class="govuk-table__cell">24/01/2023</td><td class="govuk-table__cell">Unredacted</td><td class="govuk-table__cell">Awaiting upload</td><td class="govuk-table__cell"><a data-action="" class="govuk-link govuk-body-s" href="edit/file">View/Edit properties</a><a data-action="download-52f97bad-3ff0-4c41-a2d6-c0a7c5f6aba3" class="govuk-link govuk-body-s" href="/documents/1/download/52f97bad-3ff0-4c41-a2d6-c0a7c5f6aba3/">Download</a></td></tr><tr class="govuk-table__row "><td class="govuk-table__cell"><div class="govuk-form-group"> <div class="govuk-checkboxes" data-module="govuk-checkboxes"> <div class="govuk-checkboxes__item"> <input class="govuk-checkboxes__input" id="checkbox-id-f8653281-52b4-442a-a2ac-283600e978c0" name="selectedFilesIds[]" type="checkbox" value="f8653281-52b4-442a-a2ac-283600e978c0"> <label class="govuk-label govuk-checkboxes__label" for="checkbox-id-f8653281-52b4-442a-a2ac-283600e978c0"> Cats.mp4 </label> </div></div></div></td><td class="govuk-table__cell"><a data-action="" class="govuk-link govuk-body-s govuk-!-font-weight-bold" href="/documents/1/download/f8653281-52b4-442a-a2ac-283600e978c0/preview">Cats.mp4</a><p class="file-info colour--secondary">From: </p><p class="file-info colour--secondary">File type and size: PNG,28.6 KB</p></td><td class="govuk-table__cell">24/01/2023</td><td class="govuk-table__cell">Unredacted</td><td class="govuk-table__cell">Awaiting upload</td><td class="govuk-table__cell"><a data-action="" class="govuk-link govuk-body-s" href="edit/file">View/Edit properties</a><a data-action="download-f8653281-52b4-442a-a2ac-283600e978c0" class="govuk-link govuk-body-s" href="/documents/1/download/f8653281-52b4-442a-a2ac-283600e978c0/">Download</a></td></tr><tr class="govuk-table__row "><td class="govuk-table__cell"><div class="govuk-form-group"> <div class="govuk-checkboxes" data-module="govuk-checkboxes"> <div class="govuk-checkboxes__item"> <input class="govuk-checkboxes__input" id="checkbox-id-33a6bfb0-b884-4816-af72-7dc33d5cf0ac" name="selectedFilesIds[]" type="checkbox" value="33a6bfb0-b884-4816-af72-7dc33d5cf0ac"> <label class="govuk-label govuk-checkboxes__label" for="checkbox-id-33a6bfb0-b884-4816-af72-7dc33d5cf0ac"> Screenshot 2022-08-06 at 13.55.42.png </label> </div></div></div></td><td class="govuk-table__cell"><a data-action="" class="govuk-link govuk-body-s govuk-!-font-weight-bold" href="/documents/1/download/33a6bfb0-b884-4816-af72-7dc33d5cf0ac/preview">Screenshot 2022-08-06 at 13.55.42.png</a><p class="file-info colour--secondary">From: </p><p class="file-info colour--secondary">File type and size: PNG,0.4 MB</p></td><td class="govuk-table__cell">24/01/2023</td><td class="govuk-table__cell">Unredacted</td><td class="govuk-table__cell">Awaiting upload</td><td class="govuk-table__cell"><a data-action="" class="govuk-link govuk-body-s" href="edit/file">View/Edit properties</a><a data-action="download-33a6bfb0-b884-4816-af72-7dc33d5cf0ac" class="govuk-link govuk-body-s" href="/documents/1/download/33a6bfb0-b884-4816-af72-7dc33d5cf0ac/">Download</a></td></tr></tbody></table><nav class="govuk-pagination" role="navigation" aria-label="results"><ul class="govuk-pagination__list"><li class="govuk-pagination__item govuk-pagination__item--current"> <a class="govuk-link govuk-pagination__link" href="?number=1&amp;size=50" aria-label="Page 1" aria-current="page"> 1 </a> </li></ul></nav></form>`;

document.body.innerHTML = DOM;

initFilesListModule();

describe('Files list', () => {
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

			expect(window.location.assign).toHaveBeenCalledWith('.?number=1&size=50');
		});
	});

	describe('Bulk download', () => {
		beforeAll(() => {
			spyClickOnAnchor();
		});

		it('should call the download link for each selected file', async () => {
			const downloadLinks = document.querySelector(`a[data-action^='download']`);
			const bulkDownloadButton = document.querySelector('#bulkDownload');
			const checkBoxes = document.querySelectorAll('input[name="selectedFilesIds[]"]');

			// select the first 2 files
			checkBoxes[0].checked = true;
			checkBoxes[1].checked = true;

			const checkedFiles = document.querySelectorAll('input[name="selectedFilesIds[]"]:checked');

			await bulkDownloadButton.click();

			expect(checkedFiles.length).toBe(2);
			setTimeout(() => {
				// the click is delayed, hence the test of the click should be delayed as well
				expect(downloadLinks.click).toHaveBeenCalledTimes(2);
			}, 3000);
		});
	});
});
