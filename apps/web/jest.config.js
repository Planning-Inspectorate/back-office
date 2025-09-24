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
	setupFilesAfterEnv: ['<rootDir>/setup-tests.js'],
	maxWorkers: '50%', // Limit parallel execution to 50% of available cores
	workerIdleMemoryLimit: '2048MB', // Restart worker if memory exceeds 2GB
	maxConcurrency: 5, // Limit number of tests running in parallel
	slowTestThreshold: 10000, // Mark tests as slow if they take more than 10s
	testTimeout: 30000,
	forceExit: true, // Force exit after all tests complete
	detectOpenHandles: true, // Help identify hanging processes
	coverageThreshold: {
		global: {
			branches: 56,
			functions: 76,
			lines: 72,
			statements: 72
		}
	},
	transform: {},
	moduleNameMapper: {
		'^uuid$': 'uuid',
		'^@toast-ui/editor$': toastUiRequirePath
	}
};
