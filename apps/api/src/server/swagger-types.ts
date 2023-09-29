export type DocumentsToSave = {
	/** @example "document.pdf" */
	documentName?: string;
	/** @example 123 */
	folderId?: number;
	/** @example "application/pdf" */
	documentType?: string;
	/** @example 1024 */
	documentSize?: number;
	/** @example "test-user@email.com" */
	username?: string;
	/** @example false */
	fromFrontOffice?: boolean;
}[];

export interface DocumentToSave {
	/** @example "document.pdf" */
	documentName?: string;
	/** @example 123 */
	folderId?: number;
	/** @example "application/pdf" */
	documentType?: string;
	/** @example 1024 */
	documentSize?: number;
	/** @example "test-user@email.com" */
	username?: string;
}

export interface DocumentsToUpdateRequestBody {
	/** @example "not_checked" */
	status?: string;
	/** @example true */
	redacted?: boolean;
	documents?: {
		/** @example "0084b156-006b-48b1-a47f-e7176414db29" */
		guid?: string;
	}[];
}

export interface DocumentsToPublishRequestBody {
	documents?: {
		/** @example "0084b156-006b-48b1-a47f-e7176414db29" */
		guid?: string;
	}[];
	/** @example "test-user@email.com" */
	username?: string;
}

export interface DocumentsAndBlobStorageURLs {
	/** @example "blob-storage-host" */
	blobStorageHost?: string;
	/** @example "blob-storage-container" */
	privateBlobContainer?: string;
	documents?: {
		/** @example "document.pdf" */
		documentName?: string;
		/** @example "docRef" */
		documentReference?: string;
		/** @example "/some/path/document.pdf" */
		blobStoreUrl?: string;
	}[];
}

export interface PartialDocumentsAndBlobStorageURLs {
	/** @example "blob-storage-host" */
	blobStorageHost?: string;
	/** @example "blob-storage-container" */
	privateBlobContainer?: string;
	documents?: {
		/** @example "document.pdf" */
		documentName?: string;
		/** @example "docRef" */
		documentReference?: string;
		/** @example "/some/path/document.pdf" */
		blobStoreUrl?: string;
	}[];
	/** @example ["example.pdf"] */
	failedDocuments?: string[];
	/** @example ["example2.pdf"] */
	duplicates?: string[];
}

export interface DocumentsUploadFailed {
	/** @example ["example.pdf"] */
	failedDocuments?: string[];
	/** @example ["example2.pdf"] */
	duplicates?: string[];
}

export type DocumentsPublished = {
	/** @example "0084b156-006b-48b1-a47f-e7176414db29" */
	guid?: string;
	/** @example "published" */
	publishedStatus?: string;
}[];

export interface UpdateApplication {
	/** @example "" */
	title?: string;
	/** @example "" */
	description?: string;
	/** @example "" */
	subSectorName?: string;
	/** @example "" */
	caseEmail?: string;
	/** @example "" */
	stage?: string;
	geographicalInformation?: {
		/** @example "" */
		mapZoomLevelName?: string;
		/** @example "" */
		locationDescription?: string;
		/** @example [""] */
		regionNames?: string[];
		gridReference?: {
			/** @example "123456" */
			easting?: string;
			/** @example "098765" */
			northing?: string;
		};
	};
	applicants?: {
		/** @example 1 */
		id?: number;
		/** @example "" */
		organisationName?: string;
		/** @example "" */
		firstName?: string;
		/** @example "" */
		middleName?: string;
		/** @example "" */
		lastName?: string;
		/** @example "" */
		email?: string;
		/** @example "" */
		website?: string;
		/** @example "" */
		phoneNumber?: string;
		address?: {
			/** @example "" */
			addressLine1?: string;
			/** @example "" */
			addressLine2?: string;
			/** @example "" */
			town?: string;
			/** @example "" */
			county?: string;
			/** @example "" */
			postcode?: string;
		};
	}[];
	keyDates?: {
		preApplication?: {
			/** @example "Q1 2023" */
			submissionAtPublished?: string;
			/** @example 123 */
			submissionAtInternal?: number;
		};
	};
	/** @example false */
	hasUnpublishedChanges?: boolean;
}

export interface CreateApplication {
	/** @example "" */
	title?: string;
	/** @example "" */
	description?: string;
	/** @example "" */
	subSectorName?: string;
	/** @example "" */
	caseEmail?: string;
	geographicalInformation?: {
		/** @example "" */
		mapZoomLevelName?: string;
		/** @example "" */
		locationDescription?: string;
		/** @example [""] */
		regionNames?: string[];
		gridReference?: {
			/** @example "123456" */
			easting?: string;
			/** @example "098765" */
			northing?: string;
		};
	};
	applicants?: {
		/** @example "" */
		organisationName?: string;
		/** @example "" */
		firstName?: string;
		/** @example "" */
		middleName?: string;
		/** @example "" */
		lastName?: string;
		/** @example "" */
		email?: string;
		address?: {
			/** @example "" */
			addressLine1?: string;
			/** @example "" */
			addressLine2?: string;
			/** @example "" */
			town?: string;
			/** @example "" */
			county?: string;
			/** @example "" */
			postcode?: string;
		};
		/** @example "" */
		website?: string;
		/** @example "" */
		phoneNumber?: string;
	}[];
	keyDates?: {
		preApplication?: {
			/** @example "Q1 2023" */
			submissionAtPublished?: string;
			/** @example 123 */
			submissionAtInternal?: number;
		};
	};
}

export type Sectors = {
	/** @example "BB" */
	abbreviation?: string;
	/** @example "Sector Name Cy" */
	displayNameCy?: string;
	/** @example "Sector Name En" */
	displayNameEn?: string;
	/** @example "sector" */
	name?: string;
}[];

export type RegionsForApplications = {
	/** @example 1 */
	id?: number;
	/** @example "Region Name" */
	name?: string;
	/** @example "Region Name En" */
	displayNameEn?: string;
	/** @example "Region Name Cy" */
	displayNameCy?: string;
}[];

export type MapZoomLevelForApplications = {
	/** @example 1 */
	id?: number;
	/** @example "Region Name" */
	name?: string;
	/** @example 100 */
	displayOrder?: number;
	/** @example "Region Name En" */
	displayNameEn?: string;
	/** @example "Region Name Cy" */
	displayNameCy?: string;
}[];

export type ExaminationTimetableTypes = {
	/** @example 1 */
	id?: number;
	/** @example "starttime-mandatory" */
	templateType?: string;
	/** @example "Accompanied Site Inspection" */
	name?: string;
	/** @example "Accompanied site inspection" */
	displayNameEn?: string;
	/** @example "Accompanied site inspection Cy" */
	displayNameCy?: string;
}[];

export type ExaminationTimetableItems = {
	/** @example 1 */
	id?: number;
	/** @example 1 */
	caseId?: number;
	/** @example 1 */
	examinationTypeId?: number;
	/** @example "Examination Timetable Item" */
	name?: string;
	/** @example "{"preText":"Examination Timetable Item Description\r\n","bulletPoints":[" Line item 1\r\n"," Line item 2"]}" */
	description?: string;
	/** @example "2023-02-27T10:00:00Z" */
	date?: string;
	/** @example "2023-02-27T10:00:00Z" */
	startDate?: string;
	/** @example false */
	published?: boolean;
	/** @example 134 */
	folderId?: number;
	/** @example "10:20" */
	startTime?: string;
	/** @example "12:20" */
	endTime?: string;
	/** @example true */
	submissions?: boolean;
}[];

export interface ExaminationTimetableItemRequestBody {
	/** @example 1 */
	caseId?: number;
	/** @example 1 */
	examinationTypeId?: number;
	/** @example "Examination Timetable Item" */
	name?: string;
	/** @example "{"preText":"Examination Timetable Item Description\r\n","bulletPoints":[" Line item 1\r\n"," Line item 2"]}" */
	description?: string;
	/** @example "2023-02-27T10:00:00Z" */
	date?: string;
	/** @example false */
	published?: boolean;
	/** @example 134 */
	folderId?: number;
	/** @example "2023-02-27T10:00:00Z" */
	startDate?: string;
	/** @example "10:20" */
	startTime?: string;
	/** @example "12:20" */
	endTime?: string;
}

export interface ExaminationTimetableItemResponseBody {
	/** @example 1 */
	id?: number;
	/** @example 1 */
	caseId?: number;
	/** @example 1 */
	examinationTypeId?: number;
	/** @example "Examination Timetable Item" */
	name?: string;
	/** @example "{"preText":"Examination Timetable Item Description\r\n","bulletPoints":[" Line item 1\r\n"," Line item 2"]}" */
	description?: string;
	/** @example "2023-02-27T10:00:00Z" */
	date?: string;
	/** @example false */
	published?: boolean;
	/** @example 134 */
	folderId?: number;
	/** @example "2023-02-27T10:00:00Z" */
	startDate?: string;
	/** @example "10:20" */
	startTime?: string;
	/** @example "12:20" */
	endTime?: string;
	/** @example true */
	submissions?: boolean;
}

export interface DocumentsPropertiesRequestBody {
	/** @example 1 */
	version?: number;
	/** @example "2023-02-27T10:00:00Z" */
	createdAt?: string;
	/** @example "2023-02-27T12:00:00Z" */
	lastModified?: string;
	/** @example "PDF" */
	documentType?: string;
	/** @example "B123-000001" */
	documentReference?: string;
	/** @example false */
	published?: boolean;
	/** @example "Salesforce" */
	sourceSystem?: string;
	/** @example "Email" */
	origin?: string;
	/** @example "John Doe" */
	representative?: string;
	/** @example "Marketing Brochure" */
	description?: string;
	/** @example "ab12cd34-5678-90ef-ghij-klmnopqrstuv" */
	documentGuid?: string;
	/** @example "2023-03-01T10:00:00Z" */
	datePublished?: string;
	/** @example "Jane Doe" */
	owner?: string;
	/** @example "Marketing Team" */
	author?: string;
	/** @example "Confidential" */
	securityClassification?: string;
	/** @example "application/pdf" */
	mime?: string;
	/** @example "123456789" */
	horizonDataID?: string;
	/** @example "f60c381d96dcedec4b4fb4b9e1f6e14e" */
	fileMD5?: string;
	/** @example "/documents/marketing/ab12cd34-5678-90ef-ghij-klmnopqrstuv.pdf" */
	path?: string;
	/** @example "Clean" */
	virusCheckStatus?: string;
	/** @example 1024 */
	size?: number;
	/** @example 3 */
	stage?: number;
	/** @example "Marketing" */
	filter1?: string;
	/** @example "Brochure" */
	filter2?: string;
	/** @example true */
	fromFrontOffice?: boolean;
}

export interface DocumentsMetadataResponseBody {
	/** @example 1 */
	version?: number;
	/** @example "a6f9f2e0-12c9-49b7-8a1c-3b5edc34dd99" */
	documentId?: string;
	/** @example "" */
	datePublished?: string;
	/** @example "BC0210002" */
	caseRef?: string;
	/** @example "5" */
	documentName?: string;
	/** @example "document-service-uploads" */
	privateBlobContainer?: string;
	/** @example "/application/BC010001/1111-2222-3333/my doc.pdf" */
	privateBlobPath?: string;
	/** @example "joe blogs" */
	from?: string;
	/** @example 1677585578 */
	dateCreated?: number;
	/** @example 0 */
	size?: number;
	/** @example "" */
	fileType?: string;
	/** @example false */
	redacted?: boolean;
	/** @example "awaiting_upload" */
	status?: string;
	/** @example "" */
	description?: string;
	/** @example "" */
	agent?: string;
	/** @example "" */
	documentType?: string;
	/** @example "" */
	webFilter?: string;
}

export type ApplicationsForCaseTeam = {
	/** @example 1 */
	id?: number;
	/** @example 1655298882 */
	modifiedDate?: number;
	/** @example "REFERENCE" */
	reference?: string;
	sector?: {
		/** @example "BB" */
		abbreviation?: string;
		/** @example "Sector Name Cy" */
		displayNameCy?: string;
		/** @example "Sector Name En" */
		displayNameEn?: string;
		/** @example "sector" */
		name?: string;
	};
	subSector?: {
		/** @example "AA" */
		abbreviation?: string;
		/** @example "Sub Sector Name Cy" */
		displayNameCy?: string;
		/** @example "Sub Sector Name En" */
		displayNameEn?: string;
		/** @example "sub_sector" */
		name?: string;
	};
	/** @example "status" */
	status?: string;
}[];

export type ApplicationsForCaseAdminOfficer = {
	/** @example 1 */
	id?: number;
	/** @example 1655298882 */
	modifiedDate?: number;
	/** @example "REFERENCE" */
	reference?: string;
	sector?: {
		/** @example "BB" */
		abbreviation?: string;
		/** @example "Sector Name Cy" */
		displayNameCy?: string;
		/** @example "Sector Name En" */
		displayNameEn?: string;
		/** @example "sector" */
		name?: string;
	};
	subSector?: {
		/** @example "AA" */
		abbreviation?: string;
		/** @example "Sub Sector Name Cy" */
		displayNameCy?: string;
		/** @example "Sub Sector Name En" */
		displayNameEn?: string;
		/** @example "sub_sector" */
		name?: string;
	};
	/** @example "status" */
	status?: string;
}[];

export type ApplicationsForInspector = {
	/** @example 1 */
	id?: number;
	/** @example 1655298882 */
	modifiedDate?: number;
	/** @example "REFERENCE" */
	reference?: string;
	sector?: {
		/** @example "BB" */
		abbreviation?: string;
		/** @example "Sector Name Cy" */
		displayNameCy?: string;
		/** @example "Sector Name En" */
		displayNameEn?: string;
		/** @example "sector" */
		name?: string;
	};
	subSector?: {
		/** @example "AA" */
		abbreviation?: string;
		/** @example "Sub Sector Name Cy" */
		displayNameCy?: string;
		/** @example "Sub Sector Name En" */
		displayNameEn?: string;
		/** @example "sub_sector" */
		name?: string;
	};
	/** @example "status" */
	status?: string;
}[];

export interface ApplicationsForSearchCriteriaRequestBody {
	/** @example "BC" */
	query?: string;
	/** @example "case-team" */
	role?: string;
	/** @example 1 */
	pageNumber?: number;
	/** @example 1 */
	pageSize?: number;
}

export interface ApplicationsForSearchCriteria {
	/** @example 1 */
	page?: number;
	/** @example 1 */
	pageSize?: number;
	/** @example 1 */
	pageCount?: number;
	/** @example 1 */
	itemCount?: number;
	items?: {
		/** @example 3 */
		id?: number;
		/** @example "open" */
		status?: string;
		/** @example "EN010003" */
		reference?: string;
		/** @example "EN010003 - NI Case 3 Name" */
		title?: string;
		/** @example 1655298882 */
		modifiedDate?: number;
		datePublished?: any;
	}[];
}

export interface DocumentsInCriteriaRequestBody {
	/** @example 1 */
	pageNumber?: number;
	/** @example 1 */
	pageSize?: number;
}

export interface DocumentsMetadataRequestBody {
	/** @example "123" */
	documentId?: string;
	/** @example 1 */
	version?: number;
	/** @example "ABC" */
	sourceSystem?: string;
	/** @example "456" */
	documentGuid?: string;
	/** @example "document.pdf" */
	fileName?: string;
	/** @example "2022-12-21T12:42:40.885Z" */
	datePublished?: string;
	/** @example "/documents/123.pdf" */
	privateBlobPath?: string;
	/** @example "my-blob-storage" */
	privateBlobContainer?: string;
	/** @example "John Smith" */
	author?: string;
	/** @example "2022-12-21T12:42:40.885Z" */
	dateCreated?: string;
	/** @example "published" */
	publishedStatus?: string;
	/** @example "not redacted" */
	redactedStatus?: string;
	/** @example 1024 */
	size?: number;
	/** @example "application/pdf" */
	mime?: string;
	/** @example "This is a sample document." */
	description?: string;
	/** @example "Jane Doe" */
	representative?: string;
	/** @example "some filter value" */
	filter1?: string;
	/** @example "some filter value" */
	filter2?: string;
	/** @example "contract" */
	documentType?: string;
	/** @example "ABC-123" */
	caseRef?: string;
	/** @example "EXM-456" */
	examinationRefNo?: string;
}

export interface DocumentDetails {
	/** @example "123" */
	documentId?: string;
	/** @example 1 */
	version?: number;
	/** @example "ABC" */
	sourceSystem?: string;
	/** @example "456" */
	documentGuid?: string;
	/** @example "document.pdf" */
	fileName?: string;
	/** @example 1646822400 */
	datePublished?: number;
	/** @example "/documents/123.pdf" */
	privateBlobPath?: string;
	/** @example "my-blob-storage" */
	privateBlobContainer?: string;
	/** @example "John Smith" */
	author?: string;
	/** @example 1646822400 */
	dateCreated?: number;
	/** @example "published" */
	publishedStatus?: string;
	/** @example "not redacted" */
	redactedStatus?: string;
	/** @example 1024 */
	size?: number;
	/** @example "application/pdf" */
	mime?: string;
	/** @example "This is a sample document." */
	description?: string;
	/** @example "Jane Doe" */
	representative?: string;
	/** @example "draft" */
	stage?: string;
	/** @example "some filter value" */
	filter1?: string;
	/** @example "some filter value" */
	filter2?: string;
	/** @example "contract" */
	documentType?: string;
	/** @example "ABC-123" */
	caseRef?: string;
	/** @example "EXM-456" */
	examinationRefNo?: string;
}

export type PaginatedDocumentDetails = {
	/** @example 1 */
	page?: number;
	/** @example 50 */
	pageDefaultSize?: number;
	/** @example 1 */
	pageCount?: number;
	/** @example 1 */
	itemCount?: number;
	items?: {
		/** @example "123" */
		documentId?: string;
		/** @example 1 */
		version?: number;
		/** @example "ABC" */
		sourceSystem?: string;
		/** @example "456" */
		documentGuid?: string;
		/** @example "document.pdf" */
		fileName?: string;
		/** @example "original_document.pdf" */
		originalFilename?: string;
		/** @example 1646822400 */
		datePublished?: number;
		/** @example "/documents/123.pdf" */
		privateBlobPath?: string;
		/** @example "my-blob-storage" */
		privateBlobContainer?: string;
		/** @example "John Smith" */
		author?: string;
		/** @example 1646822400 */
		dateCreated?: number;
		/** @example "published" */
		publishedStatus?: string;
		/** @example "not_redacted" */
		redactedStatus?: string;
		/** @example 1024 */
		size?: number;
		/** @example "application/pdf" */
		mime?: string;
		/** @example "active" */
		status?: string;
		/** @example "This is a sample document." */
		description?: string;
		/** @example "Jane Doe" */
		representative?: string;
		/** @example "draft" */
		stage?: string;
		/** @example "some filter value" */
		filter1?: string;
		/** @example "some filter value" */
		filter2?: string;
		/** @example "contract" */
		documentType?: string;
		/** @example "ABC-123" */
		caseRef?: string;
		/** @example "EXM-456" */
		examinationRefNo?: string;
	}[];
}[];

export interface AppealToValidate {
	/** @example 1 */
	AppealId?: number;
	/** @example "APP/Q9999/D/21/1345264" */
	AppealReference?: string;
	/** @example "Lee Thornton" */
	AppellantName?: string;
	/** @example "new" */
	AppealStatus?: string;
	/** @example "18 Mar 2022" */
	Received?: string;
	AppealSite?: {
		/** @example "96 The Avenue" */
		AddressLine1?: string;
		/** @example "" */
		AddressLine2?: string;
		/** @example "Maidstone" */
		Town?: string;
		/** @example "Kent" */
		County?: string;
		/** @example "MD21 5XY" */
		PostCode?: string;
	};
	/** @example "Maidstone Borough Council" */
	LocalPlanningDepartment?: string;
	/** @example "48269/APP/2021/1482" */
	PlanningApplicationReference?: string;
	Documents?: {
		/** @example "" */
		Type?: string;
		/** @example "" */
		Filename?: string;
		/** @example "" */
		URL?: string;
	}[];
	reason?: {
		/** @example true */
		inflammatoryComments?: boolean;
		/** @example true */
		missingApplicationForm?: boolean;
		/** @example true */
		missingDecisionNotice?: boolean;
		/** @example true */
		missingGroundsForAppeal?: boolean;
		/** @example true */
		missingSupportingDocuments?: boolean;
		/** @example true */
		namesDoNotMatch?: boolean;
		/** @example true */
		openedInError?: boolean;
		/** @example "Some other weird reason" */
		otherReasons?: string;
		/** @example true */
		sensitiveInfo?: boolean;
		/** @example true */
		wrongAppealTypeUsed?: boolean;
	};
}

export interface AppealDetailsAfterStatementUpload {
	/** @example 2 */
	AppealId?: number;
	/** @example "ABC" */
	AppealReference?: string;
	/** @example "08 March 2022" */
	canUploadStatementsUntil?: string;
}

export interface AppealDetailsAfterFinalCommentUpload {
	/** @example 2 */
	AppealId?: number;
	/** @example "ABC" */
	AppealReference?: string;
	/** @example "08 March 2022" */
	canUploadFinalCommentsUntil?: string;
}

export type AppealsToValidate = {
	/** @example 1 */
	AppealId?: number;
	/** @example "APP/Q9999/D/21/1345264" */
	AppealReference?: string;
	AppealStatus?: 'new' | 'incomplete';
	/** @example "18 Mar 2022" */
	Received?: string;
	AppealSite?: {
		/** @example "96 The Avenue" */
		AddressLine1?: string;
		/** @example "" */
		AddressLine2?: string;
		/** @example "Maidstone" */
		Town?: string;
		/** @example "Kent" */
		County?: string;
		/** @example "MD21 5XY" */
		PostCode?: string;
	};
}[];

export interface ChangeAppeal {
	/** @example "John Doe" */
	AppellantName: string;
	Address: {
		/** @example "" */
		AddressLine1: string;
		/** @example "" */
		AddressLine2: string;
		/** @example "" */
		Town: string;
		/** @example "" */
		County: string;
		/** @example "" */
		PostCode: string;
	};
	/** @example "" */
	LocalPlanningDepartment: string;
	/** @example "" */
	PlanningApplicationReference: string;
}

export interface ValidationDecision {
	AppealStatus: 'invalid' | 'incomplete' | 'valid';
	/** @example "" */
	descriptionOfDevelopment: string;
	Reason: {
		/** @example true */
		namesDoNotMatch: boolean;
		/** @example true */
		sensitiveInfo: boolean;
		/** @example true */
		missingApplicationForm: boolean;
		/** @example true */
		missingDecisionNotice: boolean;
		/** @example true */
		missingGroundsForAppeal: boolean;
		/** @example true */
		missingSupportingDocuments: boolean;
		/** @example true */
		inflammatoryComments: boolean;
		/** @example true */
		openedInError: boolean;
		/** @example true */
		wrongAppealTypeUsed: boolean;
		/** @example true */
		outOfTime: boolean;
		/** @example true */
		noRightOfAppeal: boolean;
		/** @example true */
		notAppealable: boolean;
		/** @example true */
		lPADeemedInvalid: boolean;
		/** @example "" */
		otherReasons: string;
	};
}

export interface AppealDetailsWhenUploadingStatementsAndFinalComments {
	/** @example 1 */
	AppealId?: number;
	/** @example "" */
	AppealReference?: string;
	AppealSite?: {
		/** @example "" */
		AddressLine1?: string;
		/** @example "" */
		AddressLine2?: string;
		/** @example "" */
		Town?: string;
		/** @example "" */
		County?: string;
		/** @example "" */
		PostCode?: string;
	};
	/** @example "" */
	LocalPlanningDepartment?: string;
	/** @example false */
	acceptingStatements?: boolean;
	/** @example true */
	acceptingFinalComments?: boolean;
}

export interface AllAppeals {
	/** @example 57 */
	itemCount?: number;
	items?: {
		/** @example 1 */
		appealId?: number;
		/** @example "APP/Q9999/D/21/235348" */
		appealReference?: string;
		appealSite?: {
			/** @example "19 Beauchamp Road" */
			addressLine1?: string;
			/** @example "Bristol" */
			town?: string;
			/** @example "BS7 8LQ" */
			postCode?: string;
		};
		/** @example "awaiting_lpa_questionnaire" */
		appealStatus?: string;
		/** @example "household" */
		appealType?: string;
		/** @example "2023-02-16T11:43:27.096Z" */
		createdAt?: string;
		/** @example "Wiltshire Council" */
		localPlanningDepartment?: string;
	}[];
	/** @example 1 */
	page?: number;
	/** @example 27 */
	pageCount?: number;
	/** @example 30 */
	pageSize?: number;
}

export interface SingleAppealResponse {
	agentName?: any;
	/** @example "F / General Allocation" */
	allocationDetails?: string;
	/** @example 1 */
	appealId?: number;
	/** @example "APP/Q9999/D/21/235348" */
	appealReference?: string;
	appealSite?: {
		/** @example "19 Beauchamp Road" */
		addressLine1?: string;
		/** @example "Bristol" */
		town?: string;
		/** @example "BS7 8LQ" */
		postCode?: string;
	};
	/** @example "awaiting_lpa_questionnaire" */
	appealStatus?: string;
	appealTimetable?: {
		/** @example "2023-06-28T01:00:00.000Z" */
		finalCommentReviewDate?: string;
		/** @example "2023-05-16T01:00:00.000Z" */
		lpaQuestionnaireDueDate?: string;
		/** @example "2023-06-14T01:00:00.000Z" */
		statementReviewDate?: string;
	};
	/** @example "household" */
	appealType?: string;
	/** @example 1 */
	appellantCaseId?: number;
	/** @example "Fiona Burgess" */
	appellantName?: string;
	/** @example true */
	appellantOwnsWholeSite?: boolean;
	/** @example "Not issued yet" */
	decision?: string;
	/** @example true */
	isParentAppeal?: boolean;
	linkedAppeals?: {
		/** @example 1 */
		appealId?: number;
		/** @example "APP/Q9999/D/21/725284" */
		appealReference?: string;
	}[];
	/** @example "Wiltshire Council" */
	localPlanningDepartment?: string;
	/** @example 1 */
	lpaQuestionnaireId?: number;
	otherAppeals?: {
		/** @example 1 */
		appealId?: number;
		/** @example "APP/Q9999/D/21/725284" */
		appealReference?: string;
	}[];
	/** @example "48269/APP/2021/1482" */
	planningApplicationReference?: string;
	/** @example "Written" */
	procedureType?: string;
	siteVisit?: {
		/** @example "2022-03-31T12:00:00.000Z" */
		visitDate?: string;
	};
	/** @example "2022-05-17T23:00:00.000Z" */
	startedAt?: string;
	documentationSummary?: {
		appellantCase?: {
			/** @example "received" */
			status?: string;
			dueDate?: any;
		};
		lpaQuestionnaire?: {
			/** @example "not_received" */
			status?: string;
			/** @example "2023-06-18T00:00:00.000Z" */
			dueDate?: string;
		};
	};
}

export interface SingleAppellantCaseResponse {
	agriculturalHolding?: {
		/** @example true */
		isAgriculturalHolding?: boolean;
		/** @example true */
		isTenant?: boolean;
		/** @example false */
		hasToldTenants?: boolean;
		/** @example true */
		hasOtherTenants?: boolean;
	};
	/** @example 1 */
	appealId?: number;
	/** @example "APP/Q9999/D/21/965625" */
	appealReference?: string;
	appealSite?: {
		/** @example "21 The Pavement" */
		addressLine1?: string;
		/** @example "Wandsworth" */
		county?: string;
		/** @example "SW4 0HY" */
		postCode?: string;
	};
	/** @example 1 */
	appellantCaseId?: number;
	appellant?: {
		/** @example "Roger Simmons" */
		name?: string;
		/** @example "Roger Simmons Ltd" */
		company?: string;
	};
	applicant?: {
		/** @example "Fiona" */
		firstName?: string;
		/** @example "Burgess" */
		surname?: string;
	};
	developmentDescription?: {
		/** @example false */
		isCorrect?: boolean;
		/** @example "A new extension has been added at the back" */
		details?: string;
	};
	documents?: {
		/** @example "appeal-statement.pdf" */
		appealStatement?: string;
		/** @example "application-form.pdf" */
		applicationForm?: string;
		/** @example "design-and-access-statement.pdf" */
		designAndAccessStatement?: string;
		/** @example "decision-letter.pdf" */
		decisionLetter?: string;
		/** @example ["new-plans-or-drawings-1.pdf","new-plans-or-drawings-2.pdf"] */
		newPlansOrDrawings?: string[];
		/** @example ["newsupporting-doc-1.pdf","newsupporting-doc-2.pdf"] */
		newSupportingDocuments?: string[];
		/** @example "planning-obligation.pdf" */
		planningObligation?: string;
		/** @example ["plans-drawings-supporting-documents-1.pdf","plans-drawings-supporting-documents-2.pdf"] */
		plansDrawingsSupportingDocuments?: string[];
		/** @example "separate-ownership-certificate.pdf" */
		separateOwnershipCertificate?: string;
	};
	/** @example true */
	hasAdvertisedAppeal?: boolean;
	/** @example true */
	hasDesignAndAccessStatement?: boolean;
	/** @example true */
	hasNewPlansOrDrawings?: boolean;
	/** @example true */
	hasNewSupportingDocuments?: boolean;
	/** @example true */
	hasSeparateOwnershipCertificate?: boolean;
	healthAndSafety?: {
		/** @example "There is no mobile reception at the site" */
		details?: string;
		/** @example true */
		hasIssues?: boolean;
	};
	/** @example false */
	isAppellantNamedOnApplication?: boolean;
	/** @example "Wiltshire Council" */
	localPlanningDepartment?: string;
	planningObligation?: {
		/** @example true */
		hasObligation?: boolean;
		/** @example "Finalised" */
		status?: string;
	};
	/** @example "written" */
	procedureType?: string;
	siteOwnership?: {
		/** @example true */
		areAllOwnersKnown?: boolean;
		/** @example true */
		hasAttemptedToIdentifyOwners?: boolean;
		/** @example true */
		hasToldOwners?: boolean;
		/** @example false */
		isFullyOwned?: boolean;
		/** @example true */
		isPartiallyOwned?: boolean;
		/** @example "Some" */
		knowsOtherLandowners?: string;
	};
	visibility?: {
		/** @example "The site is behind a tall hedge" */
		details?: string;
		/** @example false */
		isVisible?: boolean;
	};
}

export interface UpdateAppealRequest {
	/** @example "2023-05-09" */
	startedAt?: string;
}

export interface UpdateAppealResponse {
	/** @example "2023-05-09T01:00:00.000Z" */
	startedAt?: string;
}

export interface SingleLPAQuestionnaireResponse {
	affectsListedBuildingDetails?: {
		/** @example "Grade I" */
		grade?: string;
		/** @example "http://localhost:8080/affects-listed-building.pdf" */
		description?: string;
	}[];
	/** @example 1 */
	appealId?: number;
	/** @example "APP/Q9999/D/21/526184" */
	appealReference?: string;
	appealSite?: {
		/** @example "92 Huntsmoor Road" */
		addressLine1?: string;
		/** @example "Tadley" */
		county?: string;
		/** @example "RG26 4BX" */
		postCode?: string;
	};
	/** @example "2023-05-09T01:00:00.000Z" */
	communityInfrastructureLevyAdoptionDate?: string;
	designatedSites?: {
		/** @example "cSAC" */
		name?: string;
		/** @example "candidate special area of conservation" */
		description?: string;
	}[];
	/** @example "" */
	developmentDescription?: string;
	documents?: {
		/** @example "right-of-way.pdf" */
		definitiveMapAndStatement?: string;
		/** @example "tree-preservation-order.pdf" */
		treePreservationOrder?: string;
		/** @example "community-infrastructure-levy.pdf" */
		communityInfrastructureLevy?: string;
		/** @example "conservation-area-map-and-guidance.pdf" */
		conservationAreaMapAndGuidance?: string;
		/** @example "consultation-responses.pdf" */
		consultationResponses?: string;
		/** @example ["emerging-plan-1.pdf"] */
		emergingPlans?: string[];
		/** @example "environment-statement-responses.pdf" */
		environmentalStatementResponses?: string;
		/** @example "issued-screening-opinion.pdf" */
		issuedScreeningOption?: string;
		/** @example "letters-to-neighbours.pdf" */
		lettersToNeighbours?: string;
		/** @example ["policy-1.pdf"] */
		otherRelevantPolicies?: string[];
		/** @example "planning-officers-report.pdf" */
		planningOfficersReport?: string;
		/** @example ["policy-a.pdf"] */
		policiesFromStatutoryDevelopment?: string[];
		/** @example "press-advert.pdf" */
		pressAdvert?: string;
		/** @example ["representations-from-other-parties-1.pdf"] */
		representationsFromOtherParties?: string[];
		/** @example ["responses-or-advice.pdf"] */
		responsesOrAdvice?: string[];
		/** @example "screening-direction.pdf" */
		screeningDirection?: string;
		/** @example "site-notice.pdf" */
		siteNotice?: string;
		/** @example ["supplementary-1.pdf"] */
		supplementaryPlanningDocuments?: string[];
	};
	/** @example true */
	doesAffectAListedBuilding?: boolean;
	/** @example true */
	doesAffectAScheduledMonument?: boolean;
	/** @example true */
	doesSiteHaveHealthAndSafetyIssues?: boolean;
	/** @example true */
	doesSiteRequireInspectorAccess?: boolean;
	/** @example "Some extra conditions" */
	extraConditions?: string;
	/** @example true */
	hasCommunityInfrastructureLevy?: boolean;
	/** @example true */
	hasCompletedAnEnvironmentalStatement?: boolean;
	/** @example true */
	hasEmergingPlan?: boolean;
	/** @example true */
	hasExtraConditions?: boolean;
	/** @example true */
	hasProtectedSpecies?: boolean;
	/** @example true */
	hasRepresentationsFromOtherParties?: boolean;
	/** @example true */
	hasResponsesOrStandingAdviceToUpload?: boolean;
	/** @example true */
	hasStatementOfCase?: boolean;
	/** @example true */
	hasStatutoryConsultees?: boolean;
	/** @example true */
	hasSupplementaryPlanningDocuments?: boolean;
	/** @example true */
	hasTreePreservationOrder?: boolean;
	/** @example "There is no mobile signal at the property" */
	healthAndSafetyDetails?: string;
	/** @example true */
	inCAOrrelatesToCA?: boolean;
	/** @example true */
	includesScreeningOption?: boolean;
	/** @example 2 */
	inquiryDays?: number;
	/** @example "The entrance is at the back of the property" */
	inspectorAccessDetails?: string;
	/** @example true */
	isCommunityInfrastructureLevyFormallyAdopted?: boolean;
	/** @example true */
	isEnvironmentalStatementRequired?: boolean;
	/** @example true */
	isGypsyOrTravellerSite?: boolean;
	/** @example true */
	isListedBuilding?: boolean;
	/** @example true */
	isPublicRightOfWay?: boolean;
	/** @example true */
	isSensitiveArea?: boolean;
	/** @example true */
	isSiteVisible?: boolean;
	/** @example true */
	isTheSiteWithinAnAONB?: boolean;
	listedBuildingDetails?: {
		/** @example "Grade I" */
		grade?: string;
		/** @example "http://localhost:8080/listed-building.pdf" */
		description?: string;
	}[];
	/** @example "Wiltshire Council" */
	localPlanningDepartment?: string;
	lpaNotificationMethods?: {
		/** @example "A site notice" */
		name?: string;
	}[];
	/** @example 1 */
	lpaQuestionnaireId?: number;
	/** @example true */
	meetsOrExceedsThresholdOrCriteriaInColumn2?: boolean;
	otherAppeals?: {
		/** @example 1 */
		appealId?: number;
		/** @example "APP/Q9999/D/21/725284" */
		appealReference?: string;
	}[];
	/** @example "Written" */
	procedureType?: string;
	/** @example "Schedule 1" */
	scheduleType?: string;
	/** @example "The area is prone to flooding" */
	sensitiveAreaDetails?: string;
	/** @example true */
	siteWithinGreenBelt?: boolean;
	/** @example "Some other people need to be consulted" */
	statutoryConsulteesDetails?: string;
}

export interface UpdateAppellantCaseRequest {
	/** @example [1,2,3] */
	incompleteReasons?: number[];
	/** @example [1,2,3] */
	invalidReasons?: number[];
	/** @example "valid" */
	validationOutcome?: string;
}

export type UpdateAppellantCaseResponse = object;

export type AllAppellantCaseIncompleteReasonsResponse = {
	/** @example 1 */
	id?: number;
	/** @example "Other" */
	name?: string;
}[];

export type AllAppellantCaseInvalidReasonsResponse = {
	/** @example 1 */
	id?: number;
	/** @example "Other" */
	name?: string;
}[];

export interface AppealsForCaseOfficer {
	/** @example 1 */
	AppealId: number;
	/** @example "" */
	AppealReference: string;
	/** @example "01 Jun 2022" */
	QuestionnaireDueDate: string;
	AppealSite: {
		/** @example "96 The Avenue" */
		AddressLine1: string;
		/** @example "" */
		AddressLine2: string;
		/** @example "Maidstone" */
		Town: string;
		/** @example "Kent" */
		County: string;
		/** @example "MD21 5XY" */
		PostCode: string;
	};
	QuestionnaireStatus: 'awaiting' | 'received' | 'overdue';
}

export interface AppealForCaseOfficer {
	/** @example 1 */
	AppealId: number;
	/** @example "" */
	AppealReference: string;
	/** @example "" */
	LocalPlanningDepartment: string;
	/** @example "" */
	PlanningApplicationReference: string;
	/** @example false */
	AppealSiteNearConservationArea: boolean;
	/** @example false */
	WouldDevelopmentAffectSettingOfListedBuilding: boolean;
	/** @example "" */
	ListedBuildingDesc: string;
	AppealSite: {
		/** @example "96 The Avenue" */
		AddressLine1: string;
		/** @example "" */
		AddressLine2: string;
		/** @example "Maidstone" */
		Town: string;
		/** @example "Kent" */
		County: string;
		/** @example "MD21 5XY" */
		PostCode: string;
	};
	Documents: {
		/** @example "" */
		Type: string;
		/** @example "" */
		Filename: string;
		/** @example "" */
		URL: string;
	}[];
}

export interface MoreAppealsForInspector {
	/** @example 1 */
	appealId: number;
	/** @example 10 */
	appealAge: number;
	address: {
		/** @example "" */
		addressLine1: string;
		/** @example "" */
		addressLine2: string;
		/** @example "" */
		town: string;
		/** @example "" */
		county: string;
		/** @example "" */
		postCode: string;
	};
	/** @example "HAS" */
	appealType: string;
	/** @example "General" */
	specialist?: string;
	provisionalSiteVisitType: 'unaccompanied' | 'access required';
}

export interface DocumentsMetadataResponse {
	/** @example 1 */
	id?: number;
	/** @example "" */
	caseRef?: string;
	/** @example "1111-2222-3333" */
	documentGuid?: string;
	/** @example "" */
	horizonDataID?: string;
	/** @example "" */
	version?: string;
	/** @example "" */
	path?: string;
	/** @example "" */
	virusCheckStatus?: string;
	/** @example "" */
	fileMD5?: string;
	/** @example "" */
	mime?: string;
	/** @example 0 */
	fileSize?: number;
	/** @example "" */
	fileType?: string;
	/** @example "" */
	createdAt?: string;
	/** @example "" */
	lastModified?: string;
	/** @example "" */
	datePublished?: string;
	/** @example "" */
	documentType?: string;
	/** @example "" */
	securityClassification?: string;
	/** @example "" */
	sourceSystem?: string;
	/** @example "" */
	origin?: string;
	/** @example "" */
	owner?: string;
	/** @example "" */
	author?: string;
	/** @example "" */
	representative?: string;
	/** @example "" */
	description?: string;
	/** @example 1 */
	stage?: number;
}

export interface AppealsForInspector {
	/** @example 1 */
	appealId: number;
	/** @example 10 */
	appealAge: number;
	appealSite: {
		/** @example "" */
		addressLine1: string;
		/** @example "" */
		addressLine2: string;
		/** @example "" */
		town: string;
		/** @example "" */
		county: string;
		/** @example "" */
		postCode: string;
	};
	/** @example "HAS" */
	appealType: string;
	/** @example "" */
	reference: string;
	status: 'not yet booked' | 'booked' | 'decision due';
	siteVisitType: 'accompanied' | 'unaccompanied' | 'access required';
	provisionalSiteVisitType: 'unaccompanied' | 'access required';
}

export interface AppealDetailsForInspector {
	/** @example 1 */
	appealId?: number;
	status?: 'not yet booked' | 'booked' | 'decision due';
	/** @example "APP/2021/56789/4909983" */
	reference?: string;
	/** @example true */
	availableForSiteVisitBooking?: boolean;
	provisionalSiteVisitType?: 'unaccompanied' | 'access required';
	/** @example "Maria Sharma" */
	appellantName?: string;
	/** @example "maria.sharma@gmail.com" */
	email?: string;
	/** @example "19 June 2022" */
	expectedSiteVisitBookingAvailableFrom?: string;
	/** @example "some description of development" */
	descriptionOfDevelopment?: string;
	/** @example "12 December 2020" */
	appealReceivedDate?: string;
	/** @example false */
	extraConditions?: boolean;
	/** @example false */
	affectsListedBuilding?: boolean;
	/** @example false */
	inGreenBelt?: boolean;
	/** @example false */
	inOrNearConservationArea?: boolean;
	/** @example false */
	emergingDevelopmentPlanOrNeighbourhoodPlan?: boolean;
	/** @example "plans" */
	emergingDevelopmentPlanOrNeighbourhoodPlanDescription?: string;
	/** @example 12 */
	appealAge?: number;
	/** @example "some other department" */
	localPlanningDepartment?: string;
	bookedSiteVisit?: {
		/** @example "12 December 2022" */
		visitDate?: string;
		/** @example "1pm - 2pm" */
		visitSlot?: string;
		visitType?: 'accompanied' | 'unaccompanied' | 'access required';
	};
	address?: {
		/** @example "66 Grove Road" */
		addressLine1?: string;
		/** @example "BS16 2BP" */
		postCode?: string;
		/** @example "Fishponds" */
		town?: string;
	};
	lpaAnswers?: {
		/** @example true */
		canBeSeenFromPublic?: boolean;
		/** @example "not visible from public land" */
		canBeSeenFromPublicDescription?: string;
		/** @example false */
		inspectorNeedsToEnterSite?: boolean;
		/** @example "inspector will want to enter site" */
		inspectorNeedsToEnterSiteDescription?: string;
		/** @example false */
		inspectorNeedsAccessToNeighboursLand?: boolean;
		/** @example "should be able to see ok" */
		inspectorNeedsAccessToNeighboursLandDescription?: string;
		/** @example false */
		healthAndSafetyIssues?: boolean;
		/** @example "not really" */
		healthAndSafetyIssuesDescription?: string;
		/** @example "abcd, ABC/DEF/GHI" */
		appealsInImmediateArea?: string;
	};
	appellantAnswers?: {
		/** @example true */
		canBeSeenFromPublic?: boolean;
		/** @example "site visit description" */
		canBeSeenFromPublicDescription?: string;
		/** @example true */
		appellantOwnsWholeSite?: boolean;
		/** @example "i own the whole site" */
		appellantOwnsWholeSiteDescription?: string;
		/** @example false */
		healthAndSafetyIssues?: boolean;
		/** @example "everything is super safe" */
		healthAndSafetyIssuesDescription?: string;
	};
}

export interface AppealsAssignedToInspector {
	successfullyAssigned: {
		/** @example 1 */
		appealId: number;
		/** @example "APP/Q9999/D/21/1345264" */
		reference: string;
		/** @example "HAS" */
		appealType: string;
		/** @example "General" */
		specialist: string;
		provisionalVisitType: 'unaccompanied' | 'access required';
		appealSite: {
			/** @example "96 The Avenue" */
			addressLine1: string;
			/** @example "Kent" */
			county: string;
			/** @example "Maidstone" */
			town: string;
			/** @example "MD21 5XY" */
			postCode: string;
		};
		/** @example 41 */
		appealAge: number;
	}[];
	unsuccessfullyAssigned: {
		/** @example 4 */
		appealId: number;
		/** @example "APP/Q9999/D/21/1345264" */
		reference: string;
		/** @example "HAS" */
		appealType: string;
		/** @example "General" */
		specialist: string;
		provisionalVisitType: 'unaccompanied' | 'access required';
		appealSite: {
			/** @example "96 The Avenue" */
			addressLine1: string;
			/** @example "Kent" */
			county: string;
			/** @example "Maidstone" */
			town: string;
			/** @example "MD21 5XY" */
			postCode: string;
		};
		/** @example 41 */
		appealAge: number;
		reason: 'appeal in wrong state' | 'appeal already assigned';
	}[];
}

export interface UpdateAppealDetailsByCaseOfficer {
	/** @example "" */
	listedBuildingDescription: string;
}

export interface AppealAfterUpdateForCaseOfficer {
	appealStatus: {
		/** @example 2 */
		id: number;
		/** @example "incomplete_lpa_questionnaire" */
		status: string;
		/** @example true */
		valid: boolean;
	}[];
	/** @example "2022-01-01T00:00:00.000Z" */
	createdAt: string;
	/** @example 1 */
	id: number;
	/** @example "Local planning dept" */
	localPlanningDepartment: string;
	lpaQuestionnaire: {
		/** @example "*" */
		listedBuildingDescription: string;
	};
	/** @example "0181/811/8181" */
	planningApplicationReference: string;
	/** @example "APP/Q9999/D/21/323259" */
	reference: string;
	/** @example "2022-01-01T00:00:00.000Z" */
	updatedAt: string;
	/** @example 100 */
	userId: number;
}

export interface SendLPAQuestionnaireConfirmation {
	reason?: {
		/** @example true */
		applicationPlansToReachDecisionMissingOrIncorrect?: boolean;
		/** @example "" */
		applicationPlansToReachDecisionMissingOrIncorrectDescription?: string;
		/** @example true */
		policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrect?: boolean;
		/** @example "" */
		policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrectDescription?: string;
		/** @example true */
		policiesOtherRelevanPoliciesMissingOrIncorrect?: boolean;
		/** @example "" */
		policiesOtherRelevanPoliciesMissingOrIncorrectDescription?: string;
		/** @example true */
		policiesSupplementaryPlanningDocumentsMissingOrIncorrect?: boolean;
		/** @example "" */
		policiesSupplementaryPlanningDocumentsMissingOrIncorrectDescription?: string;
		/** @example true */
		siteConservationAreaMapAndGuidanceMissingOrIncorrect?: boolean;
		/** @example "" */
		siteConservationAreaMapAndGuidanceMissingOrIncorrectDescription?: string;
		/** @example true */
		siteListedBuildingDescriptionMissingOrIncorrect?: boolean;
		/** @example "" */
		siteListedBuildingDescriptionMissingOrIncorrectDescription?: string;
		/** @example true */
		thirdPartyApplicationNotificationMissingOrIncorrect?: boolean;
		/** @example false */
		thirdPartyApplicationNotificationMissingOrIncorrectListOfAddresses?: boolean;
		/** @example false */
		thirdPartyApplicationNotificationMissingOrIncorrectCopyOfLetterOrSiteNotice?: boolean;
		/** @example true */
		thirdPartyRepresentationsMissingOrIncorrect?: boolean;
		/** @example "" */
		thirdPartyRepresentationsMissingOrIncorrectDescription?: string;
		/** @example true */
		thirdPartyAppealNotificationMissingOrIncorrect?: boolean;
		/** @example false */
		thirdPartyAppealNotificationMissingOrIncorrectListOfAddresses?: boolean;
		/** @example false */
		thirdPartyAppealNotificationMissingOrIncorrectCopyOfLetterOrSiteNotice?: boolean;
	};
}

export interface BookSiteVisit {
	siteVisitType: 'accompanied' | 'unaccompanied' | 'access required';
	siteVisitDate: {
		/** @example true */
		required?: boolean;
		/** @example "string" */
		type?: string;
		/** @example "date" */
		format?: string;
		/** @example "2022-01-01" */
		example?: string;
	};
	siteVisitTimeSlot:
		| '8am to 10am'
		| '9am to 11am'
		| '10am to midday'
		| '11am to 1pm'
		| 'midday to 2pm'
		| '1pm to 3pm'
		| '2pm to 4pm'
		| '3pm to 5pm'
		| '4pm to 6pm'
		| '5pm to 7pm';
}

export interface IssueDecision {
	decisionLetter: {
		/** @example "file" */
		type?: string;
		/** @example true */
		required?: boolean;
	};
	outcome: 'allowed' | 'dismissed' | 'split decision';
}

export interface UploadStatement {
	statement: {
		/** @example "file" */
		type?: string;
		/** @example true */
		required?: boolean;
	};
}

export interface UploadFinalComment {
	finalcomment: {
		/** @example "file" */
		type?: string;
		/** @example true */
		required?: boolean;
	};
}

export type ApplicationProjectUpdate = ApplicationProjectUpdateCreateRequest & {
	/** @min 0 */
	id?: number;
	/** @min 0 */
	caseId?: number;
	/**
	 * The date this update was created
	 * @format date-time
	 * @example "2022-12-21T12:42:40.885Z"
	 */
	dateCreated?: string;
	/** Has this update been emailed to subscribers? */
	sentToSubscribers?: boolean;
	/**
	 * The date this update's status was set to published
	 * @format date-time
	 * @example "2022-12-21T12:42:40.885Z"
	 */
	datePublished?: string;
	/** the type of update - which determines which subscribers will recieve the notification emails */
	type?: 'general' | 'applicationSubmitted' | 'applicationDecided' | 'registrationOpen';
};

export interface ApplicationProjectUpdateCreateRequest {
	/** The back-office ID of the user who created this updated */
	authorId?: number;
	/** Will this update be emailed to subscribers? */
	emailSubscribers?: boolean;
	/** The current status of this update */
	status?: 'draft' | 'published' | 'unpublished' | 'archived';
	/** The internal title of this update */
	title?: string;
	/**
	 * The HTML content of this update, it can only include `<p> <a> <strong> <ul> <li> <br>` tags
	 * @example "<strong>Important Update</strong> Something happened."
	 */
	htmlContent?: string;
	/**
	 * The HTML content of this update in Welsh, it can only include `<p> <a> <strong> <ul> <li> <br>` tags
	 * @example "<strong>Diweddariad Pwysig</strong> Digwyddodd rhywbeth."
	 */
	htmlContentWelsh?: string;
}

export interface ApplicationProjectUpdateUpdateRequest {
	/** Will this update be emailed to subscribers? */
	emailSubscribers?: boolean;
	/** The current status of this update */
	status?: 'draft' | 'published' | 'unpublished' | 'archived';
	/** The internal title of this update */
	title?: string;
	/**
	 * The HTML content of this update, it can only include `<p> <a> <strong> <ul> <li> <br>` tags
	 * @example "<strong>Important Update</strong> Something happened."
	 */
	htmlContent?: string;
	/**
	 * The HTML content of this update in Welsh, it can only include `<p> <a> <strong> <ul> <li> <br>` tags
	 * @example "<strong>Diweddariad Pwysig</strong> Digwyddodd rhywbeth."
	 */
	htmlContentWelsh?: string;
	/** the type of update - which determines which subscribers will recieve the notification emails */
	type?: 'general' | 'applicationSubmitted' | 'applicationDecided' | 'registrationOpen';
	/** Has this update been emailed to subscribers? */
	sentToSubscribers?: boolean;
}

export interface ApplicationProjectUpdateCreateBadRequest {
	errors?: {
		/** @example "emailSubscribers is required" */
		emailSubscribers?: string;
		/** @example "status is required" */
		status?: string;
		/** @example "htmlContent is required" */
		htmlContent?: string;
		/** @example "title must be a string" */
		title?: string;
		/** @example "title must be a string" */
		htmlContentWelsh?: string;
		/** @example "type must be a string" */
		type?: string;
		/** @example "sentToSubscribers must be a boolean" */
		sentToSubscribers?: string;
	};
}

export interface ApplicationProjectUpdatesListBadRequest {
	errors?: {
		/** @example "status must be one of ..." */
		status?: string;
		/** @example "sentToSubscribers must be a boolean" */
		sentToSubscribers?: string;
		/** @example "publishedBefore must be a valid date" */
		publishedBefore?: string;
		/** @example "page must be a number" */
		page?: string;
		/** @example "pageSize must be a number" */
		pageSize?: string;
	};
}

export interface ApplicationProjectUpdates {
	/** @min 0 */
	page?: number;
	/** @min 0 */
	pageCount?: number;
	/** @min 0 */
	pageSize?: number;
	/** @min 0 */
	itemCount?: number;
	items?: ApplicationProjectUpdate[];
}

export interface S51AdviceCreateRequestBody {
	/**
	 * The application id
	 * @example 1
	 */
	caseId?: number;
	/**
	 * Advice title
	 * @example "Advice regarding right to roam"
	 */
	title?: string;
	/**
	 * Name of enquiring company / organisation
	 * @example "New Power Plc"
	 */
	enquirer?: string;
	/**
	 * First name of enquirer
	 * @example "John"
	 */
	firstName?: string;
	/**
	 * Last name of enquirer
	 * @example "Keats"
	 */
	lastName?: string;
	/**
	 * Enquiry method
	 * @example "email"
	 */
	enquiryMethod?: 'phone' | 'email' | 'meeting' | 'post';
	/**
	 * Date of enquiry yyyy-mm-dd
	 * @example "2023-03-01"
	 */
	enquiryDate?: string;
	/**
	 * Details of the enquiry
	 * @example "details of the advice sought"
	 */
	enquiryDetails?: string;
	/**
	 * Name of who gave the advice
	 * @example "John Caseworker-Smith"
	 */
	adviser?: string;
	/**
	 * Date advice given yyyy-mm-dd
	 * @example "2023-03-01"
	 */
	adviceDate?: string;
	/**
	 * Details of the advive given
	 * @example "details of the advice provided"
	 */
	adviceDetails?: string;
}

export interface S51AdviceDocumentDetails {
	/**
	 * Document name
	 * @example "Small9"
	 */
	documentName?: string;
	/**
	 * Document mime type
	 * @example "application/pdf"
	 */
	documentType?: string;
	/**
	 * Size of the document in bytes
	 * @example 7945
	 */
	documentSize?: number;
	/**
	 * Date document was added
	 * @example 1694179427
	 */
	dateAdded?: number;
	/**
	 * Published status
	 * @example "not_checked"
	 */
	status?: 'not_checked' | 'checked' | 'ready_to_publish' | 'published' | 'not_published';
	/**
	 * GUID of the document in the Document table
	 * @example "742f3ba1-c80a-4f76-81c2-5a4627d6ac00"
	 */
	documentGuid?: string;
	/**
	 * Document version number
	 * @example 1
	 */
	version?: number;
}

export interface S51AdviceDetails {
	/**
	 * The S51 Advice record id
	 * @example 1
	 */
	id?: number;
	/**
	 * Advice reference 5 digits number
	 * @example "00001"
	 */
	referenceNumber?: string;
	/**
	 * Advice reference number containing Case ref number
	 * @example "EN010001-Advice-00001"
	 */
	referenceCode?: string;
	/**
	 * Advice title
	 * @example "Advice regarding right to roam"
	 */
	title?: string;
	/**
	 * Name of enquiring company / organisation
	 * @example "New Power Plc"
	 */
	enquirer?: string;
	/**
	 * First name of enquirer
	 * @example "John"
	 */
	firstName?: string;
	/**
	 * Last name of enquirer
	 * @example "Keats"
	 */
	lastName?: string;
	/**
	 * Enquiry method
	 * @example "email"
	 */
	enquiryMethod?: 'phone' | 'email' | 'meeting' | 'post';
	/**
	 * Date of enquiry
	 * @example 1646822400
	 */
	enquiryDate?: number;
	/**
	 * Details of the enquiry
	 * @example "details of the advice sought"
	 */
	enquiryDetails?: string;
	/**
	 * Name of who gave the advice
	 * @example "John Caseworker-Smith"
	 */
	adviser?: string;
	/**
	 * Date advice given
	 * @example 1646822400
	 */
	adviceDate?: number;
	/**
	 * Details of the advive given
	 * @example "details of the advice provided"
	 */
	adviceDetails?: string;
	/**
	 * Redacted status
	 * @example "not_redacted"
	 */
	redactedStatus?: 'not_redacted' | 'redacted';
	/**
	 * Published status
	 * @example "published"
	 */
	publishedStatus?: 'not_checked' | 'checked' | 'ready_to_publish' | 'published' | 'not_published';
	/**
	 * Date advice record was created
	 * @example 1646822400
	 */
	dateCreated?: number;
	/**
	 * Date advice record was last updated
	 * @example 1646822400
	 */
	dateUpdated?: number;
}

export interface S51AdviceDetailsWithCaseId {
	/**
	 * The S51 Advice record id
	 * @example 1
	 */
	id?: number;
	/**
	 * The application id
	 * @example 1
	 */
	caseId?: number;
	/**
	 * Advice title
	 * @example "Advice regarding right to roam"
	 */
	title?: string;
	/**
	 * First name of enquirer
	 * @example "John"
	 */
	firstName?: string;
	/**
	 * Last name of enquirer
	 * @example "Keats"
	 */
	lastName?: string;
	/**
	 * Name of enquiring company / organisation
	 * @example "New Power Plc"
	 */
	enquirer?: string;
	/**
	 * Enquiry method
	 * @example "email"
	 */
	enquiryMethod?: 'phone' | 'email' | 'meeting' | 'post';
	/**
	 * Date of enquiry
	 * @example "2023-02-01T00:00:00.000Z"
	 */
	enquiryDate?: string;
	/**
	 * Details of the enquiry
	 * @example "details of the advice sought"
	 */
	enquiryDetails?: string;
	/**
	 * Name of who gave the advice
	 * @example "John Caseworker-Smith"
	 */
	adviser?: string;
	/**
	 * Date advice given
	 * @example "2023-02-01T00:00:00.000Z"
	 */
	adviceDate?: string;
	/**
	 * Details of the advive given
	 * @example "details of the advice provided"
	 */
	adviceDetails?: string;
	/**
	 * Advice reference number
	 * @example "1"
	 */
	referenceNumber?: number;
	/**
	 * Redacted status
	 * @example "not_redacted"
	 */
	redactedStatus?: 'not_redacted' | 'redacted';
	/**
	 * Published status
	 * @example "published"
	 */
	publishedStatus?: 'not_checked' | 'checked' | 'ready_to_publish' | 'published' | 'not_published';
	/**
	 * True if the advice is marked as deleted
	 * @example "true"
	 */
	isDeleted?: boolean;
	/**
	 * Date advice record was created
	 * @example "2023-02-01T00:00:00.000Z"
	 */
	createdAt?: string;
	/**
	 * Date advice record was last updated
	 * @example "2023-02-01T00:00:00.000Z"
	 */
	updatedAt?: string;
}

export interface S51AdviceDetailsWithDocumentDetails {
	/**
	 * The S51 Advice record id
	 * @example 1
	 */
	id?: number;
	/**
	 * Advice reference 5 digits number
	 * @example "00001"
	 */
	referenceNumber?: string;
	/**
	 * Advice reference number containing Case ref number
	 * @example "EN010001-Advice-00001"
	 */
	referenceCode?: string;
	/**
	 * Advice title
	 * @example "Advice regarding right to roam"
	 */
	title?: string;
	/**
	 * Name of enquiring company / organisation
	 * @example "New Power Plc"
	 */
	enquirer?: string;
	/**
	 * First name of enquirer
	 * @example "John"
	 */
	firstName?: string;
	/**
	 * Last name of enquirer
	 * @example "Keats"
	 */
	lastName?: string;
	/**
	 * Enquiry method
	 * @example "email"
	 */
	enquiryMethod?: 'phone' | 'email' | 'meeting' | 'post';
	/**
	 * Date of enquiry
	 * @example 1646822400
	 */
	enquiryDate?: number;
	/**
	 * Details of the enquiry
	 * @example "details of the advice sought"
	 */
	enquiryDetails?: string;
	/**
	 * Name of who gave the advice
	 * @example "John Caseworker-Smith"
	 */
	adviser?: string;
	/**
	 * Date advice given
	 * @example 1646822400
	 */
	adviceDate?: number;
	/**
	 * Details of the advive given
	 * @example "details of the advice provided"
	 */
	adviceDetails?: string;
	/**
	 * Redacted status
	 * @example "not_redacted"
	 */
	redactedStatus?: 'not_redacted' | 'redacted';
	/**
	 * Published status
	 * @example "published"
	 */
	publishedStatus?: 'not_checked' | 'checked' | 'ready_to_publish' | 'published' | 'not_published';
	/**
	 * Date advice record was created
	 * @example 1646822400
	 */
	dateCreated?: number;
	/**
	 * Date advice record was last updated
	 * @example 1646822400
	 */
	dateUpdated?: number;
	attachments?: S51AdviceDocumentDetails[];
	/**
	 * Total S51 Documents attached to this advice
	 * @example 1
	 */
	totalAttachments?: number;
}

export interface S51AdvicePaginatedResponse {
	/**
	 * The page number required
	 * @example 1
	 */
	page?: number;
	/**
	 * The default number of S51 Advice per page
	 * @example 50
	 */
	pageDefaultSize?: number;
	/**
	 * The total number of pages
	 * @example 1
	 */
	pageCount?: number;
	/**
	 * The total number of s51 Advice records on the case
	 * @example 1
	 */
	itemCount?: number;
	items?: S51AdviceDetails[];
}

export interface S51AdvicePaginatedResponseWithDocumentDetails {
	/**
	 * The page number required
	 * @example 1
	 */
	page?: number;
	/**
	 * The default number of S51 Advice per page
	 * @example 50
	 */
	pageDefaultSize?: number;
	/**
	 * The total number of pages
	 * @example 1
	 */
	pageCount?: number;
	/**
	 * The total number of s51 Advice records on the case
	 * @example 1
	 */
	itemCount?: number;
	items?: S51AdviceDetailsWithDocumentDetails[];
}

export interface S51AdviceDetailsArrayWithCaseId {
	results?: S51AdviceDetailsWithCaseId[];
}

export interface S51AdvicePaginatedBadRequest {
	errors?: {
		/** @example "Page Number is not valid" */
		pageNumber?: string;
		/** @example "Page Size is not valid" */
		pageSize?: string;
		unknown?: string;
	};
}

export interface S51AdviceUpdateRequestBody {
	/**
	 * Advice title
	 * @example "Advice regarding right to roam"
	 */
	title?: string;
	/**
	 * First name of enquirer
	 * @example "John"
	 */
	firstName?: string;
	/**
	 * Last name of enquirer
	 * @example "Keats"
	 */
	lastName?: string;
	/**
	 * Name of enquiring company / organisation
	 * @example "New Power Plc"
	 */
	enquirer?: string;
	/**
	 * Enquiry method
	 * @example "email"
	 */
	enquiryMethod?: 'phone' | 'email' | 'meeting' | 'post';
	/**
	 * Date of enquiry
	 * @example "2023-01-11T00:00:00.000Z"
	 */
	enquiryDate?: string;
	/**
	 * Details of the enquiry
	 * @example "details of the advice sought"
	 */
	enquiryDetails?: string;
	/**
	 * Name of who gave the advice
	 * @example "John Caseworker-Smith"
	 */
	adviser?: string;
	/**
	 * Date advice given
	 * @example "2023-02-11T00:00:00.000Z"
	 */
	adviceDate?: string;
	/**
	 * Details of the advive given
	 * @example "details of the advice provided"
	 */
	adviceDetails?: string;
	/**
	 * Published status
	 * @example "redacted"
	 */
	redactedStatus?: 'not_redacted' | 'redacted';
	/**
	 * Published status
	 * @example "not_checked"
	 */
	publishedStatus?: 'not_checked' | 'checked' | 'ready_to_publish' | 'published' | 'not_published';
}

export interface S51AdviceMultipleUpdateRequestBody {
	/**
	 * Redacted status
	 * @example true
	 */
	redacted?: boolean;
	/**
	 * Published status
	 * @example "published"
	 */
	status?: 'not_checked' | 'checked' | 'ready_to_publish' | 'published' | 'not_published';
	items?: {
		/**
		 * The S51 Advice record id
		 * @example 1
		 */
		id?: number;
	}[];
}

export interface S51AdviceUpdateResponseItem {
	/**
	 * The S51 Advice record id
	 * @example "1"
	 */
	id?: string;
	/**
	 * Published status
	 * @example "published"
	 */
	status?: 'not_checked' | 'checked' | 'ready_to_publish' | 'published' | 'not_published';
	/**
	 * Redacted status
	 * @example "not_redacted"
	 */
	redactedStatus?: 'not_redacted' | 'redacted';
}

export type S51AdviceMultipleUpdateResponseBody = S51AdviceUpdateResponseItem[];

export interface S51AdviceUpdateBadRequest {
	errors?: {
		/** @example "Unknown S51 Advice id 100" */
		items?: string;
		unknown?: string;
	};
}

export interface S51AdvicePublishRequestBody {
	/**
	 * Optional parameter. True if all S51 Advice in the publishing queue for that case is to be published
	 * @example true
	 */
	selectAll?: boolean;
	/** Array of S51 Advice Ids to publish */
	ids?: string[];
}

export interface ProjectUpdateNotificationLogList {
	/** @min 0 */
	page?: number;
	/** @min 0 */
	pageCount?: number;
	/** @min 0 */
	pageSize?: number;
	/** @min 0 */
	itemCount?: number;
	items?: ProjectUpdateNotificationLog[];
}

export interface ProjectUpdateNotificationLogListBadRequest {
	errors?: {
		/** @example "page must be a number" */
		page?: string;
		/** @example "pageSize must be a number" */
		pageSize?: string;
	};
}

export type ProjectUpdateNotificationLogCreateRequest = ProjectUpdateNotificationLog[];

export interface ProjectUpdateNotificationLogCreateBadRequest {
	errors?: {
		/** @example "projectUpdateId is required" */
		'[*].projectUpdateId'?: string;
		/** @example "subscriptionId is required" */
		'[*].subscriptionId'?: string;
		/** @example "entryDate is required" */
		'[*].entryDate'?: string;
		/** @example "emailSent must be a boolean" */
		'[*].emailSent'?: string;
		/** @example "functionInvocationId must be a string" */
		'[*].functionInvocationId'?: string;
	};
}

export interface ProjectUpdateNotificationLog {
	/** @min 0 */
	id?: number;
	/** @min 0 */
	projectUpdateId?: number;
	/** @min 0 */
	subscriptionId?: number;
	/**
	 * the date this notification was handled
	 * @format date-time
	 * @example "2022-12-21T12:42:40.885Z"
	 */
	entryDate?: string;
	/** whether an email was successfully sent */
	emailSent?: boolean;
	/** the ID of the Azure function run that handled this entry */
	functionInvocationId?: string;
}

export interface RepresentationSummary {
	/** @example 1 */
	id?: number;
	/** @example "BC0110001-2" */
	reference?: string;
	/** @example "VALID" */
	status?: string;
	/** @example true */
	redacted?: boolean;
	/** @example "2023-03-14T14:28:25.704Z" */
	received?: string;
	/** @example "James" */
	firstName?: string;
	/** @example "Bond" */
	lastName?: string;
	/** @example "MI6" */
	organisationName?: string;
}

export interface Subscriptions {
	/** @min 0 */
	page?: number;
	/** @min 0 */
	pageCount?: number;
	/** @min 0 */
	pageSize?: number;
	/** @min 0 */
	itemCount?: number;
	items?: Subscription[];
}

export interface SubscriptionsListBadRequest {
	errors?: {
		/** @example "type must be one of ..." */
		type?: string;
		/** @example "must be a string" */
		caseReference?: string;
		/** @example "page must be a number" */
		page?: string;
		/** @example "pageSize must be a number" */
		pageSize?: string;
	};
}

export interface SubscriptionGetBadRequest {
	errors?: {
		/** @example "caseReference is required" */
		caseReference?: string;
		/** @example "emailAddress is required" */
		emailAddress?: string;
		unknown?: string;
	};
}

export interface SubscriptionCreateRequest {
	/** the case reference the subscription relates to */
	caseReference: string;
	/** @format email */
	emailAddress: string;
	/** which updates does the subscriber wants to get notified of */
	subscriptionTypes?: (
		| 'allUpdates'
		| 'applicationSubmitted'
		| 'applicationDecided'
		| 'registrationOpen'
	)[];
	/**
	 * The date to start getting updates
	 * @format date-time
	 */
	startDate?: string;
	/**
	 * The date to stop getting updates
	 * @format date-time
	 */
	endDate?: string;
	/** @default "English" */
	language?: 'English' | 'Welsh';
}

export interface SubscriptionCreateBadRequest {
	errors?: {
		/** @example "caseReference is required" */
		caseReference?: string;
		/** @example "emailAddress is required" */
		emailAddress?: string;
		/** @example "subscriptionTypes is required" */
		subscriptionTypes?: string;
		/** @example "startDate must be a valid date" */
		startDate?: string;
		/** @example "endDate must be a valid date" */
		endDate?: string;
		/** @example "language must be one of 'English', 'Welsh'" */
		language?: string;
		/**
		 * prisma error code
		 * @example "P2002"
		 */
		code?: string;
		/** @example "caseReference and emailAddress combination must be unique" */
		constraint?: string;
		unknown?: string;
	};
}

export interface SubscriptionUpdateRequest {
	/**
	 * The date to stop getting updates
	 * @format date-time
	 */
	endDate: string;
}

export interface SubscriptionUpdateBadRequest {
	errors?: {
		/** @example "endDate must be a valid date" */
		endDate?: string;
		/** @example "id must be a valid integer'" */
		id?: string;
		/**
		 * prisma error code
		 * @example "P2002"
		 */
		code?: string;
		/** @example "subscription not found" */
		notFound?: string;
		unknown?: string;
	};
}

export interface SubscriptionNotFound {
	errors?: {
		/** @example "subscription not found" */
		notFound?: string;
	};
}

export interface Subscription {
	/** back office ID for this subscription */
	id?: number;
	/** the case reference the subscription relates to */
	caseReference: string;
	/** @format email */
	emailAddress: string;
	/** which updates does the subscriber wants to get notified of */
	subscriptionTypes?: (
		| 'allUpdates'
		| 'applicationSubmitted'
		| 'applicationDecided'
		| 'registrationOpen'
	)[];
	/**
	 * The date to start getting updates
	 * @format date-time
	 */
	startDate?: string;
	/**
	 * The date to stop getting updates
	 * @format date-time
	 */
	endDate?: string;
	/** @default "English" */
	language?: 'English' | 'Welsh';
}

export interface GeneralError {
	errors?: {
		/** @example "something went wrong" */
		message?: string;
	};
}

export interface InternalError {
	errors?: {
		/** @example "unknown internal error" */
		unknown?: string;
	};
}

export interface NotFound {
	errors?: {
		/** @example "resource not found" */
		notFound?: string;
	};
}

export interface ApplicationKeyDates {
	preApplication?: {
		/**
		 * Unix timestamp date
		 * @example 1646822600
		 */
		datePINSFirstNotifiedOfProject?: number;
		/**
		 * Unix timestamp date
		 * @example 1646822600
		 */
		dateProjectAppearsOnWebsite?: number;
		/**
		 * Quarter followed by year
		 * @example "Q1 2023"
		 */
		anticipatedSubmissionDateNonSpecific?: string;
		/**
		 * Unix timestamp date
		 * @example 1646822600
		 */
		anticipatedDateOfSubmission?: number;
		/**
		 * Unix timestamp date
		 * @example 1646822600
		 */
		screeningOpinionSought?: number;
		/**
		 * Unix timestamp date
		 * @example 1646822600
		 */
		screeningOpinionIssued?: number;
		/**
		 * Unix timestamp date
		 * @example 1646822600
		 */
		scopingOpinionSought?: number;
		/**
		 * Unix timestamp date
		 * @example 1646822600
		 */
		scopingOpinionIssued?: number;
		/**
		 * Unix timestamp date
		 * @example 1646822600
		 */
		section46Notification?: number;
	};
	acceptance?: {
		/**
		 * Unix timestamp date
		 * @example 1646822600
		 */
		dateOfDCOSubmission?: number;
		/**
		 * Unix timestamp date
		 * @example 1646822600
		 */
		deadlineForAcceptanceDecision?: number;
		/**
		 * Unix timestamp date
		 * @example 1646822600
		 */
		dateOfDCOAcceptance?: number;
		/**
		 * Unix timestamp date
		 * @example 1646822600
		 */
		dateOfNonAcceptance?: number;
	};
	preExamination?: {
		/**
		 * Unix timestamp date
		 * @example 1646822600
		 */
		dateOfRepresentationPeriodOpen?: number;
		/**
		 * Unix timestamp date
		 * @example 1646822600
		 */
		dateOfRelevantRepresentationClose?: number;
		/**
		 * Unix timestamp date
		 * @example 1646822600
		 */
		extensionToDateRelevantRepresentationsClose?: number;
		/**
		 * Unix timestamp date
		 * @example 1646822600
		 */
		dateRRepAppearOnWebsite?: number;
		/**
		 * Unix timestamp date
		 * @example 1646822600
		 */
		dateIAPIDue?: number;
		/**
		 * Unix timestamp date
		 * @example 1646822600
		 */
		rule6LetterPublishDate?: number;
		/**
		 * Unix timestamp date
		 * @example 1646822600
		 */
		preliminaryMeetingStartDate?: number;
		/** @example 1646822600 */
		notificationDateForPMAndEventsDirectlyFollowingPM?: number;
		/**
		 * Unix timestamp date
		 * @example 1646822600
		 */
		notificationDateForEventsDeveloper?: number;
	};
	examination?: {
		/**
		 * Unix timestamp date
		 * @example 1646822600
		 */
		dateSection58NoticeReceived?: number;
		/**
		 * Unix timestamp date
		 * @example 1646822600
		 */
		confirmedStartOfExamination?: number;
		/**
		 * Unix timestamp date
		 * @example 1646822600
		 */
		rule8LetterPublishDate?: number;
		/**
		 * Unix timestamp date
		 * @example 1646822600
		 */
		deadlineForCloseOfExamination?: number;
		/**
		 * Unix timestamp date
		 * @example 1646822600
		 */
		dateTimeExaminationEnds?: number;
		/**
		 * Unix timestamp date
		 * @example 1646822600
		 */
		stage4ExtensionToExamCloseDate?: number;
	};
	recommendation?: {
		/**
		 * Unix timestamp date
		 * @example 1646822600
		 */
		deadlineForSubmissionOfRecommendation?: number;
		/**
		 * Unix timestamp date
		 * @example 1646822600
		 */
		dateOfRecommendations?: number;
		/**
		 * Unix timestamp date
		 * @example 1646822600
		 */
		stage5ExtensionToRecommendationDeadline?: number;
	};
	decision?: {
		/**
		 * Unix timestamp date
		 * @example 1646822600
		 */
		deadlineForDecision?: number;
		/**
		 * Unix timestamp date
		 * @example 1646822600
		 */
		confirmedDateOfDecision?: number;
		/**
		 * Unix timestamp date
		 * @example 1646822600
		 */
		stage5ExtensionToDecisionDeadline?: number;
	};
	postDecision?: {
		/**
		 * Unix timestamp date
		 * @example 1646822600
		 */
		jRPeriodEndDate?: number;
	};
	withdrawal?: {
		/**
		 * Unix timestamp date
		 * @example 1646822600
		 */
		dateProjectWithdrawn?: number;
	};
}
