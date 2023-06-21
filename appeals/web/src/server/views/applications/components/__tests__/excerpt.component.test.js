import nunjucksEnv from '../../../../app/config/nunjucks.js';

describe('excerpt.component', () => {
	/**
	 *
	 * @param {Object} opts
	 * @param {string} opts.content
	 * @param {number} [opts.maxLength]
	 * @param {string} [opts.linkText]
	 * @param {boolean} [opts.strictTruncate]
	 * @returns {string}
	 */
	const renderExcerpt = ({ content, maxLength, linkText, strictTruncate }) => {
		return nunjucksEnv.renderString(
			`
        {% from "applications/components/excerpt.component.njk" import excerpt %}
        {{ excerpt(content, maxLength, linkText, strictTruncate) }}
        `,
			{
				content,
				maxLength,
				linkText,
				strictTruncate
			}
		);
	};

	it('should render excerpt, truncated', async () => {
		const html = renderExcerpt({
			content: 'Quite short, first 7 only',
			maxLength: 7,
			linkText: 'content',
			strictTruncate: true
		});
		expect(html).toMatchSnapshot();
	});

	it('should not truncate words when not strict', async () => {
		const html = renderExcerpt({
			content: 'Quite short content, all will show',
			maxLength: 7,
			linkText: 'content',
			strictTruncate: false
		});
		expect(html).toMatchSnapshot();
	});

	it('should show all content when short', async () => {
		const html = renderExcerpt({
			content: 'Quite short content, all will show',
			maxLength: 200,
			linkText: 'content',
			strictTruncate: true
		});
		expect(html).toMatchSnapshot();
	});
});
