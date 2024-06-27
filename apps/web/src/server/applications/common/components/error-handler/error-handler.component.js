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
	const { template } = layout || {};
	const fullTemplate = template
		? `applications/case/case-form/${template}`
		: `applications/components/case-form/case-form-layout`;
	return response.render(fullTemplate, {
		...properties,
		layout
	});
};
