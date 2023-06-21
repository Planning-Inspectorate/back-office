/**
 * Register document status name filter
 *
 * @param {string} key
 * @returns {string}
 */
export const statusName = (key) => {
	let documentStatusName = '';

	switch (key) {
		case 'awaiting_upload':
			documentStatusName = 'Awaiting upload';
			break;
		case 'awaiting_virus_check':
			documentStatusName = 'Awaiting virus check';
			break;
		case 'failed_virus_check':
			documentStatusName = 'Failed virus check';
			break;
		case 'not_user_checked':
			documentStatusName = 'Unchecked';
			break;
		case 'user_checked':
			documentStatusName = 'Checked';
			break;
		case 'ready_to_publish':
			documentStatusName = 'Ready to publish';
			break;
		case 'publishing':
			documentStatusName = 'Publishing';
			break;
		case 'published':
			documentStatusName = 'Published';
			break;
		case 'do_not_publish':
			documentStatusName = 'Do not publish';
			break;
		case 'unpublished':
			documentStatusName = 'Unpublished';
			break;
		default:
			documentStatusName = '';
			break;
	}

	return documentStatusName;
};
