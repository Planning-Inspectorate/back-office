import {
	DocumentationCategory,
	DocumentationFile,
	PaginatedResponse
} from '../../../applications.types';

export interface CaseDocumentationProps {
	subFolders: DocumentationCategory[] | null;
	documentationFiles: PaginatedResponse<DocumentationFile>;
	pagination: {
		dropdownItems: { value: number; text: number; selected: boolean }[];
		buttons: {
			previous?: { href: string };
			next?: { href: string };
			items: { number: number; href: string; current: boolean }[];
		};
	};
}

export interface CaseDocumentationBody {
	selectedFilesIds: string[];
}

export interface CaseDocumentationUploadProps {
	currentFolder: DocumentationCategory;
	caseId: string;
}
