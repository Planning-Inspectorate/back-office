/**
 * Returns a set of routes registered on this router, checking all nested routes/routers.
 * Each item is of the form `METHOD: /path`, and is color-coded for printing to console
 *
 * @example
 * ```
 * const routes = allRegisteredRoutes(myRouter);
 *
 * console.log(`routes\n${[...routes].join('\r\n')}`);
 * // GET  /users
 * // POST /users
 * // GET  /users/:id
 * ```
 *
 * Tidied up version of https://stackoverflow.com/a/46397967
 *
 * @param {import('express').Router} router
 * @returns {Set<string>}
 */
export function allRegisteredRoutes(router) {
	const routes = new Set();
	for (const layer of router.stack) {
		for (const r of getRoutes([], layer)) {
			routes.add(r);
		}
	}
	return routes;
}

/**
 * @param {string[]} path
 * @param {any} layer
 * @returns {string[]}
 */
function getRoutes(path, layer) {
	const routes = [];
	if (layer.route) {
		for (const layer2 of layer.route.stack) {
			routes.push(...getRoutes(path.concat(formatPart(layer.route.path)), layer2));
		}
	} else if (layer.name === 'router' && layer.handle.stack) {
		for (const layer2 of layer.handle.stack) {
			routes.push(...getRoutes(path.concat(formatPart(layer.regexp)), layer2));
		}
	} else if (layer.method) {
		// METHOD /path
		const route = `\x1b[90m${layer.method.toUpperCase().padEnd(6, ' ')}\x1b[0m /${path
			.concat(formatPart(layer.regexp))
			.filter(Boolean)
			.join('/')}`;
		routes.push(route);
	}
	return routes;
}

/**
 * @param {any} part
 * @returns {string|string[]}
 */
function formatPart(part) {
	if (typeof part === 'string') {
		return part.split('/').map(paramColor);
	} else if (part.fast_slash) {
		return '';
	} else {
		const match = part
			.toString()
			.replace('\\/?', '')
			.replace('(?=\\/|$)', '$')
			// eslint-disable-next-line no-useless-escape
			.match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//);
		if (match) {
			const parts = match[1].replace(/\\(.)/g, '$1').split('/');
			return parts.map(paramColor);
		}
		return '\x1b[31m' + part.toString() + '\x1b[0m';
	}
}

/**
 * @param {string} part
 * @returns {string}
 */
function paramColor(part) {
	if (part.startsWith(':')) {
		return `\x1b[34m${part}\x1b[0m`;
	}
	return part;
}
