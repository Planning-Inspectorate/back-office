import {
	DocumentationCategory,
	DocumentationFile,
	PaginatedResponse
} from '../../../applications.types';
import { ValidationErrors } from '@pins/express';

export interface PaginationButtons {
	previous?: { href: string };
	next?: { href: string };
	items: { number: number; href: string; current: boolean }[];
}

export interface CaseDocumentationProps {
	subFolders: DocumentationCategory[] | null;
	items: PaginatedResponse<DocumentationFile>;
	pagination: {
		dropdownItems: { value: number; text: number; selected: boolean }[];
		buttons: PaginationButtons;
	};
	errors?: ValidationErrors;
}

export interface CaseDocumentationBody {
	selectedFilesIds: string[];
	isRedacted: string;
	status: string;
}

export interface CaseDocumentationUploadProps {
	currentFolder: DocumentationCategory;
	caseId: string;
}
