/**
 * Register document status name filter
 *
 * @param {string} key
 * @returns {string}
 */
export const statusName = (key) => {
	let documentStatusName = '';

	switch (key) {
		case 'checked':
			documentStatusName = 'Checked';
			break;
		case 'ready_to_publish':
			documentStatusName = 'Ready to publish';
			break;
		case 'do_not_publish':
			documentStatusName = 'Do not publish';
			break;
		case 'awaiting_virus_check':
			documentStatusName = 'Awaiting virus check';
			break;
		case 'unpublished':
			documentStatusName = 'Unpublished';
			break;
		case 'failed_virus_check':
			documentStatusName = 'Failed virus check';
			break;
		default:
			documentStatusName = 'Unchecked';
			break;
	}

	return documentStatusName;
};
