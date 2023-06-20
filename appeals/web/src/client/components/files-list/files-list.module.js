import { buildErrorBanner } from './_html.js';

const initFilesListModule = () => {
	/** @type {HTMLElement | null} */
	const pageSizeSelect = document.querySelector('select[name="pageSize"]');
	/** @type {HTMLElement | null} */
	const bulkDownloadButton = document.querySelector('#bulkDownload');
	/** @type {HTMLElement | null} */
	const topHook = document.querySelector('.top-errors-hook');

	if (!topHook || !bulkDownloadButton || !pageSizeSelect) {
		return;
	}

	/**
	 * Refresh the page with the new pageSize value
	 *
	 * @param {*} changeEvent
	 */
	const changePageSize = (changeEvent) => {
		window.location.assign(`.?number=1&size=${changeEvent.target.value}`);
	};

	/**
	 * Download many files at once
	 *
	 * @param {*} clickEvent
	 */
	const bulkDownload = (clickEvent) => {
		clickEvent.preventDefault();

		/** @type {NodeListOf<HTMLInputElement>} */
		const checkedFiles = document.querySelectorAll('input[name="selectedFilesIds[]"]:checked');

		if (checkedFiles.length === 0) {
			topHook.innerHTML = buildErrorBanner('Select documents to download');
			topHook.scrollIntoView();

			return;
		}

		for (const [index, selectedCheckbox] of checkedFiles.entries()) {
			const { value: selectedGuid } = selectedCheckbox;

			/** @type {HTMLElement | null} */
			const downloadLink = document.querySelector(`a[data-action='download-${selectedGuid}']`);

			if (downloadLink) {
				// system interrupts download requests if they all happen at the very same moment
				// delay each request 500ms
				setTimeout(() => {
					downloadLink.click();
				}, index * 500);
			}
		}
	};

	bulkDownloadButton.addEventListener('click', bulkDownload);
	pageSizeSelect.addEventListener('change', changePageSize);
};

export default initFilesListModule;
