import {
	createUniqueRandomDateFromSeed,
	createUniqueRandomNumberFromSeed
} from '../factory/util.js';

let seed = 0;
// Return a random date between 2023 and 2024 OR null with 50% of chance
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
		submissionAtPublished: 'Q4 2023' // only field as string
	},
	acceptance: {
		dateOfDCOSubmission: randomDateOrNull(),
		deadlineForAcceptanceDecision: randomDateOrNull(),
		dateOfDCOAcceptance: randomDateOrNull(),
		dateOfNonAcceptance: randomDateOrNull()
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
		notificationDateForEventsDeveloper: randomDateOrNull()
	},
	examination: {
		dateSection58NoticeReceived: randomDateOrNull(),
		confirmedStartOfExamination: randomDateOrNull(),
		rule8LetterPublishDate: randomDateOrNull(),
		deadlineForCloseOfExamination: randomDateOrNull(),
		dateTimeExaminationEnds: randomDateOrNull(),
		stage4ExtensionToExamCloseDate: randomDateOrNull()
	},
	recommendation: {
		deadlineForSubmissionOfRecommendation: randomDateOrNull(),
		dateOfRecommendations: randomDateOrNull(),
		stage5ExtensionToRecommendationDeadline: randomDateOrNull()
	},
	decision: {
		deadlineForDecision: randomDateOrNull(),
		confirmedDateOfDecision: randomDateOrNull(),
		stage5ExtensionToDecisionDeadline: randomDateOrNull()
	},
	postDecision: {
		jRPeriodEndDate: randomDateOrNull()
	},
	withdrawal: {
		dateProjectWithdrawn: randomDateOrNull()
	}
};

export default fixtureKeyDates;
