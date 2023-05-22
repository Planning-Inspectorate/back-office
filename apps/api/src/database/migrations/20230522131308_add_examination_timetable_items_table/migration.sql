BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[ExaminationTimetableItems] (
    [id] INT NOT NULL IDENTITY(1,1),
    [examinationTypeId] INT NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000),
    [date] DATETIME2,
    [startDate] DATETIME2,
    [endDate] DATETIME2,
    CONSTRAINT [ExaminationTimetableItems_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[ExaminationTimetableItems] ADD CONSTRAINT [ExaminationTimetableItems_examinationTypeId_fkey] FOREIGN KEY ([examinationTypeId]) REFERENCES [dbo].[ExaminationTimetableType]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
