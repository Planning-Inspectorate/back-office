import { ProjectUpdate } from '@pins/applications';

export type Result<T> = IteratorResult<PageResponse<T>>;

export type Request<T> = (page: number, pageSize: number) => Promise<PageResponse<T>>;

export interface PageResponse<T> {
	page: number;
	pageSize: number;
	pageCount: number;
	itemCount: number;
	items: T[];
}

export interface ExtendedProjectUpdate extends ProjectUpdate {
	projectName: string;
	projectNameWelsh: string;
}

export type GenerateProjectLink = (caseReference: string) => string;
export type GenerateUnsubscribeLink = (caseReference: string, emailAddress: string) => string;
