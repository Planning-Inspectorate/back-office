import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
// this resolves to the commonjs path, instead of esm module path
// this avoids an error on import:
// node_modules\@toast-ui\editor\dist\esm\index.js:8
// import { Fragment, Schema, Slice, NodeRange, Mark as Mark$1, DOMParser, Node as Node$3 } from 'prosemirror-model';
// ^^^^^^
//
// SyntaxError: Cannot use import statement outside a module
const toastUiRequirePath = require.resolve('@toast-ui/editor');

export default {
	setupFiles: ['<rootDir>/setup-tests.js'],
	transform: {},
	moduleNameMapper: {
		'^uuid$': 'uuid',
		'^@toast-ui/editor$': toastUiRequirePath
	},
	testTimeout: 20000
};
