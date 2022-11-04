import { DocumentationCategory, DocumentationFile } from '../../../applications.types';

export interface DocumentationPageProps {
	caseId: number;
	currentFolder: DocumentationCategory | null;
	folderTree: DocumentationCategory[] | null;
	documentationFiles: DocumentationFile[] | null;
}
