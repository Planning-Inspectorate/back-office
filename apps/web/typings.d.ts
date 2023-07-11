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

declare module 'sanitize-html' {
	export default function (content: string, options: any): string;
}
