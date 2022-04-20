import {
    AccountInfo,
	AuthorizationUrlRequest,
    AuthorizationCodeRequest
} from "@azure/msal-node";

// Extending express session
declare module "express-session" {
    interface SessionData {
        id: string;
        key: string;
        nonce: string;
        isAuthenticated: boolean;
        hasAccess: boolean;
        account: AccountInfo;
        authCodeRequest: AuthorizationUrlRequest;
        tokenRequest: AuthorizationCodeRequest;
        protectedResources?: {
            [resource: string]: Resource;
        };
    }
};

export type AuthCodeParams = {
    authority: string;
    scopes: string[];
    state: string;
    redirect: string;
    prompt?: string;
    account?: AccountInfo;
};

export type AccessRule = {
    methods: string[];
    roles?: string[];
    groups?: string[];
};

export type GuardOptions = {
	accessRule?: AccessRule
}
