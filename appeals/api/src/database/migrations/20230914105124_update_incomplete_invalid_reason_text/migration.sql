/*
  Warnings:

  - You are about to drop the column `otherNotValidReasons` on the `AppellantCase` table. All the data in the column will be lost.
  - You are about to drop the column `otherNotValidReasons` on the `LPAQuestionnaire` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[AppellantCase] DROP COLUMN [otherNotValidReasons];

-- AlterTable
ALTER TABLE [dbo].[AppellantCaseIncompleteReason] ADD [hasText] BIT NOT NULL CONSTRAINT [AppellantCaseIncompleteReason_hasText_df] DEFAULT 0;

-- AlterTable
ALTER TABLE [dbo].[AppellantCaseInvalidReason] ADD [hasText] BIT NOT NULL CONSTRAINT [AppellantCaseInvalidReason_hasText_df] DEFAULT 0;

-- AlterTable
ALTER TABLE [dbo].[LPAQuestionnaire] DROP COLUMN [otherNotValidReasons];

-- AlterTable
ALTER TABLE [dbo].[LPAQuestionnaireIncompleteReason] ADD [hasText] BIT NOT NULL CONSTRAINT [LPAQuestionnaireIncompleteReason_hasText_df] DEFAULT 0;

-- CreateTable
CREATE TABLE [dbo].[AppellantCaseIncompleteReasonText] (
    [id] INT NOT NULL IDENTITY(1,1),
    [text] NVARCHAR(1000) NOT NULL,
    [appellantCaseIncompleteReasonId] INT NOT NULL,
    [appellantCaseId] INT NOT NULL,
    CONSTRAINT [AppellantCaseIncompleteReasonText_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[AppellantCaseInvalidReasonText] (
    [id] INT NOT NULL IDENTITY(1,1),
    [text] NVARCHAR(1000) NOT NULL,
    [appellantCaseInvalidReasonId] INT NOT NULL,
    [appellantCaseId] INT NOT NULL,
    CONSTRAINT [AppellantCaseInvalidReasonText_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[LPAQuestionnaireIncompleteReasonText] (
    [id] INT NOT NULL IDENTITY(1,1),
    [text] NVARCHAR(1000) NOT NULL,
    [lpaQuestionnaireIncompleteReasonId] INT NOT NULL,
    [lpaQuestionnaireId] INT NOT NULL,
    CONSTRAINT [LPAQuestionnaireIncompleteReasonText_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[AppellantCaseIncompleteReasonText] ADD CONSTRAINT [AppellantCaseIncompleteReasonText_appellantCaseIncompleteReasonId_appellantCaseId_fkey] FOREIGN KEY ([appellantCaseIncompleteReasonId], [appellantCaseId]) REFERENCES [dbo].[AppellantCaseIncompleteReasonOnAppellantCase]([appellantCaseIncompleteReasonId],[appellantCaseId]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AppellantCaseInvalidReasonText] ADD CONSTRAINT [AppellantCaseInvalidReasonText_appellantCaseInvalidReasonId_appellantCaseId_fkey] FOREIGN KEY ([appellantCaseInvalidReasonId], [appellantCaseId]) REFERENCES [dbo].[AppellantCaseInvalidReasonOnAppellantCase]([appellantCaseInvalidReasonId],[appellantCaseId]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[LPAQuestionnaireIncompleteReasonText] ADD CONSTRAINT [LPAQuestionnaireIncompleteReasonText_lpaQuestionnaireIncompleteReasonId_lpaQuestionnaireId_fkey] FOREIGN KEY ([lpaQuestionnaireIncompleteReasonId], [lpaQuestionnaireId]) REFERENCES [dbo].[LPAQuestionnaireIncompleteReasonOnLPAQuestionnaire]([lpaQuestionnaireIncompleteReasonId],[lpaQuestionnaireId]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
