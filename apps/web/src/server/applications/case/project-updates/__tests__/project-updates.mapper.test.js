import { bodyToUpdateRequest } from '../project-updates.mapper.js';

describe('project-updates.mapper', () => {
	it('replaces paragraphs containing a single line break with a line break', () => {
		expect(
			bodyToUpdateRequest({
				backOfficeProjectUpdateContent: '<p><br></p>',
				backOfficeProjectUpdateContentWelsh: '<p><br></p>',
				emailSubscribers: 'true'
			})
		).toEqual({ htmlContent: '<br />', htmlContentWelsh: '<br />', emailSubscribers: true });
	});

	it('removes em tags', () => {
		expect(
			bodyToUpdateRequest({
				backOfficeProjectUpdateContent: '<strong><em>content</em></strong>',
				backOfficeProjectUpdateContentWelsh: '<strong><em>content in Welsh</em></strong>',
				emailSubscribers: 'false'
			})
		).toEqual({
			htmlContent: '<strong>content</strong>',
			htmlContentWelsh: '<strong>content in Welsh</strong>',
			emailSubscribers: false
		});
	});

	it('replaces encoded whitespace', () => {
		expect(
			bodyToUpdateRequest({
				backOfficeProjectUpdateContent: '<a href="http://test.com">&nbsp;content&nbsp;</a>',
				backOfficeProjectUpdateContentWelsh:
					'<a href="http://test.com">&nbsp;content in Welsh&nbsp;</a>',
				emailSubscribers: 'false'
			})
		).toEqual({
			htmlContent: '<a href="http://test.com"> content </a>',
			htmlContentWelsh: '<a href="http://test.com"> content in Welsh </a>',
			emailSubscribers: false
		});
	});
});
