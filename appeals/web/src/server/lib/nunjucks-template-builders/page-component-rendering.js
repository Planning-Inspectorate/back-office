import nunjucks from 'nunjucks';
import { isObjectLiteral } from '#lib/object-utilities.js';
import logger from '#lib/logger.js';

/**
 * Recursively renders any PageComponents found in HtmlPropertys of the supplied pageComponents.
 * The rendered HTML string is assigned to the matching 'html' property.
 * This allows for any GDS component to be used as content in another GDS component (provided the parent accepts an html property)
 * To be correctly pre-rendered, a PageComponent must have the following:
 *  - an `html` property, whose value should be an empty string (will still work with a non-empty string, but any existing value will be overwritten)
 *  - a `pageComponents` property, whose value is an array of zero or more PageComponent objects (see `lib/mappers/mapper-types-jsdoc.js` for type definitions)
 * A PageComponent may also have a `wrapperHtml` property which defines any HTML to be rendered before and/or after the component's HTML, but this is optional.
 * @param {PageComponent[]} pageComponents list of PageComponents to render
 * @param {number} [recursions] current recursion depth
 * @param {number} [maximumRecursions] maximum recursion depth
 * @returns {undefined} because "PageComponent" objects are mutated, no need to return a value
 */
export const preRenderPageComponents = (pageComponents, recursions = 0, maximumRecursions = 5) => {
	if (recursions > maximumRecursions) {
		logger.warn(
			'preRenderPageComponents exceeded the maximum number of recursions; some nested components will not be pre-rendered'
		);
		return;
	}

	for (const pageComponent of pageComponents) {
		const parametersKeys = Object.keys(pageComponent.parameters);

		for (const parameterKey of parametersKeys) {
			const parameter = pageComponent.parameters[parameterKey];

			if (Array.isArray(parameter)) {
				for (const item of parameter) {
					const itemKeys = Object.keys(item);

					for (const itemKey of itemKeys) {
						const itemProperty = item[itemKey];

						if (!isObjectLiteral(itemProperty)) {
							continue;
						}

						if (itemKey === 'html' && 'pageComponents' in item) {
							preRenderHtmlProperty(item, recursions, maximumRecursions);
						} else if ('html' in itemProperty && 'pageComponents' in itemProperty) {
							preRenderHtmlProperty(itemProperty, recursions, maximumRecursions);
						}
					}
				}
			} else if (parameterKey === 'html' && 'pageComponents' in pageComponent.parameters) {
				preRenderHtmlProperty(pageComponent.parameters, recursions, maximumRecursions);
			}
		}
	}
};

/**
 * @param {HtmlProperty} htmlProperty
 * @param {number} recursions current recursion depth
 * @param {number} maximumRecursions maximum recursion depth
 * @returns {void}
 */
function preRenderHtmlProperty(htmlProperty, recursions, maximumRecursions) {
	preRenderPageComponents(htmlProperty.pageComponents, recursions + 1, maximumRecursions);
	htmlProperty.html = renderPageComponentsToHtml(
		htmlProperty.pageComponents,
		htmlProperty.wrapperHtml
	);
}

/**
 * Renders each PageComponent in the supplied PageComponents to an HTML string and returns the concatenated result
 * @param {PageComponent[]} pageComponents
 * @param {PageComponentWrapperHtml} [wrapperHtml]
 * @returns {string}
 */
function renderPageComponentsToHtml(pageComponents, wrapperHtml) {
	let renderedHtml = pageComponents
		.map((pageComponent) =>
			nunjucks.render('appeals/components/page-component.njk', { component: pageComponent }).trim()
		)
		.join('');

	if (wrapperHtml?.opening) {
		renderedHtml = `${wrapperHtml.opening}${renderedHtml}`;
	}
	if (wrapperHtml?.closing) {
		renderedHtml = `${renderedHtml}${wrapperHtml.closing}`;
	}

	return renderedHtml;
}
