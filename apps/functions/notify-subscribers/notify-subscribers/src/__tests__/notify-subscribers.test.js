import { jest } from '@jest/globals';
import { NotifySubscribers } from '../notify-subscribers.js';

describe('notify-subscribers', () => {
	function contextLog() {
		const log = jest.fn();
		log.info = jest.fn();
		log.warn = jest.fn();
		log.error = jest.fn();
		return log;
	}

	describe('htmlToMarkdown', () => {
		const tests = [
			{
				name: 'empty',
				content: '',
				want: ''
			},
			{
				name: 'basic content',
				content: '<p>My Important Update</p>',
				want: 'My Important Update'
			},
			{
				name: 'w/ link',
				content:
					'<p>My Important Update <a href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf">some pdf</a></p>',
				want: 'My Important Update [some pdf](https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf)'
			},
			{
				name: 'w/ list',
				content: '<p>My Important Update <ul><li>item 1</li><li>item 2</li></ul></p>',
				want: 'My Important Update\n\n*   item 1\n*   item 2'
			}
		];
		it.each(tests)('$name', ({ content, want }) => {
			const got = NotifySubscribers.htmlToMarkdown(content);
			expect(got).toEqual(want);
		});
	});

	describe('run', () => {
		function newNotify(subs, msg) {
			return new NotifySubscribers({
				apiClient: {
					baseUrl: '',
					async getProjectUpdate() {
						return {
							id: 1,
							caseId: 2,
							authorId: null,
							dateCreated: new Date().toISOString(),
							emailSubscribers: true,
							status: msg?.updateStatus,
							htmlContent: 'My Update',
							title: null,
							sentToSubscribers: false,
							htmlContentWelsh: null,
							type: 'general'
						};
					},
					async getSubscriptions(page, pageSize) {
						return { page, pageSize, pageCount: 1, items: subs, itemCount: subs.length };
					}
				},
				logger: contextLog(),
				msg,
				notifyClient: { sendEmail: jest.fn() },
				perPage: 100,
				templateId: '',
				waitPerPage: 0,
				generateUnsubscribeLink() {
					return 'link';
				}
			});
		}
		const tests = [
			{
				name: 'checks valid message',
				notify: newNotify([], {}),
				expectCalls: 0
			},
			{
				name: 'checks is published',
				notify: newNotify([], { updateStatus: 'draft' }),
				expectCalls: 0
			},
			{
				name: 'emails a subscriber',
				notify: newNotify([{ emailAddress: 'hello@example.com' }], {
					updateStatus: 'published',
					updateContentEnglish: 'My Update',
					caseReference: 'abc-123'
				}),
				expectCalls: 1
			},
			{
				name: 'emails each subscriber',
				notify: newNotify(new Array(20).fill({ emailAddress: 'hello@example.com' }), {
					updateStatus: 'published',
					updateContentEnglish: 'My Update',
					caseReference: 'abc-123'
				}),
				expectCalls: 20
			}
		];

		it.each(tests)('$name', async ({ notify, expectCalls }) => {
			await notify.run();
			expect(notify.notifyClient.sendEmail).toHaveBeenCalledTimes(expectCalls);
		});
	});
});
