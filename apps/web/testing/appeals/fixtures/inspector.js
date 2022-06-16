import sub from 'date-fns/sub/index.js';
import { createAddress } from '../factory/address.js';
import { createAppeal } from '../factory/appeal.js';
import { createAppealDetailsFromAppellant } from '../factory/appeal-details-from-appellant.js';
import { createAppealStatus } from '../factory/appeal-status.js';
import { createAppellant } from '../factory/appellant.js';
import { createSiteVisit } from '../factory/site-visit.js';
import { createValidValidationDecision } from '../factory/validation-decision.js';
import { inspector } from '../formatters/appeal.js';
import { documents } from './document.js';
import { lpaQuestionnaire } from './lpa-questionnaire.js';

/** @typedef {import('@pins/appeals').Inspector.Appeal} InspectorAppeal */
/** @typedef {import('@pins/appeals').Inspector.AppealSummary} InspectorAppealSummary */

/**
 * @param {Partial<import('../factory/appeal').AppealData> & { id: number }} appealData
 * @returns {[InspectorAppeal, InspectorAppealSummary]}
 */
const createAppealFixtures = ({ id, ...appealData }) => {
	const appeal = createAppeal({
		id,
		appellant: createAppellant({ name: `Cliff Montgomery ${id}` }),
		planningApplicationReference: `00/01/${String(id).padStart(4, '0')}`,
		localPlanningDepartment: 'Barnsley Metropolitan Borough Council',
		reference: `INS/A0000/A/00/0000${id}`,
		createdAt: new Date(2022, 0, 1),
		startedAt: sub(new Date(), { days: id }),
		userId: 1,
		appealDetailsFromAppellant: createAppealDetailsFromAppellant(),
		address: createAddress({
			addressLine1: `London Industrial Park – Unit ${id}`,
			addressLine2: 'Alpine Way',
			town: 'London',
			postcode: 'E6 6LA'
		}),
		documents,
		lpaQuestionnaire,
		validationDecision: [
			createValidValidationDecision({
				descriptionOfDevelopment: 'A nice grassy patch.'
			})
		],
		...appealData
	});

	return [inspector.formatAppealDetails(appeal), inspector.formatAppealSummary(appeal)];
};

export const [appealDetailsForUnbookedSiteVisit, appealSummaryForUnbookedSiteVisit] =
	createAppealFixtures({
		id: 301,
		appealStatus: [createAppealStatus({ status: 'site_visit_not_yet_booked' })]
	});

export const [appealDetailsForBookedSiteVisit, appealSummaryForBookedSiteVisit] =
	createAppealFixtures({
		id: 302,
		appealStatus: [createAppealStatus({ status: 'site_visit_booked' })],
		siteVisit: createSiteVisit({ visitDate: new Date(2030, 0, 1) })
	});

export const [appealDetailsForDecisionDue, appealSummaryForDecisionDue] = createAppealFixtures({
	id: 303,
	appealStatus: [createAppealStatus({ status: 'decision_due' })],
	siteVisit: createSiteVisit({ visitDate: new Date(2022, 0, 1) })
});

export const [appealDetailsForPendingStatements] = createAppealFixtures({
	id: 304,
	appealStatus: [
		createAppealStatus({
			status: 'site_visit_not_yet_booked',
			subStateMachineName: 'lpaQuestionnaireAndInspectorPickup'
		}),
		createAppealStatus({
			status: 'available_for_statements',
			subStateMachineName: 'statementsAndFinalComments',
			createdAt: new Date(2030, 0, 1)
		})
	]
});
