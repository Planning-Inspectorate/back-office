import { webEnvConfig } from '../get-web-env-config.js';

describe('apps/web/src/server/lib/nunjucks-globals/get-web-env-config', () => {
	describe('#webEnvConfig', () => {
		it('should return the nunjucks global web environment config', () => {
			expect(webEnvConfig).toEqual({ env: 'test', isTest: true });
		});
	});
});
