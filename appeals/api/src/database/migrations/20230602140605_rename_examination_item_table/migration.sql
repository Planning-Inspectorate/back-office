/*
  Warnings:

  - You are about to drop the `ExaminationTimetableItems` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[ExaminationTimetableItems] DROP CONSTRAINT [ExaminationTimetableItems_caseId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[ExaminationTimetableItems] DROP CONSTRAINT [ExaminationTimetableItems_examinationTypeId_fkey];

-- DropTable
DROP TABLE [dbo].[ExaminationTimetableItems];

-- CreateTable
CREATE TABLE [dbo].[ExaminationTimetableItem] (
    [id] INT NOT NULL IDENTITY(1,1),
    [caseId] INT NOT NULL,
    [examinationTypeId] INT NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [description] NTEXT,
    [date] DATETIME2,
    [startDate] DATETIME2,
    [startTime] NVARCHAR(1000),
    [endTime] NVARCHAR(1000),
    CONSTRAINT [ExaminationTimetableItem_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[ExaminationTimetableItem] ADD CONSTRAINT [ExaminationTimetableItem_caseId_fkey] FOREIGN KEY ([caseId]) REFERENCES [dbo].[Case]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ExaminationTimetableItem] ADD CONSTRAINT [ExaminationTimetableItem_examinationTypeId_fkey] FOREIGN KEY ([examinationTypeId]) REFERENCES [dbo].[ExaminationTimetableType]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
