import { ValidationErrors } from '@pins/express/types/express.js';

export interface AssignUserCheckAndConfirmPageContent {
	appeal: {
		id: string;
		reference: string;
		shortReference: string | null | undefined;
	};
	user: Object | undefined;
	existingUser: Object | null | undefined;
	isInspector: boolean;
	isUnassign: boolean;
	errors: ValidationErrors | undefined;
}

export interface AssignNewUserPageContent {
	appeal: {
		id: string;
		reference: string;
		shortReference: string | null | undefined;
	};
	isInspector: boolean;
	errors: ValidationErrors | undefined;
}
