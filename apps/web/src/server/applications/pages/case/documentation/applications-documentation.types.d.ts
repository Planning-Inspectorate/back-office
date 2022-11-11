import { DocumentationCategory, DocumentationFile } from '../../../applications.types';

export interface DocumentationPageProps {
	caseId: number;
	currentFolder: DocumentationCategory | null;
	folderPath: DocumentationCategory[] | null;
	subFolders: DocumentationCategory[] | null;
	documentationFiles: DocumentationFile[] | null;
}

export interface CaseDocumentationUploadProps {
	currentFolder: DocumentationCategory;
	caseId: string;
}
