import { createUniqueId } from '@pins/platform/testing';
import sub from 'date-fns/sub/index.js';
import add from 'date-fns/add/index.js';
import min from 'date-fns/min/index.js';
import { random } from 'lodash-es';
import { createAddress } from './address.js';
import { createAppellant } from './appellant.js';
import { createAppealStatus } from './appeal-status.js';
import { createAppealReference, getRandomLocalPlanningDepartment, createPlanningApplicationReference } from './util.js';
import { createAppealType } from './appeal-type.js';
import { createDocument } from './document.js';

/** @typedef {Omit<import('@pins/api').Schema.AppealStatus, 'appealId'>} AppealStatusData */
/** @typedef {import('@pins/api').Schema.Appeal} Appeal */
/** @typedef {import('@pins/api').Schema.AppealTypeCode} AppealTypeCode */
/** @typedef {Omit<Appeal, 'appealType' | 'appealTypeId' | 'appealStatus'> & { appealTypeCode: AppealTypeCode; appealStatus: AppealStatusData[] }} AppealData */

/**
 * @param {Partial<AppealData>} [options={}]
 * @returns {Appeal}
 */
export function createAppeal({
	id = createUniqueId(),
	appealTypeCode = 'HAS',
	appealStatus = [createAppealStatus({ appealId: id })],
	planningApplicationReference = createPlanningApplicationReference(),
	localPlanningDepartment = getRandomLocalPlanningDepartment(),
	createdAt = sub(new Date(), { weeks: random(1, 6) }),
	startedAt = min([new Date(), add(createdAt, { days: random(1, 42) })]),
	updatedAt = startedAt || createdAt,
	address = createAddress(),
	reference = createAppealReference({ prefix: appealTypeCode }),
	appellant = createAppellant(),
	userId = null,
	documents = [
		createDocument({ type: 'planning application form' })
	],
	validationDecision = [],
	...other
} = {}) {
	const appealType = createAppealType({ shorthand: appealTypeCode });

	return {
		id,
		reference,
		appellant,
		appellantId: appellant.id,
		appealStatus: appealStatus.map((item) => ({ ...item, appealId: id })),
		appealType,
		appealTypeId: appealType.id,
		address,
		addressId: address.id,
		planningApplicationReference,
		localPlanningDepartment,
		createdAt,
		startedAt,
		updatedAt,
		userId,
		documents,
		validationDecision,
		...other
	};
}
