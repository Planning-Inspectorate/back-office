BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[ApplicationDetails] ADD [additionalComments] NTEXT,
[caAndTpEvidence] NVARCHAR(1000),
[caAndTpEvidenceSubmittedDate] DATETIME2,
[caseTeamIssuedCommentsDate] DATETIME2,
[consultationMilestoneAdequacyDate] DATETIME2,
[courtDecisionDate] DATETIME2,
[courtDecisionOutcome] NVARCHAR(1000),
[courtDecisionOutcomeText] NVARCHAR(1000),
[decisionChallengeSubmissionDate] DATETIME2,
[designApproachDocument] NVARCHAR(1000),
[designApproachDocumentSubmittedDate] DATETIME2,
[draftDocumentSubmissionDate] DATETIME2,
[essentialFastTrackComponents] BIT,
[estimatedScopingSubmissionDate] DATETIME2,
[fastTrackAdmissionDocument] NVARCHAR(1000),
[fastTrackAdmissionDocumentSubmittedDate] DATETIME2,
[inceptionMeetingDate] DATETIME2,
[issuesTracker] NVARCHAR(1000),
[matureOutlineControlDocument] NVARCHAR(1000),
[matureOutlineControlDocumentSubmittedDate] DATETIME2,
[memLastUpdated] DATETIME2,
[multipartyApplicationCheckDocument] NVARCHAR(1000),
[multipartyApplicationCheckDocumentSubmittedDate] DATETIME2,
[newMaturity] NVARCHAR(1000),
[numberBand2Inspectors] INT,
[numberBand3Inspectors] INT,
[planProcessEvidence] BIT,
[policyComplianceDocument] NVARCHAR(1000),
[policyComplianceDocumentSubmittedDate] DATETIME2,
[principalAreaDisagreementSummaryStmt] NVARCHAR(1000),
[principalAreaDisagreementSummaryStmtSubmittedDate] DATETIME2,
[programmeDocumentReviewedByEstDate] DATETIME2,
[programmeDocumentSubmissionDate] DATETIME2,
[programmeDocumentURI] NVARCHAR(1000),
[publicSectorEqualityDuty] NVARCHAR(1000),
[publicSectorEqualityDutySubmittedDate] DATETIME2,
[recommendation] NVARCHAR(1000),
[s61SummaryURI] NVARCHAR(1000),
[statutoryConsultationPeriodEndDate] DATETIME2,
[subProjectType] NVARCHAR(1000),
[submissionOfDraftDocumentsDate] DATETIME2,
[tier] NVARCHAR(1000),
[updatedProgrammeDocumentReceivedDate] DATETIME2;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
