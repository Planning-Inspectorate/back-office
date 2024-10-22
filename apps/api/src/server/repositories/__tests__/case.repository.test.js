import { databaseConnector } from '#utils/database-connector.js';
import {
	getByStatus,
	getBySearchCriteria,
	getApplicationsCountBySearchCriteria,
	createApplication,
	updateApplication,
	publishCase,
	unpublishCase,
	getById,
	getByRef,
	updateApplicationStatusAndDataById,
	buildTrainingCasesWhereClause,
	whereNotGeneralS51AdviceCase
} from '../case.repository.js';

/**
 *
 * @param {number} skip
 * @param {number} take
 * @param {string} query
 * @returns {object}
 */
const expectedSearchParameters = (skip, take, query) => {
	const whereTrainingCriteria = buildTrainingCasesWhereClause();
	return {
		skip,
		take,
		orderBy: [
			{
				createdAt: 'desc'
			}
		],
		where: {
			AND: [
				whereNotGeneralS51AdviceCase,
				whereTrainingCriteria,
				{
					OR: [
						{
							title: { contains: query }
						},
						{
							reference: { contains: query }
						},
						{
							description: { contains: query }
						}
					]
				}
			]
		},
		include: {
			ApplicationDetails: {
				include: {
					subSector: {
						include: {
							sector: true
						}
					}
				}
			},
			CaseStatus: {
				where: {
					valid: true
				}
			}
		}
	};
};

describe('Case Repository', () => {
	describe('getByStatus', () => {
		it('should fetch cases by status', async () => {
			const statusArray = ['draft', 'submitted'];
			const mockCases = [
				{ id: 1, status: 'draft' },
				{ id: 2, status: 'submitted' }
			];
			databaseConnector.case.findMany.mockResolvedValue(mockCases);

			const result = await getByStatus(statusArray);

			expect(databaseConnector.case.findMany).toHaveBeenCalledWith({
				orderBy: [{ ApplicationDetails: { subSector: { abbreviation: 'asc' } } }],
				where: {
					AND: [
						whereNotGeneralS51AdviceCase,
						buildTrainingCasesWhereClause(),
						{
							CaseStatus: {
								some: {
									status: {
										in: statusArray
									},
									valid: true
								}
							}
						}
					]
				},
				include: {
					ApplicationDetails: {
						include: {
							subSector: {
								include: {
									sector: true
								}
							}
						}
					},
					CaseStatus: {
						where: {
							valid: true
						}
					}
				}
			});
			expect(result).toEqual(mockCases);
		});
	});

	describe('getBySearchCriteria', () => {
		it('should fetch cases by search criteria', async () => {
			const query = 'test';
			const skipValue = 0;
			const pageSize = 10;
			const mockCases = [{ id: 1, title: 'test case' }];
			databaseConnector.case.findMany.mockResolvedValue(mockCases);

			const result = await getBySearchCriteria(query, skipValue, pageSize);

			expect(databaseConnector.case.findMany).toHaveBeenCalledWith(
				expectedSearchParameters(0, 10, query)
			);
			expect(result).toEqual(mockCases);
		});
	});

	describe('getApplicationsCountBySearchCriteria', () => {
		it('should count applications by search criteria', async () => {
			const query = 'test';
			const mockCount = 5;
			databaseConnector.case.count.mockResolvedValue(mockCount);
			const whereTrainingCriteria = buildTrainingCasesWhereClause();

			const result = await getApplicationsCountBySearchCriteria(query);

			expect(databaseConnector.case.count).toHaveBeenCalledWith({
				where: {
					AND: [
						whereNotGeneralS51AdviceCase,
						whereTrainingCriteria,
						{
							OR: [
								{
									title: { contains: query }
								},
								{
									reference: { contains: query }
								},
								{
									description: { contains: query }
								}
							]
						}
					]
				}
			});
			expect(result).toEqual(mockCount);
		});
	});

	describe('createApplication', () => {
		it('should create a new application', async () => {
			const caseInfo = {
				caseDetails: { title: 'New Case' },
				gridReference: { easting: 123, northing: 456 },
				applicationDetails: { locationDescription: 'Test Location' },
				mapZoomLevelName: 'Level 1',
				subSectorName: 'Sub Sector',
				regionNames: ['Region 1'],
				applicant: { firstName: 'John', lastName: 'Doe' },
				applicantAddress: { addressLine1: '123 Street' }
			};
			const mockCase = { id: 1, ...caseInfo };
			databaseConnector.case.create.mockResolvedValue(mockCase);

			const result = await createApplication(caseInfo);

			expect(databaseConnector.case.create).toHaveBeenCalledWith(
				expect.objectContaining({
					data: expect.objectContaining({
						...caseInfo.caseDetails,
						gridReference: { create: caseInfo.gridReference },
						ApplicationDetails: expect.objectContaining({
							create: expect.objectContaining({
								...caseInfo.applicationDetails,
								subSector: { connect: { name: caseInfo.subSectorName } },
								zoomLevel: { connect: { name: caseInfo.mapZoomLevelName } },
								regions: {
									create: expect.arrayContaining([{ region: { connect: { name: 'Region 1' } } }])
								}
							})
						}),
						applicant: expect.objectContaining({
							create: expect.objectContaining({
								...caseInfo.applicant,
								address: { create: caseInfo.applicantAddress }
							})
						}),
						CaseStatus: { create: { status: 'draft' } }
					})
				})
			);
			expect(result).toEqual(mockCase);
		});
	});

	describe('updateApplication', () => {
		it('should update an existing application', async () => {
			const caseInfo = {
				caseId: 1,
				caseDetails: { title: 'Updated Case' },
				gridReference: { easting: 123, northing: 456 },
				applicationDetails: { locationDescription: 'Updated Location' },
				mapZoomLevelName: 'Level 2',
				subSectorName: 'Updated Sub Sector',
				regionNames: ['Updated Region'],
				applicant: { firstName: 'Jane', lastName: 'Doe' },
				applicantAddress: { addressLine1: '456 Avenue' },
				hasUnpublishedChanges: true,
				isMaterialChange: false
			};
			const mockCase = { id: 1, ...caseInfo };
			databaseConnector.case.findUnique.mockResolvedValue(mockCase);
			databaseConnector.case.update.mockResolvedValue(mockCase);

			const result = await updateApplication(caseInfo);
			expect(result).toEqual(mockCase);
		});
	});

	describe('publishCase', () => {
		it('should publish a case', async () => {
			const caseId = 1;
			const mockCase = {
				id: caseId,
				hasUnpublishedChanges: false,
				CasePublishedState: { isPublished: true }
			};
			databaseConnector.case.update.mockResolvedValue(mockCase);
			databaseConnector.case.findUnique.mockResolvedValue(mockCase);

			const result = await publishCase({ caseId });

			expect(databaseConnector.case.update).toHaveBeenCalledWith(
				expect.objectContaining({
					where: { id: caseId },
					data: expect.objectContaining({
						hasUnpublishedChanges: false,
						CasePublishedState: { create: { isPublished: true } }
					})
				})
			);
			expect(result).toEqual(mockCase);
		});
	});

	describe('unpublishCase', () => {
		it('should unpublish a case', async () => {
			const caseId = 1;
			const mockCase = { id: caseId, CasePublishedState: { isPublished: false } };
			databaseConnector.case.update.mockResolvedValue(mockCase);
			databaseConnector.case.findUnique.mockResolvedValue(mockCase);

			const result = await unpublishCase({ caseId });

			expect(databaseConnector.case.update).toHaveBeenCalledWith(
				expect.objectContaining({
					where: { id: caseId },
					data: expect.objectContaining({
						CasePublishedState: { create: { isPublished: false } }
					})
				})
			);
			expect(result).toEqual(mockCase);
		});
	});

	describe('getById', () => {
		it('should fetch a case by ID', async () => {
			const caseId = 1;
			const mockCase = { id: caseId, title: 'Test Case' };
			databaseConnector.case.findUnique.mockResolvedValue(mockCase);

			const result = await getById(caseId, {});

			expect(databaseConnector.case.findUnique).toHaveBeenCalledWith(
				expect.objectContaining({
					where: { id: caseId }
				})
			);
			expect(result).toEqual(mockCase);
		});
	});

	describe('getByRef', () => {
		it('should fetch a case by reference', async () => {
			const reference = 'CASE123';
			const mockCase = { id: 1, reference };
			databaseConnector.case.findFirst.mockResolvedValue(mockCase);

			const result = await getByRef(reference);

			expect(databaseConnector.case.findFirst).toHaveBeenCalledWith(
				expect.objectContaining({
					where: { reference }
				})
			);
			expect(result).toEqual(mockCase);
		});
	});

	describe('updateApplicationStatusAndDataById', () => {
		it('should update application status and data by ID', async () => {
			const caseId = 1;
			const applicationDetailsId = 1;
			const updateData = {
				status: 'submitted',
				data: { regionNames: ['Region 1'] },
				currentStatuses: [{ id: 1, status: 'draft' }],
				setReference: false
			};
			const additionalTransactions = [];
			const mockCase = { id: caseId, title: 'Test Case' };

			const result = await updateApplicationStatusAndDataById(
				caseId,
				applicationDetailsId,
				updateData,
				additionalTransactions
			);

			expect(result).toEqual(mockCase);
		});
	});
});
