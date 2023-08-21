import Editor from '@toast-ui/editor';

/**
 * Initialise the html-content-editor module, used in conjuction with html-content-editor.component.njk
 *
 * Resulting input value is URI-encoded.
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
			toolbarItems: [['bold', 'link', 'ul']],
			events: {
				keydown(_, ev) {
					// there is no option not to handle tab, but this is an accessibility issue
					// we want tab to move to the next tab element, not insert spaces
					if (ev.key === 'Tab') {
						// by throwing an error, the other handlers don't run and
						// tab get handled by the browser
						throw new Error('no error: override tab handler');
					}
				}
			}
		});

		if (input.value) {
			editor.setHTML(decodeURI(input.value));
		}
		const editBox = editor.getEditorElements().wwEditor;
		const charCount = el.parentElement?.getElementsByClassName('character-count')[0];
		const charCountWarning = el.parentElement?.getElementsByClassName('character-count-warning')[0];

		function updateCharacterCount() {
			if (!charCount) {
				return;
			}
			const text = editBox.innerText || editBox.textContent || '';
			charCount.textContent = text.length.toString();
			if (!charCountWarning || !(charCountWarning instanceof HTMLElement)) {
				return;
			}
			const limit = charCountWarning.dataset.characterCountLimit;
			if (!limit) {
				return;
			}
			const showWarning = text.length > parseInt(limit);
			console.log('showWanring', { showWarning, length: text.length, limit: parseInt(limit) });
			charCountWarning.style.setProperty('display', showWarning ? 'block' : 'none', 'important');
		}

		// another option here is 'change', but that fires for every key press
		editor.addHook('blur', () => {
			input.value = encodeURI(editor.getHTML());
			updateCharacterCount();
		});
		if (!charCount) {
			return; // not always enabled, don't add the listener unless we need it
		}
		editor.addHook('change', () => {
			updateCharacterCount();
		});
		updateCharacterCount(); // update for any existing content
	}
	// find all the editors on the page, and initialise
	const editors = document.getElementsByClassName('html-content-editor');
	for (const el of editors) {
		initEditor(el);
	}
}

export default initHtmlContentEditor;
