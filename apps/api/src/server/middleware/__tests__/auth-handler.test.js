import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';
import config from '../../config/config.js';
import BackOfficeAppError from '../../utils/app-error.js';
import { authorizeClientMiddleware, jwtOptions } from '../auth-handler.js';

describe('Authorize Client Middleware', () => {
	let /** @type {any} */ res;
	let /** @type {any} */ next;
	let /** @type {string} */ authorization = 'Bearer accessToken';

	const status = jest.fn().mockReturnThis();
	const send = jest.fn();

	beforeEach(() => {
		// @ts-ignore
		jest.replaceProperty(config, 'clientCredentialsGrantEnabled', true);

		res = {
			status,
			send
		};
		next = jest.fn();
	});

	afterEach(() => {
		jest.resetAllMocks();
		jest.clearAllMocks();
	});

	it('should throw an error and return 401 when no access token is present in request header', async () => {
		authorization = 'Bearer';

		const /** @type {any} */ req = {
				headers: {
					authorization
				}
			};

		const errorMessage = 'You have no access! Please try again later.';

		await authorizeClientMiddleware(req, res, next);

		expect(next).toBeCalledTimes(1);
		expect(next).toBeCalledWith(new BackOfficeAppError(errorMessage, 401));
	});

	it('should throw an error and return 401 when access token verification fails', async () => {
		const /** @type {any} */ req = {
				headers: {
					authorization: 'Bearer accessToken'
				}
			};

		// @ts-ignore
		jwt.decode.mockResolvedValue({
			header: {}
		});

		await authorizeClientMiddleware(req, res, next);

		expect(next).toBeCalledTimes(1);
		expect(next).toBeCalledWith(new BackOfficeAppError('invalid access token', 401));
	});

	it('should return successful verification and call next when clientCredentialsGrantEnabled and access token verification succeeds', async () => {
		const /** @type {any} */ req = {
				headers: {
					authorization: 'Bearer accessToken'
				}
			};

		// @ts-ignore
		jwt.decode.mockResolvedValue({
			header: {
				typ: 'JWT',
				alg: 'RS256',
				x5t: '-KI3Q9nNR7bRofxmeZoXqbHZGew',
				kid: '-KI3Q9nNR7bRofxmeZoXqbHZGew'
			},
			payload: {
				aud: 'api://12333',
				iss: 'https://sts.windows.net/b3327b60-a205-45a0-ae22-63da4de3a27a/',
				aio: 'E2ZgYOhkMI5UnnrGKjQ9bgubrmgaAA==',
				appid: '509806cf-a03d-42cc-b85d-a221e1d62617',
				appidacr: '1',
				roles: ['read'],
				sub: '85bd6743-ac2e-424b-bd59-7658a5b102c7'
			},
			signature:
				'fhu8uis6653CCNR3nbuhOH3e3G3VvszfalkqQ2iSYrT3J50FhOnMacEdEHfOXhds_i7OKx_I7uHpQMUe9sYs_XpOc7tY73lIDeR2Tvg1r5db4Osxi2gUUPFv0D0x7bdi3wlWGO7yyw0xlvF0d5w6UVAloSBMv2Nl9psmTYsFmpdeEGoN6acOyub8DDk4kWfKlioJAiCeRoAIXa5sfrt61LIqpaGxXhvYfgAfZgVMe3PN2DY9bmp8h-mZUQnLTWrRxqYuz9vesMVbyaXvga7oWA_fiqC9ctvZ0Lnt5Xbomu1Zw9-hkTTc1UvbzQl8aey_PciQ1N2SLqQ8u6Zthxde2A'
		});

		// @ts-ignore
		jwt.verify.mockResolvedValue({
			aud: 'api://7815c73e-1f32-4f4b-8a9e-dc6f8126681e',
			iss: 'https://sts.windows.net/b3327b60-a205-45a0-ae22-63da4de3a27a/',
			aio: 'E2ZgYOhkMI5UnnrGKjQ9bgubrmgaAA==',
			appid: '509806cf-a03d-42cc-b85d-a221e1d62617',
			appidacr: '1',
			idp: 'https://sts.windows.net/b3327b60-a205-45a0-ae22-63da4de3a27a/',
			oid: '85bd6743-ac2e-424b-bd59-7658a5b102c7',
			rh: '0.AUsAYHsyswWioEWuImPaTeOiej7HFXgyH0tPip7cb4EmaB5LAAA.',
			roles: ['read'],
			sub: '85bd6743-ac2e-424b-bd59-7658a5b102c7',
			tid: 'b3327b60-a205-45a0-ae22-63da4de3a27a',
			uti: 'S9ytKWq4L0iJf6zc1Gl_Ag',
			ver: '1.0'
		});

		await authorizeClientMiddleware(req, res, next);

		expect(next).toBeCalledTimes(1);
		expect(next).toHaveBeenCalledWith();
		expect(jwt.decode).toHaveBeenCalledWith('accessToken', { complete: true });
		expect(jwt.verify).toHaveBeenCalledWith('accessToken', 'string', jwtOptions);
	});

	it('should call next when clientCredentialsGrantEnabled is false', async () => {
		// @ts-ignore
		jest.replaceProperty(config, 'clientCredentialsGrantEnabled', false);

		// @ts-ignore
		await authorizeClientMiddleware({}, res, next);

		expect(next).toBeCalledTimes(1);
		expect(next).toHaveBeenCalledWith();
		expect(jwt.decode).not.toBeCalled();
		expect(jwt.verify).not.toBeCalled();
	});
});
