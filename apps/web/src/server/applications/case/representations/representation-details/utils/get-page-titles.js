import { mapTitles } from '../../representation/utils/map-titles.js';

/**
 * @param {string} status
 * @return {object}
 */
export const getPageTitles = (status) =>
	status === 'DRAFT'
		? mapTitles('Check your answers', 'Check your answers')
		: mapTitles('Representation details', 'Representation details');
