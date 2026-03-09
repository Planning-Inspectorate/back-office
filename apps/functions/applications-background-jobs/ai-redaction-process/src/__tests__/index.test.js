//@ts-nocheck
import { jest } from '@jest/globals';
import { index } from '../../index.js';
import { requestWithApiKey } from '../../../common/backend-api-request.js';

jest.spyOn(requestWithApiKey, 'post').mockResolvedValue({
	json: jest.fn()
});

const mockContext = { log: jest.fn() };
mockContext.log.error = jest.fn();

describe('ai-redaction-process index', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('routes ANALYSE stage to handler without throwing', async () => {
		const message = {
			stage: 'ANALYSE',
			status: 'FAILED',
			parameters: {
				metadata: {
					caseId: 1,
					documentGuid: '123'
				}
			}
		};

		await expect(index(mockContext, message)).resolves.not.toThrow();
	});

	it('ignores unknown stages', async () => {
		const message = { stage: 'OTHER_STAGE' };

		await index(mockContext, message);

		expect(mockContext.log).toHaveBeenCalledWith('Ignoring stage OTHER_STAGE');
	});

	it('logs error when handler throws', async () => {
		const badMessage = {
			stage: 'ANALYSE',
			parameters: {}
		};

		await expect(index(mockContext, badMessage)).rejects.toThrow();

		expect(mockContext.log.error).toHaveBeenCalledWith('Redaction subscriber failed');
	});
});
