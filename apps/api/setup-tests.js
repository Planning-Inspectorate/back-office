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
const mockAppealCount = jest.fn().mockResolvedValue(0);
const mockAppealTimetableUpsert = jest.fn().mockResolvedValue(0);
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
const mockFolderFindFirst = jest.fn().mockResolvedValue({});
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
const mockRepresentationFindFirst = jest.fn().mockResolvedValue({});
const mockRepresentationCreate = jest.fn().mockResolvedValue({});
const mockRepresentationUpdate = jest.fn().mockResolvedValue({});
const mockRepresentationContactUpdate = jest.fn().mockResolvedValue({});
const mockRepresentationContactFindFirst = jest.fn().mockResolvedValue({});
const mockRepresentationContactDelete = jest.fn().mockResolvedValue({});
const mockRepresentationActionCreate = jest.fn().mockResolvedValue({});
const mockRepresentationAttachmentCreate = jest.fn().mockResolvedValue({});
const mockExaminationTimetableTypeFindUnique = jest.fn().mockResolvedValue({});
const mockExaminationTimetableTypeFindMany = jest.fn().mockResolvedValue({});
const mockExaminationTimetableItemFindUnique = jest.fn().mockResolvedValue({});
const mockExaminationTimetableItemFindMany = jest.fn().mockResolvedValue({});
const mockExaminationTimetableItemCreate = jest.fn().mockResolvedValue({});
const mockExaminationTimetableItemUpdateMany = jest.fn().mockResolvedValue({});
const mockExaminationTimetableItemDelete = jest.fn().mockResolvedValue({});
const mockAddressDelete = jest.fn().mockResolvedValue({});
const mockAppellantCaseIncompleteReasonFindMany = jest.fn().mockResolvedValue({});
const mockAppellantCaseIncompleteReasonOnAppellantCaseDeleteMany = jest.fn().mockResolvedValue({});
const mockAppellantCaseIncompleteReasonOnAppellantCaseCreateMany = jest.fn().mockResolvedValue({});
const mockAppellantCaseInvalidReasonFindMany = jest.fn().mockResolvedValue({});
const mockAppellantCaseInvalidReasonOnAppellantCaseDeleteMany = jest.fn().mockResolvedValue({});
const mockAppellantCaseInvalidReasonOnAppellantCaseCreateMany = jest.fn().mockResolvedValue({});
const mockValidationOutcomeFindMany = jest.fn().mockResolvedValue({});
const mockValidationOutcomeFindUnique = jest.fn().mockResolvedValue({});
const mockAppellantCaseUpdate = jest.fn().mockResolvedValue({});

class MockPrismaClient {
	get address() {
		return {
			delete: mockAddressDelete
		};
	}
	get appeal() {
		return {
			findUnique: mockAppealFindUnique,
			update: mockAppealUpdate,
			findMany: mockAppealFindMany,
			count: mockAppealCount
		};
	}

	get appealStatus() {
		return {
			updateMany: mockAppealStatusUpdateMany,
			create: mockAppealStatusCreate,
			createMany: mockAppealStatusCreateMany
		};
	}

	get appealTimetable() {
		return {
			upsert: mockAppealTimetableUpsert
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
			updateMany: mockFolderUpdateMany,
			findFirst: mockFolderFindFirst
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
			updateMany: mockExaminationTimetableItemUpdateMany,
			delete: mockExaminationTimetableItemDelete
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
			create: mockRepresentationAttachmentCreate
		};
	}

	get representationAction() {
		return {
			create: mockRepresentationActionCreate
		};
	}

	get appellantCaseIncompleteReason() {
		return {
			findMany: mockAppellantCaseIncompleteReasonFindMany
		};
	}

	get appellantCaseInvalidReason() {
		return {
			findMany: mockAppellantCaseInvalidReasonFindMany
		};
	}

	get validationOutcome() {
		return {
			findMany: mockValidationOutcomeFindMany,
			findUnique: mockValidationOutcomeFindUnique
		};
	}

	get appellantCase() {
		return {
			update: mockAppellantCaseUpdate
		};
	}

	get appellantCaseIncompleteReasonOnAppellantCase() {
		return {
			deleteMany: mockAppellantCaseIncompleteReasonOnAppellantCaseDeleteMany,
			createMany: mockAppellantCaseIncompleteReasonOnAppellantCaseCreateMany
		};
	}

	get appellantCaseInvalidReasonOnAppellantCase() {
		return {
			deleteMany: mockAppellantCaseInvalidReasonOnAppellantCaseDeleteMany,
			createMany: mockAppellantCaseInvalidReasonOnAppellantCaseCreateMany
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
