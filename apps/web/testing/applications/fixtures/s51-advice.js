import { createS51Advice } from '../factory/s52-advice.js';

/**
 * @typedef {import('../../../src/server/applications/applications.types.js').S51Advice} S51Advice
 * @typedef {import('../../../src/server/applications/applications.types.js').PaginatedResponse<S51Advice>} PaginatedS51Advices
 * /

/** @type {S51Advice[]} */
export const fixtureS51Advices = [...Array.from({ length: 200 }).keys()].map((id) =>
	createS51Advice({ id })
);

/**
 *
 * @param {number} page
 * @param {number} pageDefaultSize
 * @returns {PaginatedS51Advices}
 */
export const fixturePaginatedS51Advice = (page, pageDefaultSize) => ({
	page,
	pageSize: pageDefaultSize,
	pageDefaultSize,
	pageCount: Math.ceil(200 / pageDefaultSize),
	itemCount: 200,
	items: fixtureS51Advices.slice(
		(page - 1) * pageDefaultSize,
		pageDefaultSize + (page - 1) * pageDefaultSize
	)
});
