//@ts-nocheck
import { jest } from '@jest/globals';

jest.unstable_mockModule('./src/common/feature-flags.js', () => ({
	featureFlagClient: {
		isFeatureActiveForCase: jest.fn()
	}
}));

const { isRedactionActiveMiddleware } = await import('./is-redaction-active.middleware.js');
const { featureFlagClient } = await import('../../../../../common/feature-flags.js');

describe('isRedactionActiveMiddleware', () => {
	let req, res, next;

	beforeEach(() => {
		req = {};

		res = {
			locals: {
				case: {
					reference: 'BC0110003'
				}
			},
			status: jest.fn().mockReturnThis(),
			render: jest.fn()
		};

		next = jest.fn();

		jest.clearAllMocks();
	});

	it('should call next when feature is enabled for case', () => {
		featureFlagClient.isFeatureActiveForCase.mockReturnValue(true);

		isRedactionActiveMiddleware(req, res, next);

		expect(featureFlagClient.isFeatureActiveForCase).toHaveBeenCalledWith(
			'idas-340-redaction-service',
			'BC0110003'
		);
		expect(next).toHaveBeenCalled();
	});

	it('should return 404 when feature is disabled for case', () => {
		featureFlagClient.isFeatureActiveForCase.mockReturnValue(false);

		isRedactionActiveMiddleware(req, res, next);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.render).toHaveBeenCalledWith('app/404.njk');
		expect(next).not.toHaveBeenCalled();
	});

	it('should return 404 if case reference is missing', () => {
		res.locals.case = undefined;

		featureFlagClient.isFeatureActiveForCase.mockReturnValue(false);

		isRedactionActiveMiddleware(req, res, next);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(next).not.toHaveBeenCalled();
	});
});
