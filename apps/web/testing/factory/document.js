import { fake } from '@pins/platform';
import { snakeCase } from 'lodash-es';

/** @typedef {import('@pins/api').Schema.AppealDocument} AppealDocument */

/**
 * @param {Partial<AppealDocument>} [options={}]
 * @returns {AppealDocument}
 */
export function createDocument({
	id = fake.createUniqueId(),
	type = 'planning application form',
	filename = `${snakeCase(type)}.pdf`,
	url = '/path/to/file'
} = {}) {
	return { id, type, filename, url };
}
