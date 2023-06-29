/**
 * @jest-environment jsdom
 */

// TODO: check why jset functions are not recognised by ESLINT
// @ts-nocheck
/* eslint-disable no-undef */
import { fireEvent, waitFor } from '@testing-library/dom';
import '@testing-library/jest-dom';
import initFileUploaderModule from '../file-uploader.module.js';

const DOM = `<div class="govuk-grid-row pins-file-upload" data-next-page-url="/applications-service/case/437/project-documentation/13/project-management/" data-case-id="437" data-folder-id="13" data-allowed-types=".pdf,application/pdf,.doc,application/msword,.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.ppt,application/vnd.ms-powerpoint,.pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation,.xls,application/vnd.ms-excel,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.jpg,image/jpeg,.jpeg,image/jpeg,.mpeg,video/mpeg,.mp3,audio/mpeg,.mp4,video/mp4,.mov,video/quicktime,.png,image/png,.tif,image/tiff,.tiff,image/tiff,">
<div class="top-errors-hook"></div>
<h2 class="govuk-heading-m govuk-grid-column-full">Upload files in Project management folder</h2>
<form class="govuk-grid-column-two-thirds">
   <div class="pins-file-upload--container">
	  <div class="govuk-body colour--secondary pins-file-upload--instructions">
		 <label for="upload-file-1">Choose a single or multiple files to upload.</label>
		 <span>
		 Your file must be
		 PDF,
		 DOC,
		 DOCX,
		 PPT,
		 PPTX,
		 XLS,
		 XLSX,
		 JPG,
		 JPEG,
		 MPEG,
		 MP3,
		 MP4,
		 MOV,
		 PNG,
		 TIF,
		 or TIFF
		 .
		 </span>
		 <span>The total of your uploaded files must be smaller than 1 GB.</span>
		 <div class="middle-errors-hook"></div>
	  </div>
	  <div class="display--flex">
		 <input class="display--none" id="upload-file-1" accept=".pdf,application/pdf,.doc,application/msword,.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.ppt,application/vnd.ms-powerpoint,.pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation,.xls,application/vnd.ms-excel,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.jpg,image/jpeg,.jpeg,image/jpeg,.mpeg,video/mpeg,.mp3,audio/mpeg,.mp4,video/mp4,.mov,video/quicktime,.png,image/png,.tif,image/tiff,.tiff,image/tiff," type="file" name="files" value="Choose file" aria-controls="file-list-1" multiple="">
		 <button type="button" class="pins-file-upload--button govuk-button">Choose file</button>
		 <span role="status" aria-live="assertive" class="govuk-body pins-file-upload--counter">No file chosen</span>
	  </div>
	  <div id="file-list-1">
		 <h3 class="display--sr-only" id="file-list-title-1">List of files to upload</h3>
		 <ul class="pins-file-upload--files-rows" aria-describedby="file-list-title-1" aria-live="polite"></ul>
	  </div>
   </div>
   <div class="govuk-inset-text">
	  Saving files will default then to "Unredacted" and "Not checked"
   </div>
   <div class="display--flex">
	  <button class="govuk-button pins-file-upload--submit" data-module="govuk-button" id="submit-button-1">
	  Save and continue
	  </button>
	  <div class="progress-hook"></div>
   </div>
</form>
</div>`;

document.body.innerHTML = DOM;

initFileUploaderModule();

const uploadForm = document.querySelectorAll('.pins-file-upload');
const uploadInput = uploadForm[0].querySelector('input[name="files"]');
// const filesRows = uploadForm[0].querySelector('.pins-file-upload--files-rows');

const files = [
	new File(['hello'], 'hello.png', { type: 'image/png' }),
	new File(['there'], 'there.png', { type: 'image/png' })
];

describe('file upload', () => {
	// TODO: [WIP ]test cases to be expanded

	test('should find one file upload form', () => {
		expect(uploadForm).toHaveLength(1);
	});

	test('should select a single file', async () => {
		await waitFor(() => {
			fireEvent.change(uploadInput, {
				target: {
					files: [files[0]]
				}
			});
		});

		expect(uploadInput.files).toHaveLength(1);
	});

	test('should select multiple files', async () => {
		await waitFor(() => {
			fireEvent.change(uploadInput, {
				target: {
					files: [...files]
				}
			});
		});

		expect(uploadInput.files).toHaveLength(2);
	});
});
