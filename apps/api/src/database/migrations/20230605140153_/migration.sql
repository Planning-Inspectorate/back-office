/*
  Warnings:

  - You are about to drop the column `finalEventsDueDate` on the `AppealTimetable` table. All the data in the column will be lost.
  - You are about to drop the column `interestedPartyRepsDueDate` on the `AppealTimetable` table. All the data in the column will be lost.
  - You are about to drop the column `questionnaireDueDate` on the `AppealTimetable` table. All the data in the column will be lost.
  - You are about to drop the column `statementDueDate` on the `AppealTimetable` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[AppealTimetable] DROP COLUMN [finalEventsDueDate],
[interestedPartyRepsDueDate],
[questionnaireDueDate],
[statementDueDate];
ALTER TABLE [dbo].[AppealTimetable] ADD [finalCommentReviewDate] DATETIME2,
[issueDeterminationDate] DATETIME2,
[lpaQuestionnaireDueDate] DATETIME2,
[statementReviewDate] DATETIME2;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
