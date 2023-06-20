/**
 * @jest-environment jsdom
 */

// TODO: investigate why Jest PAI functions not defined
/* eslint-disable no-undef */
// @ts-nocheck
import initExcerpt from '../excerpt.js';

const DOM = `
<div class="excerpt">
    <div class="excerpt-summary" id="summary">
        The applicant has agreed that all application documents can be published as soon as practicable to help everyone become familiar with the detail of what is being proposed in this application. The...

        <noscript>
            <details class="govuk-details govuk-!-margin-bottom-1 govuk-!-margin-top-4" data-module="govuk-details">
            <summary class="govuk-details__summary">
                <span class="govuk-details__summary-text">
                Show full update
                </span>
            </summary>
            <div class="govuk-details__text">
                The applicant has agreed that all application documents can be published as soon as practicable to help everyone become familiar with the detail of what is being proposed in this application. The Planning Inspectorate will therefore make the application documents available as soon as practicable. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.
            </div>
            </details>
        </noscript>
        <p class="govuk-body govuk-!-margin-bottom-1 govuk-!-margin-top-4">
            <a id="show" href="#" class="govuk-link govuk-link--no-visited-state excerpt-link">Show full update</a>
        </p>
    </div>

    <div class="excerpt-full display--none" id="full">
        The applicant has agreed that all application documents can be published as soon as practicable to help everyone become familiar with the detail of what is being proposed in this application. The Planning Inspectorate will therefore make the application documents available as soon as practicable. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.

        <p class="govuk-body govuk-!-margin-bottom-1 govuk-!-margin-top-4">
            <a id="hide" href="#" class="govuk-link govuk-link--no-visited-state excerpt-link">Hide full update</a>
        </p>
    </div>
</div>
`;

document.body.innerHTML = DOM;

initExcerpt();

describe('excerpt', () => {
	describe('toggle content', () => {
		const showLink = document.getElementById('show');
		const hideLink = document.getElementById('hide');

		const summary = document.getElementById('summary');
		const full = document.getElementById('full');

		it('should show content when clicked', async () => {
			await showLink.click();

			expect(summary.style.display).toBe('none');
			expect(full.style.display).toBe('block');
		});

		it('should hide content when clicked', async () => {
			await hideLink.click();

			expect(summary.style.display).toBe('block');
			expect(full.style.display).toBe('none');
		});
	});
});
