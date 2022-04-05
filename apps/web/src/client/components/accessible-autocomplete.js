// progressively enhance all <select> elements with the "accessible-autocomplete" class
const selectElements = document.querySelectorAll('select.accessible-autocomplete');

if (selectElements.length > 0) {
	import('accessible-autocomplete')
		.then(() => {
			for (const selectElement of selectElements) {
				window.accessibleAutocomplete.enhanceSelectElement({
					defaultValue: '',
					selectElement
				});
			}
		})
		.catch(() => {
			// do nothing, as any page will remain functional
		});
}
