BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[AppellantCase] ADD [appellantCaseIncompleteReasonId] INT,
[appellantCaseInvalidReasonId] INT,
[otherNotValidReasons] NVARCHAR(1000),
[validationOutcomeId] INT;

-- CreateTable
CREATE TABLE [dbo].[ValidationOutcome] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [ValidationOutcome_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [ValidationOutcome_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[AppellantCaseIncompleteReason] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [AppellantCaseIncompleteReason_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [AppellantCaseIncompleteReason_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[AppellantCaseInvalidReason] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [AppellantCaseInvalidReason_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [AppellantCaseInvalidReason_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[AppellantCaseIncompleteReasonOnAppellantCase] (
    [appellantCaseIncompleteReasonId] INT NOT NULL,
    [appellantCaseId] INT NOT NULL,
    CONSTRAINT [AppellantCaseIncompleteReasonOnAppellantCase_pkey] PRIMARY KEY CLUSTERED ([appellantCaseIncompleteReasonId],[appellantCaseId])
);

-- CreateTable
CREATE TABLE [dbo].[AppellantCaseInvalidReasonOnAppellantCase] (
    [appellantCaseInvalidReasonId] INT NOT NULL,
    [appellantCaseId] INT NOT NULL,
    CONSTRAINT [AppellantCaseInvalidReasonOnAppellantCase_pkey] PRIMARY KEY CLUSTERED ([appellantCaseInvalidReasonId],[appellantCaseId])
);

-- AddForeignKey
ALTER TABLE [dbo].[AppellantCase] ADD CONSTRAINT [AppellantCase_validationOutcomeId_fkey] FOREIGN KEY ([validationOutcomeId]) REFERENCES [dbo].[ValidationOutcome]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AppellantCase] ADD CONSTRAINT [AppellantCase_appellantCaseInvalidReasonId_fkey] FOREIGN KEY ([appellantCaseInvalidReasonId]) REFERENCES [dbo].[AppellantCaseInvalidReason]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[AppellantCase] ADD CONSTRAINT [AppellantCase_appellantCaseIncompleteReasonId_fkey] FOREIGN KEY ([appellantCaseIncompleteReasonId]) REFERENCES [dbo].[AppellantCaseIncompleteReason]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[AppellantCaseIncompleteReasonOnAppellantCase] ADD CONSTRAINT [AppellantCaseIncompleteReasonOnAppellantCase_appellantCaseIncompleteReasonId_fkey] FOREIGN KEY ([appellantCaseIncompleteReasonId]) REFERENCES [dbo].[AppellantCaseIncompleteReason]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AppellantCaseIncompleteReasonOnAppellantCase] ADD CONSTRAINT [AppellantCaseIncompleteReasonOnAppellantCase_appellantCaseId_fkey] FOREIGN KEY ([appellantCaseId]) REFERENCES [dbo].[AppellantCase]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AppellantCaseInvalidReasonOnAppellantCase] ADD CONSTRAINT [AppellantCaseInvalidReasonOnAppellantCase_appellantCaseInvalidReasonId_fkey] FOREIGN KEY ([appellantCaseInvalidReasonId]) REFERENCES [dbo].[AppellantCaseInvalidReason]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AppellantCaseInvalidReasonOnAppellantCase] ADD CONSTRAINT [AppellantCaseInvalidReasonOnAppellantCase_appellantCaseId_fkey] FOREIGN KEY ([appellantCaseId]) REFERENCES [dbo].[AppellantCase]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
