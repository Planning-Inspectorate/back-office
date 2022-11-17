import { AccountInfo, AuthenticationResult, TokenClaims } from '@azure/msal-common';
import { CamelCasedProperties } from 'type-fest';

type ExtendedIdTokenClaims = CamelCasedProperties<TokenClaims> & {
	claimName?: unknown;
	claimSources?: unknown;
	groups?: string[];
	roles?: string[];
	nonce?: string;
};

export interface PlanningInspectorAccountInfo extends Omit<AccountInfo, 'idTokenClaims'> {
	idTokenClaims: ExtendedIdTokenClaims;
	accessToken?: string;
	idToken?: string;
	expiresOnTimestamp?: number;
}

export interface MsalAuthenticationResult extends AuthenticationResult {
	account: PlanningInspectorAccountInfo;
	idTokenClaims: ExtendedIdTokenClaims;
}
