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
	DocumentActivityLog,
	ExaminationTimetableItem,
	ExaminationTimetableType,
	ExaminationTimetable,
	GridReference,
	Region,
	RegionsOnApplicationDetails,
	Representation,
	RepresentationContact,
	Sector,
	SubSector,
	ZoomLevel
} from '@prisma/client';

export interface Case extends schema.Case {
	CaseStatus?: CaseStatus;
	serviceCustomer?: ServiceCustomer[];
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

export interface ServiceCustomer extends schema.ServiceCustomer {
	address?: schema.Address;
	case?: schema.Case;
}

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

export interface DocumentVersionInput extends DocumentVersion {
	documentName?: string;
}

export interface DocumentMetadata extends schema.DocumentMetadata {}

export interface ExaminationTimetableType extends schema.ExaminationTimetableType {}

export interface S51Advice extends schema.S51Advice {}
