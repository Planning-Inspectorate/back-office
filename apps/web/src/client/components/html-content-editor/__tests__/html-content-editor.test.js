/**
 * @jest-environment jsdom
 */
import initHtmlContentEditor from '../html-content-editor.js';

const DOM = `
<div class="govuk-form-group">
    <label class="govuk-label govuk-!-font-weight-bold">
        Content
    </label>
    <input type="hidden" name="content">
    <div class="html-content-editor"></div>
	<div class="govuk-hint govuk-!-margin-top-4">You have entered <span class="character-count">0</span> characters.</div>
    <noscript>
        <div class="govuk-form-group">
            <label class="govuk-label govuk-!-font-weight-bold">
                Content
            </label>
            <textarea class="govuk-textarea" id="" name="content" rows="5"></textarea>
        </div>
    </noscript>
</div>
`;

document.body.innerHTML = DOM;

initHtmlContentEditor();

describe('html-content-editor', () => {
	it('should contain only bold/link/list controls', () => {
		const toolbar = document.getElementsByClassName('toastui-editor-toolbar-group')[0];
		if (!(toolbar instanceof HTMLDivElement)) {
			throw new Error('div expected');
		}
		const buttons = toolbar.getElementsByTagName('button');
		expect(buttons.length).toEqual(3);
		expect(buttons.item(0)?.classList.contains('bold')).toEqual(true);
		expect(buttons.item(1)?.classList.contains('link')).toEqual(true);
		expect(buttons.item(2)?.classList.contains('bullet-list')).toEqual(true);
	});

	it('should populate input value when content changes', async () => {
		// first textbox is markdown preview (hidden/not-used)
		const textBox = document.getElementsByClassName('toastui-editor-contents')[1];
		const input = document.getElementsByName('content')[0];
		if (!(textBox instanceof HTMLDivElement)) {
			throw new Error('div expected');
		}
		if (!(input instanceof HTMLInputElement)) {
			throw new Error('input expected');
		}

		const exampleText = '<p>My example content with some <strong>markup</strong></p>';
		// focus -> "type" some text -> blur
		textBox.focus();
		textBox.innerHTML = exampleText;
		textBox.blur();
		// check the hidden input has the correct value - used for form submission
		expect(input.value).toEqual(exampleText);
	});
	it('should count characters', async () => {
		// first textbox is markdown preview (hidden/not-used)
		const textBox = document.getElementsByClassName('toastui-editor-contents')[1];
		const charCount = document.getElementsByClassName('character-count')[0];
		if (!(textBox instanceof HTMLDivElement)) {
			throw new Error('div expected');
		}
		if (!(charCount instanceof HTMLSpanElement)) {
			throw new Error('span expected');
		}

		const exampleText = '<p>My example content with some <strong>markup</strong></p>';
		// focus -> "type" some text -> blur
		textBox.focus();
		textBox.innerHTML = exampleText;
		textBox.blur();
		// check the character count is correct (excluding HTML tags)
		expect(charCount.textContent).toEqual('35');
	});
});
