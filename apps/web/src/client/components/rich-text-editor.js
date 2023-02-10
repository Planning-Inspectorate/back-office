/* eslint-disable no-unused-vars */
/* eslint-disable no-alert */
// eslint-disable-next-line no-unused-vars
// @ts-ignore
import * as DOMPurify from 'dompurify';
// @ts-ignore
import Squire from 'squire-rte';

const squireWrapper = document.querySelector('.squire');
// const editorsJsWrapper = document.querySelector( '.editorsjs' );
// const pellWrapper = document.querySelector( '.pell' );

// Squire- https://github.com/neilj/Squire
export const renderSquire = () => {
	if (!squireWrapper) return;
	const div = document.querySelector('#squire-rte');
	const button = document.querySelector('#squire-rte-btn');
	const content = document.querySelector('#squire-rte-output');

	const editor = new Squire(div, {
		blockTag: 'p',
		blockAttributes: { class: 'paragraph' },
		tagAttributes: {
			ul: { class: 'UL' },
			ol: { class: 'OL' },
			li: { class: 'listItem' },
			a: { target: '_blank' },
			pre: { class: 'PRE' }
		}
	});

	squireWrapper.addEventListener(
		'click',
		(event) => {
			// @ts-ignore
			const { id, className } = event.target;

			let value = null;

			// @ts-ignore
			if (id && editor && editor[id]) {
				if (className === 'prompt') {
					// eslint-disable-next-line no-alert
					value = prompt('Value:');
				}
				// @ts-ignore
				editor[id](value);
			}
		},
		false
	);

	// @ts-ignore
	button.addEventListener(
		'click',
		() => {
			// @ts-ignore
			const output = editor.getHTML();
			const clean = DOMPurify.sanitize(output, { USE_PROFILES: { html: true } });

			// @ts-ignore
			// console.log('clean', clean);
			// @ts-ignore
			// console.log('removed', DOMPurify.removed);

			content.value = clean;
		},
		false
	);
};
