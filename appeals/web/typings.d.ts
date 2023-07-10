// accessible-autocomplete

declare module 'accessible-autocomplete' {}

declare interface Window {
	accessibleAutocomplete: {
		enhanceSelectElement(options: { selectElement: Element; defaultValue?: string }): void;
	};
}

// govuk-frontend

declare module 'govuk-frontend' {
	export function initAll(): void;
}

// @rollup/plugin-beep

declare module '@rollup/plugin-beep' {
	export default function (): import('rollup').Plugin;
}

// TODO: this is required to allow any custom data to be added to request.session without causing TS errors, however it breaks the other declarations in this file
// // express-session
// import { SessionData } from "express-session";
// declare module 'express-session' {
// 	export interface SessionData {
// 		[key: string]: any;
// 	}
// }
