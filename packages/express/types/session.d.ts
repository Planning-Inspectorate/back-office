import { AuthorizationUrlRequest, AuthorizationCodeRequest } from '@azure/msal-node';
import { PlanningInspectorAccountInfo } from '@pins/platform';

// Extending express session
declare module 'express-session' {
	interface SessionData {
		id: string;
		key: string;
		nonce: string;
		isAuthenticated: boolean;
		hasAccess: boolean;
		account: PlanningInspectorAccountInfo;
		authCodeRequest: AuthorizationUrlRequest;
		tokenRequest: AuthorizationCodeRequest;
		protectedResources?: {
			[resource: string]: Resource;
		};
	}
}
