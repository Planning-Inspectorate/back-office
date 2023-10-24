/**
 * nsip-project schema for use in code
 */
export interface NSIPProject {
	caseId: number;
	caseReference?: string | null;
	projectName?: string | null;
	projectDescription?: string | null;
	decision?: 'approved' | 'refused' | 'split-decision';
	publishStatus?: 'published' | 'unpublished';
	sector?: string | null;
	projectType?: string | null;
	sourceSystem: 'back-office-applications' | 'horizon';
	stage?:
		| 'draft'
		| 'pre_application'
		| 'acceptance'
		| 'pre_examination'
		| 'examination'
		| 'recommendation'
		| 'decision'
		| 'post_decision'
		| 'withdrawn';
	projectLocation?: string | null;
	projectEmailAddress?: string | null;
	regions?: (
		| 'east_midlands'
		| 'eastern'
		| 'london'
		| 'north_east'
		| 'north_west'
		| 'south_east'
		| 'south_west'
		| 'wales'
		| 'west_midlands'
		| 'yorkshire_and_the_humber'
	)[];
	transboundary?: boolean;
	easting?: number;
	northing?: number;
	welshLanguage?: boolean;
	mapZoomLevel?:
		| 'country'
		| 'region'
		| 'county'
		| 'borough'
		| 'district'
		| 'city'
		| 'town'
		| 'junction'
		| 'none';
	secretaryOfState?: string | null;
	datePINSFirstNotifiedOfProject?: string | null;
	dateProjectAppearsOnWebsite?: string | null;
	anticipatedSubmissionDateNonSpecific?: string | null;
	anticipatedDateOfSubmission?: string | null;
	screeningOpinionSought?: string | null;
	screeningOpinionIssued?: string | null;
	scopingOpinionSought?: string | null;
	scopingOpinionIssued?: string | null;
	section46Notification?: string | null;
	dateOfDCOSubmission?: string | null;
	deadlineForAcceptanceDecision?: string | null;
	dateOfDCOAcceptance?: string | null;
	dateOfNonAcceptance?: string | null;
	dateOfRepresentationPeriodOpen?: string | null;
	dateOfRelevantRepresentationClose?: string | null;
	extensionToDateRelevantRepresentationsClose?: string | null;
	dateRRepAppearOnWebsite?: string | null;
	dateIAPIDue?: string | null;
	rule6LetterPublishDate?: string | null;
	preliminaryMeetingStartDate?: string | null;
	notificationDateForPMAndEventsDirectlyFollowingPM?: string | null;
	notificationDateForEventsDeveloper?: string | null;
	dateSection58NoticeReceived?: string | null;
	confirmedStartOfExamination?: string | null;
	rule8LetterPublishDate?: string | null;
	deadlineForCloseOfExamination?: string | null;
	dateTimeExaminationEnds?: string | null;
	stage4ExtensionToExamCloseDate?: string | null;
	deadlineForSubmissionOfRecommendation?: string | null;
	dateOfRecommendations?: string | null;
	stage5ExtensionToRecommendationDeadline?: string | null;
	deadlineForDecision?: string | null;
	confirmedDateOfDecision?: string | null;
	stage5ExtensionToDecisionDeadline?: string | null;
	jRPeriodEndDate?: string | null;
	dateProjectWithdrawn?: string | null;
	operationsLeadId?: string | null;
	operationsManagerId?: string | null;
	caseManagerId?: string | null;
	nsipOfficerIds: string[];
	nsipAdministrationOfficerIds: string[];
	leadInspectorId?: string | null;
	inspectorIds: string[];
	environmentalServicesOfficerId?: string | null;
	legalOfficerId?: string | null;
	applicantId?: string | null;
}
