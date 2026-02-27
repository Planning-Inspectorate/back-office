import { buildDcoStatusHtml } from '../utils/build-dco-status-html.js';
import { DCO_STATUS } from '../../applications/common/constants.js';

describe('apps/web/src/server/lib/utils/build-dco-status-html', () => {
	describe('#buildDcoStatusHtml', () => {
		describe('When building DCO status HTML', () => {
			describe('and there is no dcoStatus', () => {
				it('should return an empty string', () => {
					expect(buildDcoStatusHtml({ additionalDetails: {} })).toBe('');
					expect(buildDcoStatusHtml({})).toBe('');
					expect(buildDcoStatusHtml(/** @type {any} */ (null))).toBe('');
					expect(buildDcoStatusHtml({ additionalDetails: { dcoStatus: '' } })).toBe('');
				});
			});

			describe('and there is a dcoStatus', () => {
				it.each([
					[DCO_STATUS.GRANTED, 'Granted', 'govuk-tag--green'],
					[DCO_STATUS.REFUSED, 'Refused', 'govuk-tag--red'],
					[DCO_STATUS.PARTIALLY_CONSENTED, 'Partially consented', 'govuk-tag--turquoise'],
					[DCO_STATUS.QUASHED, 'Quashed', 'govuk-tag--pink'],
					[DCO_STATUS.REDETERMINATION, 'Redetermination', 'govuk-tag--yellow'],
					[DCO_STATUS.WITHDRAWN, 'Withdrawn', 'govuk-tag--orange']
				])('should apply %s class and %s label', (status, expectedLabel, expectedClass) => {
					const html = buildDcoStatusHtml({ additionalDetails: { dcoStatus: status } });

					expect(html).toBe(`<strong class="govuk-tag ${expectedClass}">${expectedLabel}</strong>`);
				});
			});
		});
	});
});
