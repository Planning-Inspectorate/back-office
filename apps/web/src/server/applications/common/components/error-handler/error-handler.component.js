/** @typedef {import('../../../applications.types.js').FormCaseLayout} FormCaseLayout */

/**
 * View the sector choice step of the Casecreation
 *
 * @param {Record<string, any>} properties
 * @param {FormCaseLayout} layout
 * @param {*} response
 * @returns {*}
 */
export const handleErrors = (properties, layout, response) => {
	return response.render('applications/components/case-form/case-form-layout', {
		...properties,
		layout
	});
};
