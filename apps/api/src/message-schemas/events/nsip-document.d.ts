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
	virusCheckStatus: 'not_scanned' | 'scanned' | 'affected' | null;
	fileMD5: string | null;
	dateCreated: string | null;
	lastModified?: string;
	redactedStatus: 'not_redacted' | 'redacted' | null;
	publishedStatus:
		| 'not_checked'
		| 'checked'
		| 'ready_to_publish'
		| 'do_not_publish'
		| 'publishing'
		| 'published'
		| 'archived'
		| null;
	datePublished?: string;
	documentType: string | null;
	securityClassification: 'public' | 'official' | 'secret' | 'top-secret' | null;
	sourceSystem: 'appeals' | 'back_office' | 'horiozn' | 'ni_file' | 'sharepoint' | null;
	origin: 'pins' | 'citizen' | 'lpa' | 'ogd' | null;
	owner: string | null;
	author: string | null;
	representative: string | null;
	description: string | null;
	stage:
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
	filter1: string | null;
	filter2: string | null;
}
