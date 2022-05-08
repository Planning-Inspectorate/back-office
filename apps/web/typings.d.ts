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
