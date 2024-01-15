export type VirusCheckStatus = 'not_scanned' | 'scanned' | 'affected' | null;
export type RedactedStatus = 'not_redacted' | 'redacted' | null;
export type PublishedStatus =
	| 'not_checked'
	| 'checked'
	| 'ready_to_publish'
	| 'do_not_publish'
	| 'publishing'
	| 'published'
	| 'archived'
	| null;
export type SecurityClassification = 'public' | 'official' | 'secret' | 'top-secret' | null;
export type SourceSystem =
	| 'back-office-appeals'
	| 'back-office-applications'
	| 'horizon'
	| 'ni_file'
	| 'sharepoint'
	| null;
export type Origin = 'pins' | 'citizen' | 'lpa' | 'ogd' | null;
export type Stage =
	| 'draft'
	| 'pre-application'
	| 'acceptance'
	| 'pre-examination'
	| 'examination'
	| 'recommendation'
	| 'decision'
	| 'post_decision'
	| 'withdrawn'
	| 'developers_application'
	| null;

export interface NSIPDocument {
	documentId: string;
	caseRef?: string;
	caseId: number;
	documentReference?: string | null;
	version: number | null;
	examinationRefNo: string | null;
	filename: string | null;
	originalFilename: string | null;
	size: number | null;
	mime: string | null;
	documentURI?: string;
	publishedDocumentURI?: string;
	virusCheckStatus: VirusCheckStatus;
	fileMD5: string | null;
	dateCreated: string | null;
	lastModified?: string;
	redactedStatus: RedactedStatus;
	publishedStatus: PublishedStatus;
	datePublished?: string;
	documentType: string | null;
	securityClassification: SecurityClassification;
	sourceSystem: SourceSystem;
	origin: Origin;
	owner: string | null;
	author: string | null;
	representative: string | null;
	description: string | null;
	stage: Stage;
	filter1: string | null;
	filter2: string | null;
	horizonFolderId: string | null;
	transcriptId: string | null;
}
