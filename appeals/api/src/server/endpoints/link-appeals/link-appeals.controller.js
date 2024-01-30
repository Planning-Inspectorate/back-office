import appealRepository from '#repositories/appeal.repository.js';
import { isAppealLinked } from './link-appeals.service.js';
import { ERROR_LINKING_APPEALS } from '#endpoints/constants.js';

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
	const appealToLink = await appealRepository.getAppealById(Number(linkedAppealId));

	if (appealToLink) {
		if (isAppealLinked(currentAppeal) || isAppealLinked(appealToLink)) {
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
					childId: appealToLink.id,
					childRef: appealToLink.reference
			  }
			: {
					parentId: appealToLink.id,
					parentRef: appealToLink.reference,
					childId: currentAppeal.id,
					childRef: currentAppeal.reference
			  };

		const result = await appealRepository.linkAppeal(relationship);
		return res.send(result);
	}

	return res.status(404);
};

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<Response>}
 */
export const linkExternalAppeal = async (req, res) => {
	const { isCurrentAppealParent, linkedAppealReference } = req.body;
	const currentAppeal = req.appeal;

	if (isAppealLinked(currentAppeal)) {
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
				childId: null
		  }
		: {
				parentId: null,
				parentRef: linkedAppealReference,
				childRef: currentAppeal.reference,
				childId: currentAppeal.id
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
	const { linkedAppealReference } = req.body;
	const currentAppeal = req.appeal;
	await appealRepository.unlinkAppeal(currentAppeal.id, linkedAppealReference);

	return res.status(200).send(true);
};
