import {
	createUniqueRandomDateFromSeed,
	createUniqueRandomNumberFromSeed
} from '../factory/util.js';

let seed = 0;
const randomDateOrNull = () => {
	seed++;

	return [createUniqueRandomDateFromSeed(seed, 2023, 2024), null][
		createUniqueRandomNumberFromSeed(0, 1, seed)
	];
};

const fixtureKeyDates = {
	preApplication: {
		datePINSFirstNotifiedOfProject: randomDateOrNull(),
		dateProjectAppearsOnWebsite: randomDateOrNull(),
		submissionAtInternal: randomDateOrNull(),
		screeningOpinionSought: randomDateOrNull(),
		screeningOpinionIssued: randomDateOrNull(),
		scopingOpinionSought: randomDateOrNull(),
		scopingOpinionIssued: randomDateOrNull(),
		section46Notification: randomDateOrNull(),
		submissionAtPublished: null
	},
	acceptance: {
		dateOfDCOSubmission: randomDateOrNull(),
		deadlineForAcceptanceDecision: randomDateOrNull(),
		dateOfDCOAcceptance: randomDateOrNull(),
		dateOfNonAcceptance: null
	},
	preExamination: {
		dateOfRepresentationPeriodOpen: randomDateOrNull(),
		dateOfRelevantRepresentationClose: randomDateOrNull(),
		extensionToDateRelevantRepresentationsClose: randomDateOrNull(),
		dateRRepAppearOnWebsite: randomDateOrNull(),
		dateIAPIDue: randomDateOrNull(),
		rule6LetterPublishDate: randomDateOrNull(),
		preliminaryMeetingStartDate: randomDateOrNull(),
		notificationDateForPMAndEventsDirectlyFollowingPM: randomDateOrNull(),
		notificationDateForEventsDeveloper: null
	},
	examination: {
		dateSection58NoticeReceived: randomDateOrNull(),
		confirmedStartOfExamination: randomDateOrNull(),
		rule8LetterPublishDate: randomDateOrNull(),
		deadlineForCloseOfExamination: randomDateOrNull(),
		dateTimeExaminationEnds: randomDateOrNull(),
		stage4ExtensionToExamCloseDate: null
	},
	recommendation: {
		deadlineForSubmissionOfRecommendation: randomDateOrNull(),
		dateOfRecommendations: randomDateOrNull(),
		stage5ExtensionToRecommendationDeadline: null
	},
	decision: {
		deadlineForDecision: randomDateOrNull(),
		confirmedDateOfDecision: randomDateOrNull(),
		stage5ExtensionToDecisionDeadline: null
	},
	postDecision: {
		jRPeriodEndDate: null
	},
	withdrawal: {
		dateProjectWithdrawn: null
	}
};

export default fixtureKeyDates;
