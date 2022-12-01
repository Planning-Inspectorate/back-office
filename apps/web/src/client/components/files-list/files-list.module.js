/** @type {NodeListOf<HTMLInputElement>} */
const fileCheckBoxes = document.querySelectorAll('input[name="selectedFilesIds"]');
/** @type {HTMLElement | null} */
const selectAllCheckBox = document.querySelector('input[name="selectAll"]');
/** @type {HTMLElement | null} */
const pageSizeSelect = document.querySelector('select[name="pageSize"]');
/** @type {HTMLElement | null} */
const selectedFilesNumber = document.querySelector('#selectedFilesNumber');

const initFilesListModule = () => {
	if (!selectAllCheckBox || fileCheckBoxes.length === 0 || !pageSizeSelect) return;

	selectAllCheckBox.addEventListener('click', toggleSelectAll);
	pageSizeSelect.addEventListener('change', changePageSize);
	for (const checkbox of fileCheckBoxes) {
		checkbox.addEventListener('change', updateSelectedFilesCounter);
	}
};

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
	document.location = `.?number=1&size=${changeEvent.target.value}`;
};

/**
 * Update the counter of the selected pages
 *
 */
const updateSelectedFilesCounter = () => {
	if (!selectedFilesNumber) return;

	const checkedFiles = document.querySelectorAll('input[name="selectedFilesIds"]:checked');

	selectedFilesNumber.textContent = `${(checkedFiles || []).length}`;
};

export default initFilesListModule;
