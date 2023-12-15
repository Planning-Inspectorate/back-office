import { buildNsipS51AdvicePayload } from '../s51-advice.js';

/** @type {*} */
const s51Input = {
	caseId: 1,
	title: 'A title',
	enquirer: 'enquirer',
	referenceNumber: 1,
	enquiryMethod: 'email',
	enquiryDate: new Date('2023-02-27T10:00'),
	enquiryDetails: 'enquiryDetails',
	adviser: 'adviser',
	adviceDate: new Date('2023-02-27T10:00'),
	adviceDetails: 'adviceDetails',
	S51AdviceDocument: [{ documentGuid: 'test-guid-1' }]
};

describe('Test S51 Advice Payload', () => {
	test('Dates should be converted to ISO strings', async () => {
		const payload = await buildNsipS51AdvicePayload(s51Input);

		expect(payload.enquiryDate).toBe('2023-02-27T10:00:00.000Z');
		expect(payload.adviceDate).toBe('2023-02-27T10:00:00.000Z');
	});
});
