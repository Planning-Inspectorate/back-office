import { jest } from '@jest/globals';

const { databaseConnector } = await import('../../utils/database-connector.js');

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
});
