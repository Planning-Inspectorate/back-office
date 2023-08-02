import { projectUpdatesRows } from '../project-updates.view-model.js';

describe('project-updates.view-model', () => {
	describe('projectUpdatesRows', () => {
		/**
		 * @returns {import('@pins/applications').ProjectUpdate}
		 */
		function testUpdate() {
			return {
				authorId: 1,
				caseId: 2,
				dateCreated: '',
				emailSubscribers: false,
				sentToSubscribers: false,
				htmlContent: '',
				htmlContentWelsh: null,
				title: null,
				id: 3,
				status: 'draft',
				type: 'general'
			};
		}
		/**
		 * @returns {import('../project-updates.view-model.js').projectUpdatesRow}
		 */
		function testUpdateRow() {
			return {
				id: 3,
				datePublished: '',
				content: '',
				emailed: 'No',
				status: {
					color: 'grey',
					label: 'draft'
				}
			};
		}
		/**
		 * @typedef {Object} Test
		 * @property {string} name
		 * @property {import('@pins/applications').ProjectUpdate[]} updates
		 * @property {import('../project-updates.view-model.js').projectUpdatesRow[]} want
		 */
		/**
		 * @type {Test[]}
		 */
		const tests = [
			{
				name: 'empty',
				updates: [],
				want: []
			},
			{
				name: 'status',
				updates: [
					{ ...testUpdate(), status: 'draft' },
					{ ...testUpdate(), status: 'ready-to-publish' },
					{ ...testUpdate(), status: 'published' },
					{ ...testUpdate(), status: 'unpublished' },
					{ ...testUpdate(), status: 'archived' }
				],
				want: [
					{ ...testUpdateRow(), status: { color: 'grey', label: 'draft' } },
					{ ...testUpdateRow(), status: { color: 'purple', label: 'ready to publish' } },
					{ ...testUpdateRow(), status: { color: 'blue', label: 'published' } },
					{ ...testUpdateRow(), status: { color: 'yellow', label: 'unpublished' } },
					{ ...testUpdateRow(), status: { color: 'red', label: 'archived' } }
				]
			},
			{
				name: 'date published',
				updates: [
					{ ...testUpdate(), datePublished: '2023-06-07T23:00Z' }, // BST
					{ ...testUpdate(), datePublished: '2023-12-15T00:00Z' }
				],
				want: [
					{ ...testUpdateRow(), datePublished: '8 Jun 2023' },
					{ ...testUpdateRow(), datePublished: '15 Dec 2023' }
				]
			}
		];

		for (const { name, updates, want } of tests) {
			it('' + name, () => {
				const got = projectUpdatesRows(updates);
				expect(got).toEqual(want);
			});
		}
	});
});
