import { patch } from '../../../../../lib/request.js';

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const postChangeEdit = async (req, res) => {
	const { caseId, representationId } = req.params;
	const { editedRepresentation, editNotes } = req.body;

	await patch(`applications/${caseId}/representations/${representationId}/edit`, {
		json: {
			editedRepresentation,
			editNotes
		}
	});

	res.status(200).json({ message: 'edit successful' });
};
