import 'accessible-autocomplete';

// on page load, progressively enhance all <select> elements with the
// "accessible-autocomplete" class
window.addEventListener('DOMContentLoaded', function () {
	for (const element of document.querySelectorAll('select.accessible-autocomplete')) {
		window.accessibleAutocomplete.enhanceSelectElement({
			defaultValue: '',
			selectElement: element
		});
	}
});
