import sub from 'date-fns/sub/index.js';
import { createAddress } from '../factory/address.js';
import { createAppealStatus } from '../factory/appeal-status.js';
import { createAppeal } from '../factory/appeal.js';
import { createAppellant } from '../factory/appellant.js';
import { createDocument } from '../factory/document.js';
import { createIncompleteValidationDecision } from '../factory/validation-decision.js';
import { validation } from '../formatters/appeal.js';

/** @typedef {import('../factory/appeal').Appeal} Appeal */
/** @typedef {import('../factory/appeal').AppealData} AppealData */
/** @typedef {import('@pins/appeals').Validation.Appeal} ValidationAppeal */
/** @typedef {import('@pins/appeals').Validation.AppealSummary} ValidationAppealSummary */

/**
 * @param {Partial<AppealData> & { id: number }} appealData
 * @returns {[ValidationAppealSummary, ValidationAppeal]}
 */
const createAppealFixtures = ({ id, ...appealData }) => {
	const appeal = createAppeal({
		id,
		planningApplicationReference: `00/01/${String(id).padStart(4, '0')}`,
		localPlanningDepartment: 'Barnsley Metropolitan Borough Council',
		reference: `VAL/A0000/A/00/0000${id}`,
		createdAt: sub(new Date(), { days: id }),
		startedAt: sub(new Date(), { days: id }),
		appellant: createAppellant({ name: `Cliff Montgomery ${id}` }),
		address: createAddress({
			addressLine1: `London Industrial Park – Unit ${id}`,
			addressLine2: 'Alpine Way',
			town: 'London',
			postcode: 'E6 6LA'
		}),
		documents: [
			createDocument({ type: 'appeal statement' }),
			createDocument({ type: 'decision letter' }),
			createDocument({ type: 'planning application form' }),
			createDocument({ type: 'supporting document' })
		],
		...appealData
	});

	return [validation.formatAppealSummary(appeal), validation.formatAppealDetails(appeal)];
};

export const [receivedAppealSummary, receivedAppealDetails] = createAppealFixtures({
	id: 101
});

export const [incompleteAppealSummary, incompleteAppealDetails] = createAppealFixtures({
	id: 102,
	appealStatus: [createAppealStatus({ status: 'awaiting_validation_info' })],
	validationDecision: [
		createIncompleteValidationDecision({
			appealId: 2,
			namesDoNotMatch: true,
			sensitiveInfo: true,
			missingApplicationForm: true,
			missingDecisionNotice: true,
			missingGroundsForAppeal: true,
			missingSupportingDocuments: false,
			inflammatoryComments: true,
			openedInError: true,
			wrongAppealTypeUsed: true,
			otherReasons: '*'
		})
	]
});
