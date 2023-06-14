BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[AppealTimetable] (
    [id] INT NOT NULL IDENTITY(1,1),
    [appealId] INT NOT NULL,
    [finalEventsDueDate] DATETIME2 NOT NULL,
    [interestedPartyRepsDueDate] DATETIME2,
    [questionnaireDueDate] DATETIME2 NOT NULL,
    [statementDueDate] DATETIME2,
    CONSTRAINT [AppealTimetable_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [AppealTimetable_appealId_key] UNIQUE NONCLUSTERED ([appealId])
);

-- AddForeignKey
ALTER TABLE [dbo].[AppealTimetable] ADD CONSTRAINT [AppealTimetable_appealId_fkey] FOREIGN KEY ([appealId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
