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

	it('decodes encoded text correctly', () => {
		expect(
			bodyToUpdateRequest({
				backOfficeProjectUpdateContent:
					'%3Cp%3EHere%20is%20a%20%3Ca%20href=%22https://test.com/cheese%20and%20ham%201.pdf%22%3Elink%3C/a%3E%20to%20decode%3C/p%3E',
				backOfficeProjectUpdateContentWelsh:
					'%3Cp%3EHere%20is%20a%20Welsh%20%3Ca%20href=%22http://test.com/cheese%20and%20ham%20in%20Welsh%201.pdf%22%3Elink%3C/a%3E%20to%20decode%3C/p%3E',
				emailSubscribers: 'false'
			})
		).toEqual({
			htmlContent:
				'<p>Here is a <a href="https://test.com/cheese and ham 1.pdf">link</a> to decode</p>',
			htmlContentWelsh:
				'<p>Here is a Welsh <a href="http://test.com/cheese and ham in Welsh 1.pdf">link</a> to decode</p>',
			emailSubscribers: false
		});
	});

	it('cleans up ampersands corrupted by the rich text editor', () => {
		expect(
			bodyToUpdateRequest({
				backOfficeProjectUpdateContent:
					'<a href="https://test.com/cheese &amp;amp; ham 1.pdf">link</a>',
				backOfficeProjectUpdateContentWelsh:
					'<a href="http://test.com/cheese &amp;amp; ham in Welsh 1.pdf">link</a>',
				emailSubscribers: 'false'
			})
		).toEqual({
			htmlContent: '<a href="https://test.com/cheese &amp; ham 1.pdf">link</a>',
			htmlContentWelsh: '<a href="http://test.com/cheese &amp; ham in Welsh 1.pdf">link</a>',
			emailSubscribers: false
		});
	});
});
