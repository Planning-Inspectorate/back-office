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
	applicant?: {
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
	};
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
	applicant?: {
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
	};
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

export type CaseStages = {
	/** @example "post_decision" */
	name?: string;
	/** @example "Post-Decision" */
	displayNameEn?: string;
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
	emailSubscribers: boolean;
	/** The current status of this update */
	status: 'draft' | 'published' | 'unpublished' | 'archived';
	/** The internal title of this update */
	title?: string;
	/**
	 * The HTML content of this update, it can only include `<p> <a> <strong> <ul> <li> <br>` tags
	 * @example "<strong>Important Update</strong> Something happened."
	 */
	htmlContent: string;
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

export interface DocumentActivityLog {
	/**
	 * Id
	 * @example 1
	 */
	id?: number;
	/**
	 * Username
	 * @example "ab12cd34-5678-90ef-ghij-klmnopqrstuv"
	 */
	documentGuid?: string;
	/**
	 * Document version
	 * @example 2
	 */
	version?: number;
	/**
	 * Username
	 * @example "test-user@email.com"
	 */
	user?: string;
	/** @example "uploaded" */
	status?: string;
	/**
	 * Date created
	 * @example "2023-10-04T12:45:19.785Z"
	 */
	createdAt?: string;
}

export interface DocumentToSaveExtended {
	/**
	 * Document file name
	 * @example "document.pdf"
	 */
	documentName: string;
	/**
	 * Document size in bytes
	 * @example 1024
	 */
	documentSize: number;
	/**
	 * Document mime type
	 * @example "application/pdf"
	 */
	documentType: string;
	/**
	 * Case Id
	 * @example "1"
	 */
	caseId: string;
	/**
	 * Folder Id
	 * @example 123
	 */
	folderId: number;
	/** @example "file_row_1585663020000_7945" */
	fileRowId: string;
	/**
	 * Username
	 * @example "John Keats"
	 */
	username: string;
	/**
	 * Document unique reference
	 * @example "BC011001-123456"
	 */
	documentReference?: string;
	/**
	 * Sent from Front Office?
	 * @example false
	 */
	fromFrontOffice?: boolean;
}

export interface DocumentToSave {
	/**
	 * Document file name
	 * @example "document.pdf"
	 */
	documentName: string;
	/**
	 * Document size in bytes
	 * @example 1024
	 */
	documentSize: number;
	/**
	 * Document mime type
	 * @example "application/pdf"
	 */
	documentType: string;
	/**
	 * Case Id
	 * @example "1"
	 */
	caseId: string;
	/**
	 * Folder Id
	 * @example 123
	 */
	folderId: number;
	/** @example "file_row_1585663020000_7945" */
	fileRowId: string;
	/**
	 * Username
	 * @example "John Keats"
	 */
	username: string;
}

export type DocumentsToSaveManyRequestBody = DocumentToSave[];

export interface DocumentsToUpdateRequestBody {
	/**
	 * Published status to set. Optional
	 * @example "not_checked"
	 */
	status?: 'not_checked' | 'checked' | 'ready_to_publish' | 'published' | 'not_published';
	/**
	 * Set redaction status to redacted. Optional
	 * @example true
	 */
	redacted?: boolean;
	documents?: {
		/**
		 * Document guid
		 * @example "00000000-a173-47e2-b4b2-ce7064e0468a"
		 */
		guid?: string;
	}[];
}

export interface DocumentsToPublishRequestBody {
	documents?: {
		/**
		 * Document guid
		 * @example "00000000-a173-47e2-b4b2-ce7064e0468a"
		 */
		guid?: string;
	}[];
	/**
	 * Username
	 * @example "test-user@email.com"
	 */
	username?: string;
}

export interface DocumentProperties {
	/**
	 * Document GUID
	 * @example "ab12cd34-5678-90ef-ghij-klmnopqrstuv"
	 */
	documentGuid?: string;
	/** @example null */
	documentId?: number;
	/**
	 * Document Reference
	 * @example "BC011001-000001"
	 */
	documentRef?: string;
	/**
	 * Folder Id
	 * @example 2
	 */
	folderId?: number;
	/**
	 * Case Reference
	 * @example "BC011001"
	 */
	caseRef?: string;
	/**
	 * Source system of the document
	 * @example "back-office"
	 */
	sourceSystem?: string;
	/**
	 * Back Office blob storage container
	 * @example "Blob-Storage-Container"
	 */
	privateBlobContainer?: string;
	/**
	 * Back Office blob storage path
	 * @example "https://intranet.planninginspectorate.gov.uk/wp-content/uploads/2023/10/Lightbulb-L-and-D.gif"
	 */
	privateBlobPath?: string;
	/** @example null */
	author?: string;
	/**
	 * File Title
	 * @example "Small Doc 1"
	 */
	fileName?: string;
	/**
	 * The original filename
	 * @example "Small1.pdf"
	 */
	originalFilename?: string;
	/**
	 * Date Created Unix timestamp
	 * @example 1696418643
	 */
	dateCreated?: number;
	/**
	 * File size in bytes
	 * @example 1024
	 */
	size?: number;
	/**
	 * Document mime type
	 * @example "application/pdf"
	 */
	mime?: string;
	/**
	 * Published status
	 * @example "ready_to_publish"
	 */
	publishedStatus?: 'not_checked' | 'checked' | 'ready_to_publish' | 'published' | 'not_published';
	/**
	 * Redacted status
	 * @example null
	 */
	redactedStatus?: 'not_redacted' | 'redacted';
	/**
	 * Date published Unix timestamp
	 * @example 1696418643
	 */
	datePublished?: number;
	/** @example null */
	description?: string;
	/**
	 * Document version
	 * @example 2
	 */
	version?: number;
	/** @example null */
	representative?: string;
	/** @example 3 */
	stage?: number;
	/** @example null */
	documentType?: string;
	/** @example "some filter" */
	filter1?: string;
	/** @example "some filter" */
	filter2?: string;
	/**
	 * Examination Timetable reference number
	 * @example null
	 */
	examinationRefNo?: string;
	/**
	 * Document from front office
	 * @example false
	 */
	fromFrontOffice?: boolean;
}

export interface DocumentPropertiesWithAuditHistory {
	/**
	 * Username
	 * @example "ab12cd34-5678-90ef-ghij-klmnopqrstuv"
	 */
	documentGuid?: string;
	/**
	 * Document version
	 * @example 2
	 */
	version?: number;
	/**
	 * Last modified Unix timestamp
	 * @example 1696418643
	 */
	lastModified?: number;
	/** @example null */
	documentType?: string;
	/** @example false */
	published?: boolean;
	/**
	 * Source system of the document
	 * @example "back-office"
	 */
	sourceSystem?: string;
	/** @example null */
	origin?: string;
	/**
	 * The original filename
	 * @example "Small1.pdf"
	 */
	originalFilename?: string;
	/**
	 * File Title
	 * @example "Small Doc 1"
	 */
	fileName?: string;
	/** @example null */
	representative?: string;
	/** @example null */
	description?: string;
	/** @example null */
	owner?: string;
	/** @example null */
	author?: string;
	/** @example null */
	securityClassification?: string;
	/**
	 * Document mime type
	 * @example "application/pdf"
	 */
	mime?: string;
	/** @example null */
	horizonDataID?: string;
	/** @example null */
	fileMD5?: string;
	/** @example null */
	virusCheckStatus?: string;
	/**
	 * File size in bytes
	 * @example 1024
	 */
	size?: number;
	/** @example 3 */
	stage?: number;
	/** @example "some filter" */
	filter1?: string;
	/**
	 * Back Office blob storage container
	 * @example "Blob-Storage-Container"
	 */
	privateBlobContainer?: string;
	/**
	 * Back Office blob storage path
	 * @example "https://intranet.planninginspectorate.gov.uk/wp-content/uploads/2023/10/Lightbulb-L-and-D.gif"
	 */
	privateBlobPath?: string;
	/**
	 * Published blob storage container
	 * @example null
	 */
	publishedBlobContainer?: string;
	/**
	 * Published blob storage path
	 * @example null
	 */
	publishedBlobPath?: string;
	/**
	 * Date Created Unix timestamp
	 * @example 1696418643
	 */
	dateCreated?: number;
	/**
	 * Date published Unix timestamp
	 * @example 1696418643
	 */
	datePublished?: number;
	/**
	 * Is the document marked as deleted
	 * @example false
	 */
	isDeleted?: boolean;
	/**
	 * Examination Timetable reference number
	 * @example null
	 */
	examinationRefNo?: string;
	/** @example "some filter" */
	filter2?: string;
	/**
	 * Published status
	 * @example "ready_to_publish"
	 */
	publishedStatus?: 'not_checked' | 'checked' | 'ready_to_publish' | 'published' | 'not_published';
	/**
	 * The previous status
	 * @example "not_checked"
	 */
	publishedStatusPrev?:
		| 'not_checked'
		| 'checked'
		| 'ready_to_publish'
		| 'published'
		| 'not_published';
	DocumentActivityLog?: DocumentActivityLog[];
	history?: {
		uploaded?: {
			/**
			 * UTC timestamp
			 * @example 1696418643
			 */
			date?: number;
			/**
			 * User
			 * @example "test-user@email.com"
			 */
			name?: string;
		};
	};
}

export type DocumentPropertiesWithAllVersionWithAuditHistory = DocumentPropertiesWithAuditHistory[];

export interface DocumentBlobStoragePayload {
	/**
	 * URL to the File
	 * @example "application"
	 */
	caseType: 'appeal' | 'application';
	/**
	 * Case Reference
	 * @example "1"
	 */
	caseReference: string;
	/**
	 * Document name
	 * @example "document.pdf"
	 */
	documentName: string;
	/** @example "" */
	documentReference?: string | null;
	/**
	 * Document guid
	 * @example "00000000-a173-47e2-b4b2-ce7064e0468a"
	 */
	GUID: string;
	/**
	 * Document version
	 * @example 1
	 */
	version: number;
}

export interface DocumentAndBlobStorageDetail {
	/**
	 * URL to the File
	 * @example "/some/path/document.pdf"
	 */
	blobStoreUrl?: string;
	/**
	 * URL to the File
	 * @example "application"
	 */
	caseType?: 'appeal' | 'application';
	/**
	 * Case Reference
	 * @example "1"
	 */
	caseReference?: string;
	/**
	 * Document name
	 * @example "document.pdf"
	 */
	documentName?: string;
	/**
	 * Document guid
	 * @example "00000000-a173-47e2-b4b2-ce7064e0468a"
	 */
	GUID?: string;
}

export interface DocumentAndBlobInfoResponse {
	/**
	 * Blob Storage host name
	 * @example "blob-storage-host"
	 */
	blobStorageHost?: string;
	/**
	 * Private Blob Storage container name
	 * @example "blob-storage-container"
	 */
	privateBlobContainer?: string;
	document?: DocumentAndBlobStorageDetail;
}

export interface DocumentAndBlobInfoManyResponse {
	/**
	 * Blob Storage host name
	 * @example "blob-storage-host"
	 */
	blobStorageHost?: string;
	/**
	 * Private Blob Storage container name
	 * @example "blob-storage-container"
	 */
	privateBlobContainer?: string;
	documents?: DocumentAndBlobStorageDetail[];
}

export interface DocumentsUploadPartialFailed {
	/**
	 * Blob Storage host name
	 * @example "blob-storage-host"
	 */
	blobStorageHost?: string;
	/**
	 * Private Blob Storage container name
	 * @example "blob-storage-container"
	 */
	privateBlobContainer?: string;
	documents?: DocumentAndBlobStorageDetail[];
	failedDocuments?: string[];
	duplicates?: string[];
}

export interface DocumentsUploadFailed {
	failedDocuments?: string[];
	duplicates?: string[];
}

export type DocumentsPublished = {
	/**
	 * Document guid
	 * @example "00000000-a173-47e2-b4b2-ce7064e0468a"
	 */
	guid?: string;
	/**
	 * Published status to set. Optional
	 * @example "not_checked"
	 */
	publishedStatus?: 'not_checked' | 'checked' | 'ready_to_publish' | 'published' | 'not_published';
}[];

export interface DocumentVersionUpsertRequestBody {
	/**
	 * Document version
	 * @example 2
	 */
	version?: number;
	/**
	 * Source system of the document
	 * @example "back-office"
	 */
	sourceSystem?: string;
	/**
	 * Username
	 * @example "ab12cd34-5678-90ef-ghij-klmnopqrstuv"
	 */
	documentGuid?: string;
	/**
	 * File Title
	 * @example "Small Doc 1"
	 */
	fileName?: string;
	/**
	 * Date published UTC
	 * @example "2022-12-21T12:42:40.885Z"
	 */
	datePublished?: string;
	/**
	 * Back Office blob storage container
	 * @example "Blob-Storage-Container"
	 */
	privateBlobContainer?: string;
	/**
	 * Back Office blob storage path
	 * @example "/documents/123.pdf"
	 */
	privateBlobPath?: string;
	/** @example "John Keats" */
	author?: string;
	/**
	 * Date created UTC
	 * @example "2022-12-21T12:42:40.885Z"
	 */
	dateCreated?: string;
	/**
	 * Published status
	 * @example "ready_to_publish"
	 */
	publishedStatus?: 'not_checked' | 'checked' | 'ready_to_publish' | 'published' | 'not_published';
	/**
	 * Redacted status
	 * @example null
	 */
	redactedStatus?: 'not_redacted' | 'redacted';
	/**
	 * File size in bytes
	 * @example 1024
	 */
	size?: number;
	/**
	 * Document mime type
	 * @example "application/pdf"
	 */
	mime?: string;
	/**
	 * This is a sample document
	 * @example null
	 */
	description?: string;
	/** @example "Jane Doe" */
	representative?: string;
	/** @example "some filter value" */
	filter1?: string;
	/** @example "some filter value" */
	filter2?: string;
	/** @example "contract" */
	documentType?: string;
	/**
	 * Case Reference
	 * @example "BC011001"
	 */
	caseRef?: string;
	/**
	 * Examination Timetable reference number
	 * @example "EXM-456"
	 */
	examinationRefNo?: string;
}

export interface DocumentsToUnpublishRequestBody {
	documents?: {
		/** @example "0084b156-006b-48b1-a47f-e7176414db29" */
		guid?: string;
	}[];
}

export interface DocumentsUnpublishResponseBody {
	errors?: {
		guid?: string;
		msg?: msg;
	}[];
	successful?: string[];
}

export interface PaginationRequestBody {
	/**
	 * Page number requested
	 * @example 1
	 */
	pageNumber?: number;
	/**
	 * Max number of items per page
	 * @example 1
	 */
	pageSize?: number;
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
	projectUpdateId: number;
	/** @min 0 */
	subscriptionId: number;
	/**
	 * the date this notification was handled
	 * @format date-time
	 * @example "2022-12-21T12:42:40.885Z"
	 */
	entryDate: string;
	/** whether an email was successfully sent */
	emailSent: boolean;
	/** the ID of the Azure function run that handled this entry */
	functionInvocationId: string;
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

export interface SubscriptionGetRequest {
	/** @example "SOMEREF" */
	caseReference: string;
	/** @example "me@example.com" */
	emailAddress: string;
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
