const initSelectAllCheckbox = () => {
	/** @type {NodeListOf<HTMLInputElement>} */
	const fileCheckBoxes = document.querySelectorAll('input[name="selectedFilesIds[]"]');
	/** @type {HTMLElement | null} */
	const selectAllCheckBox = document.querySelector('input[name="selectAll"]');
	/** @type {HTMLElement | null} */
	/** @type {HTMLElement | null} */
	const selectedFilesNumber = document.querySelector('#selectedFilesNumber');

	if (!selectAllCheckBox || fileCheckBoxes.length === 0 || !selectedFilesNumber) {
		return;
	}

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
	 * Update the counter of the selected pages
	 *
	 */
	const updateSelectedFilesCounter = () => {
		if (!selectedFilesNumber) return;

		const checkedFiles = document.querySelectorAll('input[name="selectedFilesIds[]"]:checked');

		selectedFilesNumber.textContent = `${(checkedFiles || []).length}`;
	};

	selectAllCheckBox.addEventListener('click', toggleSelectAll);
	for (const checkbox of fileCheckBoxes) {
		checkbox.addEventListener('change', updateSelectedFilesCounter);
	}
};

export default initSelectAllCheckbox;
