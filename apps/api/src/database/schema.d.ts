import * as schema from '@prisma/client';
import { ZoomLevel } from '@prisma/client';
import { GridReference } from 'packages/applications';
import { string_to_uuid } from 'rhea/typings/util';

export {
	Address,
	BatchPayload,
	CaseStatus,
	Document,
	DocumentUpdateInput,
	DocumentVersion,
	DocumentVersionUpdateInput,
	DocumentVersionUpsertInput,
	DocumentActivityLog,
	ExaminationTimetableItem,
	ExaminationTimetableType,
	ExaminationTimetable,
	GridReference,
	Region,
	RegionsOnApplicationDetails,
	Representation,
	Sector,
	SubSector,
	ZoomLevel,
	ProjectTeam
} from '@prisma/client';

export interface Case extends schema.Case {
	CaseStatus?: CaseStatus;
	CasePublishedState?: CasePublishedState;
	applicant?: ServiceUser;
	ApplicationDetails?: ApplicationDetails | null;
	gridReference?: GridReference | null;
}

export interface Folder extends schema.Folder {
	case?: Case;
	parentFolder?: Folder;
}

export interface ApplicationDetails extends schema.ApplicationDetails {
	regions?: Region[];
	zoomLevel?: ZoomLevel;
	subSector?: SubSector | null;
}

export interface SubSector extends schema.SubSector {
	sector?: schema.Sector;
}

export interface ServiceUser extends schema.ServiceUser {
	address?: schema.Address;
}

export type SubscriptionWithServiceUser = schema.Prisma.SubscriptionGetPayload<{
	include: { serviceUser: { include: { address: true } } };
}>;

export type CaseStatusNameType =
	| 'Pre-application'
	| 'Acceptance'
	| 'Pre-examination'
	| 'Examination'
	| 'Recommendation'
	| 'Decision'
	| 'Post decision'
	| 'Withdrawn';

export interface DocumentDetails {
	documentId: number | null;
	sourceSystem: string;
	documentGuid: string | null;
	fileName: String;
	originalFilename: string;
	version;
	datePublished: number | null;
	privateBlobPath: string | null;
	privateBlobContainer: string;
	author: string;
	dateCreated: number | null;
	publishedStatus: string;
	redactedStatus: string;
	size: number;
	mime: string;
	description: string | null;
	version: number | null;
	representative: string | null;
	stage: string | null;
	filter1: string | null;
	filter2: string | null;
	documentType: string | null;
	caseRef: string | null;
	examinationRefNo: string;
	transcript: string | null;
}

export interface DocumentVersion extends schema.DocumentVersion {}

export interface DocumentWithSubTables extends schema.Document {
	folder: Folder;
	case: Case;
	latestDocumentVersion: DocumentVersion;
}

export interface DocumentVersionWithDocument extends DocumentVersion {
	documentName?: string;
	Document?: DocumentWithSubTables;
}

export interface DocumentVersionWithDocumentAndActivityLog extends DocumentVersion {
	documentName?: string;
	Document?: DocumentWithSubTables;
	DocumentActivityLog?: DocumentActivityLog;
}

export interface DocumentVersionInput extends DocumentVersion {
	documentName?: string;
}

export interface DocumentMetadata extends schema.DocumentMetadata {}

export interface ExaminationTimetableType extends schema.ExaminationTimetableType {}

export interface S51Advice extends schema.S51Advice {}

export interface S51AdviceDocument extends schema.S51AdviceDocument {}
export interface CreateS51AdviceDocument {
	adviceId: number;
	documentGuid: string;
}
