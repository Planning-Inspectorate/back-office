/**
 * Create error banner based on GovUk GDS html
 *
 * @param {string} errorMessage
 * @returns {string}
 */
export const buildErrorBanner = (errorMessage) => {
	return `
	<div class="govuk-grid-row">
        <div class="govuk-grid-column-two-thirds">
          <div class="govuk-error-summary" aria-labelledby="error-summary-title" data-module="govuk-error-summary">
  				<h2 class="govuk-error-summary__title" id="error-summary-title">
    				There is a problem
  				</h2>
			  <div class="govuk-error-summary__body">
				<ul class="govuk-list govuk-error-summary__list">
				  <li>
					<a href="#selectedFilesIds">${errorMessage}</a>
				  </li>
				</ul>
			  </div>
			</div>
		</div>
      </div>`;
};
