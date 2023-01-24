const initFilesListModule = () => {
	/** @type {NodeListOf<HTMLInputElement>} */
	const fileCheckBoxes = document.querySelectorAll('input[name="selectedFilesIds[]"]');
	/** @type {HTMLElement | null} */
	const selectAllCheckBox = document.querySelector('input[name="selectAll"]');
	/** @type {HTMLElement | null} */
	const pageSizeSelect = document.querySelector('select[name="pageSize"]');
	/** @type {HTMLElement | null} */
	const selectedFilesNumber = document.querySelector('#selectedFilesNumber');
	/** @type {HTMLElement | null} */
	const bulkDownloadButton = document.querySelector('#bulkDownload');

	if (
		!bulkDownloadButton ||
		!selectAllCheckBox ||
		fileCheckBoxes.length === 0 ||
		!pageSizeSelect ||
		!selectedFilesNumber
	) return;

	/**
	 * Toggle the bulk selection of files
	 *
	 * @param {*} clickEvent
	 */
	const toggleSelectAll = (clickEvent) => {
		for (const checkbox of fileCheckBoxes) {
			checkbox.checked = clickEvent.target.checked;
		}
		updateSelectedFilesCounter();
	};

	/**
	 * Refresh the page with the new pageSize value
	 *
	 * @param {*} changeEvent
	 */
	const changePageSize = (changeEvent) => {
		window.location.assign(`.?number=1&size=${changeEvent.target.value}`);
	};

	/**
	 * Update the counter of the selected pages
	 *
	 */
	const updateSelectedFilesCounter = () => {
		if (!selectedFilesNumber) return;

		const checkedFiles = document.querySelectorAll('input[name="selectedFilesIds[]"]:checked');

		selectedFilesNumber.textContent = `${(checkedFiles || []).length}`;
	};

	const bulkDownload = () => {
		/** @type {*} */
		const checkedFiles = document.querySelectorAll('input[name="selectedFilesIds[]"]:checked');

		for (const selectedCheckbox of checkedFiles) {
			const { value: selectedGuid } = selectedCheckbox;
			/** @type {HTMLElement | null} */
			const downloadLink = document.querySelector(`a[data-action='download-${selectedGuid}']`);

			if (downloadLink) {
				downloadLink.click();
			}
		}
	};

	selectAllCheckBox.addEventListener('click', toggleSelectAll);
	bulkDownloadButton.addEventListener('click', bulkDownload);
	pageSizeSelect.addEventListener('change', changePageSize);
	for (const checkbox of fileCheckBoxes) {
		checkbox.addEventListener('change', updateSelectedFilesCounter);
	}
};

export default initFilesListModule;
