import nunjucks from 'nunjucks';
import { isObjectLiteral } from '#lib/object-utilities.js';
import logger from '#lib/logger.js';

/**
 * Recursively renders any PageComponents and PageComponentGroups found in HtmlPropertys of the supplied pageComponents
 * The rendered HTML string is assigned to the matching 'html' property
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

		for (const parametersKey of parametersKeys) {
			const parametersProperty = pageComponent.parameters[parametersKey];

			if (Array.isArray(parametersProperty)) {
				for (const item of parametersProperty) {
					const itemKeys = Object.keys(item);

					for (const itemKey of itemKeys) {
						const itemProperty = item[itemKey];

						if (!isObjectLiteral(itemProperty)) {
							continue;
						}

						if (itemKey === 'html' && 'pageComponents' in item) {
							preRenderPageComponents(item.pageComponents, recursions + 1, maximumRecursions);
							item.html = renderPageComponentsToHtml(item.pageComponents);
						} else if ('html' in itemProperty && 'pageComponents' in itemProperty) {
							preRenderPageComponents(
								itemProperty.pageComponents,
								recursions + 1,
								maximumRecursions
							);
							itemProperty.html = renderPageComponentsToHtml(itemProperty.pageComponents);
						} else if ('html' in itemProperty && 'pageComponentGroups' in itemProperty) {
							preRenderPageComponentGroups(itemProperty, recursions, maximumRecursions);
						}
					}
				}
			} else if (parametersKey === 'html' && 'pageComponents' in pageComponent.parameters) {
				preRenderPageComponents(
					pageComponent.parameters.pageComponents,
					recursions + 1,
					maximumRecursions
				);
				pageComponent.parameters.html = renderPageComponentsToHtml(
					pageComponent.parameters.pageComponents
				);
			} else if (parametersKey === 'html' && 'pageComponentGroups' in pageComponent.parameters) {
				preRenderPageComponentGroups(pageComponent.parameters, recursions, maximumRecursions);
			}
		}
	}
};

/**
 * @param {HtmlProperty} itemProperty
 * @param {number} recursions
 * @param {number} maximumRecursions
 */
function preRenderPageComponentGroups(itemProperty, recursions, maximumRecursions) {
	for (const pageComponentGroup of itemProperty.pageComponentGroups) {
		if ('pageComponents' in pageComponentGroup) {
			preRenderPageComponentGroup(pageComponentGroup, itemProperty, recursions, maximumRecursions);
		} else if ('pageComponentGroups' in pageComponentGroup) {
			itemProperty.html += `${
				pageComponentGroup.wrapperHtml ? pageComponentGroup.wrapperHtml.opening : ''
			}`;

			for (const nestedComponentGroup of pageComponentGroup.pageComponentGroups) {
				preRenderPageComponentGroup(
					nestedComponentGroup,
					itemProperty,
					recursions,
					maximumRecursions
				);
			}

			itemProperty.html += `${
				pageComponentGroup.wrapperHtml ? pageComponentGroup.wrapperHtml.closing : ''
			}`;
		}
	}
}

/**
 * @param {PageComponentGroup} pageComponentGroup
 * @param {HtmlProperty} itemProperty
 * @param {number} recursions
 * @param {number} maximumRecursions
 */
function preRenderPageComponentGroup(
	pageComponentGroup,
	itemProperty,
	recursions,
	maximumRecursions
) {
	preRenderPageComponents(pageComponentGroup.pageComponents, recursions + 1, maximumRecursions);
	itemProperty.html += `${
		pageComponentGroup.wrapperHtml ? pageComponentGroup.wrapperHtml.opening : ''
	}`;
	itemProperty.html += renderPageComponentsToHtml(pageComponentGroup.pageComponents);
	itemProperty.html += `${
		pageComponentGroup.wrapperHtml ? pageComponentGroup.wrapperHtml.closing : ''
	}`;
}

/**
 * Renders each PageComponent in the supplied PageComponents to an HTML string and returns the concatenated result
 * @param {PageComponent[]} pageComponents
 * @returns {string}
 */
export function renderPageComponentsToHtml(pageComponents) {
	return pageComponents
		.map((pageComponent) =>
			nunjucks.render('appeals/components/page-component.njk', { component: pageComponent }).trim()
		)
		.join('');
}

/**
 * @param {any} value
 * @returns {value is PageComponent}
 */
export function isPageComponent(value) {
	return typeof value?.type === 'string' && typeof value?.parameters === 'object';
}
