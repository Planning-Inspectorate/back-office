import sanitizeHtml from 'sanitize-html';

const sanitizeOptions = {
	allowedTags: [
		'html',
		'head',
		'meta',
		'title',
		'link',
		'body',
		'div',
		'header',
		'h1',
		'span',
		'a',
		'aside',
		'em',
		'br',
		'img',
		'p',
		'iframe',
		'footer',
		'strong',
		'style',
		'i'
	],
	allowVulnerableTags: true,
	allowedAttributes: {
		html: ['lang'],
		meta: ['charset', 'name', 'content'],
		link: ['rel', 'type', 'media', 'href'],
		a: ['href', 'title', 'rel', 'target', 'class'],
		iframe: ['width', 'height', 'src', 'frameborder', 'allow', 'allowfullscreen'],
		img: ['class', 'alt', 'src'],
		div: ['style', 'id', 'class', 'role'],
		body: ['class'],
		footer: ['id', 'role'],
		aside: ['id', 'class', 'role'],
		header: ['id', 'class', 'role'],
		h1: ['id'],
		span: ['style']
	},
	allowedSchemes: ['https'], // only https allowed because of the iframe source
	allowedSchemesByTag: { iframe: ['https'] },
	allowedIframeHostnames: ['www.youtube.com'],
	nonBooleanAttributes: []
};

/**
 * @param {string} html
 * @throws {Error}
 * */
export const validateHTML = async (html) => {
	const trimmed = html.trim();
	const sanitized = sanitizeHtml(trimmed, sanitizeOptions).trim();

	if (sanitized !== trimmed) {
		throw new Error('HTML failed validation');
	}
};
