import Editor from '@toast-ui/editor';

/**
 * Initialise the html-content-editor module, used in conjuction with html-content-editor.component.njk
 *
 * Fallbacks to using govukTextarea in the template if there is no JS enabled.
 */
function initHtmlContentEditor() {
	/**
	 * @param {Element} el
	 */
	function initEditor(el) {
		if (!(el instanceof HTMLElement)) {
			return; // not a valid element
		}
		const input = el.parentElement?.getElementsByTagName('input')[0];
		if (!input) {
			return; // not a valid instance
		}
		const editor = new Editor({
			el,
			initialEditType: 'wysiwyg',
			usageStatistics: false,
			hideModeSwitch: true,
			toolbarItems: [['bold', 'link', 'ul']]
		});

		if (input.value) {
			editor.setHTML(input.value);
		}

		// another option here is 'change', but that fires for every key press
		editor.addHook('blur', () => {
			input.value = editor.getHTML();
		});
	}
	// find all the editors on the page, and initialise
	const editors = document.getElementsByClassName('html-content-editor');
	for (const el of editors) {
		initEditor(el);
	}
}

export default initHtmlContentEditor;
