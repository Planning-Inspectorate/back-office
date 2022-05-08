import { AccountInfo, TokenClaims } from '@azure/msal-common';
import { CamelCasedProperties } from 'type-fest';

export interface PlanningInspectorAccountInfo extends Omit<AccountInfo, 'idTokenClaims'> {
	idTokenClaims: CamelCasedProperties<TokenClaims> & {
		claimName?: unknown;
		claimSources?: unknown;
		groups?: string[];
		roles?: string[];
	};
}
