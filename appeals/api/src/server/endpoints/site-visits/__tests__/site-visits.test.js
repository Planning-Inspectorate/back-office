import { request } from '../../../app-test.js';
import {
	ERROR_INVALID_SITE_VISIT_TYPE,
	ERROR_MUST_BE_CORRECT_DATE_FORMAT,
	ERROR_MUST_BE_CORRECT_TIME_FORMAT,
	ERROR_MUST_BE_NUMBER,
	ERROR_NOT_FOUND,
	ERROR_SITE_VISIT_REQUIRED_FIELDS,
	ERROR_START_TIME_MUST_BE_EARLIER_THAN_END_TIME,
	SITE_VISIT_TYPE_UNACCOMPANIED,
	STATE_TARGET_ISSUE_DETERMINATION
} from '../../constants.js';
import { householdAppeal as householdAppealData } from '../../../tests/data.js';

const { databaseConnector } = await import('../../../utils/database-connector.js');

describe('site visit routes', () => {
	/** @type {typeof householdAppealData} */
	let householdAppeal;

	beforeEach(() => {
		householdAppeal = JSON.parse(JSON.stringify(householdAppealData));
	});

	describe('/:appealId/site-visits', () => {
		describe('POST', () => {
			test('creates a site visit without updating the status', async () => {
				const { siteVisit } = householdAppeal;

				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.siteVisitType.findUnique.mockResolvedValue(siteVisit.siteVisitType);

				const response = await request.post(`/appeals/${householdAppeal.id}/site-visits`).send({
					visitType: siteVisit.siteVisitType.name
				});

				expect(databaseConnector.siteVisit.create).toHaveBeenCalledWith({
					data: {
						appealId: householdAppeal.id,
						siteVisitTypeId: siteVisit.siteVisitType.id
					}
				});
				expect(databaseConnector.appealStatus.create).not.toHaveBeenCalled();
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					visitType: siteVisit.siteVisitType.name
				});
			});

			test('creates a site visit with updating the status and time fields with leading zeros', async () => {
				householdAppeal.appealStatus[0].status = 'arrange_site_visit';

				const { siteVisit } = householdAppeal;

				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.siteVisitType.findUnique.mockResolvedValue(siteVisit.siteVisitType);

				const response = await request.post(`/appeals/${householdAppeal.id}/site-visits`).send({
					visitDate: siteVisit.visitDate.split('T')[0],
					visitEndTime: siteVisit.visitEndTime,
					visitStartTime: siteVisit.visitStartTime,
					visitType: siteVisit.siteVisitType.name
				});

				expect(databaseConnector.siteVisit.create).toHaveBeenCalledWith({
					data: {
						appealId: householdAppeal.id,
						visitDate: siteVisit.visitDate,
						visitEndTime: siteVisit.visitEndTime,
						visitStartTime: siteVisit.visitStartTime,
						siteVisitTypeId: siteVisit.siteVisitType.id
					}
				});
				expect(databaseConnector.appealStatus.create).toHaveBeenCalledWith({
					data: {
						appealId: householdAppeal.id,
						createdAt: expect.any(Date),
						status: STATE_TARGET_ISSUE_DETERMINATION,
						valid: true
					}
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					visitDate: siteVisit.visitDate,
					visitEndTime: siteVisit.visitEndTime,
					visitStartTime: siteVisit.visitStartTime,
					visitType: siteVisit.siteVisitType.name
				});
			});

			test('creates a site visit with updating the status and time fields without leading zeros', async () => {
				householdAppeal.appealStatus[0].status = 'arrange_site_visit';

				const { siteVisit } = householdAppeal;

				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.siteVisitType.findUnique.mockResolvedValue(siteVisit.siteVisitType);

				const response = await request.post(`/appeals/${householdAppeal.id}/site-visits`).send({
					visitDate: siteVisit.visitDate.split('T')[0],
					visitEndTime: '9:00',
					visitStartTime: '7:00',
					visitType: siteVisit.siteVisitType.name
				});

				expect(databaseConnector.siteVisit.create).toHaveBeenCalledWith({
					data: {
						appealId: householdAppeal.id,
						visitDate: siteVisit.visitDate,
						visitEndTime: '9:00',
						visitStartTime: '7:00',
						siteVisitTypeId: siteVisit.siteVisitType.id
					}
				});
				expect(databaseConnector.appealStatus.create).toHaveBeenCalledWith({
					data: {
						appealId: householdAppeal.id,
						createdAt: expect.any(Date),
						status: STATE_TARGET_ISSUE_DETERMINATION,
						valid: true
					}
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					visitDate: siteVisit.visitDate,
					visitEndTime: '9:00',
					visitStartTime: '7:00',
					visitType: siteVisit.siteVisitType.name
				});
			});

			test('creates a site visit with time fields in 24h format', async () => {
				const { siteVisit } = householdAppeal;

				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.siteVisitType.findUnique.mockResolvedValue(siteVisit.siteVisitType);

				const response = await request.post(`/appeals/${householdAppeal.id}/site-visits`).send({
					visitDate: siteVisit.visitDate.split('T')[0],
					visitEndTime: '18:00',
					visitStartTime: '16:00',
					visitType: siteVisit.siteVisitType.name
				});

				expect(databaseConnector.siteVisit.create).toHaveBeenCalledWith({
					data: {
						appealId: householdAppeal.id,
						visitDate: siteVisit.visitDate,
						visitEndTime: '18:00',
						visitStartTime: '16:00',
						siteVisitTypeId: siteVisit.siteVisitType.id
					}
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					visitDate: siteVisit.visitDate,
					visitEndTime: '18:00',
					visitStartTime: '16:00',
					visitType: siteVisit.siteVisitType.name
				});
			});

			test('creates an Unaccompanied site visit without time fields', async () => {
				const { siteVisit } = householdAppeal;

				siteVisit.siteVisitType.name = SITE_VISIT_TYPE_UNACCOMPANIED;

				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.siteVisitType.findUnique.mockResolvedValue(siteVisit.siteVisitType);

				const response = await request.post(`/appeals/${householdAppeal.id}/site-visits`).send({
					visitDate: siteVisit.visitDate.split('T')[0],
					visitType: siteVisit.siteVisitType.name
				});

				expect(databaseConnector.siteVisit.create).toHaveBeenCalledWith({
					data: {
						appealId: householdAppeal.id,
						visitDate: siteVisit.visitDate,
						siteVisitTypeId: siteVisit.siteVisitType.id
					}
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					visitDate: siteVisit.visitDate,
					visitType: siteVisit.siteVisitType.name
				});
			});

			test('returns an error if appealId is not numeric', async () => {
				const response = await request.post('/appeals/one/site-visits').send({
					visitType: householdAppeal.siteVisit.siteVisitType.name
				});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						appealId: ERROR_MUST_BE_NUMBER
					}
				});
			});

			test('returns an error if appealId is not found', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(null);

				const response = await request.post(`/appeals/${householdAppeal.id}/site-visits`).send({
					visitType: householdAppeal.siteVisit.siteVisitType.name
				});

				expect(response.status).toEqual(404);
				expect(response.body).toEqual({
					errors: {
						appealId: ERROR_NOT_FOUND
					}
				});
			});

			test('returns an error if visitType is not a string value', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(null);

				const response = await request.post(`/appeals/${householdAppeal.id}/site-visits`).send({
					visitType: 123
				});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						visitType: ERROR_INVALID_SITE_VISIT_TYPE
					}
				});
			});

			test('returns an error if visitType is an incorrect value', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.siteVisitType.findUnique.mockResolvedValue(null);

				const response = await request.post(`/appeals/${householdAppeal.id}/site-visits`).send({
					visitType: 'access not required'
				});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						visitType: ERROR_INVALID_SITE_VISIT_TYPE
					}
				});
			});

			test('returns an error if visitType is not Unaccompanied and visitDate is not given when visitEndTime and visitStartTime are given', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request.post(`/appeals/${householdAppeal.id}/site-visits`).send({
					visitEndTime: '18:00',
					visitStartTime: '16:00',
					visitType: householdAppeal.siteVisit.siteVisitType.name
				});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						appealId: ERROR_SITE_VISIT_REQUIRED_FIELDS
					}
				});
			});

			test('returns an error if visitType is not Unaccompanied and visitEndTime is not given when visitDate and visitStartTime are given', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request.post(`/appeals/${householdAppeal.id}/site-visits`).send({
					visitDate: '2023-12-07',
					visitStartTime: '16:00',
					visitType: householdAppeal.siteVisit.siteVisitType.name
				});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						appealId: ERROR_SITE_VISIT_REQUIRED_FIELDS
					}
				});
			});

			test('returns an error if visitType is not Unaccompanied and visitStartTime is not given when visitDate and visitEndTime are given', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request.post(`/appeals/${householdAppeal.id}/site-visits`).send({
					visitDate: '2023-12-07',
					visitEndTime: '16:00',
					visitType: householdAppeal.siteVisit.siteVisitType.name
				});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						appealId: ERROR_SITE_VISIT_REQUIRED_FIELDS
					}
				});
			});

			test('returns an error if visitDate is in an invalid format', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request.post(`/appeals/${householdAppeal.id}/site-visits`).send({
					visitDate: '07/12/2023',
					visitEndTime: '18:00',
					visitStartTime: '16:00',
					visitType: householdAppeal.siteVisit.siteVisitType.name
				});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						visitDate: ERROR_MUST_BE_CORRECT_DATE_FORMAT
					}
				});
			});

			test('returns an error if visitDate is not a valid date', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request.post(`/appeals/${householdAppeal.id}/site-visits`).send({
					visitDate: '56/12/2023',
					visitEndTime: '18:00',
					visitStartTime: '16:00',
					visitType: householdAppeal.siteVisit.siteVisitType.name
				});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						visitDate: ERROR_MUST_BE_CORRECT_DATE_FORMAT
					}
				});
			});

			test('returns an error if visitEndTime is not a valid time', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request.post(`/appeals/${householdAppeal.id}/site-visits`).send({
					visitDate: '2023-07-12',
					visitEndTime: '56:00',
					visitStartTime: '16:00',
					visitType: householdAppeal.siteVisit.siteVisitType.name
				});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						visitEndTime: ERROR_MUST_BE_CORRECT_TIME_FORMAT
					}
				});
			});

			test('returns an error if visitStartTime is not a valid time', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request.post(`/appeals/${householdAppeal.id}/site-visits`).send({
					visitDate: '2023-07-12',
					visitEndTime: '18:00',
					visitStartTime: '56:00',
					visitType: householdAppeal.siteVisit.siteVisitType.name
				});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						visitStartTime: ERROR_MUST_BE_CORRECT_TIME_FORMAT
					}
				});
			});

			test('returns an error if visitStartTime is not before visitEndTime', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request.post(`/appeals/${householdAppeal.id}/site-visits`).send({
					visitDate: '2023-07-12',
					visitEndTime: '16:00',
					visitStartTime: '18:00',
					visitType: householdAppeal.siteVisit.siteVisitType.name
				});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						visitStartTime: ERROR_START_TIME_MUST_BE_EARLIER_THAN_END_TIME
					}
				});
			});
		});
	});

	describe('/:appealId/site-visits/:siteVisitId', () => {
		describe('GET', () => {
			test('gets a single site visit', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { siteVisit } = householdAppeal;
				const response = await request.get(
					`/appeals/${householdAppeal.id}/site-visits/${siteVisit.id}`
				);

				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					appealId: siteVisit.appealId,
					visitDate: siteVisit.visitDate,
					siteVisitId: siteVisit.id,
					visitEndTime: siteVisit.visitEndTime,
					visitStartTime: siteVisit.visitStartTime,
					visitType: siteVisit.siteVisitType.name
				});
			});

			test('returns an error if appealId is not numeric', async () => {
				const response = await request.get('/appeals/one');

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						appealId: ERROR_MUST_BE_NUMBER
					}
				});
			});

			test('returns an error if appealId is not found', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(null);

				const response = await request.get('/appeals/3');

				expect(response.status).toEqual(404);
				expect(response.body).toEqual({
					errors: {
						appealId: ERROR_NOT_FOUND
					}
				});
			});

			test('returns an error if siteVisitId is not numeric', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request.get(`/appeals/${householdAppeal.id}/site-visits/one`);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						siteVisitId: ERROR_MUST_BE_NUMBER
					}
				});
			});

			test('returns an error if siteVistId is not found', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request.get(`/appeals/${householdAppeal.id}/site-visits/2`);

				expect(response.status).toEqual(404);
				expect(response.body).toEqual({
					errors: {
						siteVisitId: ERROR_NOT_FOUND
					}
				});
			});
		});

		describe('PATCH', () => {
			test('updates a site visit without updating the status', async () => {
				const { siteVisit } = householdAppeal;

				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.siteVisitType.findUnique.mockResolvedValue(siteVisit.siteVisitType);

				const response = await request
					.patch(`/appeals/${householdAppeal.id}/site-visits/${siteVisit.id}`)
					.send({
						visitType: siteVisit.siteVisitType.name
					});

				expect(databaseConnector.siteVisit.update).toHaveBeenCalledWith({
					where: { id: siteVisit.id },
					data: {
						siteVisitTypeId: siteVisit.siteVisitType.id
					}
				});
				expect(databaseConnector.appealStatus.create).not.toHaveBeenCalledWith();
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					visitType: siteVisit.siteVisitType.name
				});
			});

			test('updates a site visit with updating the status and time fields with leading zeros', async () => {
				householdAppeal.appealStatus[0].status = 'arrange_site_visit';

				const { siteVisit } = householdAppeal;

				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.siteVisitType.findUnique.mockResolvedValue(siteVisit.siteVisitType);

				const response = await request
					.patch(`/appeals/${householdAppeal.id}/site-visits/${siteVisit.id}`)
					.send({
						visitDate: siteVisit.visitDate.split('T')[0],
						visitEndTime: siteVisit.visitEndTime,
						visitStartTime: siteVisit.visitStartTime,
						visitType: siteVisit.siteVisitType.name
					});

				expect(databaseConnector.siteVisit.update).toHaveBeenCalledWith({
					where: { id: siteVisit.id },
					data: {
						visitDate: siteVisit.visitDate,
						visitEndTime: siteVisit.visitEndTime,
						visitStartTime: siteVisit.visitStartTime,
						siteVisitTypeId: siteVisit.siteVisitType.id
					}
				});
				expect(databaseConnector.appealStatus.create).toHaveBeenCalledWith({
					data: {
						appealId: householdAppeal.id,
						createdAt: expect.any(Date),
						status: STATE_TARGET_ISSUE_DETERMINATION,
						valid: true
					}
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					visitDate: siteVisit.visitDate,
					visitEndTime: siteVisit.visitEndTime,
					visitStartTime: siteVisit.visitStartTime,
					visitType: siteVisit.siteVisitType.name
				});
			});

			test('updates a site visit with updating the status and time fields without leading zeros', async () => {
				householdAppeal.appealStatus[0].status = 'arrange_site_visit';

				const { siteVisit } = householdAppeal;

				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.siteVisitType.findUnique.mockResolvedValue(siteVisit.siteVisitType);

				const response = await request
					.patch(`/appeals/${householdAppeal.id}/site-visits/${siteVisit.id}`)
					.send({
						visitDate: siteVisit.visitDate.split('T')[0],
						visitEndTime: '3:00',
						visitStartTime: '1:00',
						visitType: siteVisit.siteVisitType.name
					});

				expect(databaseConnector.siteVisit.update).toHaveBeenCalledWith({
					where: { id: siteVisit.id },
					data: {
						visitDate: siteVisit.visitDate,
						visitEndTime: '3:00',
						visitStartTime: '1:00',
						siteVisitTypeId: siteVisit.siteVisitType.id
					}
				});
				expect(databaseConnector.appealStatus.create).toHaveBeenCalledWith({
					data: {
						appealId: householdAppeal.id,
						createdAt: expect.any(Date),
						status: STATE_TARGET_ISSUE_DETERMINATION,
						valid: true
					}
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					visitDate: siteVisit.visitDate,
					visitEndTime: '3:00',
					visitStartTime: '1:00',
					visitType: siteVisit.siteVisitType.name
				});
			});

			test('updates a site visit with time fields in 24h format', async () => {
				const { siteVisit } = householdAppeal;

				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.siteVisitType.findUnique.mockResolvedValue(siteVisit.siteVisitType);

				const response = await request
					.patch(`/appeals/${householdAppeal.id}/site-visits/${siteVisit.id}`)
					.send({
						visitDate: siteVisit.visitDate.split('T')[0],
						visitEndTime: '18:00',
						visitStartTime: '16:00',
						visitType: siteVisit.siteVisitType.name
					});

				expect(databaseConnector.siteVisit.update).toHaveBeenCalledWith({
					where: { id: siteVisit.id },
					data: {
						visitDate: siteVisit.visitDate,
						visitEndTime: '18:00',
						visitStartTime: '16:00',
						siteVisitTypeId: siteVisit.siteVisitType.id
					}
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					visitDate: siteVisit.visitDate,
					visitEndTime: '18:00',
					visitStartTime: '16:00',
					visitType: siteVisit.siteVisitType.name
				});
			});

			test('updates an Unaccompanied site visit without time fields', async () => {
				const { siteVisit } = householdAppeal;

				siteVisit.siteVisitType.name = SITE_VISIT_TYPE_UNACCOMPANIED;

				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.siteVisitType.findUnique.mockResolvedValue(siteVisit.siteVisitType);

				const response = await request
					.patch(`/appeals/${householdAppeal.id}/site-visits/${siteVisit.id}`)
					.send({
						visitDate: siteVisit.visitDate.split('T')[0],
						visitType: siteVisit.siteVisitType.name
					});

				expect(databaseConnector.siteVisit.create).toHaveBeenCalledWith({
					data: {
						appealId: householdAppeal.id,
						visitDate: siteVisit.visitDate,
						siteVisitTypeId: siteVisit.siteVisitType.id
					}
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					visitDate: siteVisit.visitDate,
					visitType: siteVisit.siteVisitType.name
				});
			});

			test('returns an error if appealId is not numeric', async () => {
				const response = await request
					.patch(`/appeals/one/site-visits/${householdAppeal.siteVisit.id}`)
					.send({
						visitType: householdAppeal.siteVisit.siteVisitType.name
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						appealId: ERROR_MUST_BE_NUMBER
					}
				});
			});

			test('returns an error if appealId is not found', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(null);

				const response = await request
					.patch(`/appeals/${householdAppeal.id}/site-visits/${householdAppeal.siteVisit.id}`)
					.send({
						visitType: householdAppeal.siteVisit.siteVisitType.name
					});

				expect(response.status).toEqual(404);
				expect(response.body).toEqual({
					errors: {
						appealId: ERROR_NOT_FOUND
					}
				});
			});

			test('returns an error if siteVisitId is not numeric', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request
					.patch(`/appeals/${householdAppeal.id}/site-visits/one`)
					.send({
						visitType: householdAppeal.siteVisit.siteVisitType.name
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						siteVisitId: ERROR_MUST_BE_NUMBER
					}
				});
			});

			test('returns an error if siteVisitId is not found', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request.patch(`/appeals/${householdAppeal.id}/site-visits/2`).send({
					visitType: householdAppeal.siteVisit.siteVisitType.name
				});

				expect(response.status).toEqual(404);
				expect(response.body).toEqual({
					errors: {
						siteVisitId: ERROR_NOT_FOUND
					}
				});
			});

			test('returns an error if visitType is not a string value', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(null);

				const response = await request
					.patch(`/appeals/${householdAppeal.id}/site-visits/${householdAppeal.siteVisit.id}`)
					.send({
						visitType: 123
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						visitType: ERROR_INVALID_SITE_VISIT_TYPE
					}
				});
			});

			test('returns an error if visitType is an incorrect value', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.siteVisitType.findUnique.mockResolvedValue(null);

				const response = await request
					.patch(`/appeals/${householdAppeal.id}/site-visits/${householdAppeal.siteVisit.id}`)
					.send({
						visitType: 'access not required'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						visitType: ERROR_INVALID_SITE_VISIT_TYPE
					}
				});
			});

			test('returns an error if visitType is not Unaccompanied and visitDate is not given when visitEndTime and visitStartTime are given', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request
					.patch(`/appeals/${householdAppeal.id}/site-visits/${householdAppeal.siteVisit.id}`)
					.send({
						visitEndTime: '18:00',
						visitStartTime: '16:00',
						visitType: householdAppeal.siteVisit.siteVisitType.name
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						appealId: ERROR_SITE_VISIT_REQUIRED_FIELDS
					}
				});
			});

			test('returns an error if visitType is not Unaccompanied and visitEndTime is not given when visitDate and visitStartTime are given', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request
					.patch(`/appeals/${householdAppeal.id}/site-visits/${householdAppeal.siteVisit.id}`)
					.send({
						visitDate: '2023-12-07',
						visitStartTime: '16:00',
						visitType: householdAppeal.siteVisit.siteVisitType.name
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						appealId: ERROR_SITE_VISIT_REQUIRED_FIELDS
					}
				});
			});

			test('returns an error if visitType is not Unaccompanied and visitStartTime is not given when visitDate and visitEndTime are given', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request
					.patch(`/appeals/${householdAppeal.id}/site-visits/${householdAppeal.siteVisit.id}`)
					.send({
						visitDate: '2023-12-07',
						visitEndTime: '16:00',
						visitType: householdAppeal.siteVisit.siteVisitType.name
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						appealId: ERROR_SITE_VISIT_REQUIRED_FIELDS
					}
				});
			});

			test('returns an error if visitDate is in an invalid format', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request
					.patch(`/appeals/${householdAppeal.id}/site-visits/${householdAppeal.siteVisit.id}`)
					.send({
						visitDate: '07/12/2023',
						visitEndTime: '18:00',
						visitStartTime: '16:00',
						visitType: householdAppeal.siteVisit.siteVisitType.name
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						visitDate: ERROR_MUST_BE_CORRECT_DATE_FORMAT
					}
				});
			});

			test('returns an error if visitDate is not a valid date', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request
					.patch(`/appeals/${householdAppeal.id}/site-visits/${householdAppeal.siteVisit.id}`)
					.send({
						visitDate: '56/12/2023',
						visitEndTime: '18:00',
						visitStartTime: '16:00',
						visitType: householdAppeal.siteVisit.siteVisitType.name
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						visitDate: ERROR_MUST_BE_CORRECT_DATE_FORMAT
					}
				});
			});

			test('returns an error if visitEndTime is not a valid time', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request
					.patch(`/appeals/${householdAppeal.id}/site-visits/${householdAppeal.siteVisit.id}`)
					.send({
						visitDate: '2023-07-12',
						visitEndTime: '56:00',
						visitStartTime: '16:00',
						visitType: householdAppeal.siteVisit.siteVisitType.name
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						visitEndTime: ERROR_MUST_BE_CORRECT_TIME_FORMAT
					}
				});
			});

			test('returns an error if visitStartTime is not a valid time', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request
					.patch(`/appeals/${householdAppeal.id}/site-visits/${householdAppeal.siteVisit.id}`)
					.send({
						visitDate: '2023-07-12',
						visitEndTime: '18:00',
						visitStartTime: '56:00',
						visitType: householdAppeal.siteVisit.siteVisitType.name
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						visitStartTime: ERROR_MUST_BE_CORRECT_TIME_FORMAT
					}
				});
			});

			test('returns an error if visitStartTime is not before visitEndTime', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request
					.patch(`/appeals/${householdAppeal.id}/site-visits/${householdAppeal.siteVisit.id}`)
					.send({
						visitDate: '2023-07-12',
						visitEndTime: '16:00',
						visitStartTime: '18:00',
						visitType: householdAppeal.siteVisit.siteVisitType.name
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						visitStartTime: ERROR_START_TIME_MUST_BE_EARLIER_THAN_END_TIME
					}
				});
			});

			test('does not throw an error if given an empty body', async () => {
				// @ts-ignore
				databaseConnector.appeal.update.mockResolvedValue(householdAppeal);

				const response = await request.patch(`/appeals/${householdAppeal.id}`).send({});

				expect(response.status).toEqual(200);
				expect(response.body).toEqual({});
			});
		});
	});
});
