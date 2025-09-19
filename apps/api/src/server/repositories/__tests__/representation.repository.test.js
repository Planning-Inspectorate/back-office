import { jest } from '@jest/globals';

const { databaseConnector } = await import('#utils/database-connector.js');

import * as representationRepository from '../representation.repository.js';
import { getAttachmentCountForCase } from '../representation.repository.js';

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
			databaseConnector.$transaction.mockResolvedValue([2, existingRepresentations]);
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
				where: { caseId: 1 }
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
							organisationName: true,
							displayName: true
						}
					}
				},
				where: { caseId: 1 },
				orderBy: [{ status: 'asc' }, { received: 'desc' }, { id: 'asc' }],
				skip: 0,
				take: 25
			});
		});

		it('supports pagination', async () => {
			databaseConnector.$transaction.mockResolvedValue([2, existingRepresentations]);
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
				where: { caseId: 1 }
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
							organisationName: true,
							displayName: true
						}
					}
				},
				where: { caseId: 1 },
				orderBy: [{ status: 'asc' }, { received: 'desc' }, { id: 'asc' }],
				skip: 50,
				take: 50
			});
		});

		it('supports search term', async () => {
			databaseConnector.$transaction.mockResolvedValue([2, existingRepresentations]);
			const { count, items } = await representationRepository.getByCaseId(
				1,
				{
					page: 1,
					pageSize: 25
				},
				{ searchTerm: 'James    Bond' }
			);
			expect(count).toEqual(2);
			expect(items).toEqual(existingRepresentations);
			const where = {
				caseId: 1,
				OR: [
					{ reference: { contains: 'James Bond' } },
					{ originalRepresentation: { contains: 'James Bond' } },
					{
						represented: {
							OR: [
								{ organisationName: { contains: 'James Bond' } },
								{ firstName: { contains: 'James' } },
								{ firstName: { contains: 'Bond' } },
								{ lastName: { contains: 'James' } },
								{ lastName: { contains: 'Bond' } }
							]
						}
					}
				]
			};
			expect(databaseConnector.representation.count).toHaveBeenCalledWith({ where });
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
							organisationName: true,
							displayName: true
						}
					}
				},
				where,
				orderBy: [{ status: 'asc' }, { received: 'desc' }, { id: 'asc' }],
				skip: 0,
				take: 25
			});
		});

		it('supports filters', async () => {
			databaseConnector.$transaction.mockResolvedValue([2, existingRepresentations]);
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
				AND: [{ represented: { under18: true } }, { status: { in: ['VALID', 'PUBLISHED'] } }]
			};
			expect(databaseConnector.representation.count).toHaveBeenCalledWith({ where });
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
							organisationName: true,
							displayName: true
						}
					}
				},
				where,
				orderBy: [{ status: 'asc' }, { received: 'desc' }, { id: 'asc' }],
				skip: 0,
				take: 25
			});
		});

		it('supports sort', async () => {
			databaseConnector.$transaction.mockResolvedValue([2, existingRepresentations]);
			const { count, items } = await representationRepository.getByCaseId(
				1,
				{
					page: 1,
					pageSize: 25
				},
				{ sort: [{ reference: 'desc' }] }
			);
			expect(count).toEqual(2);
			expect(items).toEqual(existingRepresentations);
			const where = { caseId: 1 };
			expect(databaseConnector.representation.count).toHaveBeenCalledWith({ where });
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
							organisationName: true,
							displayName: true
						}
					}
				},
				where,
				orderBy: [{ reference: 'desc' }, { received: 'desc' }, { id: 'asc' }],
				skip: 0,
				take: 25
			});
		});

		it('supports sort on nested field represented.displayName', async () => {
			databaseConnector.$transaction.mockResolvedValue([2, existingRepresentations]);
			const { count, items } = await representationRepository.getByCaseId(
				1,
				{
					page: 1,
					pageSize: 25
				},
				{
					sort: [{ displayName: 'asc' }]
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
							organisationName: true,
							displayName: true
						}
					}
				},
				where,
				orderBy: [
					{
						represented: { displayName: 'asc' }
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

	describe('updateRepresentedDisplayName', () => {
		it('updates the display name with the organisation name if it exists', async () => {
			// GIVEN
			const represented = {
				id: 1,
				organisationName: 'Test Organisation',
				firstName: 'Joe',
				lastName: 'Bloggs'
			};

			databaseConnector.serviceUser.findUnique.mockResolvedValue(represented);

			const newDisplayName = 'Test Organisation';

			// WHEN
			await representationRepository.updateRepresentedDisplayName(represented.id);

			// THEN
			expect(databaseConnector.serviceUser.update).toHaveBeenCalledWith({
				where: { id: represented.id },
				data: { displayName: newDisplayName }
			});
		});

		it('updates the display name with the first and last name if organisation name does not exist', async () => {
			// GIVEN
			const represented = {
				id: 1,
				organisationName: '',
				firstName: 'Joe',
				lastName: 'Bloggs'
			};

			databaseConnector.serviceUser.findUnique.mockResolvedValue(represented);

			const newDisplayName = 'Joe Bloggs';

			// WHEN
			await representationRepository.updateRepresentedDisplayName(represented.id);

			// THEN
			expect(databaseConnector.serviceUser.update).toHaveBeenCalledWith({
				where: { id: represented.id },
				data: { displayName: newDisplayName }
			});
		});

		it('does not update the display name if it matches the new display name', async () => {
			// GIVEN
			const represented = {
				id: 1,
				organisationName: 'Test Organisation',
				firstName: 'Joe',
				lastName: 'Bloggs',
				displayName: 'Test Organisation'
			};

			databaseConnector.serviceUser.findUnique.mockResolvedValue(represented);

			const newDisplayName = 'Test Organisation';

			// WHEN
			await representationRepository.updateRepresentedDisplayName(represented.id);

			// THEN
			expect(databaseConnector.serviceUser.update).not.toHaveBeenCalledWith({
				where: { id: represented.id },
				data: { displayName: newDisplayName }
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
					organisationName: '',
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
							organisationName: '',
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
					organisationName: '',
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
							organisationName: '',
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

	describe('getAttachmentCountForCase', () => {
		it('should return the count of attachments for a case', async () => {
			const caseId = 1;
			const expectedCount = 2;
			databaseConnector.representation.count.mockResolvedValue(expectedCount);

			expect(await getAttachmentCountForCase(caseId)).toEqual(expectedCount);
			expect(databaseConnector.representation.count).toHaveBeenCalledWith({
				where: {
					caseId,
					attachments: {
						some: { Document: { isDeleted: false } }
					}
				}
			});
		});
	});

	describe('setRepresentationsAsUnpublished', () => {
		const mockActionBy = 'test-user';
		const mockDate = new Date('2023-05-11T10:00:00.000Z');

		beforeEach(() => {
			jest.useFakeTimers();
			jest.setSystemTime(mockDate);
		});

		afterEach(() => {
			jest.useRealTimers();
		});

		it('should unpublish only PUBLISHED representations', async () => {
			const representations = [
				{ id: 1, status: 'PUBLISHED' },
				{ id: 2, status: 'VALID' },
				{ id: 3, status: 'PUBLISHED' },
				{ id: 4, status: 'DRAFT' }
			];

			databaseConnector.$transaction.mockResolvedValue([]);

			await representationRepository.setRepresentationsAsUnpublished(representations, mockActionBy);

			// Verify transaction was called with the correct operations
			const transactionCalls = databaseConnector.$transaction.mock.calls[0][0];

			// Should have 4 operations: 2 updates + 2 actions for the 2 PUBLISHED representations
			expect(transactionCalls).toHaveLength(4);

			// Check first representation update
			expect(databaseConnector.representation.update).toHaveBeenCalledWith({
				where: { id: 1 },
				data: { status: 'UNPUBLISHED' }
			});

			// Check first representation action
			expect(databaseConnector.representationAction.create).toHaveBeenCalledWith({
				data: {
					representationId: 1,
					previousStatus: 'PUBLISHED',
					type: 'STATUS',
					status: 'UNPUBLISHED',
					actionBy: mockActionBy,
					actionDate: mockDate
				}
			});

			// Check second representation update
			expect(databaseConnector.representation.update).toHaveBeenCalledWith({
				where: { id: 3 },
				data: { status: 'UNPUBLISHED' }
			});

			// Check second representation action
			expect(databaseConnector.representationAction.create).toHaveBeenCalledWith({
				data: {
					representationId: 3,
					previousStatus: 'PUBLISHED',
					type: 'STATUS',
					status: 'UNPUBLISHED',
					actionBy: mockActionBy,
					actionDate: mockDate
				}
			});
		});

		it('should handle empty representations array', async () => {
			databaseConnector.$transaction.mockResolvedValue([]);

			await representationRepository.setRepresentationsAsUnpublished([], mockActionBy);

			expect(databaseConnector.$transaction).toHaveBeenCalledWith([]);
		});

		it('should handle representations with no PUBLISHED status', async () => {
			const representations = [
				{ id: 1, status: 'VALID' },
				{ id: 2, status: 'DRAFT' },
				{ id: 3, status: 'INVALID' }
			];

			databaseConnector.$transaction.mockResolvedValue([]);

			await representationRepository.setRepresentationsAsUnpublished(representations, mockActionBy);

			expect(databaseConnector.$transaction).toHaveBeenCalledWith([]);
		});

		it('should handle single PUBLISHED representation', async () => {
			const representations = [{ id: 1, status: 'PUBLISHED' }];

			databaseConnector.$transaction.mockResolvedValue([]);

			await representationRepository.setRepresentationsAsUnpublished(representations, mockActionBy);

			// Should have 2 operations: 1 update + 1 action
			const transactionCalls = databaseConnector.$transaction.mock.calls[0][0];
			expect(transactionCalls).toHaveLength(2);

			expect(databaseConnector.representation.update).toHaveBeenCalledWith({
				where: { id: 1 },
				data: { status: 'UNPUBLISHED' }
			});

			expect(databaseConnector.representationAction.create).toHaveBeenCalledWith({
				data: {
					representationId: 1,
					previousStatus: 'PUBLISHED',
					type: 'STATUS',
					status: 'UNPUBLISHED',
					actionBy: mockActionBy,
					actionDate: mockDate
				}
			});
		});
	});

	describe('setRepresentationsAsUnpublishedBatch', () => {
		const mockActionBy = 'test-user';

		beforeEach(() => {
			jest.spyOn(console, 'info').mockImplementation(() => {});
		});

		afterEach(() => {
			console.info.mockRestore();
		});

		it('should process representations in batches of 1000', async () => {
			// Create 2500 representations to test batching
			const representations = Array.from({ length: 2500 }, (_, i) => ({
				id: i + 1,
				status: 'PUBLISHED'
			}));

			databaseConnector.$transaction.mockResolvedValue([]);

			await representationRepository.setRepresentationsAsUnpublishedBatch(
				representations,
				mockActionBy
			);

			// Should be called 3 times for the 3 batches
			expect(databaseConnector.$transaction).toHaveBeenCalledTimes(3);

			// Should log progress for each batch
			expect(console.info).toHaveBeenCalledWith('updated representations from range 0 - 1000');
			expect(console.info).toHaveBeenCalledWith('updated representations from range 1000 - 2000');
			expect(console.info).toHaveBeenCalledWith('updated representations from range 2000 - 2500');
		});

		it('should handle single batch when representations count is less than batch size', async () => {
			const representations = Array.from({ length: 500 }, (_, i) => ({
				id: i + 1,
				status: 'PUBLISHED'
			}));

			databaseConnector.$transaction.mockResolvedValue([]);

			await representationRepository.setRepresentationsAsUnpublishedBatch(
				representations,
				mockActionBy
			);

			expect(databaseConnector.$transaction).toHaveBeenCalledTimes(1);
			expect(console.info).toHaveBeenCalledWith('updated representations from range 0 - 500');
		});

		it('should handle empty representations array', async () => {
			await representationRepository.setRepresentationsAsUnpublishedBatch([], mockActionBy);

			expect(databaseConnector.$transaction).toHaveBeenCalledTimes(0);
			expect(console.info).not.toHaveBeenCalled();
		});

		it('should handle exactly one batch size (1000 representations)', async () => {
			const representations = Array.from({ length: 1000 }, (_, i) => ({
				id: i + 1,
				status: 'PUBLISHED'
			}));

			databaseConnector.$transaction.mockResolvedValue([]);

			await representationRepository.setRepresentationsAsUnpublishedBatch(
				representations,
				mockActionBy
			);

			expect(databaseConnector.$transaction).toHaveBeenCalledTimes(1);
			expect(console.info).toHaveBeenCalledWith('updated representations from range 0 - 1000');
		});
	});
});
