import { jest } from '@jest/globals';
const { databaseConnector } = await import('../../utils/database-connector.js');

import * as representationRepository from '../representation.repository.js';

const existingRepresentations = [{ id: 1 }, { id: 2 }];

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
			expect(databaseConnector.representation.count).toBeCalledWith({
				where: {
					caseId: 1
				}
			});
			expect(databaseConnector.representation.findMany).toBeCalledWith({
				select: {
					id: true,
					reference: true,
					status: true,
					redacted: true,
					received: true,
					contacts: {
						select: {
							firstName: true,
							lastName: true,
							organisationName: true
						},
						where: {
							NOT: {
								type: 'AGENT'
							}
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
						received: 'asc'
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
			expect(databaseConnector.representation.count).toBeCalledWith({
				where: {
					caseId: 1
				}
			});
			expect(databaseConnector.representation.findMany).toBeCalledWith({
				select: {
					id: true,
					reference: true,
					status: true,
					redacted: true,
					received: true,
					contacts: {
						select: {
							firstName: true,
							lastName: true,
							organisationName: true
						},
						where: {
							NOT: {
								type: 'AGENT'
							}
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
						received: 'asc'
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
						contacts: {
							some: {
								NOT: {
									type: 'AGENT'
								},
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
					}
				]
			};

			expect(databaseConnector.representation.count).toBeCalledWith({
				where
			});
			expect(databaseConnector.representation.findMany).toBeCalledWith({
				select: {
					id: true,
					reference: true,
					status: true,
					redacted: true,
					received: true,
					contacts: {
						select: {
							firstName: true,
							lastName: true,
							organisationName: true
						},
						where: {
							NOT: {
								type: 'AGENT'
							}
						}
					}
				},
				where,
				orderBy: [
					{
						status: 'asc'
					},
					{
						received: 'asc'
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
						contacts: {
							some: {
								NOT: {
									type: 'AGENT'
								},
								under18: true
							}
						}
					},
					{
						status: {
							in: ['VALID', 'PUBLISHED']
						}
					}
				]
			};

			expect(databaseConnector.representation.count).toBeCalledWith({
				where
			});
			expect(databaseConnector.representation.findMany).toBeCalledWith({
				select: {
					id: true,
					reference: true,
					status: true,
					redacted: true,
					received: true,
					contacts: {
						select: {
							firstName: true,
							lastName: true,
							organisationName: true
						},
						where: {
							NOT: {
								type: 'AGENT'
							}
						}
					}
				},
				where,
				orderBy: [
					{
						status: 'asc'
					},
					{
						received: 'asc'
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

			expect(databaseConnector.representation.count).toBeCalledWith({
				where
			});
			expect(databaseConnector.representation.findMany).toBeCalledWith({
				select: {
					id: true,
					reference: true,
					status: true,
					redacted: true,
					received: true,
					contacts: {
						select: {
							firstName: true,
							lastName: true,
							organisationName: true
						},
						where: {
							NOT: {
								type: 'AGENT'
							}
						}
					}
				},
				where,
				orderBy: [
					{
						reference: 'desc'
					},
					{
						received: 'asc'
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
		it('finds a representation by id', async () => {
			databaseConnector.representation.findMany.mockResolvedValue(existingRepresentations);

			const representation = await representationRepository.getById(1);

			expect(representation).toEqual(existingRepresentations[0]);
			expect(databaseConnector.representation.findMany).toBeCalledWith({
				select: {
					id: true,
					reference: true,
					status: true,
					redacted: true,
					received: true,
					originalRepresentation: true,
					redactedRepresentation: true,
					user: {
						select: {
							azureReference: true
						}
					},
					contacts: {
						select: {
							type: true,
							firstName: true,
							lastName: true,
							organisationName: true,
							jobTitle: true,
							under18: true,
							email: true,
							phoneNumber: true,
							address: {
								select: {
									addressLine1: true,
									addressLine2: true,
									town: true,
									county: true,
									postcode: true
								}
							}
						}
					},
					attachments: {
						select: {
							documentVersion: {
								select: {
									fileName: true,
									mime: true,
									path: true
								},
								take: 1,
								orderBy: {
									lastModified: 'desc'
								}
							}
						},
						where: {
							isDeleted: false
						}
					}
				},
				where: {
					id: 1
				}
			});
		});

		it('finds a representation by id and caseId', async () => {
			databaseConnector.representation.findMany.mockResolvedValue(existingRepresentations);

			const representation = await representationRepository.getById(1, 2);

			expect(representation).toEqual(existingRepresentations[0]);
			expect(databaseConnector.representation.findMany).toBeCalledWith({
				select: {
					id: true,
					reference: true,
					status: true,
					redacted: true,
					received: true,
					originalRepresentation: true,
					redactedRepresentation: true,
					user: {
						select: {
							azureReference: true
						}
					},
					contacts: {
						select: {
							type: true,
							firstName: true,
							lastName: true,
							organisationName: true,
							jobTitle: true,
							under18: true,
							email: true,
							phoneNumber: true,
							address: {
								select: {
									addressLine1: true,
									addressLine2: true,
									town: true,
									county: true,
									postcode: true
								}
							}
						}
					},
					attachments: {
						select: {
							documentVersion: {
								select: {
									fileName: true,
									mime: true,
									path: true
								},
								take: 1,
								orderBy: {
									lastModified: 'desc'
								}
							}
						},
						where: {
							isDeleted: false
						}
					}
				},
				where: {
					case: {
						id: 2
					},
					id: 1
				}
			});
		});
	});
});
