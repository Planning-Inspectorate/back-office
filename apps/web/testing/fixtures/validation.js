import { createAddress } from '../factory/address.js';
import { createAppealStatus } from '../factory/appeal-status.js';
import { createAppeal } from '../factory/appeal.js';
import { createAppellant } from '../factory/appellant.js';
import { createDocument } from '../factory/document.js';
import { createIncompleteValidationDecision } from '../factory/validation-decision.js';
import { validation } from '../formatters/appeal.js';

/** @typedef {import('@pins/appeals').Validation.Appeal} Appeal */
/** @typedef {import('@pins/appeals').Validation.AppealSummary} AppealSummary */

const receivedAppeal = createAppeal({
	id: 1,
	reference: 'APP/B7676/J/07/8431690',
	planningApplicationReference: '53/70/5345',
	localPlanningDepartment: 'Barnsley Metropolitan Borough Council',
	createdAt: new Date(2022, 0, 1),
	appellant: createAppellant({ name: 'Herbert Appleton' }),
	address: createAddress({
		addressLine1: 'Temple Quay House',
		addressLine2: '2 The Square',
		town: 'Bristol',
		postcode: 'BS1 6PN'
	}),
	documents: [
		createDocument({ type: 'appeal statement' }),
		createDocument({ type: 'decision letter' }),
		createDocument({ type: 'planning application form' }),
		createDocument({ type: 'supporting document' })
	]
});

export const receivedAppealDetails = validation.formatAppealDetails(receivedAppeal);
export const receivedAppealSummary = validation.formatAppealSummary(receivedAppeal);

const incompleteAppeal = createAppeal({
	id: 2,
	appealStatus: [createAppealStatus({ status: 'awaiting_validation_info' })],
	reference: 'APP/B7676/J/07/1000000',
	planningApplicationReference: '39/77/1117',
	localPlanningDepartment: 'Waveney District Council',
	createdAt: new Date(2022, 0, 1),
	appellant: createAppellant({ name: 'Jennifer Honey' }),
	address: createAddress({
		addressLine1: 'Temple Quay House',
		addressLine2: '2 The Square',
		town: 'Bristol',
		postcode: 'BS1 6PN'
	}),
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

export const incompleteAppealDetails = validation.formatAppealDetails(incompleteAppeal);
export const incompleteAppealSummary = validation.formatAppealSummary(incompleteAppeal);
