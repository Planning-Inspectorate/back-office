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

const mockServiceUserFindUnique = jest.fn().mockResolvedValue({});
const mockServiceUserFindFirst = jest.fn().mockResolvedValue({});
const mockServiceUserCreate = jest.fn().mockResolvedValue({});
const mockServiceUserUpdate = jest.fn().mockResolvedValue({});

const mockExecuteRawUnsafe = jest.fn().mockResolvedValue({});

const mockDocumentFindUnique = jest.fn().mockResolvedValue({});
const mockDocumentUpdate = jest.fn().mockResolvedValue({});
const mockDocumentUpsert = jest.fn().mockResolvedValue({});
const mockDocumentCreate = jest.fn().mockResolvedValue({});
const mockDocumentFindFirst = jest.fn().mockResolvedValue({});
const mockDocumentFindMany = jest.fn().mockResolvedValue({});
const mockDocumentCount = jest.fn().mockResolvedValue({});
const mockDocumentDelete = jest.fn().mockResolvedValue({});
const mockDocumentVersionCreate = jest.fn().mockResolvedValue({});
const mockDocumentMetdataFindFirst = jest.fn().mockResolvedValue({});
const mockDocumentMetdataFindUnique = jest.fn().mockResolvedValue({});
const mockDocumentMetdataFindMany = jest.fn().mockResolvedValue({});
const mockDocumentMetdataUpsert = jest.fn().mockResolvedValue({});
const mockDocumentMetdataUpdate = jest.fn().mockResolvedValue({});

const mockDocumentActivityLog = jest.fn().mockResolvedValue({});

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
const mockRepresentationGroupBy = jest.fn().mockResolvedValue({});
const mockRepresentationFindMany = jest.fn().mockResolvedValue({});
const mockRepresentationFindFirst = jest.fn().mockResolvedValue({});
const mockRepresentationFindUnique = jest.fn().mockResolvedValue({});
const mockRepresentationCreate = jest.fn().mockResolvedValue({});
const mockRepresentationUpdate = jest.fn().mockResolvedValue({});
const mockRepresentationUpdateMany = jest.fn().mockResolvedValue({});
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

const mockS51AdviceFindUnique = jest.fn().mockResolvedValue({});
const mockS51AdviceFindMany = jest.fn().mockResolvedValue({});
const mockS51AdviceCount = jest.fn().mockResolvedValue({});
const mockS51AdviceCreate = jest.fn().mockResolvedValue({});
const mockS51AdviceUpdate = jest.fn().mockResolvedValue({});
const mockS51AdviceUpdateMany = jest.fn().mockResolvedValue({});
const mockS51AdviceDelete = jest.fn().mockResolvedValue({});

const mockS51AdviceDocumentFindUnique = jest.fn().mockResolvedValue({});
const mockS51AdviceDocumentFindMany = jest.fn().mockResolvedValue({});
const mockS51AdviceDocumentCount = jest.fn().mockResolvedValue({});
const mockS51AdviceDocumentCreate = jest.fn().mockResolvedValue({});
const mockS51AdviceDocumentUpdateMany = jest.fn().mockResolvedValue({});
const mockS51AdviceDocumentDelete = jest.fn().mockResolvedValue({});

const mockProjectTeamFindUnique = jest.fn().mockResolvedValue({});
const mockProjectTeamFindMany = jest.fn().mockResolvedValue({});
const mockProjectTeamDelete = jest.fn().mockResolvedValue({});

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
			upsert: mockDocumentUpsert,
			create: mockDocumentCreate
		};
	}

	get documentVersion() {
		return {
			create: mockDocumentVersionCreate,
			findFirst: mockDocumentMetdataFindFirst,
			findUnique: mockDocumentMetdataFindUnique,
			findMany: mockDocumentMetdataFindMany,
			upsert: mockDocumentMetdataUpsert,
			update: mockDocumentMetdataUpdate
		};
	}

	get documentActivityLog() {
		return {
			create: mockDocumentActivityLog
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

	get s51Advice() {
		return {
			findMany: mockS51AdviceFindMany,
			findUnique: mockS51AdviceFindUnique,
			count: mockS51AdviceCount,
			create: mockS51AdviceCreate,
			update: mockS51AdviceUpdate,
			updateMany: mockS51AdviceUpdateMany,
			delete: mockS51AdviceDelete
		};
	}

	get s51AdviceDocument() {
		return {
			findMany: mockS51AdviceDocumentFindMany,
			findUnique: mockS51AdviceDocumentFindUnique,
			count: mockS51AdviceDocumentCount,
			create: mockS51AdviceDocumentCreate,
			updateMany: mockS51AdviceDocumentUpdateMany,
			delete: mockS51AdviceDocumentDelete
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

	get projectTeam() {
		return {
			findMany: mockProjectTeamFindMany,
			findUnique: mockProjectTeamFindUnique,
			delete: mockProjectTeamDelete
		};
	}

	get serviceUser() {
		return {
			findUnique: mockServiceUserFindUnique,
			findFirst: mockServiceUserFindFirst,
			create: mockServiceUserCreate,
			update: mockServiceUserUpdate
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
			groupBy: mockRepresentationGroupBy,
			findMany: mockRepresentationFindMany,
			findFirst: mockRepresentationFindFirst,
			findUnique: mockRepresentationFindUnique,
			create: mockRepresentationCreate,
			update: mockRepresentationUpdate,
			updateMany: mockRepresentationUpdateMany
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
		count: jest.fn().mockResolvedValue(0),
		findUnique: jest.fn(),
		findFirst: jest.fn(),
		findMany: jest.fn().mockResolvedValue([])
	};

	projectUpdate = {
		create: jest.fn(),
		update: jest.fn(),
		delete: jest.fn(),
		count: jest.fn().mockResolvedValue(0),
		findMany: jest.fn().mockResolvedValue([]),
		findUnique: jest.fn()
	};

	projectUpdateNotificationLog = {
		createMany: jest.fn(),
		count: jest.fn().mockResolvedValue(0),
		findMany: jest.fn().mockResolvedValue([])
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

jest.unstable_mockModule('./src/server/applications/_utils/batch-send-events.js', () => ({
	batchSendEvents: jest.fn()
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

jest.unstable_mockModule('./src/server/utils/prisma-instrumentation.js', () => ({
	initialisePrismaInstrumentation: jest.fn()
}));

process.env.APPLICATIONINSIGHTS_CONNECTION_STRING = 'test-string';
