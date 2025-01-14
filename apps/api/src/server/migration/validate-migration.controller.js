import { getByRef as getCaseByRef, getById as getCaseById } from '#repositories/case.repository.js';
import { getManyS51AdviceOnCase as getS51AdviceByCaseId } from '#repositories/s51-advice.repository.js';
import { getByCaseId as getRepresentationsByCaseId } from '#repositories/representation.repository.js';
import { getByCaseId as getExamTimetableByCaseId } from '#repositories/examination-timetable.repository.js';
import { getDocumentVersionsByCaseId } from '#repositories/document.repository.js';
import { getByExaminationTimetableId as getExamTimetableItems } from '#repositories/examination-timetable-items.repository.js';
import { getByCaseId as getServiceUsersByCaseId } from '#repositories/service-user.repository.js';
import { buildNsipProjectPayload } from '#infrastructure/payload-builders/nsip-project.js';

const MAX_VALUE = 99999;
/**
 * @type {import("express").RequestHandler<{modelType: string}, ?, any[]>}
 */
export const validateMigration = async (req, res) => {
	if (!req.query.caseReferences || req.query.caseReferences.length === 0) {
		res.status(400).send({ message: 'caseReferences are required' });
		return;
	}

	const caseReferences = Array.isArray(req.query.caseReferences)
		? req.query.caseReferences
		: [req.query.caseReferences];
	const data = {};

	for (const caseReference of caseReferences) {
		const project = await getCaseByRef(caseReference);
		if (!project) {
			data[caseReferences] = null;
			continue;
		}
		const caseId = project.id;

		const projectWithAllData = await getCaseById(caseId, {
			subSector: true,
			sector: true,
			applicationDetails: true,
			zoomLevel: true,
			regions: true,
			caseStatus: true,
			casePublishedState: true,
			applicant: true,
			gridReference: true,
			projectTeam: true
		});

		if (!projectWithAllData) {
			data[caseReferences] = null;
			continue;
		}

		const allEntities = await Promise.all([
			getS51AdviceByCaseId({ caseId, skipValue: 0, pageSize: MAX_VALUE }),
			getDocumentVersionsByCaseId(caseId),
			getRepresentationsByCaseId(caseId, { page: 1, pageSize: MAX_VALUE }, {}),
			getExamTimetableByCaseId(caseId),
			getServiceUsersByCaseId(caseId)
		]);

		const [s51Advice, documents, { items: representations }, examTimetable, serviceUsers] =
			allEntities;

		const examTimetableItems = examTimetable?.id
			? await getExamTimetableItems(examTimetable.id)
			: [];

		data[caseReference] = {
			project: buildNsipProjectPayload(projectWithAllData),
			serviceUsers,
			documents,
			s51Advice,
			representations,
			examTimetableItems
		};
	}

	res.status(200).send(data);
};
