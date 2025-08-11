import { jest } from '@jest/globals';

const { databaseConnector } = await import('#utils/database-connector.js');

import * as representationRepository from '../representation.repository.js';

const existingRepresentations = [{ id: 1 }, { id: 2 }];

const createdRepresentation = {
	id: 1,
	reference: '',
	caseId: 1,
	status: 'DRAFT',
	originalRepresentation: '',
	redactedRepresentation: null,
	redacted: false,
	userId: null,
	received: '2023-05-11T09:57:06.139Z'
};

describe('Representation repository', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	describe('getByCaseId', () => {
		it('finds representations by case id', async () => {
			databaseConnector.representation.count.mockResolvedValue(2);
			databaseConnector.representation.findMany.mockResolvedValue(existingRepresentations);

			const { count, items } = await representationRepository.getByCaseId(
				1,
				{
					page: 1,
					pageSize: 25
				},
				{}
			);

			expect(count).toEqual(2);
			expect(items).toEqual(existingRepresentations);
			expect(databaseConnector.representation.count).toHaveBeenCalledWith({
				where: {
					caseId: 1
				}
			});
			expect(databaseConnector.representation.findMany).toHaveBeenCalledWith({
				select: {
					id: true,
					reference: true,
					status: true,
					redacted: true,
					received: true,
					represented: {
						select: {
							firstName: true,
							lastName: true,
							organisationName: true
						}
					}
				},
				where: {
					caseId: 1
				},
				orderBy: [
					{
						status: 'asc'
					},
					{
						received: 'desc'
					},
					{
						id: 'asc'
					}
				],
				skip: 0,
				take: 25
			});
		});

		it('supports pagination', async () => {
			databaseConnector.representation.count.mockResolvedValue(2);
			databaseConnector.representation.findMany.mockResolvedValue(existingRepresentations);

			const { count, items } = await representationRepository.getByCaseId(
				1,
				{
					page: 2,
					pageSize: 50
				},
				{}
			);

			expect(count).toEqual(2);
			expect(items).toEqual(existingRepresentations);
			expect(databaseConnector.representation.count).toHaveBeenCalledWith({
				where: {
					caseId: 1
				}
			});
			expect(databaseConnector.representation.findMany).toHaveBeenCalledWith({
				select: {
					id: true,
					reference: true,
					status: true,
					redacted: true,
					received: true,
					represented: {
						select: {
							firstName: true,
							lastName: true,
							organisationName: true
						}
					}
				},
				where: {
					caseId: 1
				},
				orderBy: [
					{
						status: 'asc'
					},
					{
						received: 'desc'
					},
					{
						id: 'asc'
					}
				],
				skip: 50,
				take: 50
			});
		});

		it('supports search term', async () => {
			databaseConnector.representation.count.mockResolvedValue(2);
			databaseConnector.representation.findMany.mockResolvedValue(existingRepresentations);

			const { count, items } = await representationRepository.getByCaseId(
				1,
				{
					page: 1,
					pageSize: 25
				},
				{
					searchTerm: 'James    Bond'
				}
			);

			expect(count).toEqual(2);
			expect(items).toEqual(existingRepresentations);

			const where = {
				caseId: 1,
				OR: [
					{
						reference: {
							contains: 'James Bond'
						}
					},
					{
						originalRepresentation: {
							contains: 'James Bond'
						}
					},
					{
						represented: {
							OR: [
								{
									organisationName: {
										contains: 'James Bond'
									}
								},
								{
									firstName: {
										contains: 'James'
									}
								},
								{
									firstName: {
										contains: 'Bond'
									}
								},
								{
									lastName: {
										contains: 'James'
									}
								},
								{
									lastName: {
										contains: 'Bond'
									}
								}
							]
						}
					}
				]
			};

			expect(databaseConnector.representation.count).toHaveBeenCalledWith({
				where
			});
			expect(databaseConnector.representation.findMany).toHaveBeenCalledWith({
				select: {
					id: true,
					reference: true,
					status: true,
					redacted: true,
					received: true,
					represented: {
						select: {
							firstName: true,
							lastName: true,
							organisationName: true
						}
					}
				},
				where,
				orderBy: [
					{
						status: 'asc'
					},
					{
						received: 'desc'
					},
					{
						id: 'asc'
					}
				],
				skip: 0,
				take: 25
			});
		});

		it('supports filters', async () => {
			databaseConnector.representation.count.mockResolvedValue(2);
			databaseConnector.representation.findMany.mockResolvedValue(existingRepresentations);

			const { count, items } = await representationRepository.getByCaseId(
				1,
				{
					page: 1,
					pageSize: 25
				},
				{
					filters: {
						under18: true,
						status: ['VALID', 'PUBLISHED']
					}
				}
			);

			expect(count).toEqual(2);
			expect(items).toEqual(existingRepresentations);

			const where = {
				caseId: 1,
				AND: [
					{
						represented: {
							under18: true
						}
					},
					{
						status: {
							in: ['VALID', 'PUBLISHED']
						}
					}
				]
			};

			expect(databaseConnector.representation.count).toHaveBeenCalledWith({
				where
			});
			expect(databaseConnector.representation.findMany).toHaveBeenCalledWith({
				select: {
					id: true,
					reference: true,
					status: true,
					redacted: true,
					received: true,
					represented: {
						select: {
							firstName: true,
							lastName: true,
							organisationName: true
						}
					}
				},
				where,
				orderBy: [
					{
						status: 'asc'
					},
					{
						received: 'desc'
					},
					{
						id: 'asc'
					}
				],
				skip: 0,
				take: 25
			});
		});

		it('supports sort', async () => {
			databaseConnector.representation.count.mockResolvedValue(2);
			databaseConnector.representation.findMany.mockResolvedValue(existingRepresentations);

			const { count, items } = await representationRepository.getByCaseId(
				1,
				{
					page: 1,
					pageSize: 25
				},
				{
					sort: [{ reference: 'desc' }]
				}
			);

			expect(count).toEqual(2);
			expect(items).toEqual(existingRepresentations);

			const where = {
				caseId: 1
			};

			expect(databaseConnector.representation.count).toHaveBeenCalledWith({
				where
			});
			expect(databaseConnector.representation.findMany).toHaveBeenCalledWith({
				select: {
					id: true,
					reference: true,
					status: true,
					redacted: true,
					received: true,
					represented: {
						select: {
							firstName: true,
							lastName: true,
							organisationName: true
						}
					}
				},
				where,
				orderBy: [
					{
						reference: 'desc'
					},
					{
						received: 'desc'
					},
					{
						id: 'asc'
					}
				],
				skip: 0,
				take: 25
			});
		});
	});

	describe('getById', () => {
		const expectedSelect = {
			id: true,
			reference: true,
			caseId: true,
			status: true,
			redacted: true,
			received: true,
			originalRepresentation: true,
			redactedRepresentation: true,
			type: true,
			user: {
				select: {
					azureReference: true
				}
			},
			case: {
				select: {
					id: true,
					reference: true
				}
			},
			representedType: true,
			represented: {
				select: {
					id: true,
					firstName: true,
					lastName: true,
					organisationName: true,
					jobTitle: true,
					under18: true,
					email: true,
					contactMethod: true,
					phoneNumber: true,
					address: {
						select: {
							addressLine1: true,
							addressLine2: true,
							town: true,
							county: true,
							postcode: true,
							country: true
						}
					}
				}
			},
			representative: {
				select: {
					id: true,
					firstName: true,
					lastName: true,
					organisationName: true,
					jobTitle: true,
					under18: true,
					email: true,
					contactMethod: true,
					phoneNumber: true,
					address: {
						select: {
							addressLine1: true,
							addressLine2: true,
							town: true,
							county: true,
							postcode: true,
							country: true
						}
					}
				}
			},
			representationActions: {
				select: {
					actionBy: true,
					actionDate: true,
					invalidReason: true,
					notes: true,
					previousRedactStatus: true,
					previousStatus: true,
					redactStatus: true,
					referredTo: true,
					status: true,
					type: true
				},
				orderBy: {
					actionDate: 'desc'
				}
			},
			attachments: {
				select: {
					Document: {
						select: {
							isDeleted: true,
							latestDocumentVersion: {
								select: {
									fileName: true
								}
							}
						}
					},
					documentGuid: true,
					id: true
				}
			}
		};

		it('finds a representation by id', async () => {
			databaseConnector.representation.findUnique.mockResolvedValue(existingRepresentations[0]);

			const representation = await representationRepository.getById(1);

			expect(representation).toEqual(existingRepresentations[0]);
			expect(databaseConnector.representation.findUnique).toHaveBeenCalledWith({
				select: expectedSelect,
				where: {
					id: 1
				}
			});
		});
	});

	describe('getFirstById', () => {
		it('finds first representation by id', async () => {
			await representationRepository.getFirstById(1);

			expect(databaseConnector.representation.findFirst).toHaveBeenCalledWith({
				where: {
					id: 1
				}
			});
		});

		it('finds first representation by id and caseId', async () => {
			await representationRepository.getFirstById(1, 2);

			expect(databaseConnector.representation.findFirst).toHaveBeenCalledWith({
				where: {
					id: 1,
					caseId: 2
				}
			});
		});
	});

	describe('createRepresentation', () => {
		it('Create a representation', async () => {
			// GIVEN
			const mappedData = {
				representationDetails: {
					status: 'DRAFT',
					caseId: 1
				},
				represented: {
					firstName: 'Joe',
					lastName: 'Bloggs',
					under18: false,
					type: 'PERSON',
					received: '2023-05-11T09:57:06.139Z'
				},
				representedAddress: {
					addressLine1: 'Test Address Line 1'
				},
				representative: {
					firstName: 'Jack',
					lastName: 'Jones',
					under18: false,
					type: 'AGENT',
					received: '2023-05-11T09:57:06.139Z'
				},
				representativeAddress: {
					addressLine1: 'Test Address2 Line 1',
					postcode: 'XX2 9XX'
				}
			};

			databaseConnector.representation.create.mockResolvedValue(createdRepresentation);

			const updatedRepresentation = createdRepresentation;

			updatedRepresentation.reference = 'B0000001';
			databaseConnector.representation.update.mockResolvedValue(updatedRepresentation);

			// WHEN
			const representation = await representationRepository.createApplicationRepresentation(
				mappedData
			);

			// THEN
			expect(representation).toEqual({
				caseId: 1,
				id: 1,
				originalRepresentation: '',
				received: '2023-05-11T09:57:06.139Z',
				redacted: false,
				redactedRepresentation: null,
				reference: 'B0000001',
				status: 'DRAFT',
				userId: null
			});

			expect(databaseConnector.representation.create).toHaveBeenCalledWith({
				data: {
					status: 'DRAFT',
					case: {
						connect: {
							id: 1
						}
					},
					represented: {
						create: {
							firstName: 'Joe',
							lastName: 'Bloggs',
							under18: false,
							type: 'PERSON',
							received: '2023-05-11T09:57:06.139Z',
							address: { create: { addressLine1: 'Test Address Line 1' } }
						}
					},
					representative: {
						create: {
							firstName: 'Jack',
							lastName: 'Jones',
							under18: false,
							type: 'AGENT',
							received: '2023-05-11T09:57:06.139Z',
							address: {
								create: {
									addressLine1: 'Test Address2 Line 1',
									postcode: 'XX2 9XX'
								}
							}
						}
					}
				}
			});

			expect(databaseConnector.representation.update).toHaveBeenCalledWith({
				where: { id: 1 },
				data: {
					reference: 'B0000001'
				}
			});
		});

		it('Create a representation with reference id', async () => {
			// GIVEN
			const mappedData = {
				representationDetails: {
					status: 'DRAFT',
					caseId: 1,
					reference: 'FRONT_OFFICE_REFERENCE_ID'
				},
				represented: {
					firstName: 'Joe',
					lastName: 'Bloggs',
					under18: false,
					type: 'PERSON',
					received: '2023-05-11T09:57:06.139Z'
				},
				representedAddress: {
					addressLine1: 'Test Address Line 1'
				}
			};

			const createdRepresentationWithReference = {
				...createdRepresentation,
				reference: 'FRONT_OFFICE_REFERENCE_ID'
			};

			databaseConnector.representation.create.mockResolvedValue(createdRepresentationWithReference);

			// WHEN
			const representation = await representationRepository.createApplicationRepresentation(
				mappedData
			);

			// THEN
			expect(representation).toEqual({
				caseId: 1,
				id: 1,
				originalRepresentation: '',
				received: '2023-05-11T09:57:06.139Z',
				redacted: false,
				redactedRepresentation: null,
				reference: 'FRONT_OFFICE_REFERENCE_ID',
				status: 'DRAFT',
				userId: null
			});

			expect(databaseConnector.representation.create).toHaveBeenCalledWith({
				data: {
					status: 'DRAFT',
					//
					case: {
						connect: {
							id: 1
						}
					},
					reference: 'FRONT_OFFICE_REFERENCE_ID',
					represented: {
						create: {
							firstName: 'Joe',
							lastName: 'Bloggs',
							under18: false,
							type: 'PERSON',
							received: '2023-05-11T09:57:06.139Z',
							address: { create: { addressLine1: 'Test Address Line 1' } }
						}
					}
				}
			});

			expect(databaseConnector.representation.update).toHaveBeenCalledTimes(0);
		});
	});

	describe('getPublishableRepresentations', () => {
		it('should use the correct query', async () => {
			const caseId = 1;
			const totalPublishableRepsCount = 4;
			const batchSize = 2000;

			// Mock the count method
			databaseConnector.representation.count.mockResolvedValue(totalPublishableRepsCount);

			await representationRepository.getPublishableRepresentations(caseId);

			expect(databaseConnector.representation.findMany).toHaveBeenCalledWith({
				select: {
					id: true,
					reference: true,
					status: true,
					redacted: true,
					received: true,
					represented: {
						select: {
							firstName: true,
							lastName: true,
							organisationName: true
						}
					}
				},
				where: {
					caseId,
					OR: [{ status: 'PUBLISHED', unpublishedUpdates: true }, { status: 'VALID' }]
				},
				orderBy: [{ status: 'desc' }, { reference: 'asc' }],
				take: batchSize,
				skip: 0
			});
		});

		it('should batch the query', async () => {
			const caseId = 1;
			const batchSize = 2000;
			const totalPublishableRepsCount = 6000;

			databaseConnector.representation.count.mockResolvedValue(totalPublishableRepsCount);

			await representationRepository.getPublishableRepresentations(caseId);

			expect(databaseConnector.representation.findMany).toHaveBeenCalledTimes(
				Math.ceil(totalPublishableRepsCount / batchSize)
			);
		});
	});

	describe('setRepresentationsStatus', () => {
		it('should update status and create actions for representations with fromStatus, and clear unpublishedUpdates for toStatus', async () => {
			const representations = [
				{ id: 1, status: 'VALID' },
				{ id: 2, status: 'DRAFT' },
				{ id: 3, status: 'VALID' },
				{ id: 4, status: 'PUBLISHED' }
			];
			const actionBy = 'user';
			const fromStatus = 'VALID';
			const toStatus = 'PUBLISHED';

			databaseConnector.representation.update.mockResolvedValue({});
			databaseConnector.representationAction.create.mockResolvedValue({});
			databaseConnector.representation.updateMany.mockResolvedValue({});
			databaseConnector.$transaction = jest.fn().mockResolvedValue([]);

			await representationRepository.setRepresentationsStatus(
				representations,
				actionBy,
				fromStatus,
				toStatus
			);

			// Only reps with fromStatus should be updated
			expect(databaseConnector.representation.update).toHaveBeenCalledTimes(2);
			expect(databaseConnector.representationAction.create).toHaveBeenCalledTimes(2);
			// updateMany should be called for reps already in toStatus
			expect(databaseConnector.representation.updateMany).toHaveBeenCalledWith({
				where: { id: { in: [4] } },
				data: { unpublishedUpdates: false }
			});
			expect(databaseConnector.$transaction).toHaveBeenCalledWith(expect.any(Array));
		});
	});

	describe('setRepresentationsStatusBatch', () => {
		it('should call setRepresentationsStatus in batches of 1000 and update DB for each batch', async () => {
			const representations = Array.from({ length: 2501 }, (_, i) => ({
				id: i + 1,
				status: 'VALID'
			}));
			databaseConnector.representation.update.mockResolvedValue({});
			databaseConnector.representationAction.create.mockResolvedValue({});
			databaseConnector.representation.updateMany.mockResolvedValue({});
			databaseConnector.$transaction = jest.fn().mockResolvedValue([]);

			await representationRepository.setRepresentationsStatusBatch(
				representations,
				'user',
				'VALID',
				'PUBLISHED'
			);

			// Should call DB for each batch
			// 2501/1000 = 3 batches
			expect(databaseConnector.$transaction).toHaveBeenCalledTimes(3);
		});
	});

	describe('setRepresentationsAsPublished', () => {
		it('should update status to PUBLISHED for VALID representations', async () => {
			const representations = [
				{ id: 1, status: 'VALID' },
				{ id: 2, status: 'VALID' }
			];
			databaseConnector.representation.update.mockResolvedValue({});
			databaseConnector.representationAction.create.mockResolvedValue({});
			databaseConnector.representation.updateMany.mockResolvedValue({});
			databaseConnector.$transaction = jest.fn().mockResolvedValue([]);

			await representationRepository.setRepresentationsAsPublished(representations, 'user');

			expect(databaseConnector.representation.update).toHaveBeenCalledTimes(2);
			expect(databaseConnector.representationAction.create).toHaveBeenCalledTimes(2);
			expect(databaseConnector.representation.updateMany).toHaveBeenCalled();
			expect(databaseConnector.$transaction).toHaveBeenCalled();
		});
	});

	describe('setRepresentationsAsPublishedBatch', () => {
		it('should batch update status to PUBLISHED for VALID representations', async () => {
			const representations = Array.from({ length: 1500 }, (_, i) => ({
				id: i + 1,
				status: 'VALID'
			}));
			databaseConnector.representation.update.mockResolvedValue({});
			databaseConnector.representationAction.create.mockResolvedValue({});
			databaseConnector.representation.updateMany.mockResolvedValue({});
			databaseConnector.$transaction = jest.fn().mockResolvedValue([]);

			await representationRepository.setRepresentationsAsPublishedBatch(representations, 'user');

			// Should call DB for each batch
			expect(databaseConnector.$transaction).toHaveBeenCalledTimes(2);
		});
	});

	describe('setRepresentationsAsUnpublished', () => {
		it('should update status to UNPUBLISHED for PUBLISHED representations', async () => {
			const representations = [
				{ id: 1, status: 'PUBLISHED' },
				{ id: 2, status: 'PUBLISHED' }
			];
			databaseConnector.representation.update.mockResolvedValue({});
			databaseConnector.representationAction.create.mockResolvedValue({});
			databaseConnector.representation.updateMany.mockResolvedValue({});
			databaseConnector.$transaction = jest.fn().mockResolvedValue([]);

			await representationRepository.setRepresentationsAsUnpublished(representations, 'user');

			expect(databaseConnector.representation.update).toHaveBeenCalledTimes(2);
			expect(databaseConnector.representationAction.create).toHaveBeenCalledTimes(2);
			expect(databaseConnector.representation.updateMany).toHaveBeenCalled();
			expect(databaseConnector.$transaction).toHaveBeenCalled();
		});
	});

	describe('setRepresentationsAsUnpublishedBatch', () => {
		it('should batch update status to UNPUBLISHED for PUBLISHED representations', async () => {
			const representations = Array.from({ length: 1200 }, (_, i) => ({
				id: i + 1,
				status: 'PUBLISHED'
			}));
			databaseConnector.representation.update.mockResolvedValue({});
			databaseConnector.representationAction.create.mockResolvedValue({});
			databaseConnector.representation.updateMany.mockResolvedValue({});
			databaseConnector.$transaction = jest.fn().mockResolvedValue([]);

			await representationRepository.setRepresentationsAsUnpublishedBatch(representations, 'user');

			// Should call DB for each batch
			expect(databaseConnector.$transaction).toHaveBeenCalledTimes(2);
		});
	});
});
