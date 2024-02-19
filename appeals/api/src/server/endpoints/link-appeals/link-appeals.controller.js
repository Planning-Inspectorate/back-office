import appealRepository from '#repositories/appeal.repository.js';
import { canLinkAppeals } from './link-appeals.service.js';
import {
	CASE_RELATIONSHIP_LINKED,
	CASE_RELATIONSHIP_RELATED,
	ERROR_LINKING_APPEALS
} from '#endpoints/constants.js';

/** @typedef {import('express').Request} Request */
/** @typedef {import('express').Response} Response */

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<Response>}
 */
export const linkAppeal = async (req, res) => {
	const { linkedAppealId, isCurrentAppealParent } = req.body;
	const currentAppeal = req.appeal;
	const linkedAppeal = await appealRepository.getAppealById(Number(linkedAppealId));

	if (linkedAppeal) {
		const currentAppealType = isCurrentAppealParent ? 'lead' : 'child';
		const linkedAppealType = !isCurrentAppealParent ? 'lead' : 'child';

		if (
			!canLinkAppeals(currentAppeal, currentAppealType) ||
			!canLinkAppeals(linkedAppeal, linkedAppealType)
		) {
			return res.status(400).send({
				errors: {
					body: ERROR_LINKING_APPEALS
				}
			});
		}

		const relationship = isCurrentAppealParent
			? {
					parentId: currentAppeal.id,
					parentRef: currentAppeal.reference,
					childId: linkedAppeal.id,
					childRef: linkedAppeal.reference,
					type: CASE_RELATIONSHIP_LINKED,
					externalSource: false
			  }
			: {
					parentId: linkedAppeal.id,
					parentRef: linkedAppeal.reference,
					childId: currentAppeal.id,
					childRef: currentAppeal.reference,
					type: CASE_RELATIONSHIP_LINKED,
					externalSource: false
			  };

		const result = await appealRepository.linkAppeal(relationship);
		return res.send(result);
	}

	return res.status(404).send({});
};

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<Response>}
 */
export const linkExternalAppeal = async (req, res) => {
	const { isCurrentAppealParent, linkedAppealReference, externalAppealType } = req.body;
	const currentAppeal = req.appeal;
	const currentAppealType = isCurrentAppealParent ? 'lead' : 'child';
	if (!canLinkAppeals(currentAppeal, currentAppealType)) {
		return res.status(400).send({
			errors: {
				body: ERROR_LINKING_APPEALS
			}
		});
	}

	const relationship = isCurrentAppealParent
		? {
				parentId: currentAppeal.id,
				parentRef: currentAppeal.reference,
				childRef: linkedAppealReference,
				childId: null,
				type: CASE_RELATIONSHIP_LINKED,
				externalSource: true,
				externalAppealType
		  }
		: {
				parentId: null,
				parentRef: linkedAppealReference,
				childRef: currentAppeal.reference,
				childId: currentAppeal.id,
				type: CASE_RELATIONSHIP_LINKED,
				externalSource: true,
				externalAppealType
		  };

	const result = await appealRepository.linkAppeal(relationship);
	return res.send(result);
};

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<Response>}
 */
export const associateAppeal = async (req, res) => {
	const { linkedAppealId } = req.body;
	const currentAppeal = req.appeal;
	const appealToRelate = await appealRepository.getAppealById(Number(linkedAppealId));

	if (appealToRelate) {
		const relationship = {
			parentId: currentAppeal.id,
			parentRef: currentAppeal.reference,
			childId: appealToRelate.id,
			childRef: appealToRelate.reference,
			type: CASE_RELATIONSHIP_RELATED,
			externalSource: false
		};

		const result = await appealRepository.linkAppeal(relationship);
		return res.send(result);
	}

	return res.status(404).send({});
};

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<Response>}
 */
export const associateExternalAppeal = async (req, res) => {
	const { linkedAppealReference } = req.body;
	const currentAppeal = req.appeal;
	const relationship = {
		parentId: currentAppeal.id,
		parentRef: currentAppeal.reference,
		childId: null,
		childRef: linkedAppealReference,
		type: CASE_RELATIONSHIP_RELATED,
		externalSource: true
	};
	const result = await appealRepository.linkAppeal(relationship);
	return res.send(result);
};

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<Response>}
 */
export const unlinkAppeal = async (req, res) => {
	const { relationshipId } = req.body;
	await appealRepository.unlinkAppeal(relationshipId);

	return res.status(200).send(true);
};
