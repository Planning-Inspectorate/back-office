// @ts-nocheck
import { jest } from '@jest/globals';

const mockCaseFindUnique = jest.fn().mockResolvedValue({});
const mockCaseUpdate = jest.fn().mockResolvedValue({});
const mockCaseCreate = jest.fn().mockResolvedValue({});
const mockCaseUpdateMany = jest.fn().mockResolvedValue({});
const mockCaseStatusUpdateMany = jest.fn().mockResolvedValue({});
const mockCaseStatusCreate = jest.fn().mockResolvedValue({});
const mockCaseFindMany = jest.fn().mockResolvedValue({});
const mockCaseCount = jest.fn().mockResolvedValue({});

const mockApplicationDetailsFindUnique = jest.fn().mockResolvedValue({});
const mockServiceCustomerFindUnique = jest.fn().mockResolvedValue({});

const mockExecuteRawUnsafe = jest.fn().mockResolvedValue({});

const mockDocumentFindUnique = jest.fn().mockResolvedValue({});
const mockDocumentUpdate = jest.fn().mockResolvedValue({});
const mockDocumentUpsert = jest.fn().mockResolvedValue({});
const mockDocumentFindFirst = jest.fn().mockResolvedValue({});
const mockDocumentFindMany = jest.fn().mockResolvedValue({});
const mockDocumentCount = jest.fn().mockResolvedValue({});
const mockDocumentDelete = jest.fn().mockResolvedValue({});
const mockDocumentVersionCreate = jest.fn().mockResolvedValue({});
const mockDocumentMetdataFindFirst = jest.fn().mockResolvedValue({});
const mockDocumentMetdataFindUnique = jest.fn().mockResolvedValue({});
const mockDocumentMetdataUpsert = jest.fn().mockResolvedValue({});
const mockDocumentMetdataUpdate = jest.fn().mockResolvedValue({});

const mockFolderCreate = jest.fn().mockResolvedValue({});
const mockFolderUpdate = jest.fn().mockResolvedValue({});
const mockFolderUpdateMany = jest.fn().mockResolvedValue({});
const mockFolderFindUnique = jest.fn().mockResolvedValue({});
const mockFolderFindFirst = jest.fn().mockResolvedValue({});
const mockFolderFindMany = jest.fn().mockResolvedValue({});
const mockFolderDeleteMany = jest.fn().mockResolvedValue({});
const mockFolderDelete = jest.fn().mockResolvedValue({});

const mockRegionFindMany = jest.fn().mockResolvedValue({});
const mockRegionFindUnique = jest.fn().mockResolvedValue({});
const mockRegionsOnApplicationDetailsUpdateMany = jest.fn().mockResolvedValue({});
const mockRegionsOnApplicationDetailsDeleteMany = jest.fn().mockResolvedValue({});

const mockSectorFindUnique = jest.fn().mockResolvedValue({});
const mockSectorFindMany = jest.fn().mockResolvedValue({});
const mockSubSectorFindUnique = jest.fn().mockResolvedValue({});
const mockSubSectorFindMany = jest.fn().mockResolvedValue({});
const mockZoomLevelFindUnique = jest.fn().mockResolvedValue({});
const mockZoomLevelFindMany = jest.fn().mockResolvedValue({});

const mockRepresentationCount = jest.fn().mockResolvedValue({});
const mockRepresentationFindMany = jest.fn().mockResolvedValue({});
const mockRepresentationFindFirst = jest.fn().mockResolvedValue({});
const mockRepresentationCreate = jest.fn().mockResolvedValue({});
const mockRepresentationUpdate = jest.fn().mockResolvedValue({});
const mockRepresentationContactUpdate = jest.fn().mockResolvedValue({});
const mockRepresentationContactFindFirst = jest.fn().mockResolvedValue({});
const mockRepresentationContactDelete = jest.fn().mockResolvedValue({});
const mockRepresentationActionCreate = jest.fn().mockResolvedValue({});
const mockRepresentationAttachmentCreate = jest.fn().mockResolvedValue({});
const mockRepresentationAttachmentFindFirst = jest.fn().mockResolvedValue({});
const mockRepresentationAttachmentDelete = jest.fn().mockResolvedValue({});

const mockExaminationTimetableTypeFindUnique = jest.fn().mockResolvedValue({});
const mockExaminationTimetableTypeFindMany = jest.fn().mockResolvedValue({});
const mockExaminationTimetableItemFindUnique = jest.fn().mockResolvedValue({});
const mockExaminationTimetableItemFindMany = jest.fn().mockResolvedValue({});
const mockExaminationTimetableItemCreate = jest.fn().mockResolvedValue({});
const mockExaminationTimetableItemUpdate = jest.fn().mockResolvedValue({});
const mockExaminationTimetableItemUpdateMany = jest.fn().mockResolvedValue({});
const mockExaminationTimetableItemDelete = jest.fn().mockResolvedValue({});

const mockExaminationTimetableFindUnique = jest.fn().mockResolvedValue({});
const mockExaminationTimetableCreate = jest.fn().mockResolvedValue({});
const mockExaminationTimetableUpdate = jest.fn().mockResolvedValue({});

const mockAddressDelete = jest.fn().mockResolvedValue({});

class MockPrismaClient {
	get address() {
		return {
			delete: mockAddressDelete
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
			update: mockFolderUpdate,
			updateMany: mockFolderUpdateMany,
			findFirst: mockFolderFindFirst,
			deleteMany: mockFolderDeleteMany,
			delete: mockFolderDelete
		};
	}

	get zoomLevel() {
		return {
			findMany: mockZoomLevelFindMany,
			findUnique: mockZoomLevelFindUnique
		};
	}

	get examinationTimetableType() {
		return {
			findMany: mockExaminationTimetableTypeFindMany,
			findUnique: mockExaminationTimetableTypeFindUnique
		};
	}

	get examinationTimetableItem() {
		return {
			findMany: mockExaminationTimetableItemFindMany,
			findUnique: mockExaminationTimetableItemFindUnique,
			create: mockExaminationTimetableItemCreate,
			update: mockExaminationTimetableItemUpdate,
			updateMany: mockExaminationTimetableItemUpdateMany,
			delete: mockExaminationTimetableItemDelete
		};
	}

	get examinationTimetable() {
		return {
			findUnique: mockExaminationTimetableFindUnique,
			create: mockExaminationTimetableCreate,
			update: mockExaminationTimetableUpdate
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
			findMany: mockRepresentationFindMany,
			findFirst: mockRepresentationFindFirst,
			create: mockRepresentationCreate,
			update: mockRepresentationUpdate
		};
	}

	get representationContact() {
		return {
			findFirst: mockRepresentationContactFindFirst,
			update: mockRepresentationContactUpdate,
			delete: mockRepresentationContactDelete
		};
	}
	get representationAttachment() {
		return {
			findFirst: mockRepresentationAttachmentFindFirst,
			create: mockRepresentationAttachmentCreate,
			delete: mockRepresentationAttachmentDelete
		};
	}

	get representationAction() {
		return {
			create: mockRepresentationActionCreate
		};
	}

	subscription = {
		create: jest.fn(),
		update: jest.fn(),
		findUnique: jest.fn()
	};

	projectUpdate = {
		create: jest.fn(),
		update: jest.fn(),
		count: jest.fn().mockResolvedValue(0),
		findMany: jest.fn().mockResolvedValue([]),
		findUnique: jest.fn()
	};

	// see https://www.prisma.io/docs/concepts/components/prisma-client/transactions#the-transaction-api
	$transaction(queries = []) {
		if (typeof queries === 'function') {
			// transactions can be a function, run with an instance of the client
			return queries(this);
		} else {
			// or just an array of queries to run
			return Promise.all(queries);
		}
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
