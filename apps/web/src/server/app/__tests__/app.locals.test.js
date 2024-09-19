// @ts-nocheck

import { jest } from '@jest/globals';

import { setWebEnvironmentLocals } from '../app.locals.js';

describe('apps/web/src/server/app/app.locals', () => {
	describe('#setWebEnvironmentLocals', () => {
		let req = { hostname: '' };
		let res = { locals: { webEnvironment: '' } };
		const next = jest.fn();

		beforeEach(() => {
			req.hostname = '';
			res.locals.webEnvironment = '';
		});

		describe('When the web environment is training', () => {
			beforeEach(() => {
				req.hostname = 'back-office-training.planninginspectorate.gov.uk';
				setWebEnvironmentLocals(req, res, next);
			});

			it('should set the web environment local to training and call next', () => {
				expect(res.locals).toEqual('training');
				expect(next).toHaveBeenCalled();
			});
		});
	});
});
