import { buildNsipS51AdvicePayload } from '#infrastructure/payload-builders/nsip-s51-advice.js';
import { validateMessageToSchema } from '#utils/schema-test-utils.js';

/** @type {*} */
const s51Input = {
	id: 1,
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
	publishedStatus: 'published',
	firstName: 'John',
	lastName: 'Keats',
	S51AdviceDocument: [{ documentGuid: 'test-guid-1' }]
};

describe('Test S51 Advice Payload', () => {
	test('Dates should be converted to ISO strings', async () => {
		const payload = await buildNsipS51AdvicePayload(s51Input);

		expect(payload.enquiryDate).toBe('2023-02-27T10:00:00.000Z');
		expect(payload.adviceDate).toBe('2023-02-27T10:00:00.000Z');
	});

	test('s51-advice payload validates to schema', async () => {
		const payload = await buildNsipS51AdvicePayload(s51Input);

		const isAllValid = await validateMessageToSchema('s51-advice.schema.json', payload);
		if (isAllValid) {
			console.info(`Dummy publishing events ${JSON.stringify(payload)}`);
		} else {
			console.info(
				`Message fails schema validation on  - no dummy events broadcast for ${JSON.stringify(
					payload
				)}`
			);
		}

		expect(isAllValid).toEqual(true);
	});
});
