import { DocumentationCategory, DocumentationFile } from '../../../applications.types';

export interface DocumentationPageProps {
	caseId: number;
	folderId: number;
	folderName: string | undefined;
	folderTree: DocumentationCategory[] | null;
	documentationFiles: DocumentationFile[] | null;
}
