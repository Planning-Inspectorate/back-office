/**
 * Register document status name filter
 *
 * @param {string} key
 * @returns {string}
 */
export const statusName = (key) => {
	switch (key) {
		case 'awaiting_upload': // user will never see the awaiting_upload status
		case 'awaiting_virus_check':
			return 'Awaiting virus check';
		case 'failed_virus_check':
			return 'Failed virus check';
		case 'not_checked':
			return 'Not checked';
		case 'checked':
			return 'Checked';
		case 'ready_to_publish':
			return 'Ready to publish';
		case 'publishing':
			return 'Publishing';
		case 'published':
			return 'Published';
		case 'do_not_publish':
			return 'Do not publish';
		case 'unpublishing':
			return 'Unpublishing';
		case 'unpublished':
			return 'Unpublished';
		default:
			return '';
	}
};
