/*
  Warnings:

  - You are about to drop the column `validationOutcomeId` on the `AppellantCase` table. All the data in the column will be lost.
  - You are about to drop the `ValidationOutcome` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[AppellantCase] DROP CONSTRAINT [AppellantCase_validationOutcomeId_fkey];

-- AlterTable
ALTER TABLE [dbo].[AppellantCase] DROP COLUMN [validationOutcomeId];
ALTER TABLE [dbo].[AppellantCase] ADD [appellantCaseValidationOutcomeId] INT;

-- AlterTable
ALTER TABLE [dbo].[LPAQuestionnaire] ADD [lpaQuestionnaireValidationOutcomeId] INT,
[otherNotValidReasons] NVARCHAR(1000);

-- DropTable
DROP TABLE [dbo].[ValidationOutcome];

-- CreateTable
CREATE TABLE [dbo].[AppellantCaseValidationOutcome] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [AppellantCaseValidationOutcome_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [AppellantCaseValidationOutcome_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[LPAQuestionnaireValidationOutcome] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [LPAQuestionnaireValidationOutcome_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [LPAQuestionnaireValidationOutcome_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[LPAQuestionnaireIncompleteReason] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [LPAQuestionnaireIncompleteReason_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [LPAQuestionnaireIncompleteReason_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[LPAQuestionnaireIncompleteReasonOnLPAQuestionnaire] (
    [lpaQuestionnaireIncompleteReasonId] INT NOT NULL,
    [lpaQuestionnaireId] INT NOT NULL,
    CONSTRAINT [LPAQuestionnaireIncompleteReasonOnLPAQuestionnaire_pkey] PRIMARY KEY CLUSTERED ([lpaQuestionnaireIncompleteReasonId],[lpaQuestionnaireId])
);

-- AddForeignKey
ALTER TABLE [dbo].[AppellantCase] ADD CONSTRAINT [AppellantCase_appellantCaseValidationOutcomeId_fkey] FOREIGN KEY ([appellantCaseValidationOutcomeId]) REFERENCES [dbo].[AppellantCaseValidationOutcome]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[LPAQuestionnaire] ADD CONSTRAINT [LPAQuestionnaire_lpaQuestionnaireValidationOutcomeId_fkey] FOREIGN KEY ([lpaQuestionnaireValidationOutcomeId]) REFERENCES [dbo].[LPAQuestionnaireValidationOutcome]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[LPAQuestionnaireIncompleteReasonOnLPAQuestionnaire] ADD CONSTRAINT [LPAQuestionnaireIncompleteReasonOnLPAQuestionnaire_lpaQuestionnaireIncompleteReasonId_fkey] FOREIGN KEY ([lpaQuestionnaireIncompleteReasonId]) REFERENCES [dbo].[LPAQuestionnaireIncompleteReason]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[LPAQuestionnaireIncompleteReasonOnLPAQuestionnaire] ADD CONSTRAINT [LPAQuestionnaireIncompleteReasonOnLPAQuestionnaire_lpaQuestionnaireId_fkey] FOREIGN KEY ([lpaQuestionnaireId]) REFERENCES [dbo].[LPAQuestionnaire]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
