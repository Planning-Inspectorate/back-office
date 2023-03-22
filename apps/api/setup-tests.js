// @ts-nocheck
import { jest } from '@jest/globals';

const mockCaseFindUnique = jest.fn().mockResolvedValue({});
const mockCaseUpdate = jest.fn().mockResolvedValue({});
const mockApplicationDetailsFindUnique = jest.fn().mockResolvedValue({});
const mockZoomLevelFindUnique = jest.fn().mockResolvedValue({});
const mockSubSectorFindUnique = jest.fn().mockResolvedValue({});
const mockServiceCustomerFindUnique = jest.fn().mockResolvedValue({});
const mockRegionFindUnique = jest.fn().mockResolvedValue({});
const mockRegionsOnApplicationDetailsDeleteMany = jest.fn().mockResolvedValue({});
const mockAppealFindUnique = jest.fn().mockResolvedValue({});
const mocklPAQuestionnaireCreate = jest.fn().mockResolvedValue({});
const mockAppealStatusUpdateMany = jest.fn().mockResolvedValue({});
const mockAppealStatusCreate = jest.fn().mockResolvedValue({});
const mockAppealUpdate = jest.fn().mockResolvedValue({});
const mockValidationDecisionCreate = jest.fn().mockResolvedValue({});
const mockAppealStatusCreateMany = jest.fn().mockResolvedValue({});
const mockAppealFindMany = jest.fn().mockResolvedValue({});
const mockReviewQuestionnaireCreate = jest.fn().mockResolvedValue({});
const mockCaseCreate = jest.fn().mockResolvedValue({});
const mockFolderCreate = jest.fn().mockResolvedValue({});
const mockCaseUpdateMany = jest.fn().mockResolvedValue({});
const mockFolderUpdateMany = jest.fn().mockResolvedValue({});
const mockRegionsOnApplicationDetailsUpdateMany = jest.fn().mockResolvedValue({});
const mockCaseStatusUpdateMany = jest.fn().mockResolvedValue({});
const mockCaseStatusCreate = jest.fn().mockResolvedValue({});
const mockExecuteRawUnsafe = jest.fn().mockResolvedValue({});
const mockDocumentFindUnique = jest.fn().mockResolvedValue({});
const mockDocumentUpdate = jest.fn().mockResolvedValue({});
const mockFolderFindUnique = jest.fn().mockResolvedValue({});
const mockDocumentUpsert = jest.fn().mockResolvedValue({});
const mockFolderFindMany = jest.fn().mockResolvedValue({});
const mockDocumentFindMany = jest.fn().mockResolvedValue({});
const mockDocumentCount = jest.fn().mockResolvedValue({});
const mockCaseFindMany = jest.fn().mockResolvedValue({});
const mockRegionFindMany = jest.fn().mockResolvedValue({});
const mockCaseCount = jest.fn().mockResolvedValue({});
const mockSectorFindUnique = jest.fn().mockResolvedValue({});
const mockSectorFindMany = jest.fn().mockResolvedValue({});
const mockSubSectorFindMany = jest.fn().mockResolvedValue({});
const mockZoomLevelFindMany = jest.fn().mockResolvedValue({});
const mockDocumentFindFirst = jest.fn().mockResolvedValue({});
const mockDocumentDelete = jest.fn().mockResolvedValue({});
const mockDocumentVersionCreate = jest.fn().mockResolvedValue({});
const mockDocumentMetdataFindFirst = jest.fn().mockResolvedValue({});
const mockDocumentMetdataFindUnique = jest.fn().mockResolvedValue({});
const mockDocumentMetdataUpsert = jest.fn().mockResolvedValue({});
const mockDocumentMetdataUpdate = jest.fn().mockResolvedValue({});
const mockRepresentationCount = jest.fn().mockResolvedValue({});
const mockRepresentationFindMany = jest.fn().mockResolvedValue({});

class MockPrismaClient {
	get appeal() {
		return {
			findUnique: mockAppealFindUnique,
			update: mockAppealUpdate,
			findMany: mockAppealFindMany
		};
	}

	get appealStatus() {
		return {
			updateMany: mockAppealStatusUpdateMany,
			create: mockAppealStatusCreate,
			createMany: mockAppealStatusCreateMany
		};
	}

	get reviewQuestionnaire() {
		return {
			create: mockReviewQuestionnaireCreate
		};
	}

	get lPAQuestionnaire() {
		return {
			create: mocklPAQuestionnaireCreate
		};
	}

	get validationDecision() {
		return {
			create: mockValidationDecisionCreate
		};
	}

	get caseStatus() {
		return {
			updateMany: mockCaseStatusUpdateMany,
			create: mockCaseStatusCreate
		};
	}

	get case() {
		return {
			findMany: mockCaseFindMany,
			findUnique: mockCaseFindUnique,
			update: mockCaseUpdate,
			create: mockCaseCreate,
			count: mockCaseCount,
			updateMany: mockCaseUpdateMany
		};
	}

	get applicationDetails() {
		return {
			findUnique: mockApplicationDetailsFindUnique
		};
	}

	get document() {
		return {
			delete: mockDocumentDelete,
			findFirst: mockDocumentFindFirst,
			count: mockDocumentCount,
			findUnique: mockDocumentFindUnique,
			findMany: mockDocumentFindMany,
			update: mockDocumentUpdate,
			upsert: mockDocumentUpsert
		};
	}

	get documentVersion() {
		return {
			create: mockDocumentVersionCreate,
			findFirst: mockDocumentMetdataFindFirst,
			findUnique: mockDocumentMetdataFindUnique,
			upsert: mockDocumentMetdataUpsert,
			update: mockDocumentMetdataUpdate
		};
	}

	get folder() {
		return {
			findUnique: mockFolderFindUnique,
			findMany: mockFolderFindMany,
			create: mockFolderCreate,
			updateMany: mockFolderUpdateMany
		};
	}

	get zoomLevel() {
		return {
			findMany: mockZoomLevelFindMany,
			findUnique: mockZoomLevelFindUnique
		};
	}

	get sector() {
		return {
			findUnique: mockSectorFindUnique,
			findMany: mockSectorFindMany
		};
	}

	get subSector() {
		return {
			findMany: mockSubSectorFindMany,
			findUnique: mockSubSectorFindUnique
		};
	}

	get serviceCustomer() {
		return {
			findUnique: mockServiceCustomerFindUnique
		};
	}

	get region() {
		return {
			findUnique: mockRegionFindUnique,
			findMany: mockRegionFindMany
		};
	}

	get regionsOnApplicationDetails() {
		return {
			deleteMany: mockRegionsOnApplicationDetailsDeleteMany,
			updateMany: mockRegionsOnApplicationDetailsUpdateMany
		};
	}

	get representation() {
		return {
			count: mockRepresentationCount,
			findMany: mockRepresentationFindMany
		};
	}

	$transaction(queries = []) {
		return Promise.all(queries);
	}
}

const mockPrismaUse = jest.fn().mockResolvedValue();

MockPrismaClient.prototype.$executeRawUnsafe = mockExecuteRawUnsafe;
MockPrismaClient.prototype.$use = mockPrismaUse;

class MockPrisma {}

jest.unstable_mockModule('@prisma/client', () => ({
	PrismaClient: MockPrismaClient,
	Prisma: MockPrisma,
	default: {
		// PrismaClient: MockPrismaClient,
		// Prisma: MockPrisma
	}
}));

jest.unstable_mockModule('jwks-rsa', () => ({
	default: jest.fn().mockImplementation(() => ({
		getSigningKey: () => ({ getPublicKey: () => 'string' })
	}))
}));

const mockSendEvents = jest.fn();

jest.unstable_mockModule('./src/server/infrastructure/event-client.js', () => ({
	eventClient: {
		sendEvents: mockSendEvents
	}
}));

const mockGotGet = jest.fn();
const mockGotPost = jest.fn();

jest.unstable_mockModule('jsonwebtoken', () => ({
	default: {
		decode: jest.fn(),
		verify: jest.fn()
	}
}));

jest.unstable_mockModule('got', () => ({
	default: {
		get: mockGotGet,
		post: mockGotPost
	}
}));
