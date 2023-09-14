// @ts-nocheck
import { jest } from '@jest/globals';
import config from '#config/config.js';
import { NODE_ENV_PRODUCTION } from '#endpoints/constants.js';

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
const mocklPAQuestionnaireUpdate = jest.fn().mockResolvedValue({});
const mockAppealStatusUpdateMany = jest.fn().mockResolvedValue({});
const mockAppealStatusCreate = jest.fn().mockResolvedValue({});
const mockAppealUpdate = jest.fn().mockResolvedValue({});
const mockValidationDecisionCreate = jest.fn().mockResolvedValue({});
const mockAppealStatusCreateMany = jest.fn().mockResolvedValue({});
const mockAppealFindMany = jest.fn().mockResolvedValue({});
const mockAppealCount = jest.fn().mockResolvedValue(0);
const mockAppealTimetableUpsert = jest.fn().mockResolvedValue(0);
const mockAppealTimetableUpdate = jest.fn().mockResolvedValue(0);
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
const mockExaminationTimetableTypeFindUnique = jest.fn().mockResolvedValue({});
const mockExaminationTimetableTypeFindMany = jest.fn().mockResolvedValue({});
const mockExaminationTimetableItemFindUnique = jest.fn().mockResolvedValue({});
const mockExaminationTimetableItemFindMany = jest.fn().mockResolvedValue({});
const mockExaminationTimetableItemCreate = jest.fn().mockResolvedValue({});
const mockExaminationTimetableItemUpdateMany = jest.fn().mockResolvedValue({});
const mockExaminationTimetableItemDelete = jest.fn().mockResolvedValue({});
const mockAddressDelete = jest.fn().mockResolvedValue({});
const mockAddressUpdate = jest.fn().mockResolvedValue({});
const mockAppellantCaseIncompleteReasonFindMany = jest.fn().mockResolvedValue({});
const mockAppellantCaseIncompleteReasonOnAppellantCaseDeleteMany = jest.fn().mockResolvedValue({});
const mockAppellantCaseIncompleteReasonOnAppellantCaseCreateMany = jest.fn().mockResolvedValue({});
const mockAppellantCaseInvalidReasonFindMany = jest.fn().mockResolvedValue({});
const mockAppellantCaseInvalidReasonOnAppellantCaseDeleteMany = jest.fn().mockResolvedValue({});
const mockAppellantCaseInvalidReasonOnAppellantCaseCreateMany = jest.fn().mockResolvedValue({});
const mockAppellantCaseValidationOutcomeFindMany = jest.fn().mockResolvedValue({});
const mockAppellantCaseValidationOutcomeFindUnique = jest.fn().mockResolvedValue({});
const mockAppellantCaseUpdate = jest.fn().mockResolvedValue({});
const mockLPAQuestionnaireValidationOutcomeFindMany = jest.fn().mockResolvedValue({});
const mockLPAQuestionnaireValidationOutcomeFindUnique = jest.fn().mockResolvedValue({});
const mockLPAQuestionnaireIncompleteReasonFindUnique = jest.fn().mockResolvedValue({});
const mockLPAQuestionnaireIncompleteReasonFindMany = jest.fn().mockResolvedValue({});
const mockLPAQuestionnaireIncompleteReasonOnLPAQuestionnaireDeleteMany = jest
	.fn()
	.mockResolvedValue({});
const mockLPAQuestionnaireIncompleteReasonOnLPAQuestionnaireCreateMany = jest
	.fn()
	.mockResolvedValue({});
const mockLPAQuestionnaireIncompleteReasonOnLPAQuestionnaireUpdate = jest
	.fn()
	.mockResolvedValue({});
const mockSiteVisitCreate = jest.fn().mockResolvedValue({});
const mockSiteVisitUpdate = jest.fn().mockResolvedValue({});
const mockSiteVisitTypeFindUnique = jest.fn().mockResolvedValue({});
const mockSiteVisitTypeFindMany = jest.fn().mockResolvedValue({});
const mockSpecialismsFindUnique = jest.fn().mockResolvedValue({});
const mockAppealAllocationUpsert = jest.fn().mockResolvedValue({});
const mockAppealSpecialismDeleteMany = jest.fn().mockResolvedValue({});
const mockAppealSpecialismCreateMany = jest.fn().mockResolvedValue({});
const mockDesignatedSiteFindMany = jest.fn().mockResolvedValue({});
const mockKnowledgeOfOtherLandownersFindMany = jest.fn().mockResolvedValue({});
const mockLPANotificationMethodsFindMany = jest.fn().mockResolvedValue({});
const mockPlanningObligationStatusFindMany = jest.fn().mockResolvedValue({});
const mockProcedureTypeFindMany = jest.fn().mockResolvedValue({});
const mockScheduleTypeFindMany = jest.fn().mockResolvedValue({});
const mockAppellantUpdate = jest.fn().mockResolvedValue({});
const mockDesignatedSitesOnLPAQuestionnairesCreateMany = jest.fn().mockResolvedValue({});
const mockDesignatedSitesOnLPAQuestionnairesDeleteMany = jest.fn().mockResolvedValue({});
const mockUserUpsert = jest.fn().mockResolvedValue({});
const mockAppellantCaseIncompleteReasonTextDeleteMany = jest.fn().mockResolvedValue({});
const mockAppellantCaseIncompleteReasonTextCreateMany = jest.fn().mockResolvedValue({});
const mockAppellantCaseInvalidReasonTextDeleteMany = jest.fn().mockResolvedValue({});
const mockAppellantCaseInvalidReasonTextCreateMany = jest.fn().mockResolvedValue({});
const mockLPAQuestionnaireIncompleteReasonTextDeleteMany = jest.fn().mockResolvedValue({});
const mockLPAQuestionnaireIncompleteReasonTextCreateMany = jest.fn().mockResolvedValue({});

class MockPrismaClient {
	get address() {
		return {
			delete: mockAddressDelete,
			update: mockAddressUpdate
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
			upsert: mockAppealTimetableUpsert,
			update: mockAppealTimetableUpdate
		};
	}

	get reviewQuestionnaire() {
		return {
			create: mockReviewQuestionnaireCreate
		};
	}

	get lPAQuestionnaire() {
		return {
			create: mocklPAQuestionnaireCreate,
			update: mocklPAQuestionnaireUpdate
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

	get appellantCaseValidationOutcome() {
		return {
			findMany: mockAppellantCaseValidationOutcomeFindMany,
			findUnique: mockAppellantCaseValidationOutcomeFindUnique
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

	get lPAQuestionnaireValidationOutcome() {
		return {
			findMany: mockLPAQuestionnaireValidationOutcomeFindMany,
			findUnique: mockLPAQuestionnaireValidationOutcomeFindUnique
		};
	}

	get lPAQuestionnaireIncompleteReason() {
		return {
			findUnique: mockLPAQuestionnaireIncompleteReasonFindUnique,
			findMany: mockLPAQuestionnaireIncompleteReasonFindMany
		};
	}

	get lPAQuestionnaireIncompleteReasonOnLPAQuestionnaire() {
		return {
			deleteMany: mockLPAQuestionnaireIncompleteReasonOnLPAQuestionnaireDeleteMany,
			createMany: mockLPAQuestionnaireIncompleteReasonOnLPAQuestionnaireCreateMany,
			update: mockLPAQuestionnaireIncompleteReasonOnLPAQuestionnaireUpdate
		};
	}

	get siteVisit() {
		return {
			create: mockSiteVisitCreate,
			update: mockSiteVisitUpdate
		};
	}

	get siteVisitType() {
		return {
			findUnique: mockSiteVisitTypeFindUnique,
			findMany: mockSiteVisitTypeFindMany
		};
	}

	get specialism() {
		return {
			findMany: mockSpecialismsFindUnique
		};
	}

	get appealSpecialism() {
		return {
			deleteMany: mockAppealSpecialismDeleteMany,
			createMany: mockAppealSpecialismCreateMany
		};
	}

	get appealAllocation() {
		return {
			upsert: mockAppealAllocationUpsert
		};
	}

	get designatedSite() {
		return {
			findMany: mockDesignatedSiteFindMany
		};
	}

	get knowledgeOfOtherLandowners() {
		return {
			findMany: mockKnowledgeOfOtherLandownersFindMany
		};
	}

	get lPANotificationMethods() {
		return {
			findMany: mockLPANotificationMethodsFindMany
		};
	}

	get planningObligationStatus() {
		return {
			findMany: mockPlanningObligationStatusFindMany
		};
	}

	get procedureType() {
		return {
			findMany: mockProcedureTypeFindMany
		};
	}

	get scheduleType() {
		return {
			findMany: mockScheduleTypeFindMany
		};
	}

	get appellant() {
		return {
			update: mockAppellantUpdate
		};
	}

	get designatedSitesOnLPAQuestionnaires() {
		return {
			createMany: mockDesignatedSitesOnLPAQuestionnairesCreateMany,
			deleteMany: mockDesignatedSitesOnLPAQuestionnairesDeleteMany
		};
	}

	get user() {
		return {
			upsert: mockUserUpsert
		};
	}

	get appellantCaseIncompleteReasonText() {
		return {
			deleteMany: mockAppellantCaseIncompleteReasonTextDeleteMany,
			createMany: mockAppellantCaseIncompleteReasonTextCreateMany
		};
	}

	get appellantCaseInvalidReasonText() {
		return {
			deleteMany: mockAppellantCaseInvalidReasonTextDeleteMany,
			createMany: mockAppellantCaseInvalidReasonTextCreateMany
		};
	}

	get lPAQuestionnaireIncompleteReasonText() {
		return {
			deleteMany: mockLPAQuestionnaireIncompleteReasonTextDeleteMany,
			createMany: mockLPAQuestionnaireIncompleteReasonTextCreateMany
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

jest.unstable_mockModule('#db-client', () => ({
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
const mockSendEmail = jest.fn();

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

jest.unstable_mockModule('notifications-node-client', () => ({
	NotifyClient: class {
		sendEmail = mockSendEmail;
	}
}));

jest.unstable_mockModule('./src/server/config/config.js', () => ({
	default: {
		...config,
		NODE_ENV: NODE_ENV_PRODUCTION,
		govNotify: {
			...config.govNotify,
			testMailbox: '',
			api: {
				key: 'gov-notify-api-key-123'
			}
		}
	}
}));
