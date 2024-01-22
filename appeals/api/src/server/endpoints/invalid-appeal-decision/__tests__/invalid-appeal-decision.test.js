import { request } from '../../../app-test.js';
import { jest } from '@jest/globals';
import { azureAdUserId } from '#tests/shared/mocks.js';
import { householdAppeal } from '#tests/appeals/mocks.js';
import { documentCreated } from '#tests/documents/mocks.js';
import { STATE_TARGET_ISSUE_DETERMINATION } from '#endpoints/constants.js';

const { databaseConnector } = await import('#utils/database-connector.js');

describe('invalid appeal decision routes', () => {
	beforeEach(() => {
		// @ts-ignore
		databaseConnector.appealRelationship.findMany.mockResolvedValue([]);
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	describe('POST', () => {
		test('returns 400 when state is not correct - blank invalidDecisionReason', async () => {
			// @ts-ignore
			databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
			// @ts-ignore
			databaseConnector.document.findUnique.mockResolvedValue(documentCreated);

			const response = await request
				.post(`/appeals/${householdAppeal.id}/inspector-decision-invalid`)
				.send({
					invalidDecisionReason: ''
				})
				.set('azureAdUserId', azureAdUserId);

			expect(response.status).toEqual(400);
			expect(response.body).toEqual({
				errors: {
					invalidDecisionReason: 'invalidDecisionReason required'
				}
			});
		});
		test('returns 400 when state is not correct - 1001 charecters invalidDecisionReason', async () => {
			// @ts-ignore
			databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
			// @ts-ignore
			databaseConnector.document.findUnique.mockResolvedValue(documentCreated);

			const response = await request
				.post(`/appeals/${householdAppeal.id}/inspector-decision-invalid`)
				.send({
					invalidDecisionReason:
						'Li Europan lingues es membres del sam familie. Lor separat existentie es un myth. Por scientie, musica, sport etc, litot Europa usa li sam vocabular. Li lingues differe solmen in li grammatica, li pronunciation e li plu commun vocabules. Omnicos directe al desirabilite de un nov lingua franca: On refusa continuar payar custosi traductores. At solmen va esser necessi far uniform grammatica, pronunciation e plu sommun paroles. Ma quande lingues coalesce, li grammatica del resultant lingue es plu simplic e regulari quam ti del coalescent lingues. Li nov lingua franca va esser plu simplic e regulari quam li existent Europan lingues. It va esser tam simplic quam Occidental in fact, it va esser Occidental. A un Angleso it va semblar un simplificat Angles, quam un skeptic Cambridge amico dit me que Occidental es. Li Europan lingues es membres del sam familie. Lor separat existentie es un myth. Por scientie, musica, sport etc, litot Europa usa li sam vocabular. Li lingues differe solmen in li g'
				})
				.set('azureAdUserId', azureAdUserId);

			expect(response.status).toEqual(400);
			expect(response.body).toEqual({
				errors: {
					invalidDecisionReason: 'must be 1000 characters or less'
				}
			});
		});
		test('returns 400 when state is not correct - invalidDecisionReason not a string', async () => {
			// @ts-ignore
			databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
			// @ts-ignore
			databaseConnector.document.findUnique.mockResolvedValue(documentCreated);

			const response = await request
				.post(`/appeals/${householdAppeal.id}/inspector-decision-invalid`)
				.send({
					invalidDecisionReason: 1000
				})
				.set('azureAdUserId', azureAdUserId);

			expect(response.status).toEqual(400);
			expect(response.body).toEqual({
				errors: {
					invalidDecisionReason: 'must be a string'
				}
			});
		});
		test('returns 200 when all good', async () => {
			const correctAppealState = {
				...householdAppeal,
				appealStatus: [
					{
						status: STATE_TARGET_ISSUE_DETERMINATION,
						valid: true
					}
				]
			};
			// @ts-ignore
			databaseConnector.appeal.findUnique.mockResolvedValue(correctAppealState);
			// @ts-ignore
			databaseConnector.document.findUnique.mockResolvedValue(documentCreated);
			// @ts-ignore
			databaseConnector.inspectorDecision.create.mockResolvedValue({});

			const response = await request
				.post(`/appeals/${householdAppeal.id}/inspector-decision-invalid`)
				.send({
					invalidDecisionReason: 'Invalid reason'
				})
				.set('azureAdUserId', azureAdUserId);

			expect(response.status).toEqual(200);
		});
	});
});
