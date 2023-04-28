import config from '@pins/web/environment/config.js';
import { Router as createRouter } from 'express';
import { assertGroupAccess } from '../app/auth/auth.guards.js';
import caseOfficerRouter from '../appeals/case-officer/case-officer.router.js';
import nationalListRouter from '../appeals/national-list/national-list.router.js';
import inspectorRouter from './inspector/inspector.router.js';
import validationRouter from './validation/validation.router.js';
import { findAllAppeals } from './validation/validation.service.js';

const router = createRouter();

router.use('/appeals-list', nationalListRouter);

// TODO: BOAT-64
router.route('/appeal-details/:appealId').get(async (req, response) => {
	const allAppeals = await findAllAppeals();
	const matchingAppeal = allAppeals.find(appeal => {
		const referenceFragments = appeal.AppealReference.split('/');
		const id = referenceFragments?.[referenceFragments.length - 1];

		return id === req.params.appealId;
	});

	const appealReferenceFragments = matchingAppeal?.AppealReference.split('/');

	response.render('appeals/all-appeals/appeal-details.njk', {
		appeal: {
			reference: matchingAppeal?.AppealReference,
			shortReference: appealReferenceFragments?.[appealReferenceFragments.length - 1],
			status: matchingAppeal?.AppealStatus,
			siteAddress: Object.values(matchingAppeal?.AppealSite)?.join(', '),
			localPlanningAuthority: 'Bradford Council',
			type: 'Full planning',
			caseProcedure: 'Written',
			linkedAppeal: 'APP/Q9999/D/21/725284',
			otherAppeals: [
				'APP/Q9999/D/21/726034',
				'APP/Q9999/D/21/726035',
			],
			allocationDetails: 'F / General Allocation',
			lpaReference: '22/00118/FULL',
			developmentType: 'Minor dwellings',
			eventType: 'Site visit (access required)',
			decision: 'Not issued yet',
			documentationStatus: {
				appellantCase: "Complete",
				lpaQuestionnaire: "Overdue",
				statementAndProofs: "Incomplete",
				interestedParties: "Complete",
				finalComments: "Overdue",
				costs: "Not started",
				planningObligation: "None",
				statementOfCommonGround: "None"
			}
		},
		appellant: {
			name: 'Fiona Shall',
		},
		agent: {
			name: 'Naomi Johnson',
		},
		caseOfficer: {
			name: 'Robert Williams',
			email: 'robert.williams@planninginspectorate.gov.uk',
			phone: '0300 027 1289'
		},
		inspector: null
	});
});

router.use(
	'/validation',
	assertGroupAccess(config.referenceData.appeals.validationOfficerGroupId),
	validationRouter
);

router.use(
	'/case-officer',
	assertGroupAccess(config.referenceData.appeals.caseOfficerGroupId),
	caseOfficerRouter
);

router.use(
	'/inspector',
	assertGroupAccess(config.referenceData.appeals.inspectorGroupId),
	inspectorRouter
);

export default router;
