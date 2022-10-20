import slugify from 'slugify';

/** @typedef {import('../../applications/applications.types').DomainType} DomainType */

// TODO: this function is a mess: full of repetitions, very long lines and not scalable at all.
//  The javascript linter makes the switch not really usable. Must find other solution

/**
 * @typedef {object} urlFilterArguments
 * @property {DomainType=} domainType
 * @property {number=} applicationId
 * @property {string=} step
 * @property {string=} query
 * @property {number=} documentCategoryId
 * @property {string=} documentCategoryName
 */

/**
 * Register the url filter
 *
 * @param {string} key
 * @param {urlFilterArguments} filterArguments
 * @returns {string}
 */
export const url = (key, filterArguments) => {
	const domainUrl = '/applications-service';
	const { domainType, applicationId, step, query, documentCategoryId, documentCategoryName } =
		filterArguments || {};

	switch (key) {
		case 'applications-create':
			return `${domainUrl}/create-new-case/${applicationId ? `${applicationId}/` : ''}${
				step ? `${step}/` : ''
			}`;
		case 'applications-edit':
			return `${domainUrl}/case/${applicationId ? `${applicationId}/` : ''}edit/${
				step ? `${step}/` : ''
			}`;
		case 'dashboard':
			return `${domainUrl}/${domainType || ''}`;
		case 'document-category':
			// TODO: this doesnt handle subfolders
			return `${domainUrl}/case/${applicationId ? `${applicationId}/` : ''}project-documentation/${
				documentCategoryId ? `${documentCategoryId}/` : ''
			}${documentCategoryName ? slugify(documentCategoryName, { lower: true }) : ''}`;
		case 'search-results':
			return `${domainUrl}/search-results/${step}?q=${query}`;
		case 'view-application':
			return `${domainUrl}/case/${applicationId ? `${applicationId}/` : ''}${
				step ? `${step}/` : ''
			}`;
		default:
			return 'app/404';
	}
};
