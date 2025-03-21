import { registerCase } from '@pins/applications.web/src/server/applications/case/applications-case.locals.js';
import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';
import * as controller from './applications-timetable.controller.js';
import * as validators from './applications-timetable.validators.js';

const applicationsTimetableRouter = createRouter({ mergeParams: true });

applicationsTimetableRouter
	.route('/')
	.get(registerCase, asyncHandler(controller.viewApplicationsCaseTimetableList));

applicationsTimetableRouter
	.route('/item/new')
	.get(asyncHandler(controller.viewApplicationsCaseTimetableNew))
	// click on change from "check-your-answers" page
	.post(asyncHandler(controller.viewApplicationsCaseTimetableDetailsNew));

applicationsTimetableRouter
	.route('/item/edit/:timetableId')
	.get(asyncHandler(controller.viewApplicationsCaseTimetableDetailsEdit))
	// click on change from "check-your-answers" page
	.post(asyncHandler(controller.viewApplicationsCaseTimetableDetailsNew));

applicationsTimetableRouter
	.route('/item/edit/:timetableId/name-welsh')
	.get(asyncHandler(controller.viewApplicationsCaseTimetableItemNameWelsh))
	.post(
		validators.nameWelshValidator,
		asyncHandler(controller.postApplicationsCaseTimetableItemNameWelsh)
	);

applicationsTimetableRouter
	.route('/item/edit/:timetableId/description-welsh')
	.get(asyncHandler(controller.viewApplicationsCaseTimetableItemDescriptionWelsh))
	.post(
		validators.descriptionWelshValidator,
		asyncHandler(controller.postApplicationsCaseTimetableItemDescriptionWelsh)
	);

// click on "Continue" button from details-form
// works for edit and new
applicationsTimetableRouter
	.route('/item/validate')
	.post(
		validators.validatorsDispatcher,
		asyncHandler(controller.postApplicationsCaseTimetableDetails)
	);

// redirect to check-your-answers page
// triggered by Validate controller: no button leads directly here
// works for edit and new
applicationsTimetableRouter
	.route('/item/check-your-answers/:timetableId?')
	.post(asyncHandler(controller.postApplicationsCaseTimetableCheckYourAnswers));

// click on "Save" from "check-your-answers" page
// works for edit and new
applicationsTimetableRouter
	.route('/item/save')
	.post(asyncHandler(controller.postApplicationsCaseTimetableSave));

// Timetable preview for publishing
applicationsTimetableRouter
	.route('/preview')
	.get(registerCase, asyncHandler(controller.viewApplicationsCaseTimetablesPreview))
	.post(registerCase, asyncHandler(controller.publishApplicationsCaseTimetables));

// Timetable preview for unpublishing
applicationsTimetableRouter
	.route('/unpublish-preview')
	.get(registerCase, asyncHandler(controller.viewApplicationsCaseTimetablesUnpublishPreview))
	.post(asyncHandler(controller.unpublishApplicationsCaseTimetables));

applicationsTimetableRouter
	.route('/item/delete/:timetableId')
	.get(registerCase, asyncHandler(controller.viewApplicationsCaseTimetableDelete))
	.post(asyncHandler(controller.deleteApplicationsCaseTimetable));

applicationsTimetableRouter
	.route('/:action/success')
	.get(registerCase, asyncHandler(controller.viewApplicationsCaseTimetableSuccessBanner));

export default applicationsTimetableRouter;
