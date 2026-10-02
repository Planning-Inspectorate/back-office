import { defineConfig, globalIgnores } from 'eslint/config';
import { eslintConfig } from '@planning-inspectorate/coding-standards';
import jestPlugin from 'eslint-plugin-jest';
import globals from 'globals';

export default defineConfig([
	...eslintConfig,
	globalIgnores([
		'apps/e2e/**/*.js',
		'apps/api-testing/**/*.js',
		'apps/api-testing/**/*.test.js',
		'apps/web/src/server/static/scripts/*',
		'apps/web/src/server/static/styles/*',
		'apps/functions/migration/database/db-client/*',
		'apps/api/src/database/client/*'
	]),
	{
		files: ['**/*.test.js'],
		plugins: { jest: jestPlugin },
		languageOptions: {
			globals: jestPlugin.environments.globals.globals
		}
	},
	{
		files: ['apps/web/src/client/**', 'apps/web/testing/app/mocks/client-side.js'],
		languageOptions: {
			globals: globals.browser
		}
	},
	{
		files: ['**/*.d.ts'],
		rules: {
			// allow imports for types in d.ts files
			'@typescript-eslint/consistent-type-imports': 'off',
			// allow 'renaming' types with an empty extends
			'@typescript-eslint/no-empty-object-type': 'off'
		}
	},
	{
		files: [
			// allow these special folder names
			'**/__{fixtures,tests}__/**/*.{ts,js}'
		],
		rules: {
			'check-file/folder-naming-convention': 'off'
		}
	},
	{
		files: [
			// allow files starting _
			'**/_*.js',
			// allow existing camelCase or non-compliant files names
			'apps/api/src/server/migration/migrators/cleanup/htmlTemplates.js',
			'apps/web/src/server/applications/common/isCaseWelsh.js',
			'apps/web/src/server/applications/common/services/address-lookup/services/findAddressListByPostcode.js',
			'apps/web/src/server/applications/common/services/address-lookup/utils/capitalizeString.js',
			'apps/web/src/server/applications/common/services/address-lookup/utils/formatAddress.js',
			'apps/web/src/server/applications/case/general-s51/utils/get-general-section-51-URL.js',
			'apps/web/src/server/lib/msGraphRequest.js',
			'apps/web/testing/app/mocks/featureFlags.js'
		],
		rules: {
			'check-file/filename-naming-convention': 'off'
		}
	}
]);
