export const errorMessages = {
	GENERIC: 'Something went wrong, please try again',
	SIZE_EXCEDEED: 'The total of your uploaded files must be smaller than 1 GB',
	TIMEOUT: 'There was a timeout and your files could not be uploaded, try again'
	// SINGLE_FILE : (fileName) => `${fileName} could not be added, try again`
};
/*

const showErrors = () => {

	const uploadErrorsTop = document.querySelector('.pins-file-upload--errors-top');
	const uploadErrorsCenter = document.querySelector('.pins-file-upload--errors-center');
	const uploadErrorsBottom = document.querySelector('.pins-file-upload--errors-bottom');

	if (!uploadErrorsTop) return;


	const showTopErrors = (errors) => {
		const errorsTopList = uploadErrorsTop.querySelector('.govuk-error-summary__list');
		const emptyErrorsTopListItem = errorsTopList.children[0];

		errorsTopList.innerHTML = ''
		for (const error of errors) {
			const newErrorsTopListItem = emptyErrorsTopListItem.cloneNode(true);

			newErrorsTopListItem.children[0].textContent = error;
			newErrorsTopListItem.classList.remove('display--none');
			errorsTopList.append(newErrorsTopListItem);
		}
		uploadErrorsTop.focus();
		uploadErrorsTop.classList.remove('display--none');
	}
}
*/
