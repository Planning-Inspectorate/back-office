/*
  Warnings:

  - You are about to drop the column `caseId` on the `ExaminationTimetableItem` table. All the data in the column will be lost.
  - You are about to drop the column `published` on the `ExaminationTimetableItem` table. All the data in the column will be lost.
  - Added the required column `examinationTimetableId` to the `ExaminationTimetableItem` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- Truncate Existing records
TRUNCATE TABLE [dbo].[ExaminationTimetableItem]

-- DropForeignKey
ALTER TABLE [dbo].[ExaminationTimetableItem] DROP CONSTRAINT [ExaminationTimetableItem_caseId_fkey];

ALTER TABLE [dbo].[ExaminationTimetableItem] DROP CONSTRAINT [ExaminationTimetableItem_published_df];

-- AlterTable
ALTER TABLE [dbo].[ExaminationTimetableItem] DROP COLUMN [caseId],
[published];
ALTER TABLE [dbo].[ExaminationTimetableItem] ADD [examinationTimetableId] INT NOT NULL;

-- CreateTable
CREATE TABLE [dbo].[ExaminationTimetable] (
    [id] INT NOT NULL IDENTITY(1,1),
    [caseId] INT NOT NULL,
    [published] BIT NOT NULL CONSTRAINT [ExaminationTimetable_published_df] DEFAULT 0,
    [publishedAt] DATETIME2,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [ExaminationTimetable_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [ExaminationTimetable_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [ExaminationTimetable_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [ExaminationTimetable_caseId_key] UNIQUE NONCLUSTERED ([caseId])
);

-- AddForeignKey
ALTER TABLE [dbo].[ExaminationTimetableItem] ADD CONSTRAINT [ExaminationTimetableItem_examinationTimetableId_fkey] FOREIGN KEY ([examinationTimetableId]) REFERENCES [dbo].[ExaminationTimetable]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ExaminationTimetable] ADD CONSTRAINT [ExaminationTimetable_caseId_fkey] FOREIGN KEY ([caseId]) REFERENCES [dbo].[Case]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
