BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[ApplicationDetails] ADD [confirmedDateOfDecision] DATETIME2,
[confirmedStartOfExamination] DATETIME2,
[dateIAPIDue] DATETIME2,
[dateOfDCOAcceptance] DATETIME2,
[dateOfDCOSubmission] DATETIME2,
[dateOfNonAcceptance] DATETIME2,
[dateOfRecommendations] DATETIME2,
[dateOfRelevantRepresentationClose] DATETIME2,
[dateOfRepresentationPeriodOpen] DATETIME2,
[datePINSFirstNotifiedOfProject] DATETIME2,
[dateProjectAppearsOnWebsite] DATETIME2,
[dateProjectWithdrawn] DATETIME2,
[dateRRepAppearOnWebsite] DATETIME2,
[dateSection58NoticeReceived] DATETIME2,
[dateTimeExaminationEnds] DATETIME2,
[deadlineForAcceptanceDecision] DATETIME2,
[deadlineForCloseOfExamination] DATETIME2,
[deadlineForDecision] DATETIME2,
[deadlineForSubmissionOfRecommendation] DATETIME2,
[extensionToDateRelevantRepresentationsClose] DATETIME2,
[jRPeriodEndDate] DATETIME2,
[notificationDateForEventsDeveloper] DATETIME2,
[notificationDateForPMAndEventsDirectlyFollowingPM] DATETIME2,
[preliminaryMeetingStartDate] DATETIME2,
[rule6LetterPublishDate] DATETIME2,
[rule8LetterPublishDate] DATETIME2,
[scopingOpinionIssued] DATETIME2,
[scopingOpinionSought] DATETIME2,
[screeningOpinionIssued] DATETIME2,
[screeningOpinionSought] DATETIME2,
[section46Notification] DATETIME2,
[stage4ExtensionToExamCloseDate] DATETIME2,
[stage5ExtensionToDecisionDeadline] DATETIME2,
[stage5ExtensionToRecommendationDeadline] DATETIME2;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
